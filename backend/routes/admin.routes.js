import express from 'express';
import { getDashboardStats } from '../controllers/admin/dashboard.controllers.js';
import { getAllRequests, approveRequest } from '../controllers/admin/access.controllers.js';
import { authMiddleware } from '../middleware/isAuth.middleware.js';
import { authorize } from '../middleware/role.middleware.js';

const adminRouter = express.Router();

// All admin routes are protected by authMiddleware
// In a real app, we'd also have an isAdmin middleware
adminRouter.use(authMiddleware);

adminRouter.get('/dashboard/stats', authorize(['admin']), getDashboardStats);
adminRouter.get('/requests', authorize(['admin']), getAllRequests);
adminRouter.post('/requests/approve/:id', authorize(['admin']), approveRequest);

export default adminRouter;
