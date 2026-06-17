import { pgTable, text, serial, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const systemsTable = pgTable("systems", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  nameAr: text("name_ar").notNull(),
  nameEn: text("name_en").notNull(),
  category: text("category").notNull(),
  icon: text("icon").notNull(),
  descriptionAr: text("description_ar").notNull(),
  objectiveAr: text("objective_ar").notNull(),
  obligationsAr: text("obligations_ar").notNull(),
  commonViolationsAr: text("common_violations_ar").notNull(),
  penaltiesAr: text("penalties_ar").notNull(),
  complianceTipsAr: text("compliance_tips_ar").notNull(),
  sourceUrl: text("source_url").notNull(),
  officialReference: text("official_reference").notNull(),
  lastUpdated: text("last_updated").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertSystemSchema = createInsertSchema(systemsTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertSystem = z.infer<typeof insertSystemSchema>;
export type LegalSystem = typeof systemsTable.$inferSelect;
