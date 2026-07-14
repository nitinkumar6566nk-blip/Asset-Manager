import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import statsRouter from "./stats";
import programsRouter from "./programs";
import campaignsRouter from "./campaigns";
import donationsRouter from "./donations";
import blogsRouter from "./blogs";
import eventsRouter from "./events";
import galleryRouter from "./gallery";
import testimonialsRouter from "./testimonials";
import volunteersRouter from "./volunteers";
import contactRouter from "./contact";
import newsletterRouter from "./newsletter";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(statsRouter);
router.use(programsRouter);
router.use(campaignsRouter);
router.use(donationsRouter);
router.use(blogsRouter);
router.use(eventsRouter);
router.use(galleryRouter);
router.use(testimonialsRouter);
router.use(volunteersRouter);
router.use(contactRouter);
router.use(newsletterRouter);

export default router;
