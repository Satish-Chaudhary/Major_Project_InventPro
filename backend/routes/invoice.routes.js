import express from 'express';
import { 
    generateInvoice, 
    getInvoices, 
    getInvoiceById, 
    updateInvoiceStatus,
    downloadInvoicePDFController
} from '../controllers/invoice.controllers.js';
import { authMiddleware } from '../middleware/isAuth.middleware.js';
import { authorize } from '../middleware/role.middleware.js';

const invoiceRouter = express.Router();

// All routes are protected and require admin or staff roles for billing management
invoiceRouter.use(authMiddleware);

// Core CRUD for Invoices
invoiceRouter.post('/generate/:orderId', authorize(['admin', 'root', 'staff']), generateInvoice);
invoiceRouter.get('/all', authorize(['admin', 'root', 'staff', 'viewer']), getInvoices);
invoiceRouter.get('/:id', authorize(['admin', 'root', 'staff', 'viewer']), getInvoiceById);

// Invoice Status Updates
invoiceRouter.patch('/status/:id', authorize(['admin', 'root', 'staff']), updateInvoiceStatus);

// Download PDF
invoiceRouter.get('/download/:id', authorize(['admin', 'root', 'staff', 'viewer', 'customer']), downloadInvoicePDFController);

export default invoiceRouter;
