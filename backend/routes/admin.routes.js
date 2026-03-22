import express from 'express';
import { approveRequest, rejectRequest } from '../controllers/auth.controllers.js';
import { getDashboardStats } from '../controllers/admin/dashboard.controllers.js';
import { getAllRequests } from '../controllers/admin/access.controllers.js';
import { authMiddleware } from '../middleware/isAuth.middleware.js';
import { authorize } from '../middleware/role.middleware.js';
import { addRole, getAllRoles, updateRole, deleteRole, addDepartment, getAllDepartments } from '../controllers/roleDept.controllers.js';
import { getUsers, adminAddUser, adminUpdateUser, adminDeleteUser, getAuditLogs } from '../controllers/admin/user.controllers.js';

const adminRouter = express.Router();

// All admin routes are protected by authMiddleware
adminRouter.use(authMiddleware);

adminRouter.get('/dashboard/stats', authorize(['admin', 'root']), getDashboardStats);
adminRouter.get('/requests', authorize(['admin', 'root']), getAllRequests);
adminRouter.post('/requests/approve/:id', authorize(['admin', 'root']), approveRequest);
adminRouter.post('/requests/reject/:id', authorize(['admin', 'root']), rejectRequest);

// Role & Department routes
adminRouter.post('/roles/add', authorize(['admin', 'root']), addRole);
adminRouter.get('/roles/all', authorize(['admin', 'root']), getAllRoles);
adminRouter.put('/roles/update/:id', authorize(['admin', 'root']), updateRole);
adminRouter.delete('/roles/delete/:id', authorize(['admin', 'root']), deleteRole);
adminRouter.post('/departments/add', authorize(['admin', 'root']), addDepartment);
adminRouter.get('/departments/all', authorize(['admin', 'root']), getAllDepartments);

// User Management routes
adminRouter.get('/users/all', authorize(['admin', 'root']), getUsers);
adminRouter.post('/users/add', authorize(['admin', 'root']), adminAddUser);
adminRouter.put('/users/update/:id', authorize(['admin', 'root']), adminUpdateUser);
adminRouter.delete('/users/delete/:id', authorize(['admin', 'root']), adminDeleteUser);

// Audit logs
adminRouter.get('/audit-logs/all', authorize(['admin', 'root']), getAuditLogs);

export default adminRouter;
