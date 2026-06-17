import { pgTable, text, serial, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const faqTable = pgTable("faq", {
  id: serial("id").primaryKey(),
  systemId: integer("system_id"),
  questionAr: text("question_ar").notNull(),
  answerAr: text("answer_ar").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertFaqSchema = createInsertSchema(faqTable).omit({ id: true, createdAt: true });
export type InsertFaq = z.infer<typeof insertFaqSchema>;
export type FaqItem = typeof faqTable.$inferSelect;
