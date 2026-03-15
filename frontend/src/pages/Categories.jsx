import React from 'react';
import { motion } from 'framer-motion';
import { Package, Plus, Search, FolderPlus, MoreVertical, Edit2, Trash2 } from 'lucide-react';

import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const Categories = () => {
    const navigate = useNavigate();
    const { categories, deleteCategory } = useApp();

    const onAddClick = () => navigate('/add-category');

    const handleDelete = (id, name) => {
        if (window.confirm(`Are you sure you want to delete the category "${name}"?`)) {
            deleteCategory(id);
        }
    };

    const handleEdit = (category) => {
        navigate('/add-category', { state: { editCategory: category } });
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-6 space-y-8"
        >
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-white tracking-tight">Product Categories</h2>
                    <p className="text-slate-400 text-sm mt-1">Manage your inventory taxonomy and structure.</p>
                </div>
                <button
                    onClick={onAddClick}
                    className="flex items-center gap-2 bg-linear-to-r from-purple-600 to-cyan-600 text-white px-5 py-2.5 rounded-xl hover:brightness-110 transition-all font-bold text-sm shadow-lg shadow-purple-500/20"
                >
                    <FolderPlus className="w-4 h-4" />
                    Create Category
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((cat, index) => (
                    <motion.div
                        key={cat.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="group bg-slate-900/40 border border-slate-800 rounded-2xl p-6 hover:border-purple-500/30 transition-all cursor-pointer relative overflow-hidden"
                    >
                        <div className={cat.name === 'Electronics' ? "absolute -right-8 -top-8 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl group-hover:bg-purple-500/20 transition-all" : "absolute -right-8 -top-8 w-32 h-32 bg-slate-500/5 rounded-full blur-3xl"}></div>

                        <div className="flex justify-between items-start mb-6">
                            <div className={`w-12 h-12 rounded-xl bg-linear-to-br ${cat.color} flex items-center justify-center shadow-lg shadow-black/20 group-hover:scale-110 transition-transform`}>
                                <Package className="w-6 h-6 text-white" />
                            </div>
                            <button className="p-2 text-slate-500 hover:text-white transition-colors">
                                <MoreVertical className="w-5 h-5" />
                            </button>
                        </div>

                        <h3 className="text-xl font-bold text-white tracking-tight">{cat.name}</h3>
                        <div className="flex items-center gap-4 mt-4">
                            <div>
                                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest leading-none">Products</p>
                                <p className="text-white font-bold text-lg">{cat.count}</p>
                            </div>
                            <div className="w-px h-8 bg-slate-800" />
                            <div>
                                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest leading-none">Stock Value</p>
                                <p className="text-white font-bold text-lg">{cat.stockValue}</p>
                            </div>
                        </div>

                        <div className="mt-6 flex items-center justify-between">
                            <span className={`text-xs font-bold px-2 py-1 rounded-lg ${cat.trend.startsWith('+') ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                                {cat.trend} this month
                            </span>
                            <div className="flex gap-2">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleEdit(cat);
                                    }}
                                    className="p-2 text-slate-400 hover:text-cyan-400 hover:bg-cyan-400/10 rounded-lg transition-all"
                                    title="Edit Category"
                                >
                                    <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDelete(cat.id, cat.name);
                                    }}
                                    className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                                    title="Delete Category"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
};

export default Categories;
