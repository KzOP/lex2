import { Router } from "express";
import { db, faqTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { logger } from "../lib/logger";
import {
  ListFaqItemsQueryParams,
  CreateFaqItemBody,
  UpdateFaqItemParams,
  UpdateFaqItemBody,
  DeleteFaqItemParams,
} from "@workspace/api-zod";

const router = Router();

router.get("/faq", async (req, res) => {
  try {
    const parsed = ListFaqItemsQueryParams.safeParse({
      systemId: req.query.systemId ? Number(req.query.systemId) : undefined,
    });

    let faqs = await db.select().from(faqTable);
    if (parsed.success && parsed.data.systemId != null) {
      faqs = faqs.filter((f) => f.systemId === parsed.data.systemId);
    }
    res.json(faqs);
  } catch (err) {
    logger.error({ err }, "Failed to list FAQ");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/faq", async (req, res) => {
  try {
    const parsed = CreateFaqItemBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid request body" });
      return;
    }
    const [created] = await db.insert(faqTable).values(parsed.data).returning();
    res.status(201).json(created);
  } catch (err) {
    logger.error({ err }, "Failed to create FAQ item");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/faq/:id", async (req, res) => {
  try {
    const paramsParsed = UpdateFaqItemParams.safeParse({ id: Number(req.params.id) });
    const bodyParsed = UpdateFaqItemBody.safeParse(req.body);
    if (!paramsParsed.success || !bodyParsed.success) {
      res.status(400).json({ error: "Invalid request" });
      return;
    }
    const [updated] = await db
      .update(faqTable)
      .set(bodyParsed.data)
      .where(eq(faqTable.id, paramsParsed.data.id))
      .returning();
    if (!updated) {
      res.status(404).json({ error: "FAQ item not found" });
      return;
    }
    res.json(updated);
  } catch (err) {
    logger.error({ err }, "Failed to update FAQ item");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/faq/:id", async (req, res) => {
  try {
    const parsed = DeleteFaqItemParams.safeParse({ id: Number(req.params.id) });
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid id" });
      return;
    }
    const [deleted] = await db.delete(faqTable).where(eq(faqTable.id, parsed.data.id)).returning();
    if (!deleted) {
      res.status(404).json({ error: "FAQ item not found" });
      return;
    }
    res.status(204).send();
  } catch (err) {
    logger.error({ err }, "Failed to delete FAQ item");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
