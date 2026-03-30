import Product from "../models/product.model.js";
import { logActivity } from "../utils/logger.utils.js";

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
        const { page = 1, limit = 10, search = '', category = '', sort = 'createdAt', order = 'desc' } = req.query;
        
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

        const skip = (page - 1) * limit;
        const total = await Product.countDocuments(filter);
        const products = await Product.find(filter)
            .sort({ [sort]: order === 'desc' ? -1 : 1 })
            .skip(skip)
            .limit(Number(limit));

        res.status(200).json({
            success: true,
            products,
            total,
            page: Number(page),
            pages: Math.ceil(total / limit)
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
        product.initialQty += Number(adjustment);

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
