import Order from "../models/order.model.js";
import { logActivity } from "../utils/logger.utils.js";

// @desc    Add a new order
// @route   POST /api/orders/add
export const addOrder = async (req, res) => {
    try {
        const orderData = req.body;
        const newOrder = new Order(orderData);
        await newOrder.save();

        // Log activity
        await logActivity(req.user._id, `Created new ${orderData.type} order: ${orderData.orderId}`, 'orders', { orderId: newOrder._id }, req.ip);

        res.status(201).json({ success: true, message: "Order created successfully", order: newOrder });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get all orders
// @route   GET /api/orders/all
export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, orders });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update an order
// @route   PUT /api/orders/update/:id
export const updateOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const order = await Order.findByIdAndUpdate(id, req.body, { new: true });
        if (!order) return res.status(404).json({ success: false, message: "Order not found" });

        // Log activity
        await logActivity(req.user._id, `Updated order: ${order.orderId}`, 'orders', { orderId: order._id }, req.ip);

        res.status(200).json({ success: true, message: "Order updated", order });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Delete an order
// @route   DELETE /api/orders/delete/:id
export const deleteOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const order = await Order.findByIdAndDelete(id);
        if (!order) return res.status(404).json({ success: false, message: "Order not found" });

        // Log activity
        await logActivity(req.user._id, `Deleted order: ${order.orderId}`, 'orders', { orderId: order._id }, req.ip);

        res.status(200).json({ success: true, message: "Order deleted" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
