import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Download, Edit2, Trash2, Package, Check, RotateCcw } from 'lucide-react';
import { clsx } from 'clsx';

import { useApp } from '../context/AppContext';
import AddProduct from './AddProduct';

const ProductsList = () => {
    const { inventory, categories, getStatusBadge, deleteProduct, deleteMultipleProducts, setShowAddModal, showAddModal, user } = useApp();
    const userRole = user?.role?.toLowerCase();

    // Role-based activity flags
    const canDelete = ['admin', 'manager'].includes(userRole);
    const canAdd = ['admin', 'manager'].includes(userRole);
    const canExport = ['admin', 'manager', 'accountant'].includes(userRole);
    const [selectedItems, setSelectedItems] = useState([]);
    const [editProduct, setEditProduct] = useState(null);
    const [localSearch, setLocalSearch] = useState('');
    const [filterCategory, setFilterCategory] = useState('All');
    const [filterStatus, setFilterStatus] = useState('All');

    const filteredInventory = inventory.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(localSearch.toLowerCase()) ||
            item.sku.toLowerCase().includes(localSearch.toLowerCase()) ||
            item.category.toLowerCase().includes(localSearch.toLowerCase());

        // Normalize status strings for comparison (remove hyphens and spaces)
        const normalize = (str) => str?.toLowerCase().replace(/[- ]/g, '') || '';

        // Normalize category matching (handle strings and arrays)
        const matchesCategory = filterCategory === 'All' ||
            (Array.isArray(item.category)
                ? item.category.some(cat => cat.trim().toLowerCase() === filterCategory.toLowerCase())
                : item.category.toLowerCase() === filterCategory.toLowerCase());

        const matchesStatus = filterStatus === 'All' || normalize(item.status) === normalize(filterStatus);

        return matchesSearch && matchesCategory && matchesStatus;
    });

    const clearFilters = () => {
        setLocalSearch('');
        setFilterCategory('All');
        setFilterStatus('All');
    };

    const toggleSelectAll = () => {
        if (selectedItems.length === filteredInventory.length) {
            setSelectedItems([]);
        } else {
            setSelectedItems(filteredInventory.map(item => item.id));
        }
    };

    const toggleSelectItem = (id) => {
        if (selectedItems.includes(id)) {
            setSelectedItems(selectedItems.filter(itemId => itemId !== id));
        } else {
            setSelectedItems([...selectedItems, id]);
        }
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            deleteProduct(id);
            setSelectedItems(selectedItems.filter(itemId => itemId !== id));
        }
    };

    const handleBulkDelete = () => {
        if (window.confirm(`Are you sure you want to delete ${selectedItems.length} products?`)) {
            deleteMultipleProducts(selectedItems);
            setSelectedItems([]);
        }
    };

    const handleEdit = (product) => {
        setEditProduct(product);
        setShowAddModal(true);
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-6 space-y-6"
        >
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-4">
                    <h2 className="text-2xl font-bold text-white tracking-tight">Product Inventory</h2>
                    {selectedItems.length > 0 && canDelete && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex items-center gap-3 bg-purple-500/10 border border-purple-500/20 px-4 py-1.5 rounded-full"
                        >
                            <span className="text-purple-400 text-xs font-bold">{selectedItems.length} Selected</span>
                            <div className="w-px h-4 bg-purple-500/20" />
                            <button
                                onClick={handleBulkDelete}
                                className="text-red-400 hover:text-red-300 text-xs font-bold flex items-center gap-1.5 transition-colors"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                                Delete
                            </button>
                        </motion.div>
                    )}
                </div>
                <div className="flex items-center gap-3">
                    {canExport && (
                        <button className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-lg transition-all text-sm font-medium border border-slate-700">
                            <Download className="w-4 h-4" />
                            Export CSV
                        </button>
                    )}
                    {canAdd && (
                        <button
                            onClick={() => {
                                setEditProduct(null);
                                setShowAddModal(true);
                            }}
                            className="flex items-center gap-2 bg-linear-to-r from-purple-600 to-cyan-600 hover:brightness-110 text-white px-4 py-2 rounded-lg transition-all text-sm font-bold shadow-lg shadow-purple-500/20"
                        >
                            <Plus className="w-4 h-4" />
                            Add Product
                        </button>
                    )}
                </div>
            </div>

            {/* Filters Bar */}
            <div className="bg-slate-900/40 border border-slate-800 p-4 rounded-2xl flex flex-col md:flex-row gap-4 items-center shadow-sm">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                        type="text"
                        value={localSearch}
                        onChange={(e) => setLocalSearch(e.target.value)}
                        placeholder="Search by name, SKU, or category..."
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-300 focus:outline-none focus:border-purple-500/50 transition-all font-medium"
                    />
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-300 focus:outline-none w-full md:w-48 cursor-pointer hover:border-slate-700 transition-colors"
                    >
                        <option value="All">All Categories</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.name}>{cat.name}</option>
                        ))}
                    </select>
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-300 focus:outline-none w-full md:w-48 cursor-pointer hover:border-slate-700 transition-colors"
                    >
                        <option value="All">All Status</option>
                        <option value="in stock">In Stock</option>
                        <option value="low stock">Low Stock</option>
                        <option value="out of stock">Out of Stock</option>
                    </select>
                    <button
                        onClick={clearFilters}
                        className="flex items-center gap-2 bg-red-500/5 border border-red-500/50 hover:border-red-500/50 opacity-70 hover:bg-red-500/5 hover:opacity-100 text-red-400 px-4 py-2 rounded-xl transition-all text-sm font-bold shrink-0 shadow-sm"
                        title="Clear all filters"
                    >
                        <RotateCcw className="w-4 h-4" />
                        Clear Filter
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl relative">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-800/40 border-b border-slate-800 text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em]">
                                <th className="px-6 py-4 w-12">
                                    <div className="flex items-center justify-center">
                                        <input
                                            type="checkbox"
                                            checked={selectedItems.length === filteredInventory.length && filteredInventory.length > 0}
                                            onChange={toggleSelectAll}
                                            className="w-4 h-4 rounded border-slate-700 bg-slate-900 accent-purple-500 cursor-pointer"
                                        />
                                    </div>
                                </th>
                                <th className="px-6 py-4">Product Name</th>
                                <th className="px-6 py-4">SKU</th>
                                <th className="px-6 py-4">Category</th>
                                <th className="px-6 py-4">Quantity</th>
                                <th className="px-6 py-4">Price</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {filteredInventory.map((item, index) => (
                                <motion.tr
                                    key={item.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: index * 0.03 }}
                                    className={clsx(
                                        "hover:bg-slate-800/30 transition-all group",
                                        selectedItems.includes(item.id) && "bg-purple-500/5"
                                    )}
                                >
                                    <td className="px-6 py-5">
                                        <div className="flex items-center justify-center">
                                            <input
                                                type="checkbox"
                                                checked={selectedItems.includes(item.id)}
                                                onChange={() => toggleSelectItem(item.id)}
                                                className="w-4 h-4 rounded border-slate-700 bg-slate-900 accent-purple-500 cursor-pointer"
                                            />
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-linear-to-br from-slate-700/50 to-slate-800/50 rounded-xl flex items-center justify-center border border-slate-700/50 group-hover:scale-105 transition-transform shrink-0">
                                                <Package className="w-5 h-5 text-slate-400 group-hover:text-purple-400 transition-colors" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-white font-bold text-sm tracking-tight truncate">{item.name}</p>
                                                <p className="text-slate-500 text-[10px] mt-0.5 font-bold uppercase tracking-wider">InvenPro Global</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 font-mono text-[10px] text-slate-500 font-bold">{item.sku}</td>
                                    <td className="px-6 py-5">
                                        <span className="text-[11px] font-bold text-slate-400 bg-slate-800/50 px-2 py-1 rounded-md border border-slate-700/50 leading-none">
                                            {item.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-sm text-white font-bold tabular-nums">{item.stock}</td>
                                    <td className="px-6 py-5 text-sm text-white font-bold tabular-nums">${item.price.toLocaleString()}</td>
                                    <td className="px-6 py-5">{getStatusBadge(item.status)}</td>
                                    <td className="px-6 py-5 text-right">
                                        <div className="flex items-center justify-end gap-1.5">
                                            <button
                                                onClick={() => handleEdit(item)}
                                                className="p-2 text-slate-400 hover:text-cyan-400 hover:bg-cyan-400/10 rounded-lg transition-all"
                                                title="Edit Product"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            {canDelete && (
                                                <button
                                                    onClick={() => handleDelete(item.id)}
                                                    className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                                                    title="Delete Product"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {inventory.length === 0 && (
                    <div className="py-20 flex flex-col items-center justify-center text-center">
                        <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4">
                            <Package className="w-8 h-8 text-slate-600" />
                        </div>
                        <h3 className="text-white font-bold">No products found</h3>
                        <p className="text-slate-500 text-sm mt-1">Start by adding your first product to the inventory.</p>
                    </div>
                )}
                <div className="px-6 py-4 bg-slate-800/20 border-t border-slate-800 flex items-center justify-between">
                    <p className="text-xs text-slate-500 font-medium">Showing <span className="text-slate-300 font-bold">{filteredInventory.length}</span> of <span className="text-slate-300 font-bold">{inventory.length}</span> products</p>
                    <div className="flex gap-2">
                        <button className="px-4 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-600 text-[11px] font-bold cursor-not-allowed">Previous</button>
                        <button className="px-4 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 text-[11px] font-bold hover:bg-slate-800 transition-colors">Next</button>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {showAddModal && (
                    <AddProduct
                        isOpen={showAddModal}
                        editProduct={editProduct}
                    />
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default ProductsList;
