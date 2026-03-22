import express from 'express';
import { addCategory, getAllCategories, updateCategory, deleteCategory } from '../controllers/category.controllers.js';
import { authMiddleware } from '../middleware/isAuth.middleware.js';
import { authorize } from '../middleware/role.middleware.js';
import upload from '../middleware/upload.middleware.js';

const categoryRouter = express.Router();

// Public routes for fetching categories (within app context)
categoryRouter.get('/all', authMiddleware, getAllCategories);

// Admin / Root only routes for managing categories
categoryRouter.post('/add', authMiddleware, authorize(['admin', 'root']), upload.single('thumbnail'), addCategory);
categoryRouter.put('/update/:id', authMiddleware, authorize(['admin', 'root']), upload.single('thumbnail'), updateCategory);
categoryRouter.delete('/delete/:id', authMiddleware, authorize(['admin', 'root']), deleteCategory);

export default categoryRouter;
