import { Router } from "express";
import Groq from "groq-sdk";
import { logger } from "../lib/logger";
import { AiChatBody } from "@workspace/api-zod";
import { db, systemsTable, legalTermsTable, articlesTable, faqTable } from "@workspace/db";

const router = Router();

router.post("/ai/chat", async (req, res) => {
  try {
    const parsed = AiChatBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid request body" });
      return;
    }

    const { message, conversationHistory = [] } = parsed.data;

    const groqApiKey = process.env.GROQ_API_KEY;
    if (!groqApiKey) {
      res.status(500).json({ error: "AI service not configured" });
      return;
    }

    const q = message.toLowerCase();

    const [allSystems, allTerms, allArticles, allFaq] = await Promise.all([
      db.select().from(systemsTable),
      db.select().from(legalTermsTable),
      db.select().from(articlesTable),
      db.select().from(faqTable),
    ]);

    const matchedSystems = allSystems.filter((s) =>
      [s.nameAr, s.nameEn, s.descriptionAr, s.objectiveAr, s.obligationsAr, s.penaltiesAr, s.complianceTipsAr]
        .some((f) => f && f.toLowerCase().includes(q.slice(0, 20)))
    );

    const matchedTerms = allTerms.filter((t) =>
      t.termAr.toLowerCase().includes(q.slice(0, 20)) ||
      t.termEn.toLowerCase().includes(q.slice(0, 20)) ||
      t.definitionAr.toLowerCase().includes(q.slice(0, 20))
    ).slice(0, 5);

    const matchedArticles = allArticles.filter((a) =>
      a.titleAr.toLowerCase().includes(q.slice(0, 20)) ||
      a.contentAr.toLowerCase().includes(q.slice(0, 20))
    ).slice(0, 3);

    const matchedFaq = allFaq.filter((f) =>
      f.questionAr.toLowerCase().includes(q.slice(0, 20)) ||
      f.answerAr.toLowerCase().includes(q.slice(0, 20))
    ).slice(0, 3);

    const hasContext =
      matchedSystems.length > 0 ||
      matchedTerms.length > 0 ||
      matchedArticles.length > 0 ||
      matchedFaq.length > 0;

    if (!hasContext) {
      res.json({
        response:
          "لم أجد في قاعدة بيانات المنصة معلومات موثقة كافية للإجابة على هذا السؤال تحديداً.\n\nيُنصح بمراجعة الجهات الرسمية المختصة:\n• هيئة السوق المالية: cma.org.sa\n• وزارة التجارة: mc.gov.sa\n• البنك المركزي السعودي: sama.gov.sa\n• الهيئة السعودية للبيانات والذكاء الاصطناعي: sdaia.gov.sa",
        disclaimer:
          "المحتوى المعروض لأغراض تعليمية وتوعوية فقط ولا يُعد استشارة قانونية أو رأياً قانونياً ملزماً.",
        sources: [],
        hasContext: false,
      });
      return;
    }

    const contextParts: string[] = [];

    if (matchedSystems.length > 0) {
      contextParts.push("=== الأنظمة ذات الصلة ===");
      for (const s of matchedSystems) {
        contextParts.push(
          `النظام: ${s.nameAr} (${s.nameEn})\nالوصف: ${s.descriptionAr}\nالأهداف: ${s.objectiveAr}\nالالتزامات: ${s.obligationsAr}\nالعقوبات: ${s.penaltiesAr}\nنصائح الامتثال: ${s.complianceTipsAr}\nالمرجع الرسمي: ${s.officialReference}`
        );
      }
    }

    if (matchedTerms.length > 0) {
      contextParts.push("=== المصطلحات ذات الصلة ===");
      for (const t of matchedTerms) {
        contextParts.push(`${t.termAr} (${t.termEn}): ${t.definitionAr}`);
      }
    }

    if (matchedArticles.length > 0) {
      contextParts.push("=== المقالات ذات الصلة ===");
      for (const a of matchedArticles) {
        contextParts.push(`العنوان: ${a.titleAr}\nالمحتوى: ${a.contentAr}`);
      }
    }

    if (matchedFaq.length > 0) {
      contextParts.push("=== الأسئلة الشائعة ذات الصلة ===");
      for (const f of matchedFaq) {
        contextParts.push(`السؤال: ${f.questionAr}\nالإجابة: ${f.answerAr}`);
      }
    }

    const context = contextParts.join("\n\n");

    const SYSTEM_PROMPT = `أنت مساعد قانوني توعوي سعودي لمنصة LexBridge Saudi.

القواعد الصارمة:
1. أجب باللغة العربية فقط في جميع الأحوال.
2. استخدم فقط المعلومات الموجودة في السياق المُقدَّم أدناه. لا تخترع أي معلومات قانونية.
3. لا تقدم استشارات قانونية ملزمة. أنت مصدر توعوي فقط.
4. اذكر المصدر عند الإجابة (اسم النظام أو المصطلح أو المقال).
5. إذا كانت المعلومات غير موجودة في السياق، قل ذلك صراحةً.

السياق المُعتمَد من قاعدة بيانات المنصة:
${context}`;

    const groq = new Groq({ apiKey: groqApiKey });

    const messages = [
      { role: "system" as const, content: SYSTEM_PROMPT },
      ...conversationHistory.map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
      { role: "user" as const, content: message },
    ];

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages,
      max_tokens: 1024,
      temperature: 0.3,
    });

    const responseText =
      completion.choices[0]?.message?.content ??
      "عذراً، لم أتمكن من معالجة طلبك. يرجى المحاولة مرة أخرى.";

    const sources: Array<{ type: string; label: string; reference?: string }> = [];

    for (const s of matchedSystems) {
      sources.push({
        type: "system",
        label: s.nameAr,
        reference: s.officialReference,
      });
    }
    for (const t of matchedTerms) {
      sources.push({ type: "term", label: `مصطلح: ${t.termAr}` });
    }
    for (const a of matchedArticles) {
      sources.push({ type: "article", label: a.titleAr });
    }

    res.json({
      response: responseText,
      disclaimer:
        "المحتوى المعروض لأغراض تعليمية وتوعوية فقط ولا يُعد استشارة قانونية أو رأياً قانونياً ملزماً.",
      sources,
      hasContext: true,
    });
  } catch (err) {
    logger.error({ err }, "AI chat error");
    res.status(500).json({ error: "Failed to process AI request" });
  }
});

export default router;
