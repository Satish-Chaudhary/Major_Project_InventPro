import express from 'express';
import { 
    createSalesOrder, 
    getSalesOrders, 
    getSalesOrderById, 
    updateOrderStatus, 
    getCustomerOrders 
} from '../controllers/salesOrder.controllers.js';
import { authMiddleware } from '../middleware/isAuth.middleware.js';
import { authorize } from '../middleware/role.middleware.js';

const salesOrderRouter = express.Router();

// All routes are protected and require admin or staff roles for management
salesOrderRouter.use(authMiddleware);

// Core CRUD for Sales Orders
salesOrderRouter.post('/create', authorize(['admin', 'root', 'staff']), createSalesOrder);
salesOrderRouter.get('/all', authorize(['admin', 'root', 'staff', 'viewer']), getSalesOrders);
salesOrderRouter.get('/:id', authorize(['admin', 'root', 'staff', 'viewer']), getSalesOrderById);

// Order Status & Updates
salesOrderRouter.patch('/status/:id', authorize(['admin', 'root', 'staff']), updateOrderStatus);

// Customer history routes
salesOrderRouter.get('/customer/:customerId', authorize(['admin', 'root', 'staff', 'viewer']), getCustomerOrders);

export default salesOrderRouter;
