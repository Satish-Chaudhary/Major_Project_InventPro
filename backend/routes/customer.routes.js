import express from 'express';
import { authMiddleware } from '../middleware/isAuth.middleware.js';
import { authorize } from '../middleware/role.middleware.js';
import { addCustomer, getCustomers, getCustomerById, updateCustomer, deleteCustomer } from '../controllers/customer.controllers.js';

const router = express.Router();

router.use(authMiddleware);

router.post('/add', authorize(['admin', 'root', 'sales staff']), addCustomer);
router.get('/all', getCustomers);
router.get('/:id', getCustomerById);
router.put('/update/:id', authorize(['admin', 'root', 'sales staff']), updateCustomer);
router.delete('/:id', authorize(['admin', 'root']), deleteCustomer);

export default router;
