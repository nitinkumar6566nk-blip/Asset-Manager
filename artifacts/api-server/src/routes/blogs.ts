import { Router } from "express";
import { db, blogsTable } from "@workspace/db";
import { eq, ilike, or, sql } from "drizzle-orm";

const router = Router();

const serializeBlog = (b: typeof blogsTable.$inferSelect) => ({
  ...b,
  publishedAt: b.publishedAt.toISOString(),
  tags: b.tags ?? [],
});

router.get("/blogs", async (req, res) => {
  try {
    const { category, search } = req.query as { category?: string; search?: string };
    let query = db.select().from(blogsTable).$dynamic();

    if (category) {
      query = query.where(eq(blogsTable.category, category));
    } else if (search) {
      query = query.where(
        or(ilike(blogsTable.title, `%${search}%`), ilike(blogsTable.excerpt, `%${search}%`))
      );
    }

    const blogs = await query.orderBy(sql`${blogsTable.publishedAt} desc`);
    res.json(blogs.map(serializeBlog));
  } catch (err) {
    req.log.error(err, "Failed to get blogs");
    res.status(500).json({ error: "Failed to get blogs" });
  }
});

router.get("/blogs/:slug", async (req, res) => {
  try {
    const [blog] = await db.select().from(blogsTable).where(eq(blogsTable.slug, req.params.slug));
    if (!blog) { res.status(404).json({ error: "Blog not found" }); return; }
    res.json(serializeBlog(blog));
  } catch (err) {
    req.log.error(err, "Failed to get blog");
    res.status(500).json({ error: "Failed to get blog" });
  }
});

router.post("/blogs", async (req, res) => {
  try {
    const { title, slug, excerpt, content, category, imageUrl, authorName, authorImage, readTime, tags } = req.body;
    const [blog] = await db.insert(blogsTable).values({
      title, slug, excerpt, content, category: category || "General",
      imageUrl, authorName, authorImage, readTime: readTime || 5, tags: tags || [],
    }).returning();
    res.status(201).json(serializeBlog(blog));
  } catch (err) {
    req.log.error(err, "Failed to create blog");
    res.status(500).json({ error: "Failed to create blog" });
  }
});

export default router;
