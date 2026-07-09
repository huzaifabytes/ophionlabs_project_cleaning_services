import { Router } from "express";
import type { Request, Response } from "express";
import { db, settingsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { requireAdmin } from "../middlewares/auth.js";

const router = Router();

async function getOrCreateSettings() {
  const rows = await db.select().from(settingsTable).limit(1);
  if (rows.length > 0) return rows[0];
  const [created] = await db.insert(settingsTable).values({
    navItems: [
      { label: "Home", href: "#home", visible: true },
      { label: "Services", href: "#services", visible: true },
      { label: "Reviews", href: "#reviews", visible: true },
      { label: "Contact", href: "#contact", visible: true },
      { label: "About", href: "#about", visible: true },
    ],
    socialLinks: [],
  }).returning();
  return created;
}

router.get("/settings", async (req: Request, res: Response) => {
  try {
    const settings = await getOrCreateSettings();
    res.json(settings);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/settings", requireAdmin, async (req: Request, res: Response) => {
  try {
    const settings = await getOrCreateSettings();
    const [updated] = await db.update(settingsTable)
      .set(req.body)
      .where(eq(settingsTable.id, settings.id))
      .returning();
    res.json(updated);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
