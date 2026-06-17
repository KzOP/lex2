import { Router } from "express";
import { db, legalTermsTable } from "@workspace/db";
import { eq, ilike, or } from "drizzle-orm";
import { logger } from "../lib/logger";
import {
  ListLegalTermsQueryParams,
  CreateLegalTermBody,
  UpdateLegalTermParams,
  UpdateLegalTermBody,
  DeleteLegalTermParams,
} from "@workspace/api-zod";

const router = Router();

router.get("/legal-terms", async (req, res) => {
  try {
    const parsed = ListLegalTermsQueryParams.safeParse(req.query);
    let terms = await db.select().from(legalTermsTable);

    if (parsed.success) {
      if (parsed.data.search) {
        const s = parsed.data.search.toLowerCase();
        terms = terms.filter(
          (t) =>
            t.termAr.toLowerCase().includes(s) ||
            t.termEn.toLowerCase().includes(s) ||
            t.definitionAr.toLowerCase().includes(s)
        );
      }
      if (parsed.data.letter) {
        terms = terms.filter((t) => t.termAr.startsWith(parsed.data.letter!));
      }
    }

    terms.sort((a, b) => a.termAr.localeCompare(b.termAr, "ar"));
    res.json(terms);
  } catch (err) {
    logger.error({ err }, "Failed to list legal terms");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/legal-terms", async (req, res) => {
  try {
    const parsed = CreateLegalTermBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid request body" });
      return;
    }
    const [created] = await db.insert(legalTermsTable).values(parsed.data).returning();
    res.status(201).json(created);
  } catch (err) {
    logger.error({ err }, "Failed to create legal term");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/legal-terms/:id", async (req, res) => {
  try {
    const paramsParsed = UpdateLegalTermParams.safeParse({ id: Number(req.params.id) });
    const bodyParsed = UpdateLegalTermBody.safeParse(req.body);
    if (!paramsParsed.success || !bodyParsed.success) {
      res.status(400).json({ error: "Invalid request" });
      return;
    }
    const [updated] = await db
      .update(legalTermsTable)
      .set(bodyParsed.data)
      .where(eq(legalTermsTable.id, paramsParsed.data.id))
      .returning();
    if (!updated) {
      res.status(404).json({ error: "Legal term not found" });
      return;
    }
    res.json(updated);
  } catch (err) {
    logger.error({ err }, "Failed to update legal term");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/legal-terms/:id", async (req, res) => {
  try {
    const parsed = DeleteLegalTermParams.safeParse({ id: Number(req.params.id) });
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid id" });
      return;
    }
    const [deleted] = await db.delete(legalTermsTable).where(eq(legalTermsTable.id, parsed.data.id)).returning();
    if (!deleted) {
      res.status(404).json({ error: "Legal term not found" });
      return;
    }
    res.status(204).send();
  } catch (err) {
    logger.error({ err }, "Failed to delete legal term");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
