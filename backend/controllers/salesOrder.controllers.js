import SalesOrder from '../models/salesOrder.model.js';
import Product from '../models/product.model.js';
import Customer from '../models/customer.model.js';
import { logActivity } from '../utils/logger.utils.js';
import { io } from '../socket/socket.js';

// @desc    Create a new sales order
// @route   POST /api/sales-orders/create
export const createSalesOrder = async (req, res) => {
    try {
        const { 
            customer, items, subtotal, discountTotal, taxAmount, 
            shippingAmount, total, paymentMethod, paymentGateway, notes 
        } = req.body;

        // 1. Validate stock for all items
        for (const item of items) {
            const product = await Product.findById(item.product);
            if (!product) {
                return res.status(404).json({ success: false, message: `Product ${item.productName} not found` });
            }
            if (product.initialQty < item.quantity) {
                return res.status(400).json({ success: false, message: `Insufficient stock for ${product.productName}` });
            }
        }

        // 2. Create the Sales Order
        const salesOrder = await SalesOrder.create({
            customer,
            items,
            subtotal,
            discountTotal,
            taxAmount,
            shippingAmount,
            total,
            dueAmount: total,
            paymentMethod,
            paymentGateway,
            notes,
            createdBy: req.user._id
        });

        // 3. Deduct stock and log activity
        for (const item of items) {
            await Product.findByIdAndUpdate(item.product, {
                $inc: { initialQty: -item.quantity }
            });
        }

        await logActivity(req.user._id, `Created Sales Order: ${salesOrder.orderNumber}`, 'sales', { orderId: salesOrder._id }, req.ip);

        // 4. Emit Socket Event for real-time updates
        io.emit('order:new', { 
            orderNumber: salesOrder.orderNumber, 
            total: salesOrder.total, 
            customer: salesOrder.customer 
        });

        res.status(201).json({ success: true, salesOrder });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get all sales orders
// @route   GET /api/sales-orders/all
export const getSalesOrders = async (req, res) => {
    try {
        const { status, paymentStatus, search, page = 1, limit = 10 } = req.query;
        const filter = {};

        if (status) filter.orderStatus = status;
        if (paymentStatus) filter.paymentStatus = paymentStatus;

        const skip = (Number(page) - 1) * Number(limit);
        const total = await SalesOrder.countDocuments(filter);

        // Fetch orders (then apply in-memory search for customer name if needed)
        let orders = await SalesOrder.find(filter)
            .populate('customer', 'name email companyName')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        // Apply search filter (order number or customer name)
        if (search) {
            const q = search.toLowerCase();
            orders = orders.filter(o =>
                o.orderNumber?.toLowerCase().includes(q) ||
                o.customer?.name?.toLowerCase().includes(q) ||
                o.customer?.email?.toLowerCase().includes(q)
            );
        }

        res.status(200).json({
            success: true,
            orders,
            pagination: {
                total: search ? orders.length : total,
                page: parseInt(page),
                pages: Math.ceil(total / limit),
                limit: parseInt(limit)
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get sales order by ID
// @route   GET /api/sales-orders/:id
export const getSalesOrderById = async (req, res) => {
    try {
        const order = await SalesOrder.findById(req.params.id)
            .populate('customer')
            .populate('items.product')
            .populate('createdBy', 'fullName role');

        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        res.status(200).json({ success: true, order });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update order status
// @route   PATCH /api/sales-orders/status/:id
export const updateOrderStatus = async (req, res) => {
    try {
        const { status: statusField, orderStatus, trackingNumber, carrier } = req.body;
        const status = orderStatus || statusField; // accept either field name
        const order = await SalesOrder.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        // Handle Cancellation logic (Restore stock)
        if (status === 'cancelled' && order.orderStatus !== 'cancelled') {
            for (const item of order.items) {
                await Product.findByIdAndUpdate(item.product, {
                    $inc: { initialQty: item.quantity }
                });
            }
        }

        order.orderStatus = status;
        if (trackingNumber) order.shippingDetails.trackingNumber = trackingNumber;
        if (carrier) order.shippingDetails.carrier = carrier;
        if (status === 'shipped') order.shippingDetails.shippedDate = new Date();

        await order.save();

        await logActivity(req.user._id, `Updated Order ${order.orderNumber} status to ${status}`, 'sales', { orderId: order._id, status }, req.ip);

        // Emit for dashboard real-time notification
        io.emit('order:update', { orderNumber: order.orderNumber, status });

        res.status(200).json({ success: true, order });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get orders by customer
// @route   GET /api/sales-orders/customer/:customerId
export const getCustomerOrders = async (req, res) => {
    try {
        const orders = await SalesOrder.find({ customer: req.params.customerId }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, orders });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
