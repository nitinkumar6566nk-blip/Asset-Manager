import { Router } from "express";
import { db, newsletterTable } from "@workspace/db";
import { sendNewsletterWelcome } from "../lib/email";

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

    // Send welcome email without blocking
    sendNewsletterWelcome({ email, name: name || undefined }).catch(
      (err) => req.log.error(err, "Failed to send newsletter welcome email"),
    );

    res.status(201).json({ ...subscriber, subscribedAt: subscriber.subscribedAt.toISOString() });
  } catch (err) {
    req.log.error(err, "Failed to subscribe to newsletter");
    res.status(500).json({ error: "Failed to subscribe" });
  }
});

export default router;
