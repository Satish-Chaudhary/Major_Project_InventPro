import React from 'react';
import { motion } from 'framer-motion';
import { Package, Plus, Search, FolderPlus, MoreVertical, Edit2, Trash2 } from 'lucide-react';

const Categories = ({ onAddClick }) => {
    const categories = [
        { id: 1, name: 'Electronics', count: 450, stockValue: '$124,500', trend: '+12%', color: 'from-purple-500 to-indigo-500' },
        { id: 2, name: 'Furniture', count: 120, stockValue: '$86,200', trend: '-5%', color: 'from-cyan-500 to-blue-500' },
        { id: 3, name: 'Accessories', count: 890, stockValue: '$42,300', trend: '+18%', color: 'from-emerald-500 to-teal-500' },
        { id: 4, name: 'Office Supplies', count: 340, stockValue: '$31,900', trend: '+2%', color: 'from-amber-500 to-orange-500' },
        { id: 5, name: 'Laptops', count: 85, stockValue: '$210,000', trend: '+24%', color: 'from-pink-500 to-rose-500' },
        { id: 6, name: 'Smartphones', count: 160, stockValue: '$145,000', trend: '+15%', color: 'from-violet-500 to-purple-500' },
    ];

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

                        <h3 className="text-xl font-bold text-white">{cat.name}</h3>
                        <div className="flex items-center gap-4 mt-4">
                            <div>
                                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Products</p>
                                <p className="text-white font-bold">{cat.count}</p>
                            </div>
                            <div className="w-px h-8 bg-slate-800" />
                            <div>
                                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Stock Value</p>
                                <p className="text-white font-bold">{cat.stockValue}</p>
                            </div>
                        </div>

                        <div className="mt-6 flex items-center justify-between">
                            <span className={`text-xs font-bold px-2 py-1 rounded-lg ${cat.trend.startsWith('+') ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                                {cat.trend} this month
                            </span>
                            <div className="flex gap-2">
                                <button className="p-1.5 text-slate-500 hover:text-cyan-400 transition-colors"><Edit2 className="w-4 h-4" /></button>
                                <button className="p-1.5 text-slate-500 hover:text-red-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
};

export default Categories;
