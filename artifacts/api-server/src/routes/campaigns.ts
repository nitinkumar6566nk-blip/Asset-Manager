import { Router } from "express";
import { db, campaignsTable } from "@workspace/db";
import { eq, sql } from "drizzle-orm";

const router = Router();

const serializeCampaign = (c: typeof campaignsTable.$inferSelect) => ({
  ...c,
  goalAmount: Number(c.goalAmount),
  raisedAmount: Number(c.raisedAmount),
  startDate: c.startDate.toISOString(),
  endDate: c.endDate ? c.endDate.toISOString() : null,
});

// ─── All campaigns ─────────────────────────────────────────────────────────────
router.get("/campaigns", async (req, res) => {
  try {
    const campaigns = await db
      .select()
      .from(campaignsTable)
      .orderBy(sql`${campaignsTable.id} desc`);
    res.json(campaigns.map(serializeCampaign));
  } catch (err) {
    req.log.error(err, "Failed to get campaigns");
    res.status(500).json({ error: "Failed to get campaigns" });
  }
});

// ─── Active campaigns only ─────────────────────────────────────────────────────
router.get("/campaigns/active", async (req, res) => {
  try {
    const campaigns = await db
      .select()
      .from(campaignsTable)
      .where(eq(campaignsTable.isActive, true))
      .orderBy(sql`${campaignsTable.id} desc`);
    res.json(campaigns.map(serializeCampaign));
  } catch (err) {
    req.log.error(err, "Failed to get active campaigns");
    res.status(500).json({ error: "Failed to get active campaigns" });
  }
});

// ─── Single campaign ───────────────────────────────────────────────────────────
router.get("/campaigns/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) { res.status(400).json({ error: "Invalid campaign id" }); return; }
    const [campaign] = await db
      .select()
      .from(campaignsTable)
      .where(eq(campaignsTable.id, id));
    if (!campaign) { res.status(404).json({ error: "Campaign not found" }); return; }
    res.json(serializeCampaign(campaign));
  } catch (err) {
    req.log.error(err, "Failed to get campaign");
    res.status(500).json({ error: "Failed to get campaign" });
  }
});

// ─── Create campaign ───────────────────────────────────────────────────────────
router.post("/campaigns", async (req, res) => {
  try {
    const { title, description, imageUrl, goalAmount, startDate, endDate, programId } = req.body;
    if (!title || !goalAmount || !startDate) {
      res.status(400).json({ error: "title, goalAmount and startDate are required" });
      return;
    }
    const [campaign] = await db
      .insert(campaignsTable)
      .values({
        title,
        description,
        imageUrl,
        goalAmount: String(goalAmount),
        raisedAmount: "0",
        donorsCount: 0,
        isActive: true,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : undefined,
        programId: programId ?? null,
      })
      .returning();
    res.status(201).json(serializeCampaign(campaign));
  } catch (err) {
    req.log.error(err, "Failed to create campaign");
    res.status(500).json({ error: "Failed to create campaign" });
  }
});

// ─── Toggle campaign active status ────────────────────────────────────────────
router.patch("/campaigns/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) { res.status(400).json({ error: "Invalid campaign id" }); return; }
    const { isActive } = req.body;
    const [updated] = await db
      .update(campaignsTable)
      .set({ isActive: Boolean(isActive) })
      .where(eq(campaignsTable.id, id))
      .returning();
    if (!updated) { res.status(404).json({ error: "Campaign not found" }); return; }
    res.json(serializeCampaign(updated));
  } catch (err) {
    req.log.error(err, "Failed to update campaign");
    res.status(500).json({ error: "Failed to update campaign" });
  }
});

export default router;
