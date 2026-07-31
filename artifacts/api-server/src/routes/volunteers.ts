import { Router } from "express";
import { db, volunteersTable } from "@workspace/db";
import { eq, sql } from "drizzle-orm";
import { sendVolunteerConfirmation, sendVolunteerNotification } from "../lib/email";

const router = Router();

const serializeVolunteer = (v: typeof volunteersTable.$inferSelect) => ({
  ...v,
  skills: v.skills ?? [],
  createdAt: v.createdAt.toISOString(),
});

// ─── List all volunteers (admin) ───────────────────────────────────────────────
router.get("/volunteers", async (req, res) => {
  try {
    const volunteers = await db
      .select()
      .from(volunteersTable)
      .orderBy(sql`${volunteersTable.createdAt} desc`);
    res.json(volunteers.map(serializeVolunteer));
  } catch (err) {
    req.log.error(err, "Failed to get volunteers");
    res.status(500).json({ error: "Failed to get volunteers" });
  }
});

// ─── Current user's volunteer profile ─────────────────────────────────────────
router.get("/volunteers/me", async (req, res) => {
  try {
    const user = (req as any).user;
    if (!user) { res.status(401).json({ error: "Unauthenticated" }); return; }
    const [volunteer] = await db
      .select()
      .from(volunteersTable)
      .where(eq(volunteersTable.userId, user.id));
    if (!volunteer) { res.status(404).json({ error: "Not a volunteer" }); return; }
    res.json(serializeVolunteer(volunteer));
  } catch (err) {
    req.log.error(err, "Failed to get volunteer profile");
    res.status(500).json({ error: "Failed to get volunteer profile" });
  }
});

// ─── Apply as volunteer ────────────────────────────────────────────────────────
router.post("/volunteers", async (req, res) => {
  try {
    const user = (req as any).user;
    const { name, email, phone, skills, availability, location, bio } = req.body;

    // Basic validation
    if (!name || !email || !phone || !availability || !location) {
      res.status(400).json({ error: "name, email, phone, availability and location are required" });
      return;
    }

    // Prevent duplicate applications by email
    const [existing] = await db
      .select({ id: volunteersTable.id })
      .from(volunteersTable)
      .where(eq(volunteersTable.email, email))
      .limit(1);

    if (existing) {
      res.status(409).json({ error: "An application with this email already exists" });
      return;
    }

    const [volunteer] = await db
      .insert(volunteersTable)
      .values({
        userId: user?.id ?? null,
        name,
        email,
        phone,
        skills: Array.isArray(skills) ? skills : [],
        availability,
        location,
        bio: bio ?? null,
        status: "pending",
      })
      .returning();

    // Send confirmation to applicant + notification to admin (non-blocking)
    Promise.all([
      sendVolunteerConfirmation({ name, email, skills: Array.isArray(skills) ? skills : [] }),
      sendVolunteerNotification({ name, email, phone, skills: Array.isArray(skills) ? skills : [], availability, location, bio }),
    ]).catch((err) => req.log.error(err, "Failed to send volunteer emails"));

    res.status(201).json(serializeVolunteer(volunteer));
  } catch (err) {
    req.log.error(err, "Failed to register volunteer");
    res.status(500).json({ error: "Failed to register volunteer" });
  }
});

export default router;
