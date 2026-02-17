import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Plus, X, Upload, Check,
    ChevronRight, FolderPlus, Info
} from 'lucide-react';
import { clsx } from 'clsx';

const AddCategory = ({ isOpen, onClose, onAdd }) => {
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        description: '',
        status: 'active',
        parent: 'none'
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
                className="relative w-full max-w-5xl bg-[#0a0a0a] border border-slate-800 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
                {/* Header */}
                <div className="px-8 py-6 border-b border-slate-800 flex items-center justify-between bg-linear-to-r from-purple-500/5 to-cyan-500/5">
                    <div>
                        {/* <div className="flex items-center gap-2 text-slate-500 text-[10px] font-bold uppercase tracking-widest leading-none mb-1">
                            <span>Categories</span>
                            <ChevronRight className="w-3 h-3" />
                            <span className="text-slate-300">Add New Category</span>
                        </div> */}
                        <h2 className="text-2xl font-bold text-white tracking-tight">Add Category</h2>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={onClose}
                            className="px-6 py-2.5 rounded-xl border border-slate-700 text-slate-300 font-bold hover:bg-slate-800 transition-all text-xs uppercase tracking-widest"
                        >
                            Cancel
                        </button>
                        <button
                            className="px-6 py-2.5 rounded-xl bg-linear-to-r from-purple-600 to-cyan-600 text-white font-bold hover:brightness-110 shadow-lg shadow-purple-500/20 flex items-center gap-2 transition-all text-xs uppercase tracking-widest"
                        >
                            <Check className="w-4 h-4" />
                            Save Category
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                        {/* Left Column - Form Details */}
                        <div className="lg:col-span-2 space-y-8">
                            <section className="bg-slate-900/40 border border-slate-800/60 rounded-4xl p-8 space-y-8">
                                <div className="flex flex-col gap-1">
                                    <h3 className="text-lg font-bold text-white tracking-tight">General Information</h3>
                                    <p className="text-slate-500 text-xs">Basic details about the category</p>
                                </div>

                                <div className="space-y-6">
                                    <div className="space-y-2 group">
                                        <label className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] ml-1">Category Name</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. Electronics"
                                            className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl px-5 py-4 text-white text-sm focus:outline-none focus:border-purple-500/50 transition-all focus:ring-4 focus:ring-purple-500/5"
                                        />
                                    </div>

                                    <div className="space-y-2 group">
                                        <label className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] ml-1">Category Slug</label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                placeholder="e.g. electronics"
                                                className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl px-5 py-4 text-slate-400 text-sm focus:outline-none"
                                                disabled
                                            />
                                            <div className="mt-2 flex items-start gap-2">
                                                <Info className="w-3.5 h-3.5 text-slate-600 shrink-0 mt-0.5" />
                                                <p className="text-[10px] text-slate-600 font-medium italic">Slug is auto-generated from the name.</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2 group">
                                        <label className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] ml-1">Description</label>
                                        <textarea
                                            rows="6"
                                            placeholder="Type category description here..."
                                            className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl px-5 py-4 text-white text-sm focus:outline-none focus:border-purple-500/50 transition-all focus:ring-4 focus:ring-purple-500/5 resize-none"
                                        />
                                    </div>
                                </div>
                            </section>
                        </div>

                        {/* Right Column - Status & Media */}
                        <div className="space-y-8">
                            <section className="bg-slate-900/40 border border-slate-800/60 rounded-4xl p-8 space-y-6">
                                <div className="flex flex-col gap-1">
                                    <h3 className="text-lg font-bold text-white tracking-tight">Status</h3>
                                    <p className="text-slate-500 text-xs">Set visibility status</p>
                                </div>

                                <div className="space-y-3">
                                    <label className={clsx(
                                        "flex items-center gap-4 px-5 py-4 rounded-2xl border cursor-pointer transition-all",
                                        formData.status === 'active' ? "bg-purple-500/10 border-purple-500/50 shadow-lg shadow-purple-500/5" : "bg-slate-950 border-slate-800"
                                    )}>
                                        <input
                                            type="radio"
                                            name="status"
                                            checked={formData.status === 'active'}
                                            onChange={() => setFormData({ ...formData, status: 'active' })}
                                            className="hidden"
                                        />
                                        <div className={clsx("w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all", formData.status === 'active' ? "border-purple-500" : "border-slate-700")}>
                                            {formData.status === 'active' && <div className="w-2.5 h-2.5 bg-purple-500 rounded-full" />}
                                        </div>
                                        <span className={clsx("text-sm font-bold", formData.status === 'active' ? "text-white" : "text-slate-500")}>Active</span>
                                    </label>

                                    <label className={clsx(
                                        "flex items-center gap-4 px-5 py-4 rounded-2xl border cursor-pointer transition-all",
                                        formData.status === 'inactive' ? "bg-slate-800 border-slate-600" : "bg-slate-950 border-slate-800"
                                    )}>
                                        <input
                                            type="radio"
                                            name="status"
                                            checked={formData.status === 'inactive'}
                                            onChange={() => setFormData({ ...formData, status: 'inactive' })}
                                            className="hidden"
                                        />
                                        <div className={clsx("w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all", formData.status === 'inactive' ? "border-slate-400" : "border-slate-700")}>
                                            {formData.status === 'inactive' && <div className="w-2.5 h-2.5 bg-slate-400 rounded-full" />}
                                        </div>
                                        <span className={clsx("text-sm font-bold", formData.status === 'inactive' ? "text-white" : "text-slate-500")}>Inactive</span>
                                    </label>
                                </div>
                            </section>

                            <section className="bg-slate-900/40 border border-slate-800/60 rounded-4xl p-8 space-y-4">
                                <h3 className="text-lg font-bold text-white tracking-tight leading-none">Parent Category</h3>
                                <div className="relative group">
                                    <select
                                        className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-slate-300 text-sm focus:outline-none focus:border-purple-500/50 appearance-none cursor-pointer"
                                        value={formData.parent}
                                        onChange={(e) => setFormData({ ...formData, parent: e.target.value })}
                                    >
                                        <option value="none">None (Top Level)</option>
                                        <option value="electronics">Electronics</option>
                                        <option value="office">Office Supplies</option>
                                    </select>
                                </div>
                            </section>

                            <section className="bg-slate-900/40 border border-slate-800/60 rounded-4xl p-8 space-y-6">
                                <h3 className="text-lg font-bold text-white tracking-tight leading-none">Thumbnail</h3>
                                <div className="group relative border-2 border-dashed border-slate-800 bg-slate-950/20 rounded-3xl p-10 flex flex-col items-center justify-center text-center cursor-pointer hover:border-purple-500/50 hover:bg-purple-500/5 transition-all">                                    <div className="w-14 h-14 rounded-2xl bg-slate-800/50 group-hover:bg-purple-500/20 flex items-center justify-center mb-4 transition-all">
                                    <Upload className="w-7 h-7 text-slate-500 group-hover:text-purple-400" />
                                </div>
                                    <p className="text-white text-sm font-bold tracking-tight">Click to upload image</p>
                                    <p className="text-slate-600 text-[10px] font-bold uppercase tracking-widest mt-2 leading-tight">SVG, PNG, JPG or GIF (max. 2MB)</p>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default AddCategory;
