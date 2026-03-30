import express from "express";
import { createPO, getAllPOs, receivePO } from "../controllers/purchaseOrder.controllers.js";
import { authMiddleware } from "../middleware/isAuth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";

const poRouter = express.Router();

poRouter.post('/add', authMiddleware, authorize(['admin', 'root', 'manager', 'accountant']), createPO);
poRouter.get('/all', authMiddleware, authorize(['admin', 'root', 'manager', 'accountant', 'warehouse staff']), getAllPOs);
poRouter.post('/receive/:id', authMiddleware, authorize(['admin', 'root', 'manager', 'warehouse staff']), receivePO);

export default poRouter;
