import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const blogsTable = pgTable("blogs", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  category: text("category").notNull().default("General"),
  imageUrl: text("image_url"),
  authorName: text("author_name").notNull(),
  authorImage: text("author_image"),
  publishedAt: timestamp("published_at").notNull().defaultNow(),
  readTime: integer("read_time").notNull().default(5),
  tags: text("tags").array().notNull().default([]),
});

export const insertBlogSchema = createInsertSchema(blogsTable).omit({ id: true });
export type InsertBlog = z.infer<typeof insertBlogSchema>;
export type Blog = typeof blogsTable.$inferSelect;
