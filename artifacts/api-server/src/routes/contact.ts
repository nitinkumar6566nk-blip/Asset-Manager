import { Router } from "express";
import { db, contactMessagesTable } from "@workspace/db";
import { sendContactConfirmation, sendContactNotification } from "../lib/email";

const router = Router();

router.post("/contact", async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    const [msg] = await db.insert(contactMessagesTable).values({
      name, email, phone: phone || null, subject, message,
    }).returning();

    // Fire emails without blocking the response
    Promise.all([
      sendContactConfirmation({ name, email, subject }),
      sendContactNotification({ name, email, phone, subject, message }),
    ]).catch((err) => req.log.error(err, "Failed to send contact emails"));

    res.status(201).json({ ...msg, createdAt: msg.createdAt.toISOString() });
  } catch (err) {
    req.log.error(err, "Failed to save contact message");
    res.status(500).json({ error: "Failed to save contact message" });
  }
});

export default router;
