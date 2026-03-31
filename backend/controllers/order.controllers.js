import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import { logActivity } from "../utils/logger.utils.js";
import { io } from "../socket/socket.js";
import { sendNotification } from "../utils/notification.utils.js";

// @desc    Add a new order and sync stock
// @route   POST /api/orders/add
export const addOrder = async (req, res) => {
    try {
        const orderData = req.body;
        const { type, items } = orderData;

        // 1. Validate items and stock availability for outward orders
        if (type === 'outward') {
            for (const item of items) {
                const product = await Product.findById(item.productId);
                if (!product) {
                    return res.status(404).json({ success: false, message: `Product ${item.name} not found` });
                }
                if (product.initialQty < item.quantity) {
                    return res.status(400).json({ success: false, message: `Insufficient stock for ${item.name}. Available: ${product.initialQty}` });
                }
            }
        }

        // 2. Create the order
        const newOrder = new Order(orderData);
        await newOrder.save();

        // 3. Sync Stock automatically if order is created (assuming creation means initiation)
        // For Outward: deduct stock
        // For Inward: add stock (maybe only on completion? but for MVP let's do it on creation/status CONFIRMED)
        // Let's do it on creation for now.
        for (const item of items) {
            const product = await Product.findById(item.productId);
            if (product) {
                const adjustment = type === 'inward' ? item.quantity : -item.quantity;
                product.initialQty += adjustment;
                
                // Update status
                if (product.initialQty <= 0) product.status = 'out of stock';
                else if (product.initialQty <= product.lowStockThreshold) product.status = 'low stock';
                else product.status = 'in stock';
                
                await product.save();
            }
        }

        // Log activity
        await logActivity(req.user._id, `Created ${type} order: ${orderData.orderId}`, 'orders', { orderId: newOrder._id }, req.ip);

        // Emit real-time events
        io.emit("order:updated", newOrder);
        // Stock was updated inside the loop, emit those products
        for (const item of items) {
           const p = await Product.findById(item.productId);
           if (p) io.emit("stock:updated", p);
        }

        // Send notifications to relevant roles
        const notificationPayload = {
            title: `New ${type.toUpperCase()} Order`,
            message: `Order ${newOrder.orderId} created by ${req.user.fullName}`,
            type: 'order',
            metadata: { orderId: newOrder._id }
        };
        await sendNotification({ ...notificationPayload, role: 'admin' });
        await sendNotification({ ...notificationPayload, role: 'manager' });
        if (type === 'outward') {
            await sendNotification({ ...notificationPayload, role: 'sales staff' });
        } else {
            await sendNotification({ ...notificationPayload, role: 'warehouse staff' });
        }

        res.status(201).json({ success: true, message: "Order created and stock synchronized", order: newOrder });
    } catch (error) {
        console.error("AddOrder Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get all orders with pagination
// @route   GET /api/orders/all
export const getAllOrders = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '', type = '', status = '' } = req.query;

        // Cap limit (V13 performance guard)
        const safeLimit = Math.min(Number(limit), 100);

        const filter = {};
        if (search) {
            filter.$or = [
                { orderId: { $regex: search, $options: 'i' } },
                { entity: { $regex: search, $options: 'i' } }
            ];
        }
        if (type) filter.type = type;
        if (status) filter.status = status;

        const skip = (page - 1) * safeLimit;
        const total = await Order.countDocuments(filter);
        const orders = await Order.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(safeLimit)
            .populate('items.productId');

        res.status(200).json({ success: true, orders, total, page: Number(page), pages: Math.ceil(total / safeLimit) });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


// @desc    Get order by ID
// @route   GET /api/orders/:id
export const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('items.productId');
        if (!order) return res.status(404).json({ success: false, message: "Order not found" });
        res.status(200).json({ success: true, order });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update order status and handle inventory reversal if cancelled
// @route   PUT /api/orders/update/:id
export const updateOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const oldOrder = await Order.findById(id);
        if (!oldOrder) return res.status(404).json({ success: false, message: "Order not found" });

        const newOrder = await Order.findByIdAndUpdate(id, req.body, { new: true });

        // If order was cancelled, reverse the stock
        if (newOrder.status === 'cancelled' && oldOrder.status !== 'cancelled') {
            for (const item of newOrder.items) {
                const product = await Product.findById(item.productId);
                if (product) {
                    const adjustment = newOrder.type === 'inward' ? -item.quantity : item.quantity;
                    product.initialQty += adjustment;
                    
                    // Update status
                    if (product.initialQty <= 0) product.status = 'out of stock';
                    else if (product.initialQty <= product.lowStockThreshold) product.status = 'low stock';
                    else product.status = 'in stock';
                    
                    await product.save();
                }
            }
            await logActivity(req.user._id, `Cancelled order ${newOrder.orderId} - stock restored`, 'orders', { orderId: newOrder._id }, req.ip);
            
            // Notify about cancellation
            const cancelNotify = {
                title: `Order Cancelled`,
                message: `Order ${newOrder.orderId} was cancelled. Stock has been restored.`,
                type: 'order',
                metadata: { orderId: newOrder._id }
            };
            await sendNotification({ ...cancelNotify, role: 'admin' });
            await sendNotification({ ...cancelNotify, role: 'manager' });
        } else {
            await logActivity(req.user._id, `Updated order status: ${newOrder.orderId} -> ${newOrder.status}`, 'orders', { orderId: newOrder._id }, req.ip);
        }

        // Emit real-time events
        io.emit("order:updated", newOrder);
        // If it was cancelled, stock has been restored, emit product updates
        if (newOrder.status === 'cancelled' && oldOrder.status !== 'cancelled') {
            for (const item of newOrder.items) {
                const p = await Product.findById(item.productId);
                if (p) io.emit("stock:updated", p);
            }
        }

        res.status(200).json({ success: true, message: "Order updated", order: newOrder });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Delete an order (and log it)
export const deleteOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const order = await Order.findByIdAndDelete(id);
        if (!order) return res.status(404).json({ success: false, message: "Order not found" });

        await logActivity(req.user._id, `Deleted order: ${order.orderId}`, 'orders', { orderId: order._id }, req.ip);
        res.status(200).json({ success: true, message: "Order deleted" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
