import { Router, type IRouter } from "express";
import healthRouter from "./health.js";
import authRouter from "./auth.js";
import settingsRouter from "./settings.js";
import slidesRouter from "./slides.js";
import servicesRouter from "./services.js";
import reviewsRouter from "./reviews.js";
import contactRouter from "./contact.js";
import teamRouter from "./team.js";
import aboutRouter from "./about.js";
import uploadRouter from "./upload.js";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(settingsRouter);
router.use(slidesRouter);
router.use(servicesRouter);
router.use(reviewsRouter);
router.use(contactRouter);
router.use(teamRouter);
router.use(aboutRouter);
router.use(uploadRouter);

export default router;
