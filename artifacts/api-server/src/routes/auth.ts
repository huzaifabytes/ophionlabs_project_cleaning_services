import { Router } from "express";
import type { Request, Response } from "express";
import "../lib/session.js";

const router = Router();

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

router.post("/auth/login", (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    req.session.adminLoggedIn = true;
    req.session.username = username;
    res.json({ username });
  } else {
    res.status(401).json({ error: "Invalid credentials" });
  }
});

router.post("/auth/logout", (req: Request, res: Response) => {
  req.session.destroy(() => {
    res.json({ success: true });
  });
});

router.get("/auth/me", (req: Request, res: Response) => {
  if (req.session?.adminLoggedIn) {
    res.json({ username: req.session.username });
  } else {
    res.status(401).json({ error: "Not authenticated" });
  }
});

export default router;
