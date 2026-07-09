import { Router } from "express";
import type { Request, Response } from "express";
import { db, aboutTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { requireAdmin } from "../middlewares/auth.js";

const router = Router();

async function getOrCreateAbout() {
  const rows = await db.select().from(aboutTable).limit(1);
  if (rows.length > 0) return rows[0];
  const [created] = await db.insert(aboutTable).values({
    introduction: "We are a professional cleaning company dedicated to delivering spotless results for homes and businesses.",
    mission: "To provide exceptional cleaning services that exceed our clients' expectations with every visit.",
    vision: "To be the most trusted cleaning service provider in our community, known for reliability and quality.",
    experience: "Over 10 years of professional cleaning experience serving hundreds of satisfied customers.",
  }).returning();
  return created;
}

router.get("/about", async (req: Request, res: Response) => {
  try {
    const about = await getOrCreateAbout();
    res.json(about);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/about", requireAdmin, async (req: Request, res: Response) => {
  try {
    const about = await getOrCreateAbout();
    const [updated] = await db.update(aboutTable)
      .set(req.body)
      .where(eq(aboutTable.id, about.id))
      .returning();
    res.json(updated);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
