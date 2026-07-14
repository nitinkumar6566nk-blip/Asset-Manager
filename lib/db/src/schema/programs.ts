import { pgTable, serial, text, integer, numeric } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const programsTable = pgTable("programs", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull().default("Heart"),
  imageUrl: text("image_url").notNull().default(""),
  slug: text("slug"),
  donorsCount: integer("donors_count").notNull().default(0),
  raisedAmount: numeric("raised_amount", { precision: 12, scale: 2 }).notNull().default("0"),
});

export const insertProgramSchema = createInsertSchema(programsTable).omit({ id: true });
export type InsertProgram = z.infer<typeof insertProgramSchema>;
export type Program = typeof programsTable.$inferSelect;
