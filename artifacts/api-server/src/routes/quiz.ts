import { Router } from "express";
import { db, quizQuestionsTable } from "@workspace/db";
import { logger } from "../lib/logger";
import { ListQuizQuestionsQueryParams, SubmitQuizBody } from "@workspace/api-zod";

const router = Router();

router.get("/quiz/questions", async (req, res) => {
  try {
    const parsed = ListQuizQuestionsQueryParams.safeParse({
      systemId: req.query.systemId ? Number(req.query.systemId) : undefined,
      limit: req.query.limit ? Number(req.query.limit) : undefined,
    });

    let questions = await db.select().from(quizQuestionsTable);

    if (parsed.success) {
      if (parsed.data.systemId != null) {
        questions = questions.filter((q) => q.systemId === parsed.data.systemId);
      }
      if (parsed.data.limit != null) {
        questions = questions.slice(0, parsed.data.limit);
      }
    }

    res.json(questions);
  } catch (err) {
    logger.error({ err }, "Failed to list quiz questions");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/quiz/submit", async (req, res) => {
  try {
    const parsed = SubmitQuizBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid request body" });
      return;
    }

    const { answers } = parsed.data;
    const allQuestions = await db.select().from(quizQuestionsTable);
    const questionMap = new Map(allQuestions.map((q) => [q.id, q]));

    let score = 0;
    const details = answers.map((answer) => {
      const question = questionMap.get(answer.questionId);
      if (!question) {
        return null;
      }
      const isCorrect = answer.selectedIndex === question.correctIndex;
      if (isCorrect) score++;
      return {
        questionId: question.id,
        questionAr: question.questionAr,
        selectedIndex: answer.selectedIndex,
        correctIndex: question.correctIndex,
        isCorrect,
        explanationAr: question.explanationAr,
      };
    }).filter(Boolean);

    res.json({
      score,
      total: details.length,
      percentage: details.length > 0 ? Math.round((score / details.length) * 100) : 0,
      details,
    });
  } catch (err) {
    logger.error({ err }, "Failed to submit quiz");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
