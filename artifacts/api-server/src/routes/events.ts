import { Router } from "express";
import { db, eventsTable, eventRegistrationsTable } from "@workspace/db";
import { eq, sql, gt } from "drizzle-orm";

const router = Router();

const serializeEvent = (e: typeof eventsTable.$inferSelect) => ({
  ...e,
  startDate: e.startDate.toISOString(),
  endDate: e.endDate.toISOString(),
});

router.get("/events", async (req, res) => {
  try {
    const events = await db.select().from(eventsTable).orderBy(eventsTable.startDate);
    res.json(events.map(serializeEvent));
  } catch (err) {
    req.log.error(err, "Failed to get events");
    res.status(500).json({ error: "Failed to get events" });
  }
});

router.get("/events/upcoming", async (req, res) => {
  try {
    const now = new Date();
    const events = await db
      .select()
      .from(eventsTable)
      .where(gt(eventsTable.startDate, now))
      .orderBy(eventsTable.startDate)
      .limit(6);
    res.json(events.map(serializeEvent));
  } catch (err) {
    req.log.error(err, "Failed to get upcoming events");
    res.status(500).json({ error: "Failed to get upcoming events" });
  }
});

router.get("/events/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [event] = await db.select().from(eventsTable).where(eq(eventsTable.id, id));
    if (!event) { res.status(404).json({ error: "Event not found" }); return; }
    res.json(serializeEvent(event));
  } catch (err) {
    req.log.error(err, "Failed to get event");
    res.status(500).json({ error: "Failed to get event" });
  }
});

router.post("/events", async (req, res) => {
  try {
    const { title, description, imageUrl, location, startDate, endDate, maxSeats, category } = req.body;
    const [event] = await db.insert(eventsTable).values({
      title, description, imageUrl, location,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      maxSeats: maxSeats || 100,
      category: category || "General",
    }).returning();
    res.status(201).json(serializeEvent(event));
  } catch (err) {
    req.log.error(err, "Failed to create event");
    res.status(500).json({ error: "Failed to create event" });
  }
});

router.post("/events/:id/register", async (req, res) => {
  try {
    const eventId = parseInt(req.params.id);
    const { name, email, phone } = req.body;
    const [registration] = await db.insert(eventRegistrationsTable).values({
      eventId, name, email, phone: phone || null,
    }).returning();
    // increment registered count
    await db.update(eventsTable)
      .set({ registeredCount: sql`${eventsTable.registeredCount} + 1` })
      .where(eq(eventsTable.id, eventId));
    res.status(201).json({
      ...registration,
      createdAt: registration.createdAt.toISOString(),
    });
  } catch (err) {
    req.log.error(err, "Failed to register for event");
    res.status(500).json({ error: "Failed to register for event" });
  }
});

export default router;
