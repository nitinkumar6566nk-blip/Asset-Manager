import { Router } from "express";
import { db, newsletterTable } from "@workspace/db";

const router = Router();

router.post("/newsletter/subscribe", async (req, res) => {
  try {
    const { email, name } = req.body;
    const [subscriber] = await db
      .insert(newsletterTable)
      .values({ email, name: name || null })
      .onConflictDoNothing()
      .returning();

    if (!subscriber) {
      res.status(200).json({ message: "Already subscribed" });
      return;
    }

    res.status(201).json({ ...subscriber, subscribedAt: subscriber.subscribedAt.toISOString() });
  } catch (err) {
    req.log.error(err, "Failed to subscribe to newsletter");
    res.status(500).json({ error: "Failed to subscribe" });
  }
});

export default router;
