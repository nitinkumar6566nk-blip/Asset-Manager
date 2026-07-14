import { Router } from "express";
import { db, volunteersTable } from "@workspace/db";
import { eq, sql } from "drizzle-orm";

const router = Router();

const serializeVolunteer = (v: typeof volunteersTable.$inferSelect) => ({
  ...v,
  skills: v.skills ?? [],
  createdAt: v.createdAt.toISOString(),
});

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

router.post("/volunteers", async (req, res) => {
  try {
    const user = (req as any).user;
    const { name, email, phone, skills, availability, location, bio } = req.body;
    const [volunteer] = await db.insert(volunteersTable).values({
      userId: user?.id,
      name, email, phone,
      skills: skills || [],
      availability, location, bio,
      status: "pending",
    }).returning();
    res.status(201).json(serializeVolunteer(volunteer));
  } catch (err) {
    req.log.error(err, "Failed to register volunteer");
    res.status(500).json({ error: "Failed to register volunteer" });
  }
});

export default router;
