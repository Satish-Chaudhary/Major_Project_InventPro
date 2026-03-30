import express from 'express';
import { 
    addProduct, getAllProducts, updateProduct, deleteProduct, 
    getLowStockProducts, adjustStock 
} from '../controllers/product.controllers.js';
import { authMiddleware } from '../middleware/isAuth.middleware.js';
import { authorize } from '../middleware/role.middleware.js';
import upload from '../middleware/upload.middleware.js';

const productRouter = express.Router();

// Fetching products
productRouter.get('/all', authMiddleware, getAllProducts);
productRouter.get('/low-stock', authMiddleware, getLowStockProducts);

// Managing products
productRouter.post('/add', authMiddleware, authorize(['admin', 'root', 'manager']), upload.single('productImage'), addProduct);
productRouter.patch('/adjust-stock/:id', authMiddleware, authorize(['admin', 'root', 'manager', 'warehouse staff']), adjustStock);
productRouter.put('/update/:id', authMiddleware, authorize(['admin', 'root', 'manager']), upload.single('productImage'), updateProduct);
productRouter.delete('/delete/:id', authMiddleware, authorize(['admin', 'root']), deleteProduct);

export default productRouter;
