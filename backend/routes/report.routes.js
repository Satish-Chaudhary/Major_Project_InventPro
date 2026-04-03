import express from "express";
import { logDownload, getReports, createReportSchedule, getSummaryReport, getRecentExports } from "../controllers/report.controllers.js";
import { authMiddleware } from "../middleware/isAuth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";

const router = express.Router();

// Reports are restricted to admin, manager, and accountant roles
router.get("/summary", authMiddleware, authorize(['admin', 'root', 'manager', 'accountant']), getSummaryReport);
router.post("/log-download", authMiddleware, authorize(['admin', 'root', 'manager', 'accountant']), logDownload);
router.get("/recent-exports", authMiddleware, getRecentExports);
router.get("/all", authMiddleware, authorize(['admin', 'root', 'manager', 'accountant']), getReports);
router.post("/add", authMiddleware, authorize(['admin', 'root', 'manager', 'accountant']), createReportSchedule);

export default router;

