import mongoose from "mongoose";
import Product from "../models/product.model.js";
import Category from "../models/category.model.js";
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

        // ============================================
        // CATEGORY HANDLING - THE FIX
        // ============================================
        
        let processedCategories = [];

        if (category) {
            // Step 1: Parse if category is a string (e.g., from form-data or JSON string)
            let categoryArray = category;
            
            if (typeof category === 'string') {
                try {
                    // Try parsing JSON string like "['Electronics', 'Phones']"
                    categoryArray = JSON.parse(category);
                } catch {
                    // If not valid JSON, maybe it's a single string "Electronics"
                    categoryArray = [category];
                }
            }

            // Step 2: Ensure it's an array
            if (!Array.isArray(categoryArray)) {
                categoryArray = [categoryArray];
            }

            // Step 3: Process each category - convert names to ObjectIds
            const categoryPromises = categoryArray.map(async (cat) => {
                // Check if it's already a valid ObjectId
                if (mongoose.Types.ObjectId.isValid(cat)) {
                    return cat;
                }

                // It's a category name - try to find the Category by catName
                const foundCategory = await Category.findOne({ 
                    catName: { $regex: new RegExp(`^${cat}$`, 'i') } 
                });
                
                if (foundCategory) {
                    return foundCategory._id;
                }

                // Category not found - return null (will handle validation later)
                return null;
            });

            const resolvedCategories = await Promise.all(categoryPromises);
            
            // Filter out null values (invalid categories)
            processedCategories = resolvedCategories.filter(cat => cat !== null);

            // Validate: if some categories were not found, warn but continue
            const invalidCategories = categoryArray.filter((cat, index) => 
                resolvedCategories[index] === null
            );
            
            if (invalidCategories.length > 0) {
                console.warn(`Warning: Categories not found: ${invalidCategories.join(', ')}`);
            }
        }

        // ============================================
        // VALIDATION
        // ============================================

        // Check if SKU already exists
        if (skuId) {
            const existingProduct = await Product.findOne({ skuId });
            if (existingProduct) {
                return res.status(400).json({ 
                    success: false, 
                    message: "Product with this SKU already exists" 
                });
            }
        }

        // Validate required fields
        if (!productName) {
            return res.status(400).json({ 
                success: false, 
                message: "Product name is required" 
            });
        }

        if (!basePrice || isNaN(basePrice)) {
            return res.status(400).json({ 
                success: false, 
                message: "Valid base price is required" 
            });
        }

        // ============================================
        // CREATE PRODUCT
        // ============================================

        // Auto-generate Product ID if not provided
        const generatedProductId = productId || `PRD-${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 1000)}`;

        const newProduct = new Product({
            productName,
            productId: generatedProductId,
            productDescription,
            category: processedCategories, // Use processed categories
            brand,
            skuId,
            barcodeEAN,
            initialQty: Number(initialQty) || 0,
            lowStockThreshold: Number(lowStockThreshold) || 10,
            productImage,
            basePrice: Number(basePrice),
            costPrice: Number(costPrice) || 0,
            tax: Number(tax) || 0,
            status: status || 'in stock'
        });

        await newProduct.save();

        // Log activity
        await logActivity(
            req.user._id, 
            `Added new product: ${productName}`, 
            'inventory', 
            { productId: newProduct._id }, 
            req.ip
        );

        // Emit real-time update
        io.emit("stock:updated", newProduct);

        res.status(201).json({
            success: true,
            message: "Product added successfully",
            product: newProduct
        });
    } catch (error) {
        console.error("Error adding product:", error);
        
        // Handle specific Mongoose validation errors
        if (error.name === 'ValidationError') {
            return res.status(400).json({ 
                success: false, 
                message: "Validation Error", 
                error: error.message 
            });
        }

        res.status(500).json({ 
            success: false, 
            message: "Server Error", 
            error: error.message 
        });
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

        if (status && status !== 'All') {
            filter.status = status.toLowerCase();
        }

        if (category && category !== 'All') {
            // Find the category first to get its ID
            const foundCategory = await Category.findOne({ 
                catName: { $regex: new RegExp(`^${category}$`, 'i') } 
            });
            
            if (foundCategory) {
                filter.category = foundCategory._id;
            } else if (mongoose.Types.ObjectId.isValid(category)) {
                // If it's already an ID
                filter.category = category;
            } else {
                // Category not found, return empty results
                return res.status(200).json({
                    success: true,
                    products: [],
                    total: 0,
                    page: Number(page),
                    pages: 0
                });
            }
        }

        const skip = (page - 1) * safeLimit;
        const total = await Product.countDocuments(filter);
        const products = await Product.find(filter)
            .populate('category', 'catName')
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

        // ============================================
        // CATEGORY HANDLING (for updates too)
        // ============================================
        if (updatedData.category) {
            let categoryArray = updatedData.category;
            
            if (typeof categoryArray === 'string') {
                try {
                    categoryArray = JSON.parse(categoryArray);
                } catch {
                    categoryArray = [categoryArray];
                }
            }

            if (!Array.isArray(categoryArray)) {
                categoryArray = [categoryArray];
            }

            const categoryPromises = categoryArray.map(async (cat) => {
                if (mongoose.Types.ObjectId.isValid(cat)) {
                    return cat;
                }
                const foundCategory = await Category.findOne({ 
                    catName: { $regex: new RegExp(`^${cat}$`, 'i') } 
                });
                return foundCategory ? foundCategory._id : null;
            });

            const resolvedCategories = await Promise.all(categoryPromises);
            updatedData.category = resolvedCategories.filter(cat => cat !== null);
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

        // Log activity (non-blocking)
        logActivity(req.user._id, `Updated product: ${product.productName}`, 'inventory', { productId: product._id }, req.ip)
            .catch(err => console.error("Activity log error:", err));

        // Emit real-time update (wrapped in try-catch)
        try {
            io.emit("stock:updated", product);
        } catch (socketError) {
            console.error("Socket emit error:", socketError);
        }

        res.status(200).json({
            success: true,
            message: "Product updated successfully",
            product
        });
    } catch (error) {
        console.error("Error updating product:", error);
        
        if (error.name === 'ValidationError') {
            return res.status(400).json({ 
                success: false, 
                message: "Validation Error", 
                error: error.message 
            });
        }

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

        // ============================================
        // FIX: Non-blocking operations
        // ============================================

        // Log activity (non-blocking - don't await!)
        logActivity(
            req.user._id, 
            `Deleted product: ${product.productName}`, 
            'inventory', 
            { productId: product._id }, 
            req.ip
        ).catch(err => console.error("Activity log error:", err));

        // Emit socket event (wrapped in try-catch to prevent crashes)
        try {
            io.emit("stock:updated", { _id: id, deleted: true, productName: product.productName });
        } catch (socketError) {
            console.error("Socket emit error:", socketError);
        }

        res.status(200).json({
            success: true,
            message: "Product deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};

// @desc    Delete multiple products by IDs
// @route   POST /api/products/delete-multiple
// @access  Private (Admin/Root/Manager)
export const deleteMultipleProducts = async (req, res) => {
    try {
        const { ids } = req.body;

        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({ success: false, message: "No product IDs provided" });
        }

        const result = await Product.deleteMany({ _id: { $in: ids } });

        // Log activity (non-blocking)
        logActivity(
            req.user._id,
            `Bulk deleted ${result.deletedCount} products`,
            'inventory',
            { ids },
            req.ip
        ).catch(err => console.error("Activity log error:", err));

        // Emit socket event
        try {
            io.emit("stock:updated", { type: "bulk_delete", ids, deletedCount: result.deletedCount });
        } catch (socketError) {
            console.error("Socket emit error:", socketError);
        }

        res.status(200).json({
            success: true,
            message: `Successfully deleted ${result.deletedCount} products`
        });
    } catch (error) {
        console.error("Error deleting multiple products:", error);
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
