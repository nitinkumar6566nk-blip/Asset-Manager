import { Router } from "express";
import { db, donationsTable } from "@workspace/db";
import { eq, sql } from "drizzle-orm";

const router = Router();

const serializeDonation = (d: typeof donationsTable.$inferSelect) => ({
  ...d,
  amount: Number(d.amount),
  createdAt: d.createdAt.toISOString(),
});

router.get("/donations", async (req, res) => {
  try {
    const user = (req as any).user;
    let donations;
    if (user) {
      donations = await db
        .select()
        .from(donationsTable)
        .where(eq(donationsTable.userId, user.id))
        .orderBy(sql`${donationsTable.createdAt} desc`);
    } else {
      donations = await db
        .select()
        .from(donationsTable)
        .orderBy(sql`${donationsTable.createdAt} desc`)
        .limit(20);
    }
    res.json(donations.map(serializeDonation));
  } catch (err) {
    req.log.error(err, "Failed to get donations");
    res.status(500).json({ error: "Failed to get donations" });
  }
});

router.get("/donations/recent", async (req, res) => {
  try {
    const donations = await db
      .select()
      .from(donationsTable)
      .where(eq(donationsTable.status, "completed"))
      .orderBy(sql`${donationsTable.createdAt} desc`)
      .limit(10);
    res.json(donations.map(serializeDonation));
  } catch (err) {
    req.log.error(err, "Failed to get recent donations");
    res.status(500).json({ error: "Failed to get recent donations" });
  }
});

router.post("/donations", async (req, res) => {
  try {
    const user = (req as any).user;
    const {
      amount, currency, paymentMethod, isAnonymous, isRecurring,
      campaignId, programId, message, donorName, donorEmail, donorPhone,
    } = req.body;

    const [donation] = await db.insert(donationsTable).values({
      userId: user?.id,
      donorName: isAnonymous ? "Anonymous" : donorName,
      donorEmail,
      donorPhone,
      amount: String(amount),
      currency: currency || "INR",
      paymentMethod: paymentMethod || "stripe",
      status: "completed",
      isAnonymous: Boolean(isAnonymous),
      isRecurring: Boolean(isRecurring),
      campaignId: campaignId || null,
      programId: programId || null,
      message,
    }).returning();

    res.status(201).json(serializeDonation(donation));
  } catch (err) {
    req.log.error(err, "Failed to create donation");
    res.status(500).json({ error: "Failed to create donation" });
  }
});

export default router;
