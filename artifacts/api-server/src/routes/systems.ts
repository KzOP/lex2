import { Router } from "express";
import { db, systemsTable, articlesTable, legalTermsTable, faqTable } from "@workspace/db";
import { eq, inArray } from "drizzle-orm";
import { logger } from "../lib/logger";
import {
  ListSystemsQueryParams,
  CreateSystemBody,
  GetSystemParams,
  UpdateSystemParams,
  UpdateSystemBody,
  DeleteSystemParams,
  CompareSystemsBody,
} from "@workspace/api-zod";

const router = Router();

router.get("/systems/stats", async (req, res) => {
  try {
    const systems = await db.select().from(systemsTable);
    const articles = await db.select().from(articlesTable);
    const terms = await db.select().from(legalTermsTable);
    const faqs = await db.select().from(faqTable);

    const categories = [...new Set(systems.map((s) => s.category))];

    res.json({
      totalSystems: systems.length,
      totalArticles: articles.length,
      totalTerms: terms.length,
      totalFaq: faqs.length,
      categories,
    });
  } catch (err) {
    logger.error({ err }, "Failed to get stats");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/systems", async (req, res) => {
  try {
    const parsed = ListSystemsQueryParams.safeParse(req.query);
    const category = parsed.success ? parsed.data.category : undefined;

    let query = db.select().from(systemsTable).$dynamic();
    if (category) {
      query = query.where(eq(systemsTable.category, category));
    }
    const systems = await query;
    res.json(systems);
  } catch (err) {
    logger.error({ err }, "Failed to list systems");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/systems/compare", async (req, res) => {
  try {
    const parsed = CompareSystemsBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid request" });
      return;
    }
    const { ids } = parsed.data;
    if (ids.length === 0) {
      res.json([]);
      return;
    }
    const systems = await db
      .select()
      .from(systemsTable)
      .where(inArray(systemsTable.id, ids));
    res.json(systems);
  } catch (err) {
    logger.error({ err }, "Failed to compare systems");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/systems/:id", async (req, res) => {
  try {
    const parsed = GetSystemParams.safeParse({ id: Number(req.params.id) });
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid id" });
      return;
    }
    const [system] = await db
      .select()
      .from(systemsTable)
      .where(eq(systemsTable.id, parsed.data.id));
    if (!system) {
      res.status(404).json({ error: "System not found" });
      return;
    }
    res.json(system);
  } catch (err) {
    logger.error({ err }, "Failed to get system");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/systems", async (req, res) => {
  try {
    const parsed = CreateSystemBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid request body" });
      return;
    }
    const [created] = await db.insert(systemsTable).values(parsed.data).returning();
    res.status(201).json(created);
  } catch (err) {
    logger.error({ err }, "Failed to create system");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/systems/:id", async (req, res) => {
  try {
    const paramsParsed = UpdateSystemParams.safeParse({ id: Number(req.params.id) });
    const bodyParsed = UpdateSystemBody.safeParse(req.body);
    if (!paramsParsed.success || !bodyParsed.success) {
      res.status(400).json({ error: "Invalid request" });
      return;
    }
    const [updated] = await db
      .update(systemsTable)
      .set(bodyParsed.data)
      .where(eq(systemsTable.id, paramsParsed.data.id))
      .returning();
    if (!updated) {
      res.status(404).json({ error: "System not found" });
      return;
    }
    res.json(updated);
  } catch (err) {
    logger.error({ err }, "Failed to update system");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/systems/:id", async (req, res) => {
  try {
    const parsed = DeleteSystemParams.safeParse({ id: Number(req.params.id) });
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid id" });
      return;
    }
    const [deleted] = await db
      .delete(systemsTable)
      .where(eq(systemsTable.id, parsed.data.id))
      .returning();
    if (!deleted) {
      res.status(404).json({ error: "System not found" });
      return;
    }
    res.status(204).send();
  } catch (err) {
    logger.error({ err }, "Failed to delete system");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
