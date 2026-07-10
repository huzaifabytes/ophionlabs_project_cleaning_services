import { Router } from "express";
import type { Request, Response } from "express";
import { db, teamMembersTable } from "@workspace/db";
import { asc, eq } from "drizzle-orm";
import { requireAdmin } from "../middlewares/auth.js";

const router = Router();

router.get("/team", async (req: Request, res: Response) => {
  try {
    const members = await db.select().from(teamMembersTable).orderBy(asc(teamMembersTable.sortOrder));
    res.json(members);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/team", requireAdmin, async (req: Request, res: Response) => {
  try {
    const [member] = await db.insert(teamMembersTable).values(req.body).returning();
    res.status(201).json(member);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/team/reorder", requireAdmin, async (req: Request, res: Response) => {
  try {
    const { ids } = req.body as { ids: number[] };
    await Promise.all(
      ids.map((id, index) =>
        db.update(teamMembersTable).set({ sortOrder: index }).where(eq(teamMembersTable.id, id))
      )
    );
    res.json({ success: true });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/team/:id", requireAdmin, async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const [member] = await db.update(teamMembersTable).set(req.body).where(eq(teamMembersTable.id, id)).returning();
    if (!member) { res.status(404).json({ error: "Not found" }); return; }
    res.json(member);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/team/:id", requireAdmin, async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await db.delete(teamMembersTable).where(eq(teamMembersTable.id, id));
    res.json({ success: true });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
