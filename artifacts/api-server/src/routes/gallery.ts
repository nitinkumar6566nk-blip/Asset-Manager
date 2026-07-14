import { Router } from "express";
import { db, galleryTable } from "@workspace/db";
import { eq, sql } from "drizzle-orm";

const router = Router();

router.get("/gallery", async (req, res) => {
  try {
    const { category } = req.query as { category?: string };
    let query = db.select().from(galleryTable).$dynamic();
    if (category) {
      query = query.where(eq(galleryTable.category, category));
    }
    const items = await query.orderBy(sql`${galleryTable.uploadedAt} desc`);
    res.json(items.map((i) => ({ ...i, uploadedAt: i.uploadedAt.toISOString() })));
  } catch (err) {
    req.log.error(err, "Failed to get gallery");
    res.status(500).json({ error: "Failed to get gallery" });
  }
});

export default router;
