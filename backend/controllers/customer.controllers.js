import Customer from '../models/customer.model.js';
import SalesOrder from '../models/salesOrder.model.js';
import { logActivity } from '../utils/logger.utils.js';

// @desc    Add a new customer
// @route   POST /api/customers/add
export const addCustomer = async (req, res) => {
    try {
        const { name, email, phone, customerType, companyName, taxId, billingAddress, shippingAddress, notes } = req.body;

        const customerExists = await Customer.findOne({ email });
        if (customerExists) {
            return res.status(400).json({ success: false, message: "Customer already exists with this email" });
        }

        const customer = await Customer.create({
            name, email, phone, customerType, companyName, taxId, billingAddress, shippingAddress, notes
        });

        await logActivity(req.user._id, `Added new customer: ${name}`, 'customers', { customerId: customer._id }, req.ip);

        res.status(201).json({ success: true, customer });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get all customers
// @route   GET /api/customers/all
export const getCustomers = async (req, res) => {
    try {
        const customers = await Customer.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, customers });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get customer by ID with history
// @route   GET /api/customers/:id
export const getCustomerById = async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id);
        if (!customer) {
            return res.status(404).json({ success: false, message: "Customer not found" });
        }

        const orders = await SalesOrder.find({ customer: req.params.id }).sort({ createdAt: -1 });
        
        res.status(200).json({ success: true, customer, orders });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update customer
// @route   PUT /api/customers/update/:id
export const updateCustomer = async (req, res) => {
    try {
        const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!customer) {
            return res.status(404).json({ success: false, message: "Customer not found" });
        }

        await logActivity(req.user._id, `Updated customer details: ${customer.name}`, 'customers', { customerId: customer._id }, req.ip);

        res.status(200).json({ success: true, customer });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Delete customer (Soft delete or check for orders)
// @route   DELETE /api/customers/:id
export const deleteCustomer = async (req, res) => {
    try {
        const orderCount = await SalesOrder.countDocuments({ customer: req.params.id });
        if (orderCount > 0) {
            return res.status(400).json({ 
                success: false, 
                message: "Cannot delete customer with existing orders. Deactivate them instead." 
            });
        }

        const customer = await Customer.findByIdAndDelete(req.params.id);
        if (!customer) {
            return res.status(404).json({ success: false, message: "Customer not found" });
        }

        await logActivity(req.user._id, `Deleted customer: ${customer.name}`, 'customers', { customerId: req.params.id }, req.ip);

        res.status(200).json({ success: true, message: "Customer deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
