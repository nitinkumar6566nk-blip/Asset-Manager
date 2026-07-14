import { Router } from "express";
import { db, testimonialsTable } from "@workspace/db";
import { eq, sql } from "drizzle-orm";

const router = Router();

router.get("/testimonials", async (req, res) => {
  try {
    const items = await db
      .select()
      .from(testimonialsTable)
      .where(eq(testimonialsTable.isApproved, true))
      .orderBy(sql`${testimonialsTable.createdAt} desc`);
    res.json(items.map((t) => ({ ...t, createdAt: t.createdAt.toISOString() })));
  } catch (err) {
    req.log.error(err, "Failed to get testimonials");
    res.status(500).json({ error: "Failed to get testimonials" });
  }
});

router.post("/testimonials", async (req, res) => {
  try {
    const { name, role, imageUrl, content, rating, programId } = req.body;
    const [testimonial] = await db.insert(testimonialsTable).values({
      name, role, imageUrl, content,
      rating: rating || 5,
      programId: programId || null,
      isApproved: false,
    }).returning();
    res.status(201).json({ ...testimonial, createdAt: testimonial.createdAt.toISOString() });
  } catch (err) {
    req.log.error(err, "Failed to create testimonial");
    res.status(500).json({ error: "Failed to create testimonial" });
  }
});

export default router;
