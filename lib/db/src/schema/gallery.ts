import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const galleryTable = pgTable("gallery", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  mediaUrl: text("media_url").notNull(),
  mediaType: text("media_type").notNull().default("image"),
  category: text("category").notNull().default("General"),
  uploadedAt: timestamp("uploaded_at").notNull().defaultNow(),
});

export const insertGallerySchema = createInsertSchema(galleryTable).omit({ id: true, uploadedAt: true });
export type InsertGallery = z.infer<typeof insertGallerySchema>;
export type GalleryItem = typeof galleryTable.$inferSelect;
