import Product from "../models/product.model.js";
import { logActivity } from "../utils/logger.utils.js";
import { io } from "../socket/socket.js";
import { sendNotification } from "../utils/notification.utils.js";

// @desc    Add a new product
// @route   POST /api/product/add
// @access  Private (Admin/Root)
export const addProduct = async (req, res) => {
    try {
        const {
            productName,
            productId,
            productDescription,
            category,
            brand,
            skuId,
            barcodeEAN,
            initialQty,
            lowStockThreshold,
            basePrice,
            costPrice,
            tax,
            status
        } = req.body;

        const productImage = req.file ? req.file.path : '';

        // Check if SKU already exists
        const existingProduct = await Product.findOne({ skuId });
        if (skuId && existingProduct) {
            return res.status(400).json({ success: false, message: "Product with this SKU already exists" });
        }

        // Auto-generate Product ID if not provided
        const generatedProductId = productId || `PRD-${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 1000)}`;

        const newProduct = new Product({
            productName,
            productId: generatedProductId,
            productDescription,
            category,
            brand,
            skuId,
            barcodeEAN,
            initialQty: Number(initialQty),
            lowStockThreshold: Number(lowStockThreshold),
            productImage,
            basePrice: Number(basePrice),
            costPrice: Number(costPrice),
            tax: Number(tax),
            status: status || 'in stock'
        });

        await newProduct.save();

        // Log activity
        await logActivity(req.user._id, `Added new product: ${productName}`, 'inventory', { productId: newProduct._id }, req.ip);

        // Emit real-time update
        io.emit("stock:updated", newProduct);

        res.status(201).json({
            success: true,
            message: "Product added successfully",
            product: newProduct
        });
    } catch (error) {
        console.error("Error adding product:", error);
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};

// @desc    Get all products with pagination and filters
// @route   GET /api/product/all
// @access  Private
export const getAllProducts = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '', category = '', status = '', sort = 'createdAt', order = 'desc' } = req.query;

        // Cap limit to prevent unbounded queries (V13 performance)
        const safeLimit = Math.min(Number(limit), 100);

        const filter = {};
        if (search) {
            filter.$or = [
                { productName: { $regex: search, $options: 'i' } },
                { skuId: { $regex: search, $options: 'i' } },
                { productId: { $regex: search, $options: 'i' } }
            ];
        }
        if (category && category !== 'All') {
            filter.category = category;
        }
        if (status && status !== 'All') {
            filter.status = { $regex: status, $options: 'i' };
        }

        const skip = (page - 1) * safeLimit;
        const total = await Product.countDocuments(filter);
        const products = await Product.find(filter)
            .sort({ [sort]: order === 'desc' ? -1 : 1 })
            .skip(skip)
            .limit(safeLimit);

        res.status(200).json({
            success: true,
            products,
            total,
            page: Number(page),
            pages: Math.ceil(total / safeLimit)
        });
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};


// @desc    Get low stock products
// @route   GET /api/product/low-stock
// @access  Private
export const getLowStockProducts = async (req, res) => {
    try {
        const products = await Product.find({
            $expr: { $lte: ["$initialQty", "$lowStockThreshold"] }
        });
        res.status(200).json({
            success: true,
            products
        });
    } catch (error) {
        console.error("Error fetching low stock products:", error);
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};

// @desc    Update a product
// @route   PUT /api/product/update/:id
// @access  Private (Admin/Root)
export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        let updatedData = { ...req.body };

        if (req.file) {
            updatedData.productImage = req.file.path;
        }

        // Ensure numeric fields are converted (since Multipart/form-data sends everything as strings)
        if (updatedData.initialQty) updatedData.initialQty = Number(updatedData.initialQty);
        if (updatedData.lowStockThreshold) updatedData.lowStockThreshold = Number(updatedData.lowStockThreshold);
        if (updatedData.basePrice) updatedData.basePrice = Number(updatedData.basePrice);
        if (updatedData.costPrice) updatedData.costPrice = Number(updatedData.costPrice);
        if (updatedData.tax) updatedData.tax = Number(updatedData.tax);

        const product = await Product.findByIdAndUpdate(id, updatedData, { new: true });

        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        // Log activity
        await logActivity(req.user._id, `Updated product: ${product.productName}`, 'inventory', { productId: product._id }, req.ip);

        // Emit real-time update
        io.emit("stock:updated", product);

        res.status(200).json({
            success: true,
            message: "Product updated successfully",
            product
        });
    } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};

