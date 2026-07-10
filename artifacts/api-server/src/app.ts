import path from "path";
import { fileURLToPath } from "url";
import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import session from "express-session";
import router from "./routes/index.js";
import { logger } from "./lib/logger.js";
import "./lib/session.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req: Record<string, unknown>) {
        return {
          id: req["id"],
          method: req["method"],
          url: typeof req["url"] === "string" ? req["url"].split("?")[0] : req["url"],
        };
      },
      res(res: Record<string, unknown>) {
        return {
          statusCode: res["statusCode"],
        };
      },
    },
  }),
);

app.use(cors({
  origin: true,
  credentials: true,
}));

app.use(session({
  secret: process.env.SESSION_SECRET || "cleanpro-secret-fallback",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    maxAge: 24 * 60 * 60 * 1000,
    sameSite: "lax",
  },
}));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use("/api/uploads", express.static(path.join(process.cwd(), "public", "uploads")));

app.use("/api", router);

export default app;
