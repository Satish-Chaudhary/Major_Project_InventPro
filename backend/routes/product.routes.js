import express from 'express';
import { addProduct, getAllProducts, updateProduct, deleteProduct } from '../controllers/product.controllers.js';
import { authMiddleware } from '../middleware/isAuth.middleware.js';
import { authorize } from '../middleware/role.middleware.js';
import upload from '../middleware/upload.middleware.js';

const productRouter = express.Router();

// Public routes for fetching products (within app context)
productRouter.get('/all', authMiddleware, getAllProducts);

// Admin / Root only routes for managing products
productRouter.post('/add', authMiddleware, authorize(['admin', 'root']), upload.single('productImage'), addProduct);
productRouter.put('/update/:id', authMiddleware, authorize(['admin', 'root']), upload.single('productImage'), updateProduct);
productRouter.delete('/delete/:id', authMiddleware, authorize(['admin', 'root']), deleteProduct);

export default productRouter;
