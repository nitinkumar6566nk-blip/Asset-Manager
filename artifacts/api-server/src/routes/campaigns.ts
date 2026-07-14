import { Router } from "express";
import { db, campaignsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

const serializeCampaign = (c: typeof campaignsTable.$inferSelect) => ({
  ...c,
  goalAmount: Number(c.goalAmount),
  raisedAmount: Number(c.raisedAmount),
  startDate: c.startDate.toISOString(),
  endDate: c.endDate ? c.endDate.toISOString() : null,
});

router.get("/campaigns", async (req, res) => {
  try {
    const campaigns = await db.select().from(campaignsTable).orderBy(campaignsTable.id);
    res.json(campaigns.map(serializeCampaign));
  } catch (err) {
    req.log.error(err, "Failed to get campaigns");
    res.status(500).json({ error: "Failed to get campaigns" });
  }
});

router.get("/campaigns/active", async (req, res) => {
  try {
    const campaigns = await db.select().from(campaignsTable).where(eq(campaignsTable.isActive, true));
    res.json(campaigns.map(serializeCampaign));
  } catch (err) {
    req.log.error(err, "Failed to get active campaigns");
    res.status(500).json({ error: "Failed to get active campaigns" });
  }
});

router.get("/campaigns/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [campaign] = await db.select().from(campaignsTable).where(eq(campaignsTable.id, id));
    if (!campaign) { res.status(404).json({ error: "Campaign not found" }); return; }
    res.json(serializeCampaign(campaign));
  } catch (err) {
    req.log.error(err, "Failed to get campaign");
    res.status(500).json({ error: "Failed to get campaign" });
  }
});

router.post("/campaigns", async (req, res) => {
  try {
    const { title, description, imageUrl, goalAmount, startDate, endDate, programId } = req.body;
    const [campaign] = await db.insert(campaignsTable).values({
      title,
      description,
      imageUrl,
      goalAmount: String(goalAmount),
      startDate: new Date(startDate),
      endDate: endDate ? new Date(endDate) : undefined,
      programId,
    }).returning();
    res.status(201).json(serializeCampaign(campaign));
  } catch (err) {
    req.log.error(err, "Failed to create campaign");
    res.status(500).json({ error: "Failed to create campaign" });
  }
});

export default router;
