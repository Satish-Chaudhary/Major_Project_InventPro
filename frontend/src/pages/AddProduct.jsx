import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, X, Upload, Info, Check } from 'lucide-react';

import { useApp } from '../context/AppContext';
import { serverUrl } from '../App';

const AddProduct = ({ isOpen, editProduct }) => {
    const { setShowAddModal, addProduct, updateProduct, categories } = useApp();
    const onClose = () => setShowAddModal(false);

    // Internal state for form remains here as it's local to the form
    const [formData, setFormData] = useState({
        name: '',
        sku: '',
        category: 'Electronics',
        brand: '',
        description: '',
        basePrice: '',
        costPrice: '',
        taxRate: '20',
        barcodeEAN: '',
        productImage: '',
        imageFile: null, // To store the actual file object
        status: 'in stock'
    });

    useEffect(() => {
        if (editProduct) {
            setFormData({
                name: editProduct.productName || '',
                sku: editProduct.skuId || '',
                category: editProduct.category || 'Electronics',
                brand: editProduct.brand || '',
                description: editProduct.productDescription || '',
                basePrice: editProduct.basePrice || '',
                costPrice: editProduct.costPrice || '',
                taxRate: editProduct.tax || '20',
                initialQuantity: editProduct.initialQty || '',
                lowStockThreshold: editProduct.lowStockThreshold || '10',
                barcodeEAN: editProduct.barcodeEAN || '',
                productImage: editProduct.productImage ? (editProduct.productImage.startsWith('http') ? editProduct.productImage : `${serverUrl}/${editProduct.productImage.replace('\\', '/')}`) : '',
                status: editProduct.status || 'in stock'
            });
        } else {
            setFormData({
                name: '',
                sku: '',
                category: 'Electronics',
                brand: '',
                description: '',
                basePrice: '',
                costPrice: '',
                taxRate: '20',
                initialQuantity: '',
                lowStockThreshold: '10',
                barcodeEAN: '',
                productImage: '',
                status: 'in stock'
            });
        }
    }, [editProduct, isOpen]);

    if (!isOpen) return null;

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({
                ...formData,
                imageFile: file,
                productImage: URL.createObjectURL(file) // For local preview
            });
        }
    };

    const handleSave = () => {
        const productData = {
            productName: formData.name,
            productDescription: formData.description,
            category: formData.category,
            brand: formData.brand,
            skuId: formData.sku,
            barcodeEAN: formData.barcodeEAN || '',
            initialQty: formData.initialQuantity || 0,
            lowStockThreshold: formData.lowStockThreshold || 10,
            basePrice: formData.basePrice || 0,
            costPrice: formData.costPrice || 0,
            tax: formData.taxRate || 0,
            productImage: formData.imageFile || formData.productImage, // Send file if exists, else existing URL/path
            status: formData.status
        };

        if (editProduct) {
            updateProduct({ ...productData, _id: editProduct._id });
        } else {
            addProduct(productData);
        }
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-[#050505]/80 backdrop-blur-md"
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-5xl bg-[#0a0a0a] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
                {/* Header */}
                <div className="px-8 py-6 border-b border-slate-800 flex items-center justify-between bg-linear-to-r from-purple-500/5 to-cyan-500/5">
                    <div>
                        <h2 className="text-2xl font-bold text-white tracking-tight">
                            {editProduct ? 'Edit Product' : 'Add New Product'}
                        </h2>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={onClose}
                            className="px-6 py-2.5 rounded-lg border border-slate-700 text-slate-300 font-medium hover:bg-slate-800 transition-all text-sm"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            className="px-6 py-2.5 rounded-lg bg-linear-to-r from-purple-600 to-cyan-600 text-white font-bold hover:brightness-110 shadow-lg shadow-purple-500/20 flex items-center gap-2 transition-all text-sm"
                        >
                            <Check className="w-4 h-4" />
                            {editProduct ? 'Update Product' : 'Save Product'}
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column - General Info */}
                        <div className="lg:col-span-2 space-y-8">
                            <section className="bg-slate-900/30 border border-slate-800/50 rounded-2xl p-6 space-y-6">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="w-2 h-6 bg-purple-500 rounded-full" />
                                    <h3 className="text-lg font-bold text-white tracking-tight">General Information</h3>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Product Name</label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            placeholder="e.g. Wireless Noise-Cancelling Headphones"
                                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Description</label>
                                        <textarea
                                            rows="4"
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            placeholder="Describe the product features and specifications..."
                                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-all resize-none"
                                        />
                                    </div>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="col-span-2">
                                            <label className="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Category</label>
                                            <select
                                                value={formData.category}
                                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-all appearance-none cursor-pointer"
                                            >
                                                {categories.map((cat) => (
                                                    <option key={cat._id} value={cat.catName}>
                                                        {cat.catName}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Brand</label>
                                            <input
                                                type="text"
                                                value={formData.brand}
                                                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                                                placeholder="e.g. Sony, Apple"
                                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-all"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section className="bg-slate-900/30 border border-slate-800/50 rounded-2xl p-6 space-y-6">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="w-2 h-6 bg-cyan-500 rounded-full" />
                                    <h3 className="text-lg font-bold text-white tracking-tight">Inventory & Shipping</h3>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">SKU (Stock Keeping Unit)</label>
                                        <input
                                            type="text"
                                            value={formData.sku}
                                            onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                                            placeholder="e.g. WNH-001"
                                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Barcode / EAN</label>
                                        <input
                                            type="text"
                                            value={formData.barcodeEAN}
                                            onChange={(e) => setFormData({ ...formData, barcodeEAN: e.target.value })}
                                            placeholder="0000 0000 0000"
                                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Quantity</label>
                                        <input
                                            type="number"
                                            value={formData.initialQuantity}
                                            onChange={(e) => setFormData({ ...formData, initialQuantity: e.target.value })}
                                            placeholder="0"
                                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Low Stock Threshold</label>
                                        <input
                                            type="number"
                                            value={formData.lowStockThreshold}
                                            onChange={(e) => setFormData({ ...formData, lowStockThreshold: e.target.value })}
                                            placeholder="10"
                                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                                        />
                                    </div>
                                </div>
                            </section>
                        </div>

                        {/* Right Column - Side Panels */}
                        <div className="space-y-6">
                            <section className="bg-slate-900/30 border border-slate-800/50 rounded-2xl p-6">
                                <h3 className="text-md font-bold text-white mb-4 tracking-tight">Product Media</h3>
                                <div className="space-y-4">
                                    <label className="border-2 border-dashed border-slate-800 bg-slate-950/50 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-purple-500/50 hover:bg-purple-500/5 transition-all group overflow-hidden relative min-h-[160px]">
                                        <input
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                        />
                                        {formData.productImage ? (
                                            <div className="relative w-full h-full flex items-center justify-center">
                                                <img src={formData.productImage} alt="Product" className="w-full h-full object-contain max-h-[140px]" />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <p className="text-white text-xs font-bold">Change Image</p>
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="w-12 h-12 rounded-full bg-slate-800 group-hover:bg-purple-500/20 flex items-center justify-center mb-3 transition-colors">
                                                    <Upload className="w-6 h-6 text-slate-400 group-hover:text-purple-400" />
                                                </div>
                                                <p className="text-white text-sm font-semibold">Click to upload from system</p>
                                                <p className="text-slate-500 text-[10px] mt-1">SVG, PNG, JPG (max. 5MB)</p>
                                            </>
                                        )}
                                    </label>
                                </div>
                            </section>

                            <section className="bg-slate-900/30 border border-slate-800/50 rounded-2xl p-6 space-y-6">
                                <h3 className="text-md font-bold text-white tracking-tight">Pricing</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Base Price ($)</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={formData.basePrice}
                                            onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
                                            placeholder="0.00"
                                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 tabular-nums"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Cost Price ($)</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={formData.costPrice}
                                            onChange={(e) => setFormData({ ...formData, costPrice: e.target.value })}
                                            placeholder="0.00"
                                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 tabular-nums"
                                        />
                                        <p className="text-[10px] text-slate-500 mt-1 flex items-center gap-1"><Info className="w-3 h-3" /> Customers won't see this</p>
                                    </div>
                                    <div>
                                        <label className="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Tax Rate (%)</label>
                                        <input
                                            type="number"
                                            value={formData.taxRate}
                                            onChange={(e) => setFormData({ ...formData, taxRate: e.target.value })}
                                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 tabular-nums"
                                        />
                                    </div>
                                </div>
                            </section>

                            <section className="bg-slate-900/30 border border-slate-800/50 rounded-2xl p-6">
                                <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Product Status</h3>
                                <div className="space-y-3">
                                    {[
                                        { id: 'in stock', label: 'In Stock', color: 'bg-emerald-500' },
                                        { id: 'low stock', label: 'Low Stock', color: 'bg-amber-500' },
                                        { id: 'out of stock', label: 'Out of Stock', color: 'bg-rose-500' }
                                    ].map((option) => (
                                        <label
                                            key={option.id}
                                            className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${formData.status === option.id
                                                ? 'bg-purple-500/10 border-purple-500/50'
                                                : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`w-2 h-2 rounded-full ${option.color}`} />
                                                <span className={`text-xs font-semibold ${formData.status === option.id ? 'text-white' : 'text-slate-400'}`}>
                                                    {option.label}
                                                </span>
                                            </div>
                                            <input
                                                type="radio"
                                                name="status"
                                                value={option.id}
                                                checked={formData.status === option.id}
                                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                                className="w-4 h-4 accent-purple-500 cursor-pointer"
                                            />
                                        </label>
                                    ))}
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default AddProduct;
