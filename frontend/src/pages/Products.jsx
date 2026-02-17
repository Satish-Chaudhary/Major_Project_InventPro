import React from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, Download, Edit2, Trash2, Package } from 'lucide-react';
import { clsx } from 'clsx';

const ProductsList = ({ inventory, getStatusBadge }) => {
    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-6 space-y-6"
        >
            <div className="flex items-center justify-between mb-2">
                <h2 className="text-2xl font-bold text-white tracking-tight">Product Inventory</h2>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-lg transition-all text-sm font-medium border border-slate-700">
                        <Download className="w-4 h-4" />
                        Export CSV
                    </button>
                </div>
            </div>

            {/* Filters Bar */}
            <div className="bg-slate-900/40 border border-slate-800 p-4 rounded-2xl flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                        type="text"
                        placeholder="Search by name, SKU, or category..."
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-300 focus:outline-none focus:border-purple-500/50"
                    />
                </div>
                <select className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-300 focus:outline-none w-full md:w-48">
                    <option>All Categories</option>
                    <option>Electronics</option>
                    <option>Furniture</option>
                </select>
                <select className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-300 focus:outline-none w-full md:w-48">
                    <option>All Status</option>
                    <option>In Stock</option>
                    <option>Low Stock</option>
                    <option>Out of Stock</option>
                </select>
            </div>

            {/* Table */}
            <div className="bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-800/40 border-b border-slate-800 text-slate-400 font-bold text-xs uppercase tracking-widest">
                                <th className="px-6 py-4 w-12"><input type="checkbox" className="rounded bg-slate-900 border-slate-700" /></th>
                                <th className="px-6 py-4 font-bold tracking-widest">Product Name</th>
                                <th className="px-6 py-4">SKU</th>
                                <th className="px-6 py-4">Category</th>
                                <th className="px-6 py-4">Quantity</th>
                                <th className="px-6 py-4">Price</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {inventory.map((item, index) => (
                                <motion.tr
                                    key={item.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="hover:bg-slate-800/30 transition-all group"
                                >
                                    <td className="px-6 py-5"><input type="checkbox" className="rounded bg-slate-900 border-slate-700" /></td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-linear-to-br from-slate-700/50 to-slate-800/50 rounded-xl flex items-center justify-center border border-slate-700/50 group-hover:scale-105 transition-transform">
                                                <Package className="w-6 h-6 text-slate-400 group-hover:text-purple-400 transition-colors" />
                                            </div>
                                            <div>
                                                <p className="text-white font-bold text-sm tracking-tight">{item.name}</p>
                                                <p className="text-slate-500 text-[11px] mt-0.5 font-medium">Global Logistics Inc.</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 font-mono text-xs text-slate-400">{item.sku}</td>
                                    <td className="px-6 py-5 text-sm text-slate-300 font-medium">{item.category}</td>
                                    <td className="px-6 py-5 text-sm text-white font-bold tabular-nums">{item.stock}</td>
                                    <td className="px-6 py-5 text-sm text-white font-bold tabular-nums">${item.price.toLocaleString()}</td>
                                    <td className="px-6 py-5">{getStatusBadge(item.status)}</td>
                                    <td className="px-6 py-5 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button className="p-2 text-slate-400 hover:text-cyan-400 hover:bg-cyan-400/10 rounded-lg transition-all"><Edit2 className="w-4 h-4" /></button>
                                            <button className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"><Trash2 className="w-4 h-4" /></button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="px-6 py-4 bg-slate-800/20 border-t border-slate-800 flex items-center justify-between">
                    <p className="text-xs text-slate-500">Showing <span className="text-slate-300 font-bold text-xs">{inventory.length}</span> of <span className="text-slate-300 font-bold text-xs">{inventory.length}</span> products</p>
                    <div className="flex gap-2">
                        <button className="px-3 py-1 rounded bg-slate-800 border border-slate-700 text-slate-500 text-xs cursor-not-allowed">Previous</button>
                        <button className="px-3 py-1 rounded bg-slate-800 border border-slate-700 text-slate-300 text-xs hover:bg-slate-700">Next</button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default ProductsList;
