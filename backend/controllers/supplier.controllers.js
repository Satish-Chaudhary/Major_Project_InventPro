import Supplier from "../models/supplier.model.js";
import { logActivity } from "../utils/logger.utils.js";

// @desc    Add a new supplier
// @route   POST /api/suppliers/add
export const addSupplier = async (req, res) => {
    try {
        const supplierData = req.body;
        const newSupplier = new Supplier(supplierData);
        await newSupplier.save();

        // Log activity
        await logActivity(req.user._id, `Added new supplier: ${supplierData.company}`, 'suppliers', { supplierId: newSupplier._id }, req.ip);

        res.status(201).json({ success: true, message: "Supplier registered successfully", supplier: newSupplier });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get all suppliers
// @route   GET /api/suppliers/all
export const getAllSuppliers = async (req, res) => {
    try {
        const suppliers = await Supplier.find().populate('categories');
        res.status(200).json({ success: true, suppliers });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update a supplier
// @route   PUT /api/suppliers/update/:id
export const updateSupplier = async (req, res) => {
    try {
        const { id } = req.params;
        const supplier = await Supplier.findByIdAndUpdate(id, req.body, { new: true });
        if (!supplier) return res.status(404).json({ success: false, message: "Supplier not found" });

        // Log activity
        await logActivity(req.user._id, `Updated supplier: ${supplier.company}`, 'suppliers', { supplierId: supplier._id }, req.ip);

        res.status(200).json({ success: true, message: "Supplier info updated", supplier });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Delete a supplier
// @route   DELETE /api/suppliers/delete/:id
export const deleteSupplier = async (req, res) => {
    try {
        const { id } = req.params;
        const supplier = await Supplier.findByIdAndDelete(id);
        if (!supplier) return res.status(404).json({ success: false, message: "Supplier not found" });

        // Log activity
        await logActivity(req.user._id, `Deleted supplier profile: ${supplier.company}`, 'suppliers', { supplierId: supplier._id }, req.ip);

        res.status(200).json({ success: true, message: "Supplier deleted" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
