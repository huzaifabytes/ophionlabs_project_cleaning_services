import { Router } from "express";
import type { Request, Response } from "express";
import multer from "multer";
import path from "path";
import { mkdirSync } from "fs";
import { requireAdmin } from "../middlewares/auth.js";

const uploadDir = path.join(process.cwd(), "public", "uploads");
mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

const router = Router();

router.post("/upload", requireAdmin, upload.single("file"), (req: Request, res: Response) => {
  if (!req.file) {
    res.status(400).json({ error: "No file uploaded" });
    return;
  }
  const url = `/api/uploads/${req.file.filename}`;
  res.json({ url });
});

export default router;
