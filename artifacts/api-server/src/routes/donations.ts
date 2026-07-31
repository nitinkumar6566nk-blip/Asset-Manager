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

// ─── List donations ────────────────────────────────────────────────────────────
router.get("/donations", async (req, res) => {
  try {
    const user = (req as any).user;
    let donations;
    if (user) {
      // Authenticated: return only their own donations
      donations = await db
        .select()
        .from(donationsTable)
        .where(eq(donationsTable.userId, user.id))
        .orderBy(sql`${donationsTable.createdAt} desc`);
    } else {
      // Public: return recent completed donations (anonymized if needed)
      donations = await db
        .select()
        .from(donationsTable)
        .where(eq(donationsTable.status, "completed"))
        .orderBy(sql`${donationsTable.createdAt} desc`)
        .limit(20);
    }
    res.json(donations.map(serializeDonation));
  } catch (err) {
    req.log.error(err, "Failed to get donations");
    res.status(500).json({ error: "Failed to get donations" });
  }
});

// ─── Recent donations ticker ───────────────────────────────────────────────────
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

// ─── Record a new donation ─────────────────────────────────────────────────────
router.post("/donations", async (req, res) => {
  try {
    const user = (req as any).user;
    const {
      amount, currency, paymentMethod, isAnonymous, isRecurring,
      campaignId, programId, message, donorName, donorEmail, donorPhone,
    } = req.body;

    // Basic validation
    const parsedAmount = parseFloat(amount);
    if (!parsedAmount || parsedAmount <= 0) {
      res.status(400).json({ error: "Invalid donation amount" });
      return;
    }
    if (!isAnonymous && (!donorName || !donorEmail)) {
      res.status(400).json({ error: "Donor name and email are required for non-anonymous donations" });
      return;
    }

    const [donation] = await db
      .insert(donationsTable)
      .values({
        userId: user?.id ?? null,
        donorName: isAnonymous ? "Anonymous" : (donorName ?? "Guest"),
        donorEmail: isAnonymous ? null : donorEmail,
        donorPhone: donorPhone ?? null,
        amount: String(parsedAmount),
        currency: currency || "INR",
        paymentMethod: paymentMethod || "online",
        status: "completed",
        isAnonymous: Boolean(isAnonymous),
        isRecurring: Boolean(isRecurring),
        campaignId: campaignId ?? null,
        programId: programId ?? null,
        message: message ?? null,
      })
      .returning();

    // ── Update campaign totals ─────────────────────────────────────────────
    if (campaignId) {
      await db
        .update(campaignsTable)
        .set({
          raisedAmount: sql`${campaignsTable.raisedAmount} + ${String(parsedAmount)}`,
          donorsCount: sql`${campaignsTable.donorsCount} + 1`,
        })
        .where(eq(campaignsTable.id, campaignId));
    }

    // ── Update program totals ──────────────────────────────────────────────
    if (programId) {
      await db
        .update(programsTable)
        .set({
          raisedAmount: sql`${programsTable.raisedAmount} + ${String(parsedAmount)}`,
          donorsCount: sql`${programsTable.donorsCount} + 1`,
        })
        .where(eq(programsTable.id, programId));
    }

    // ── Send donation receipt (fire-and-forget, guarded) ──────────────────
    if (donorEmail && !isAnonymous) {
      Promise.all([
        campaignId
          ? db
              .select({ title: campaignsTable.title })
              .from(campaignsTable)
              .where(eq(campaignsTable.id, campaignId))
              .then((r) => r[0]?.title)
          : Promise.resolve(undefined),
        programId
          ? db
              .select({ title: programsTable.title })
              .from(programsTable)
              .where(eq(programsTable.id, programId))
              .then((r) => r[0]?.title)
          : Promise.resolve(undefined),
      ])
        .then(([campaignTitle, programTitle]) =>
          sendDonationReceipt({
            donorName: donorName ?? "Friend",
            donorEmail,
            amount: parsedAmount,
            currency: currency || "INR",
            isRecurring: Boolean(isRecurring),
            campaignTitle,
            programTitle,
          }),
        )
        .catch((err) => req.log.error(err, "Failed to send donation receipt"));
    }

    res.status(201).json(serializeDonation(donation));
  } catch (err) {
    req.log.error(err, "Failed to create donation");
    res.status(500).json({ error: "Failed to create donation" });
  }
});

export default router;
