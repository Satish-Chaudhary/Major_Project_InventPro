import Category from "../models/category.model.js";
import Product from "../models/product.model.js";
import { logActivity } from "../utils/logger.utils.js";


// @desc    Add a new category
// @route   POST /api/categories/add
// @access  Private (Admin/Root)
export const addCategory = async (req, res) => {
    try {
        const { catName, description, status, parent } = req.body;

        const existingCategory = await Category.findOne({ catName });
        if (existingCategory) {
            return res.status(400).json({ success: false, message: "Category already exists" });
        }

        const newCategory = new Category({
            catName,
            description,
            status: status || 'active',
            parent: (parent === 'null' || !parent) ? null : parent,
            thumbnail: req.file ? req.file.path : ''
        });

        await newCategory.save();
        
        // Log activity
        await logActivity(req.user._id, `Added new category: ${catName}`, 'inventory', { catId: newCategory._id }, req.ip);

        res.status(201).json({
            success: true,
            message: "Category added successfully",
            category: newCategory
        });
    } catch (error) {
        console.error("Error adding category:", error);
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};

// @desc    Get all categories
// @route   GET /api/categories/all
// @access  Private
export const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find().populate('parent');
        res.status(200).json({
            success: true,
            categories
        });
    } catch (error) {
        console.error("Error fetching categories:", error);
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};

// @desc    Update a category
// @route   PUT /api/categories/update/:id
// @access  Private (Admin/Root)
export const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        let updatedData = { ...req.body };

        if (req.file) {
            updatedData.thumbnail = req.file.path;
        }

        if (updatedData.parent === 'null' || !updatedData.parent) {
            updatedData.parent = null;
        }

        const category = await Category.findByIdAndUpdate(id, updatedData, { new: true });

        if (!category) {
            return res.status(404).json({ success: false, message: "Category not found" });
        }

        // Log activity
        await logActivity(req.user._id, `Updated category: ${category.catName}`, 'inventory', { catId: category._id }, req.ip);

        res.status(200).json({
            success: true,
            message: "Category updated successfully",
            category
        });
    } catch (error) {
        console.error("Error updating category:", error);
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};

// @desc    Delete a category (with data consistency cascade)
// @route   DELETE /api/categories/delete/:id
// @access  Private (Admin/Root)
export const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;

        // 1. Block deletion if it has child subcategories
        const childCount = await Category.countDocuments({ parent: id });
        if (childCount > 0) {
            return res.status(400).json({
                success: false,
                message: `Cannot delete: this category has ${childCount} subcategorie(s). Delete or reassign them first.`
            });
        }

        const category = await Category.findById(id);
        if (!category) {
            return res.status(404).json({ success: false, message: "Category not found" });
        }

        // 2. Nullify category reference on all products using this category
        const affected = await Product.countDocuments({ category: category.catName });
        if (affected > 0) {
            await Product.updateMany(
                { category: category.catName },
                { $set: { category: 'General' } }
            );
        }

        // 3. Delete the category
        await Category.findByIdAndDelete(id);

        // 4. Log activity
        await logActivity(
            req.user._id,
            `Deleted category: ${category.catName}${affected > 0 ? ` (${affected} products moved to General)` : ''}`,
            'inventory',
            { catId: id, affectedProducts: affected },
            req.ip
        );

        res.status(200).json({
            success: true,
            message: `Category deleted successfully.${affected > 0 ? ` ${affected} product(s) moved to General.` : ''}`
        });
    } catch (error) {
        console.error("Error deleting category:", error);
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};
