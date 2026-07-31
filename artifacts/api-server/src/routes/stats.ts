import { Router } from "express";
import { db } from "@workspace/db";
import {
  donationsTable,
  volunteersTable,
  campaignsTable,
  eventsTable,
  contactMessagesTable,
  impactStatsTable,
} from "@workspace/db";
import { eq, sql, gt } from "drizzle-orm";

const router = Router();

// ─── Public stats (impact numbers shown on homepage) ──────────────────────────
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

    // Read impact metrics from DB (admin-updatable)
    const [impact] = await db.select().from(impactStatsTable).limit(1);

    res.json({
      mealsServed: impact?.mealsServed ?? 125000,
      childrenHelped: impact?.childrenHelped ?? 3800,
      oldAgeResidents: impact?.oldAgeResidents ?? 240,
      volunteers: Number(volunteerCount?.count ?? 0),
      medicalCamps: impact?.medicalCamps ?? 85,
      treesPlanted: impact?.treesPlanted ?? 12000,
      totalDonations: Number(donationAgg?.totalDonations ?? 0),
      totalDonors: Number(donationAgg?.totalDonors ?? 0),
    });
  } catch (err) {
    req.log.error(err, "Failed to get stats");
    res.status(500).json({ error: "Failed to get stats" });
  }
});

// ─── Live ticker (header strip) ───────────────────────────────────────────────
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
      .where(
        sql`${donationsTable.createdAt} >= ${today} and ${donationsTable.status} = 'completed'`,
      );

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

// ─── Admin dashboard ──────────────────────────────────────────────────────────
router.get("/admin/dashboard", async (req, res) => {
  try {
    // ── Core aggregates ────────────────────────────────────────────────────
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

    const [msgCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(contactMessagesTable);

    // ── Recent donations (last 5) ──────────────────────────────────────────
    const recentDonations = await db
      .select()
      .from(donationsTable)
      .orderBy(sql`${donationsTable.createdAt} desc`)
      .limit(5);

    // ── Upcoming events (next 3) ──────────────────────────────────────────
    const now = new Date();
    const upcomingEvents = await db
      .select()
      .from(eventsTable)
      .where(gt(eventsTable.startDate, now))
      .orderBy(eventsTable.startDate)
      .limit(3);

    // ── Monthly donations for last 6 months (chart data) ──────────────────
    const monthlyRows = await db.execute<{
      month: string;
      donations: string;
      count: string;
    }>(sql`
      SELECT
        to_char(date_trunc('month', created_at), 'Mon') AS month,
        coalesce(sum(amount::numeric), 0)::float        AS donations,
        count(*)::int                                    AS count
      FROM donations
      WHERE status = 'completed'
        AND created_at >= now() - interval '6 months'
      GROUP BY date_trunc('month', created_at)
      ORDER BY date_trunc('month', created_at)
    `);

    const monthlyDonations = (monthlyRows.rows ?? []).map((r) => ({
      name: r.month,
      donations: Number(r.donations),
      count: Number(r.count),
    }));

    res.json({
      totalDonations: Number(donationAgg?.total ?? 0),
      totalDonors: Number(donationAgg?.donors ?? 0),
      totalVolunteers: Number(volCount?.count ?? 0),
      pendingMessages: Number(msgCount?.count ?? 0),
      recentDonations: recentDonations.map((d) => ({
        ...d,
        amount: Number(d.amount),
        createdAt: d.createdAt.toISOString(),
      })),
      upcomingEvents: upcomingEvents.map((e) => ({
        ...e,
        startDate: e.startDate.toISOString(),
        endDate: e.endDate.toISOString(),
      })),
      monthlyDonations,
    });
  } catch (err) {
    req.log.error(err, "Failed to get admin dashboard");
    res.status(500).json({ error: "Failed to get admin dashboard" });
  }
});

// ─── Update impact metrics (admin only) ───────────────────────────────────────
router.patch("/admin/impact-stats", async (req, res) => {
  try {
    const { mealsServed, childrenHelped, oldAgeResidents, medicalCamps, treesPlanted } = req.body;

    const [existing] = await db.select().from(impactStatsTable).limit(1);
    if (existing) {
      const [updated] = await db
        .update(impactStatsTable)
        .set({
          ...(mealsServed != null && { mealsServed }),
          ...(childrenHelped != null && { childrenHelped }),
          ...(oldAgeResidents != null && { oldAgeResidents }),
          ...(medicalCamps != null && { medicalCamps }),
          ...(treesPlanted != null && { treesPlanted }),
        })
        .where(eq(impactStatsTable.id, existing.id))
        .returning();
      res.json(updated);
    } else {
      const [created] = await db
        .insert(impactStatsTable)
        .values({ mealsServed, childrenHelped, oldAgeResidents, medicalCamps, treesPlanted })
        .returning();
      res.json(created);
    }
  } catch (err) {
    req.log.error(err, "Failed to update impact stats");
    res.status(500).json({ error: "Failed to update impact stats" });
  }
});

export default router;
