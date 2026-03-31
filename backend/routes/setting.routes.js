import express from "express";
import { getSettings, updateSettings, getSystemStats } from "../controllers/setting.controllers.js";
import { authMiddleware } from "../middleware/isAuth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";

const router = express.Router();

router.get("/get", authMiddleware, getSettings);
router.post("/update", authMiddleware, authorize(['admin', 'root']), updateSettings);
router.get("/system-stats", authMiddleware, authorize(['admin', 'root']), getSystemStats);

export default router;
