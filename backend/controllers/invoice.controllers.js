import Invoice from '../models/invoice.model.js';
import SalesOrder from '../models/salesOrder.model.js';
import { logActivity } from '../utils/logger.utils.js';
import { sendInvoiceEmail } from '../utils/email.utils.js';
import { generateInvoicePDF } from '../utils/pdf.utils.js';
import Customer from '../models/customer.model.js';

// @desc    Generate invoice for a sales order
// @route   POST /api/invoices/generate/:orderId
export const generateInvoice = async (req, res) => {
    try {
        const order = await SalesOrder.findById(req.params.orderId).populate('customer');
        if (!order) {
            return res.status(404).json({ success: false, message: "Sales order not found" });
        }

        // Check if invoice already exists for this order
        const existingInvoice = await Invoice.findOne({ salesOrderId: order._id });
        if (existingInvoice) {
            return res.status(400).json({ success: false, message: "Invoice already exists for this order" });
        }

        const invoice = await Invoice.create({
            salesOrderId: order._id,
            customerId: order.customer._id,
            items: order.items.map(item => ({
                description: item.productName || item.sku,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                total: item.total
            })),
            subtotal: order.subtotal,
            taxAmount: order.taxAmount,
            discountTotal: order.discountTotal,
            total: order.total,
            dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // Default 15 days
            notes: order.notes,
            status: order.paymentStatus === 'paid' ? 'paid' : 'sent'
        });

        await logActivity(req.user._id, `Generated Invoice: ${invoice.invoiceNumber}`, 'billing', { invoiceId: invoice._id, orderId: order._id }, req.ip);
        
        // Send email to customer
        await sendInvoiceEmail(order.customer.email, order.customer.name, invoice);

        res.status(201).json({ success: true, invoice });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get all invoices
// @route   GET /api/invoices/all
export const getInvoices = async (req, res) => {
    try {
        const invoices = await Invoice.find()
            .populate('customerId', 'name email companyName')
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, invoices });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get invoice by ID
// @route   GET /api/invoices/:id
export const getInvoiceById = async (req, res) => {
    try {
        const invoice = await Invoice.findById(req.params.id)
            .populate('customerId')
            .populate('salesOrderId');

        if (!invoice) {
            return res.status(404).json({ success: false, message: "Invoice not found" });
        }

        res.status(200).json({ success: true, invoice });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update invoice status
// @route   PATCH /api/invoices/status/:id
export const updateInvoiceStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const invoice = await Invoice.findByIdAndUpdate(req.params.id, { status }, { new: true });
        
        if (!invoice) {
            return res.status(404).json({ success: false, message: "Invoice not found" });
        }

        await logActivity(req.user._id, `Updated Invoice ${invoice.invoiceNumber} status to ${status}`, 'billing', { invoiceId: invoice._id }, req.ip);

        res.status(200).json({ success: true, invoice });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Download invoice PDF
// @route   GET /api/invoices/download/:id
export const downloadInvoicePDFController = async (req, res) => {
    try {
        const invoice = await Invoice.findById(req.params.id).populate('customerId');
        if (!invoice) {
            return res.status(404).json({ success: false, message: "Invoice not found" });
        }

        const customer = invoice.customerId;
        generateInvoicePDF(invoice, customer, res);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
