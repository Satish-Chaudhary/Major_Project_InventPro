import express from "express";
import { logDownload, getReports, createReportSchedule } from "../controllers/report.controllers.js";
import { authMiddleware } from "../middleware/isAuth.middleware.js";

const router = express.Router();

router.post("/log-download", authMiddleware, logDownload);
router.get("/all", authMiddleware, getReports);
router.post("/add", authMiddleware, createReportSchedule);

export default router;
