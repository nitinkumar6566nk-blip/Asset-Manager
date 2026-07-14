import { Router } from "express";
import { db } from "@workspace/db";
import { donationsTable, volunteersTable, campaignsTable } from "@workspace/db";
import { sql, eq } from "drizzle-orm";

const router = Router();

router.get("/stats", async (req, res) => {
  try {
    const [donationAgg] = await db
      .select({
        totalDonations: sql<number>`coalesce(sum(${donationsTable.amount}::numeric), 0)`,
        totalDonors: sql<number>`count(distinct case when ${donationsTable.donorEmail} is not null then ${donationsTable.donorEmail} end)`,
      })
      .from(donationsTable)
      .where(eq(donationsTable.status, "completed"));

    const [volunteerCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(volunteersTable);

    res.json({
      mealsServed: 125000,
      childrenHelped: 3800,
      oldAgeResidents: 240,
      volunteers: Number(volunteerCount?.count ?? 0),
      medicalCamps: 85,
      treesPlanted: 12000,
      totalDonations: Number(donationAgg?.totalDonations ?? 0),
      totalDonors: Number(donationAgg?.totalDonors ?? 0),
    });
  } catch (err) {
    req.log.error(err, "Failed to get stats");
    res.status(500).json({ error: "Failed to get stats" });
  }
});

router.get("/stats/live", async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [totalAgg] = await db
      .select({ total: sql<number>`coalesce(sum(${donationsTable.amount}::numeric), 0)` })
      .from(donationsTable)
      .where(eq(donationsTable.status, "completed"));

    const [todayAgg] = await db
      .select({ count: sql<number>`count(*)` })
      .from(donationsTable)
      .where(sql`${donationsTable.createdAt} >= ${today} and ${donationsTable.status} = 'completed'`);

    const [activeVols] = await db
      .select({ count: sql<number>`count(*)` })
      .from(volunteersTable)
      .where(eq(volunteersTable.status, "active"));

    const [activeCamps] = await db
      .select({ count: sql<number>`count(*)` })
      .from(campaignsTable)
      .where(eq(campaignsTable.isActive, true));

    res.json({
      totalRaised: Number(totalAgg?.total ?? 0),
      donationsToday: Number(todayAgg?.count ?? 0),
      activeVolunteers: Number(activeVols?.count ?? 0),
      activeCampaigns: Number(activeCamps?.count ?? 0),
    });
  } catch (err) {
    req.log.error(err, "Failed to get live stats");
    res.status(500).json({ error: "Failed to get live stats" });
  }
});

router.get("/admin/dashboard", async (req, res) => {
  try {
    const [donationAgg] = await db
      .select({
        total: sql<number>`coalesce(sum(${donationsTable.amount}::numeric), 0)`,
        donors: sql<number>`count(distinct ${donationsTable.donorEmail})`,
      })
      .from(donationsTable)
      .where(eq(donationsTable.status, "completed"));

    const [volCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(volunteersTable);

    const recentDonations = await db
      .select()
      .from(donationsTable)
      .orderBy(sql`${donationsTable.createdAt} desc`)
      .limit(5);

    res.json({
      totalDonations: Number(donationAgg?.total ?? 0),
      totalDonors: Number(donationAgg?.donors ?? 0),
      totalVolunteers: Number(volCount?.count ?? 0),
      pendingMessages: 0,
      recentDonations: recentDonations.map((d) => ({
        ...d,
        amount: Number(d.amount),
        createdAt: d.createdAt.toISOString(),
      })),
      upcomingEvents: [],
    });
  } catch (err) {
    req.log.error(err, "Failed to get admin dashboard");
    res.status(500).json({ error: "Failed to get admin dashboard" });
  }
});

export default router;
