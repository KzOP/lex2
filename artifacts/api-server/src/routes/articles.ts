import { Router } from "express";
import { db, articlesTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { logger } from "../lib/logger";
import {
  ListArticlesQueryParams,
  CreateArticleBody,
  UpdateArticleParams,
  UpdateArticleBody,
  DeleteArticleParams,
} from "@workspace/api-zod";

const router = Router();

router.get("/articles", async (req, res) => {
  try {
    const parsed = ListArticlesQueryParams.safeParse({
      systemId: req.query.systemId ? Number(req.query.systemId) : undefined,
      featured: req.query.featured === "true" ? true : req.query.featured === "false" ? false : undefined,
    });

    let articles = await db.select().from(articlesTable);
    if (parsed.success) {
      if (parsed.data.systemId != null) {
        articles = articles.filter((a) => a.systemId === parsed.data.systemId);
      }
      if (parsed.data.featured != null) {
        articles = articles.filter((a) => a.isFeatured === parsed.data.featured);
      }
    }
    res.json(articles);
  } catch (err) {
    logger.error({ err }, "Failed to list articles");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/articles", async (req, res) => {
  try {
    const parsed = CreateArticleBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid request body" });
      return;
    }
    const [created] = await db.insert(articlesTable).values(parsed.data).returning();
    res.status(201).json(created);
  } catch (err) {
    logger.error({ err }, "Failed to create article");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/articles/:id", async (req, res) => {
  try {
    const paramsParsed = UpdateArticleParams.safeParse({ id: Number(req.params.id) });
    const bodyParsed = UpdateArticleBody.safeParse(req.body);
    if (!paramsParsed.success || !bodyParsed.success) {
      res.status(400).json({ error: "Invalid request" });
      return;
    }
    const [updated] = await db
      .update(articlesTable)
      .set(bodyParsed.data)
      .where(eq(articlesTable.id, paramsParsed.data.id))
      .returning();
    if (!updated) {
      res.status(404).json({ error: "Article not found" });
      return;
    }
    res.json(updated);
  } catch (err) {
    logger.error({ err }, "Failed to update article");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/articles/:id", async (req, res) => {
  try {
    const parsed = DeleteArticleParams.safeParse({ id: Number(req.params.id) });
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid id" });
      return;
    }
    const [deleted] = await db.delete(articlesTable).where(eq(articlesTable.id, parsed.data.id)).returning();
    if (!deleted) {
      res.status(404).json({ error: "Article not found" });
      return;
    }
    res.status(204).send();
  } catch (err) {
    logger.error({ err }, "Failed to delete article");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
