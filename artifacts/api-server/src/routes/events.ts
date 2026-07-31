import { Router } from "express";
import { db, eventsTable, eventRegistrationsTable } from "@workspace/db";
import { eq, sql, gt, and } from "drizzle-orm";
import { sendEventRegistrationConfirmation } from "../lib/email";

const router = Router();

const serializeEvent = (e: typeof eventsTable.$inferSelect) => ({
  ...e,
  startDate: e.startDate.toISOString(),
  endDate: e.endDate.toISOString(),
});

// ─── All events ────────────────────────────────────────────────────────────────
router.get("/events", async (req, res) => {
  try {
    const events = await db
      .select()
      .from(eventsTable)
      .where(eq(eventsTable.isActive, true))
      .orderBy(eventsTable.startDate);
    res.json(events.map(serializeEvent));
  } catch (err) {
    req.log.error(err, "Failed to get events");
    res.status(500).json({ error: "Failed to get events" });
  }
});

// ─── Upcoming events (next 6) ──────────────────────────────────────────────────
router.get("/events/upcoming", async (req, res) => {
  try {
    const now = new Date();
    const events = await db
      .select()
      .from(eventsTable)
      .where(and(gt(eventsTable.startDate, now), eq(eventsTable.isActive, true)))
      .orderBy(eventsTable.startDate)
      .limit(6);
    res.json(events.map(serializeEvent));
  } catch (err) {
    req.log.error(err, "Failed to get upcoming events");
    res.status(500).json({ error: "Failed to get upcoming events" });
  }
});

// ─── Single event ──────────────────────────────────────────────────────────────
router.get("/events/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) { res.status(400).json({ error: "Invalid event id" }); return; }
    const [event] = await db
      .select()
      .from(eventsTable)
      .where(eq(eventsTable.id, id));
    if (!event) { res.status(404).json({ error: "Event not found" }); return; }
    res.json(serializeEvent(event));
  } catch (err) {
    req.log.error(err, "Failed to get event");
    res.status(500).json({ error: "Failed to get event" });
  }
});

// ─── Create event (admin) ─────────────────────────────────────────────────────
router.post("/events", async (req, res) => {
  try {
    const { title, description, imageUrl, location, startDate, endDate, maxSeats, category } =
      req.body;
    if (!title || !location || !startDate || !endDate) {
      res.status(400).json({ error: "title, location, startDate and endDate are required" });
      return;
    }
    const [event] = await db
      .insert(eventsTable)
      .values({
        title,
        description,
        imageUrl,
        location,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        maxSeats: maxSeats || 100,
        registeredCount: 0,
        isActive: true,
        category: category || "General",
      })
      .returning();
    res.status(201).json(serializeEvent(event));
  } catch (err) {
    req.log.error(err, "Failed to create event");
    res.status(500).json({ error: "Failed to create event" });
  }
});

// ─── Register for event ────────────────────────────────────────────────────────
router.post("/events/:id/register", async (req, res) => {
  try {
    const eventId = parseInt(req.params.id);
    if (isNaN(eventId)) { res.status(400).json({ error: "Invalid event id" }); return; }

    const { name, email, phone } = req.body;
    if (!name || !email) {
      res.status(400).json({ error: "name and email are required" });
      return;
    }

    // Fetch event to check capacity and existence
    const [event] = await db
      .select()
      .from(eventsTable)
      .where(eq(eventsTable.id, eventId));

    if (!event) {
      res.status(404).json({ error: "Event not found" });
      return;
    }
    if (!event.isActive) {
      res.status(400).json({ error: "This event is no longer accepting registrations" });
      return;
    }
    if (event.maxSeats != null && event.registeredCount >= event.maxSeats) {
      res.status(409).json({ error: "This event is fully booked" });
      return;
    }

    // Check for duplicate registration
    const [dup] = await db
      .select({ id: eventRegistrationsTable.id })
      .from(eventRegistrationsTable)
      .where(
        and(
          eq(eventRegistrationsTable.eventId, eventId),
          eq(eventRegistrationsTable.email, email),
        ),
      )
      .limit(1);

    if (dup) {
      res.status(409).json({ error: "You are already registered for this event" });
      return;
    }

    const [registration] = await db
      .insert(eventRegistrationsTable)
      .values({ eventId, name, email, phone: phone || null })
      .returning();

    // Increment registered count
    await db
      .update(eventsTable)
      .set({ registeredCount: sql`${eventsTable.registeredCount} + 1` })
      .where(eq(eventsTable.id, eventId));

    // Send confirmation email (fire-and-forget)
    sendEventRegistrationConfirmation({
      name,
      email,
      eventTitle: event.title,
      eventDate: event.startDate.toLocaleDateString("en-IN", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      eventLocation: event.location,
    }).catch((err) => req.log.error(err, "Failed to send event confirmation email"));

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
