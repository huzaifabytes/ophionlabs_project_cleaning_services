import { Router } from "express";
import type { Request, Response } from "express";
import { db, contactsTable, settingsTable } from "@workspace/db";
import { desc, eq } from "drizzle-orm";
import { requireAdmin } from "../middlewares/auth.js";

const router = Router();

router.get("/contact", requireAdmin, async (req: Request, res: Response) => {
  try {
    const contacts = await db.select().from(contactsTable).orderBy(desc(contactsTable.createdAt));
    res.json(contacts);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/contact", async (req: Request, res: Response) => {
  try {
    const { fullName, phone, email, serviceRequired, message } = req.body;
    const [contact] = await db.insert(contactsTable).values({
      fullName,
      phone,
      email,
      serviceRequired,
      message,
    }).returning();

    // Try to send to Google Sheets if configured
    try {
      const settings = await db.select().from(settingsTable).limit(1);
      const scriptUrl = settings[0]?.sheetsScriptUrl;
      if (scriptUrl) {
        const now = new Date();
        await fetch(scriptUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: fullName,
            phone,
            email,
            service: serviceRequired || "",
            message: message || "",
            date: now.toLocaleDateString(),
            time: now.toLocaleTimeString(),
          }),
        });
      }
    } catch {
      // Silently ignore Sheets errors
    }

    res.status(201).json(contact);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/contact/:id", requireAdmin, async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await db.delete(contactsTable).where(eq(contactsTable.id, id));
    res.json({ success: true });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
