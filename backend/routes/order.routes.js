import express from "express";
import { addOrder, getAllOrders, updateOrder, deleteOrder } from "../controllers/order.controllers.js";
import { authMiddleware } from "../middleware/isAuth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";

const router = express.Router();

router.post("/add", authMiddleware, authorize('admin', 'manager', 'sales staff'), addOrder);
router.get("/all", authMiddleware, getAllOrders);
router.put("/update/:id", authMiddleware, authorize('admin', 'manager'), updateOrder);
router.delete("/delete/:id", authMiddleware, authorize('admin', 'manager'), deleteOrder);

export default router;
