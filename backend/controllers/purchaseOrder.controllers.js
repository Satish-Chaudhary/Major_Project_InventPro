import PurchaseOrder from "../models/purchaseOrder.model.js";
import Product from "../models/product.model.js";
import { logActivity } from "../utils/logger.utils.js";

// @desc    Add a new Purchase Order
// @route   POST /api/purchase-orders/add
export const createPO = async (req, res) => {
    try {
        const poData = req.body;
        const newPO = new PurchaseOrder(poData);
        await newPO.save();

        // Log activity
        await logActivity(req.user._id, `Created Purchase Order: ${newPO.poNumber}`, 'suppliers', { poId: newPO._id }, req.ip);

        res.status(201).json({ success: true, message: "Purchase Order created", po: newPO });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get all Purchase Orders
// @route   GET /api/purchase-orders/all
export const getAllPOs = async (req, res) => {
    try {
        const pos = await PurchaseOrder.find().populate('supplier').populate('items.product');
        res.status(200).json({ success: true, pos });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Receive Items and update inventory
// @route   POST /api/purchase-orders/receive/:id
export const receivePO = async (req, res) => {
    try {
        const { id } = req.params;
        const { itemUpdates } = req.body; // Array of { productId, receivedQty }

        const po = await PurchaseOrder.findById(id);
        if (!po) return res.status(404).json({ success: false, message: "PO not found" });

        let allReceived = true;

        for (const update of itemUpdates) {
            const item = po.items.find(i => i.product.toString() === update.productId);
            if (item) {
                const prevReceived = item.received || 0;
                item.received = prevReceived + update.receivedQty;
                
                if (item.received >= item.quantity) {
                    item.status = 'received';
                } else {
                    item.status = 'partial';
                    allReceived = false;
                }

                // Update actual product stock
                const product = await Product.findById(update.productId);
                if (product) {
                    product.initialQty += update.receivedQty;
                    // Product status update
                    if (product.initialQty > 10) product.status = 'in stock';
                    else if (product.initialQty > 0) product.status = 'low stock';
                    await product.save();
                }
            }
        }

        po.status = allReceived ? 'received' : 'partially-received';
        if (allReceived) po.receivedDate = new Date();
        
        await po.save();

        // Log activity
        await logActivity(req.user._id, `Received items for PO: ${po.poNumber}`, 'inventory', { poId: po._id, items: itemUpdates }, req.ip);

        res.status(200).json({ success: true, message: "Inventory updated", po });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
