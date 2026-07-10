import { Router } from "express";
import type { Request, Response } from "express";
import { db, servicesTable } from "@workspace/db";
import { asc, eq } from "drizzle-orm";
import { requireAdmin } from "../middlewares/auth.js";

const router = Router();

router.get("/services", async (req: Request, res: Response) => {
  try {
    const services = await db.select().from(servicesTable).orderBy(asc(servicesTable.sortOrder));
    res.json(services);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/services", requireAdmin, async (req: Request, res: Response) => {
  try {
    const [service] = await db.insert(servicesTable).values(req.body).returning();
    res.status(201).json(service);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/services/reorder", requireAdmin, async (req: Request, res: Response) => {
  try {
    const { ids } = req.body as { ids: number[] };
    await Promise.all(
      ids.map((id, index) =>
        db.update(servicesTable).set({ sortOrder: index }).where(eq(servicesTable.id, id))
      )
    );
    res.json({ success: true });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/services/:id", requireAdmin, async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const [service] = await db.update(servicesTable).set(req.body).where(eq(servicesTable.id, id)).returning();
    if (!service) { res.status(404).json({ error: "Not found" }); return; }
    res.json(service);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/services/:id", requireAdmin, async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await db.delete(servicesTable).where(eq(servicesTable.id, id));
    res.json({ success: true });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
