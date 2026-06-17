import { Router } from "express";
import { db, systemsTable, legalTermsTable, articlesTable, faqTable } from "@workspace/db";
import { logger } from "../lib/logger";

const router = Router();

router.get("/search", async (req, res) => {
  try {
    const q = (req.query.q as string | undefined)?.trim();
    if (!q || q.length < 2) {
      res.status(400).json({ error: "Query too short" });
      return;
    }

    const ql = q.toLowerCase();

    const [allSystems, allTerms, allArticles, allFaq] = await Promise.all([
      db.select().from(systemsTable),
      db.select().from(legalTermsTable),
      db.select().from(articlesTable),
      db.select().from(faqTable),
    ]);

    const systems = allSystems
      .filter((s) =>
        s.nameAr.toLowerCase().includes(ql) ||
        s.nameEn.toLowerCase().includes(ql) ||
        s.descriptionAr.toLowerCase().includes(ql)
      )
      .map((s) => ({
        type: "system",
        id: s.id,
        titleAr: s.nameAr,
        snippetAr: s.descriptionAr.slice(0, 120) + (s.descriptionAr.length > 120 ? "..." : ""),
        systemNameAr: null as string | null,
        url: `/systems/${s.id}`,
      }));

    const terms = allTerms
      .filter((t) =>
        t.termAr.toLowerCase().includes(ql) ||
        t.termEn.toLowerCase().includes(ql) ||
        t.definitionAr.toLowerCase().includes(ql)
      )
      .slice(0, 20)
      .map((t) => ({
        type: "term",
        id: t.id,
        titleAr: t.termAr,
        snippetAr: t.definitionAr.slice(0, 120) + (t.definitionAr.length > 120 ? "..." : ""),
        systemNameAr: null as string | null,
        url: `/glossary`,
      }));

    const articles = allArticles
      .filter((a) =>
        a.titleAr.toLowerCase().includes(ql) ||
        a.contentAr.toLowerCase().includes(ql)
      )
      .slice(0, 10)
      .map((a) => {
        const sys = allSystems.find((s) => s.id === a.systemId);
        return {
          type: "article",
          id: a.id,
          titleAr: a.titleAr,
          snippetAr: a.contentAr.slice(0, 120) + (a.contentAr.length > 120 ? "..." : ""),
          systemNameAr: sys ? sys.nameAr : null,
          url: `/systems/${a.systemId}`,
        };
      });

    const faq = allFaq
      .filter((f) =>
        f.questionAr.toLowerCase().includes(ql) ||
        f.answerAr.toLowerCase().includes(ql)
      )
      .slice(0, 10)
      .map((f) => ({
        type: "faq",
        id: f.id,
        titleAr: f.questionAr,
        snippetAr: f.answerAr.slice(0, 120) + (f.answerAr.length > 120 ? "..." : ""),
        systemNameAr: null as string | null,
        url: `/faq`,
      }));

    const total = systems.length + terms.length + articles.length + faq.length;

    res.json({ query: q, total, systems, articles, terms, faq });
  } catch (err) {
    logger.error({ err }, "Search error");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
