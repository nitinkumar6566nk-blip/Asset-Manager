import { Router } from "express";
import { db, programsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

const serializeProgram = (p: typeof programsTable.$inferSelect) => ({
  ...p,
  raisedAmount: Number(p.raisedAmount),
});

router.get("/programs", async (req, res) => {
  try {
    const programs = await db.select().from(programsTable).orderBy(programsTable.id);
    res.json(programs.map(serializeProgram));
  } catch (err) {
    req.log.error(err, "Failed to get programs");
    res.status(500).json({ error: "Failed to get programs" });
  }
});

router.get("/programs/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [program] = await db.select().from(programsTable).where(eq(programsTable.id, id));
    if (!program) { res.status(404).json({ error: "Program not found" }); return; }
    res.json(serializeProgram(program));
  } catch (err) {
    req.log.error(err, "Failed to get program");
    res.status(500).json({ error: "Failed to get program" });
  }
});

export default router;