// @desc    Delete a product
// @route   DELETE /api/product/delete/:id
// @access  Private (Admin/Root)
export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findByIdAndDelete(id);

        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        // Log activity
        await logActivity(req.user._id, `Deleted product: ${product.productName}`, 'inventory', { productId: product._id }, req.ip);

        // Emit real-time update
        io.emit("stock:updated", { _id: id, deleted: true });

        res.status(200).json({
            success: true,
            message: "Product deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};
// @desc    Adjust product stock
// @route   PATCH /api/product/adjust-stock/:id
// @access  Private (Admin/Manager/Warehouse)
export const adjustStock = async (req, res) => {
    try {
        const { id } = req.params;
        const { adjustment, reason, notes } = req.body;

        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        const oldQty = product.initialQty;
        const newQty = product.initialQty + Number(adjustment);

        if (newQty < 0) {
            return res.status(400).json({
                success: false,
                message: `Insufficient stock. Current quantity is ${oldQty}. Cannot reduce by ${Math.abs(adjustment)}.`
            });
        }

        product.initialQty = newQty;

        // Update status based on new quantity
        if (product.initialQty <= 0) {
            product.status = 'out of stock';
        } else if (product.initialQty <= product.lowStockThreshold) {
            product.status = 'low stock';
        } else {
            product.status = 'in stock';
        }

        await product.save();

        // Log activity with details
        await logActivity(
            req.user._id, 
            `Stock adjusted for ${product.productName}: ${adjustment > 0 ? '+' : ''}${adjustment} (Reason: ${reason})`, 
            'inventory', 
            { 
                productId: product._id, 
                oldQty, 
                newQty: product.initialQty,
                reason,
                notes
            }, 
            req.ip
        );

        // Emit real-time update
        io.emit("stock:updated", product);

        // Check for low stock alert
        if (product.initialQty <= product.lowStockThreshold) {
            const lowStockNotify = {
                title: 'Low Stock Alert',
                message: `${product.productName} is running low on stock (${product.initialQty} remaining).`,
                type: 'stock',
                metadata: { productId: product._id }
            };
            await sendNotification({ ...lowStockNotify, role: 'admin' });
            await sendNotification({ ...lowStockNotify, role: 'manager' });
            await sendNotification({ ...lowStockNotify, role: 'warehouse staff' });
        }

            res.status(200).json({
            success: true,
            message: "Stock adjusted successfully",
            product
        });
    } catch (error) {
        console.error("Error adjusting stock:", error);
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};

// @desc    Bulk import products from CSV
// @route   POST /api/product/bulk-import
// @access  Private (Admin/Root/Manager)
export const bulkImportProducts = async (req, res) => {
    try {
        const { products } = req.body;
        
        if (!products || !Array.isArray(products) || products.length === 0) {
            return res.status(400).json({ success: false, message: "No products provided" });
        }

        const results = {
            created: [],
            skipped: [],
            errors: []
        };

        for (const p of products) {
            try {
                const existingProduct = await Product.findOne({ skuId: p.skuId });
                
                if (existingProduct) {
                    results.skipped.push({ skuId: p.skuId, reason: "SKU already exists" });
                    continue;
                }

                const generatedProductId = `PRD-${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 1000)}`;
                
                const newProduct = new Product({
                    productName: p.productName,
                    productId: generatedProductId,
                    productDescription: p.productDescription || '',
                    category: p.category || [],
                    brand: p.brand || '',
                    skuId: p.skuId,
                    barcodeEAN: p.barcodeEAN || '',
                    initialQty: Number(p.initialQty) || 0,
                    lowStockThreshold: Number(p.lowStockThreshold) || 10,
                    basePrice: Number(p.basePrice) || 0,
                    costPrice: Number(p.costPrice) || 0,
                    tax: Number(p.tax) || 0,
                    status: p.initialQty > p.lowStockThreshold ? 'in stock' : 'low stock'
                });

                await newProduct.save();
                results.created.push({ skuId: p.skuId, productName: p.productName });
            } catch (err) {
                results.errors.push({ skuId: p.skuId, error: err.message });
            }
        }

        if (results.created.length > 0) {
            io.emit("stock:updated", { type: "bulk_import", count: results.created.length });
        }

        res.status(201).json({
            success: true,
            message: `Import complete: ${results.created.length} created, ${results.skipped.length} skipped, ${results.errors.length} errors`,
            results
        });
    } catch (error) {
        console.error("Error in bulk import:", error);
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};

// @desc    Export products to CSV format
// @route   GET /api/product/export
// @access  Private (Admin/Root/Accountant)
export const exportProducts = async (req, res) => {
    try {
        const products = await Product.find().populate('category', 'catName');
        
        const exportData = products.map(p => ({
            productName: p.productName,
            skuId: p.skuId,
            barcodeEAN: p.barcodeEAN || '',
            category: p.category?.catName || '',
            brand: p.brand || '',
            initialQty: p.initialQty,
            lowStockThreshold: p.lowStockThreshold,
            basePrice: p.basePrice,
            costPrice: p.costPrice || 0,
            tax: p.tax || 0,
            status: p.status
        }));

        res.status(200).json({
            success: true,
            products: exportData,
            total: exportData.length
        });
    } catch (error) {
        console.error("Error exporting products:", error);
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};
