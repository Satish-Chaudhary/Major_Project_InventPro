import express from "express";
import { addSupplier, getAllSuppliers, updateSupplier, deleteSupplier } from "../controllers/supplier.controllers.js";
import { authMiddleware } from "../middleware/isAuth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";


const router = express.Router();

router.post("/add", authMiddleware, authorize('admin', 'manager'), addSupplier);
router.get("/all", authMiddleware, getAllSuppliers);
router.put("/update/:id", authMiddleware, authorize('admin', 'manager'), updateSupplier);
router.delete("/delete/:id", authMiddleware, authorize('admin', 'manager'), deleteSupplier);

export default router;
