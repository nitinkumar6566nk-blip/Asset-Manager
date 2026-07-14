import { Router } from "express";
import { db, donationsTable, campaignsTable, programsTable } from "@workspace/db";
import { eq, sql } from "drizzle-orm";
import { sendDonationReceipt } from "../lib/email";

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

    // Send receipt email if we have a donor email and they're not anonymous
    if (donorEmail && !isAnonymous) {
      // Fetch campaign/program titles for the receipt
      Promise.all([
        campaignId
          ? db.select({ title: campaignsTable.title }).from(campaignsTable).where(eq(campaignsTable.id, campaignId)).then(r => r[0]?.title)
          : Promise.resolve(undefined),
        programId
          ? db.select({ title: programsTable.title }).from(programsTable).where(eq(programsTable.id, programId)).then(r => r[0]?.title)
          : Promise.resolve(undefined),
      ]).then(([campaignTitle, programTitle]) =>
        sendDonationReceipt({
          donorName,
          donorEmail,
          amount: Number(amount),
          currency: currency || "INR",
          isRecurring: Boolean(isRecurring),
          campaignTitle,
          programTitle,
        })
      ).catch((err) => req.log.error(err, "Failed to send donation receipt"));
    }

    res.status(201).json(serializeDonation(donation));
  } catch (err) {
    req.log.error(err, "Failed to create donation");
    res.status(500).json({ error: "Failed to create donation" });
  }
});

export default router;
