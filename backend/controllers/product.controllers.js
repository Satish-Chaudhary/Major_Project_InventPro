import Product from "../models/product.model.js";
import { logActivity } from "../utils/logger.utils.js";

// @desc    Add a new product
// @route   POST /api/product/add
// @access  Private (Admin/Root)
export const addProduct = async (req, res) => {
    try {
        const {
            productName,
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
        if (existingProduct) {
            return res.status(400).json({ success: false, message: "Product with this SKU already exists" });
        }

        const newProduct = new Product({
            productName,
            productDescription,
            category, // This might need to be resolved to ObjectIds if passed as strings
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

// @desc    Get all products
// @route   GET /api/product/all
// @access  Private
export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json({
            success: true,
            products
        });
    } catch (error) {
        console.error("Error fetching products:", error);
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
