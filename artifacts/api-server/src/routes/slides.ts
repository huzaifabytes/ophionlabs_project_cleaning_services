import { Router } from "express";
import type { Request, Response } from "express";
import { db, slidesTable } from "@workspace/db";
import { asc, eq } from "drizzle-orm";
import { requireAdmin } from "../middlewares/auth.js";

const router = Router();

router.get("/slides", async (req: Request, res: Response) => {
  try {
    const slides = await db.select().from(slidesTable).orderBy(asc(slidesTable.sortOrder));
    res.json(slides);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/slides", requireAdmin, async (req: Request, res: Response) => {
  try {
    const [slide] = await db.insert(slidesTable).values(req.body).returning();
    res.status(201).json(slide);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/slides/reorder", requireAdmin, async (req: Request, res: Response) => {
  try {
    const { ids } = req.body as { ids: number[] };
    await Promise.all(
      ids.map((id, index) =>
        db.update(slidesTable).set({ sortOrder: index }).where(eq(slidesTable.id, id))
      )
    );
    res.json({ success: true });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/slides/:id", requireAdmin, async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const [slide] = await db.update(slidesTable).set(req.body).where(eq(slidesTable.id, id)).returning();
    if (!slide) { res.status(404).json({ error: "Not found" }); return; }
    res.json(slide);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/slides/:id", requireAdmin, async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await db.delete(slidesTable).where(eq(slidesTable.id, id));
    res.json({ success: true });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
