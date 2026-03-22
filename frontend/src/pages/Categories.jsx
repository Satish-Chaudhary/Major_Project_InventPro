import React from 'react';
import { motion } from 'framer-motion';
import { Package, Plus, Search, FolderPlus, MoreVertical, Edit2, Trash2 } from 'lucide-react';
import { clsx } from 'clsx';

import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { serverUrl } from '../App';

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
                        key={cat._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="group bg-slate-900/40 border border-slate-800 rounded-2xl p-6 hover:border-purple-500/30 transition-all cursor-pointer relative overflow-hidden"
                        onClick={() => handleEdit(cat)}
                    >
                        <div className="absolute -right-8 -top-8 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl group-hover:bg-purple-500/10 transition-all"></div>

                        <div className="flex justify-between items-start mb-6 relative z-10">
                            <div className="w-12 h-12 rounded-xl bg-slate-800/50 flex items-center justify-center shadow-lg shadow-black/20 group-hover:scale-110 transition-transform overflow-hidden">
                                {cat.thumbnail ? (
                                    <img
                                        src={cat.thumbnail.startsWith('http') ? cat.thumbnail : `${serverUrl}/${cat.thumbnail.replace('\\', '/')}`}
                                        alt={cat.catName}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <Package className="w-6 h-6 text-slate-500 group-hover:text-purple-400" />
                                )}
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleEdit(cat);
                                    }}
                                    className="p-2 text-slate-400 hover:text-cyan-400 hover:bg-cyan-400/10 rounded-lg transition-all"
                                >
                                    <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDelete(cat._id, cat.catName);
                                    }}
                                    className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        <div className="relative z-10">
                            <h3 className="text-xl font-bold text-white tracking-tight">{cat.catName}</h3>
                            <p className="text-slate-500 text-xs mt-2 line-clamp-2 h-8">{cat.description || 'No description provided.'}</p>

                            <div className="mt-6 flex items-center justify-between border-t border-slate-800 pt-4">
                                <div className="flex flex-col">
                                    <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest leading-none mb-1">Status</span>
                                    <span className={clsx(
                                        "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest",
                                        cat.status === 'active' ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"
                                    )}>
                                        {cat.status}
                                    </span>
                                </div>
                                {cat.parent && (
                                    <div className="flex flex-col items-end">
                                        <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest leading-none mb-1">Parent</span>
                                        <span className="text-purple-400 text-[10px] font-bold uppercase tracking-widest">{cat.parent.catName || 'Subcategory'}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
};

export default Categories;
