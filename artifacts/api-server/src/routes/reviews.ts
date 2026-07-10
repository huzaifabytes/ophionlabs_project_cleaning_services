import { Router } from "express";
import type { Request, Response } from "express";
import { db, reviewsTable, settingsTable } from "@workspace/db";
import { desc, eq, and, or } from "drizzle-orm";
import { requireAdmin } from "../middlewares/auth.js";

const router = Router();

router.get("/reviews", async (req: Request, res: Response) => {
  try {
    const wantsAll = req.query.all === "true" || req.query.all === "1";
    // Only admins may fetch all reviews (including pending/rejected/hidden)
    const showAll = wantsAll && req.session?.adminLoggedIn === true;
    const reviews = await db.select().from(reviewsTable)
      .where(showAll ? undefined : and(
        eq(reviewsTable.status, "approved"),
        eq(reviewsTable.hidden, false)
      ))
      .orderBy(desc(reviewsTable.pinned), desc(reviewsTable.createdAt));
    res.json(reviews);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/reviews", async (req: Request, res: Response) => {
  try {
    const { customerName, rating, comment } = req.body;
    const [review] = await db.insert(reviewsTable).values({
      customerName,
      rating: Number(rating),
      comment,
      status: "pending",
    }).returning();

    // Forward to Google Sheets if a reviews script URL is configured
    try {
      const [s] = await db.select().from(settingsTable).limit(1);
      if (s?.reviewsScriptUrl) {
        const now = new Date();
        await fetch(s.reviewsScriptUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "review",
            name: customerName,
            rating,
            comment: comment || "",
            status: "pending",
            date: now.toLocaleDateString(),
            time: now.toLocaleTimeString(),
          }),
        });
      }
    } catch {
      // Silently ignore Sheets errors — review is already saved to DB
    }

    res.status(201).json(review);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/reviews/:id", requireAdmin, async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const [review] = await db.update(reviewsTable).set(req.body).where(eq(reviewsTable.id, id)).returning();
    if (!review) { res.status(404).json({ error: "Not found" }); return; }
    res.json(review);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/reviews/:id", requireAdmin, async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await db.delete(reviewsTable).where(eq(reviewsTable.id, id));
    res.json({ success: true });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
