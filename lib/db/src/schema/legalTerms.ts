import { pgTable, text, serial, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const legalTermsTable = pgTable("legal_terms", {
  id: serial("id").primaryKey(),
  termAr: text("term_ar").notNull(),
  termEn: text("term_en").notNull(),
  definitionAr: text("definition_ar").notNull(),
  systemId: integer("system_id"),
  needsReview: boolean("needs_review").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertLegalTermSchema = createInsertSchema(legalTermsTable).omit({ id: true, createdAt: true });
export type InsertLegalTerm = z.infer<typeof insertLegalTermSchema>;
export type LegalTerm = typeof legalTermsTable.$inferSelect;
