import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus, X, Upload, Check,
    ChevronRight, FolderPlus, Info
} from 'lucide-react';
import { clsx } from 'clsx';

import { useNavigate, useLocation } from 'react-router-dom';
import { serverUrl } from '../config/api';

import { 
    useCreateCategoryMutation, 
    useUpdateCategoryMutation,
    useGetCategoriesQuery
} from '../redux/slices/categorySlice';
import { toast } from 'react-hot-toast';

const AddCategory = ({ isOpen = true }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { data: categoriesData } = useGetCategoriesQuery();
    const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation();
    const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation();

    const categories = categoriesData?.categories || [];
    const onClose = () => navigate('/categories');

    // Check if we are in edit mode based on state passed via navigation
    const editCategory = location.state?.editCategory;

    const [formData, setFormData] = useState({
        catName: '',
        description: '',
        status: 'active',
        parent: ''
    });

    useEffect(() => {
        if (editCategory) {
            setFormData({
                catName: editCategory.catName || '',
                description: editCategory.description || '',
                status: editCategory.status || 'active',
                parent: editCategory.parent?._id || editCategory.parent || ''
            });
        }
    }, [editCategory]);

    if (!isOpen) return null;

    const handleSave = async () => {
        const categoryFormData = new FormData();
        categoryFormData.append('catName', formData.catName);
        categoryFormData.append('description', formData.description);
        categoryFormData.append('status', formData.status);
        if (formData.parent) {
            categoryFormData.append('parent', formData.parent);
        }

        try {
            if (editCategory) {
                await updateCategory({ id: editCategory._id, body: categoryFormData }).unwrap();
                toast.success('Category updated successfully');
            } else {
                await createCategory(categoryFormData).unwrap();
                toast.success('Category added successfully');
            }
            onClose();
        } catch (error) {
            toast.error(error.data?.message || 'Failed to save category');
        }
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
                className="relative w-full max-w-5xl bg-[#0a0a0a] border border-slate-800 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
                {/* Header */}
                <div className="px-8 py-6 border-b border-slate-800 flex items-center justify-between bg-linear-to-r from-purple-500/5 to-cyan-500/5">
                    <div>
                        <h2 className="text-2xl font-bold text-white tracking-tight">
                            {editCategory ? 'Edit Category' : 'Add Category'}
                        </h2>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={onClose}
                            className="px-6 py-2.5 rounded-xl border border-slate-700 text-slate-300 font-bold hover:bg-slate-800 transition-all text-xs uppercase tracking-widest"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            className="px-6 py-2.5 rounded-xl bg-linear-to-r from-purple-600 to-cyan-600 text-white font-bold hover:brightness-110 shadow-lg shadow-purple-500/20 flex items-center gap-2 transition-all text-xs uppercase tracking-widest"
                        >
                            <Check className="w-4 h-4" />
                            {editCategory ? 'Update Category' : 'Save Category'}
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
                                            value={formData.catName}
                                            onChange={(e) => setFormData({ ...formData, catName: e.target.value })}
                                            placeholder="e.g. Electronics"
                                            className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl px-5 py-4 text-white text-sm focus:outline-none focus:border-purple-500/50 transition-all focus:ring-4 focus:ring-purple-500/5"
                                        />
                                    </div>

                                    <div className="space-y-2 group">
                                        <label className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] ml-1">Description</label>
                                        <textarea
                                            rows="6"
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            placeholder="Type category description here..."
                                            className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl px-5 py-4 text-white text-sm focus:outline-none focus:border-purple-500/50 transition-all focus:ring-4 focus:ring-purple-500/5 resize-none"
                                        />
                                    </div>
                                </div>
                            </section>
                        </div>

                        {/* Right Column - Status */}
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
                                        <option value="">None (Top Level)</option>
                                        {categories.filter(c => c._id !== editCategory?._id).map((cat) => (
                                            <option key={cat._id} value={cat._id}>
                                                {cat.catName}
                                            </option>
                                        ))}
                                    </select>
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
