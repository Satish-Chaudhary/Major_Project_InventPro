import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, X, Upload, Info, Check } from 'lucide-react';

const AddProduct = ({ isOpen, onClose, onAdd }) => {
    const [formData, setFormData] = useState({
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
        status: true
    });

    if (!isOpen) return null;

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
                        <h2 className="text-2xl font-bold text-white tracking-tight">Add New Product</h2>
                        {/* <p className="text-slate-400 text-sm mt-1">Products &gt; Add New Product</p> */}
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={onClose}
                            className="px-6 py-2.5 rounded-lg border border-slate-700 text-slate-300 font-medium hover:bg-slate-800 transition-all text-sm"
                        >
                            Cancel
                        </button>
                        <button
                            className="px-6 py-2.5 rounded-lg bg-linear-to-r from-purple-600 to-cyan-600 text-white font-bold hover:brightness-110 shadow-lg shadow-purple-500/20 flex items-center gap-2 transition-all text-sm"
                        >
                            <Check className="w-4 h-4" />
                            Save Product
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
                                            placeholder="e.g. Wireless Noise-Cancelling Headphones"
                                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Description</label>
                                        <textarea
                                            rows="4"
                                            placeholder="Describe the product features and specifications..."
                                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-all resize-none"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Category</label>
                                            <select className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-all appearance-none cursor-pointer">
                                                <option>Electronics</option>
                                                <option>Accessories</option>
                                                <option>Office Supplies</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Brand</label>
                                            <input
                                                type="text"
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
                                        <input type="text" placeholder="e.g. WNH-001" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500" />
                                    </div>
                                    <div>
                                        <label className="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Barcode / EAN</label>
                                        <input type="text" placeholder="0000 0000 0000" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500" />
                                    </div>
                                    <div>
                                        <label className="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Initial Quantity</label>
                                        <input type="number" placeholder="0" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500" />
                                    </div>
                                    <div>
                                        <label className="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Low Stock Threshold</label>
                                        <input type="number" placeholder="10" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500" />
                                    </div>
                                </div>
                            </section>
                        </div>

                        {/* Right Column - Side Panels */}
                        <div className="space-y-6">
                            <section className="bg-slate-900/30 border border-slate-800/50 rounded-2xl p-6">
                                <h3 className="text-md font-bold text-white mb-4 tracking-tight">Product Media</h3>
                                <div className="border-2 border-dashed border-slate-800 bg-slate-950/50 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:border-purple-500/50 hover:bg-purple-500/5 transition-all group">
                                    <div className="w-12 h-12 rounded-full bg-slate-800 group-hover:bg-purple-500/20 flex items-center justify-center mb-3 transition-colors">
                                        <Upload className="w-6 h-6 text-slate-400 group-hover:text-purple-400" />
                                    </div>
                                    <p className="text-white text-sm font-semibold">Click to upload image</p>
                                    <p className="text-slate-500 text-[11px] mt-1">or drag and drop<br />SVG, PNG, JPG (max. 800x800px)</p>
                                </div>
                            </section>

                            <section className="bg-slate-900/30 border border-slate-800/50 rounded-2xl p-6 space-y-6">
                                <h3 className="text-md font-bold text-white tracking-tight">Pricing</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Base Price ($)</label>
                                        <input type="number" step="0.01" placeholder="0.00" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 tabular-nums" />
                                    </div>
                                    <div>
                                        <label className="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Cost Price ($)</label>
                                        <input type="number" step="0.01" placeholder="0.00" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 tabular-nums" />
                                        <p className="text-[10px] text-slate-500 mt-1 flex items-center gap-1"><Info className="w-3 h-3" /> Customers won't see this</p>
                                    </div>
                                    <div>
                                        <label className="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Tax Rate (%)</label>
                                        <input type="number" defaultValue="20" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 tabular-nums" />
                                    </div>
                                </div>
                            </section>

                            <section className="bg-slate-900/30 border border-slate-800/50 rounded-2xl p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-md font-bold text-white tracking-tight">Status</h3>
                                        <p className="text-[11px] text-slate-500">Product will be visible</p>
                                    </div>
                                    <button className="w-12 h-6 bg-purple-600 rounded-full relative shadow-inner">
                                        <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-md" />
                                    </button>
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
