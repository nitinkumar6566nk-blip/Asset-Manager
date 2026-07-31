import { Router } from "express";
import { db, blogsTable } from "@workspace/db";
import { eq, ilike, or, and, sql } from "drizzle-orm";

const router = Router();

const serializeBlog = (b: typeof blogsTable.$inferSelect) => ({
  ...b,
  publishedAt: b.publishedAt.toISOString(),
  tags: b.tags ?? [],
});

// ─── List blogs (with optional category + search filters) ────────────────────
router.get("/blogs", async (req, res) => {
  try {
    const { category, search } = req.query as { category?: string; search?: string };

    const conditions = [];
    if (category && category.trim()) {
      conditions.push(eq(blogsTable.category, category.trim()));
    }
    if (search && search.trim()) {
      const term = `%${search.trim()}%`;
      conditions.push(
        or(
          ilike(blogsTable.title, term),
          ilike(blogsTable.excerpt, term),
        ),
      );
    }

    let query = db.select().from(blogsTable).$dynamic();
    if (conditions.length === 1) {
      query = query.where(conditions[0]!);
    } else if (conditions.length > 1) {
      query = query.where(and(...conditions));
    }

    const blogs = await query.orderBy(sql`${blogsTable.publishedAt} desc`);
    res.json(blogs.map(serializeBlog));
  } catch (err) {
    req.log.error(err, "Failed to get blogs");
    res.status(500).json({ error: "Failed to get blogs" });
  }
});

// ─── Single blog by slug ───────────────────────────────────────────────────────
router.get("/blogs/:slug", async (req, res) => {
  try {
    const [blog] = await db
      .select()
      .from(blogsTable)
      .where(eq(blogsTable.slug, req.params.slug));
    if (!blog) { res.status(404).json({ error: "Blog not found" }); return; }
    res.json(serializeBlog(blog));
  } catch (err) {
    req.log.error(err, "Failed to get blog");
    res.status(500).json({ error: "Failed to get blog" });
  }
});

// ─── Create blog post (admin) ──────────────────────────────────────────────────
router.post("/blogs", async (req, res) => {
  try {
    const { title, slug, excerpt, content, category, imageUrl, authorName, authorImage, readTime, tags } =
      req.body;
    if (!title || !slug || !content) {
      res.status(400).json({ error: "title, slug and content are required" });
      return;
    }
    // Ensure slug is unique
    const [existing] = await db
      .select({ id: blogsTable.id })
      .from(blogsTable)
      .where(eq(blogsTable.slug, slug))
      .limit(1);
    if (existing) {
      res.status(409).json({ error: "A blog with this slug already exists" });
      return;
    }
    const [blog] = await db
      .insert(blogsTable)
      .values({
        title,
        slug,
        excerpt: excerpt || "",
        content,
        category: category || "General",
        imageUrl: imageUrl || null,
        authorName: authorName || "Karuna Dham Team",
        authorImage: authorImage || null,
        readTime: readTime || 5,
        tags: Array.isArray(tags) ? tags : [],
      })
      .returning();
    res.status(201).json(serializeBlog(blog));
  } catch (err) {
    req.log.error(err, "Failed to create blog");
    res.status(500).json({ error: "Failed to create blog" });
  }
});

export default router;
