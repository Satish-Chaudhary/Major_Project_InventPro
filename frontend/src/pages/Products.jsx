import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Download, Edit2, Trash2, Package, Check, RotateCcw, Settings } from 'lucide-react';
import { clsx } from 'clsx';
import { toast } from 'react-hot-toast'
import { serverUrl } from '../config/api';
import AdjustStockModal from './AdjustStockModal';
import { useDeleteWithConfirm } from '../hooks/useDeleteWithConfirm';
import { exportToCSV } from '../utils/exportUtils';

import { useAppDispatch, useAppSelector } from '../redux/hooks';
import {
    selectProductFilters,
    setFilters,
    resetFilters,
    useGetProductsQuery,
    useDeleteProductMutation,
    useDeleteMultipleProductsMutation
} from '../redux/slices/productSlice';
import { useGetCategoriesQuery } from '../redux/slices/categorySlice';
import { openModal } from '../redux/slices/uiSlice';
import { selectUser } from '../redux/slices/authSlice';
import { getStatusBadge } from '../utils/statusBadges';

const ProductsList = () => {
    const dispatch = useAppDispatch();
    const user = useAppSelector(selectUser);
    const filters = useAppSelector(selectProductFilters);
    const userRole = user?.role?.toLowerCase();
    const confirmDelete = useDeleteWithConfirm();

    const { data: productsData, isLoading, isFetching } = useGetProductsQuery(filters);
    const { data: categoriesData } = useGetCategoriesQuery();
    const [deleteProduct] = useDeleteProductMutation();

    const inventory = productsData?.products || [];
    const inventoryStats = {
        total: productsData?.total || 0,
        page: productsData?.page || 1,
        pages: productsData?.pages || 1
    };
    const categories = categoriesData?.categories || [];

    // Role-based activity flags
    const canDelete = ['admin', 'manager'].includes(userRole);
    const canAdd = ['admin', 'manager'].includes(userRole);
    const canExport = ['admin', 'manager', 'accountant'].includes(userRole);

    const [selectedItems, setSelectedItems] = useState([]);
    const [adjustProduct, setAdjustProduct] = useState(null);
    const [showAdjustModal, setShowAdjustModal] = useState(false);

    const handlePageChange = (newPage) => {
        if (newPage < 1 || newPage > inventoryStats.pages) return;
        dispatch(setFilters({ page: newPage }));
    };

    const clearFilters = () => {
        dispatch(resetFilters());
    };

    const toggleSelectAll = () => {
        if (selectedItems.length === inventory.length) {
            setSelectedItems([]);
        } else {
            setSelectedItems(inventory.map(item => item._id));
        }
    };

    const toggleSelectItem = (id) => {
        if (selectedItems.includes(id)) {
            setSelectedItems(selectedItems.filter(itemId => itemId !== id));
        } else {
            setSelectedItems([...selectedItems, id]);
        }
    };

    const [deleteMultipleProducts] = useDeleteMultipleProductsMutation();

    const handleDelete = (id) => {
        const item = inventory.find(i => i._id === id);
        confirmDelete({
            title: item?.productName || 'Product',
            onConfirm: async () => {
                await deleteProduct(id);
                setSelectedItems(prev => prev.filter(itemId => itemId !== id));
            }
        });
    };

    const handleBulkDelete = () => {
        confirmDelete({
            title: `${selectedItems.length} items`,
            message: `Are you sure you want to permanently delete these ${selectedItems.length} products?`,
            onConfirm: async () => {
                await deleteMultipleProducts(selectedItems);
                setSelectedItems([]);
            }
        });
    };

    const handleEdit = (product) => {
        dispatch(openModal({
            modalName: 'productForm',
            mode: 'edit',
            product: product // Passing the whole product object
        }));
    };

    const handleAdd = () => {
        dispatch(openModal({
            modalName: 'productForm',
            mode: 'create'
        }));
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
                        <button
                            onClick={() => {
                                const exportData = inventory.map(i => ({
                                    ID: i.sku,
                                    Name: i.productName,
                                    Category: i.category?.catName || 'N/A',
                                    Price: i.salePrice,
                                    Cost: i.costPrice,
                                    Stock: i.initialQty,
                                    Status: i.status
                                }));
                                exportToCSV(exportData, `products_report_${new Date().toLocaleDateString()}`);
                            }}
                            disabled={!canExport}
                            className="flex items-center gap-1.5 px-4 py-2 bg-slate-800 text-slate-300 hover:text-white rounded-xl border border-slate-700 transition-all font-bold text-xs uppercase tracking-widest disabled:opacity-50"
                        >
                            <Download className="w-4 h-4" />
                            Export CSV
                        </button>
                    )}
                    {canAdd && (
                        <button
                            onClick={handleAdd}
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
                        value={filters.search}
                        onChange={(e) => dispatch(setFilters({ search: e.target.value, page: 1 }))}
                        placeholder="Search by name, SKU, or category..."
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-300 focus:outline-none focus:border-purple-500/50 transition-all font-medium"
                    />
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <select
                        value={filters.category || 'All'}
                        onChange={(e) => dispatch(setFilters({ category: e.target.value, page: 1 }))}
                        className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-300 focus:outline-none w-full md:w-48 cursor-pointer hover:border-slate-700 transition-colors"
                    >
                        <option value="All">All Categories</option>
                        {categories.map(cat => (
                            <option key={cat._id} value={cat.name}>{cat.name}</option>
                        ))}
                    </select>
                    <select
                        value={filters.status || 'All'}
                        onChange={(e) => dispatch(setFilters({ status: e.target.value, page: 1 }))}
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
                                            checked={selectedItems.length === inventory.length && inventory.length > 0}
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
                            {inventory.map((item, index) => (
                                <motion.tr
                                    key={item._id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: index * 0.03 }}
                                    className={clsx(
                                        "hover:bg-slate-800/30 transition-all group",
                                        selectedItems.includes(item._id) && "bg-purple-500/5"
                                    )}
                                >
                                    <td className="px-6 py-5">
                                        <div className="flex items-center justify-center">
                                            <input
                                                type="checkbox"
                                                checked={selectedItems.includes(item._id)}
                                                onChange={() => toggleSelectItem(item._id)}
                                                className="w-4 h-4 rounded border-slate-700 bg-slate-900 accent-purple-500 cursor-pointer"
                                            />
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-linear-to-br from-slate-700/50 to-slate-800/50 rounded-xl flex items-center justify-center border border-slate-700/50 group-hover:scale-105 transition-transform shrink-0 overflow-hidden">
                                                {item.productImage ? (
                                                    <img
                                                        src={item.productImage.startsWith('http') ? item.productImage : `${serverUrl}/${item.productImage.replace('\\', '/')}`}
                                                        alt={item.productName}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <Package className="w-5 h-5 text-slate-400 group-hover:text-purple-400 transition-colors" />
                                                )}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-white font-bold text-sm tracking-tight truncate">{item.productName}</p>
                                                <p className="text-slate-500 text-[10px] mt-0.5 font-bold uppercase tracking-wider">InvenPro Global</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 font-mono text-[10px] text-slate-500 font-bold">{item.skuId}</td>
                                    <td className="px-6 py-5">
                                        <span className="text-[11px] font-bold text-slate-400 bg-slate-800/50 px-2 py-1 rounded-md border border-slate-700/50 leading-none">
                                            {typeof item.category === 'string' ? item.category : 'General'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-sm text-white font-bold tabular-nums">{item.initialQty}</td>
                                    <td className="px-6 py-5 text-sm text-white font-bold tabular-nums">${item.basePrice?.toLocaleString()}</td>
                                    <td className="px-6 py-5">{getStatusBadge(item.status)}</td>
                                    <td className="px-6 py-5 text-right">
                                        <div className="flex items-center justify-end gap-1.5">
                                            <button
                                                onClick={() => {
                                                    setAdjustProduct(item);
                                                    setShowAdjustModal(true);
                                                }}
                                                className="p-2 text-slate-400 hover:text-purple-400 hover:bg-purple-400/10 rounded-lg transition-all"
                                                title="Adjust Stock"
                                            >
                                                <Settings className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleEdit(item)}
                                                className="p-2 text-slate-400 hover:text-cyan-400 hover:bg-cyan-400/10 rounded-lg transition-all"
                                                title="Edit Product"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            {canDelete && (
                                                <button
                                                    onClick={() => handleDelete(item._id)}
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
                    <p className="text-xs text-slate-500 font-medium tracking-tight">
                        Showing Page <span className="text-slate-300 font-bold">{inventoryStats.page}</span> of <span className="text-slate-300 font-bold">{inventoryStats.pages}</span> (Total <span className="text-slate-300 font-bold">{inventoryStats.total}</span> products)
                    </p>
                    <div className="flex gap-2">
                        <button
                            onClick={() => handlePageChange(inventoryStats.page - 1)}
                            disabled={inventoryStats.page <= 1}
                            className={clsx(
                                "px-4 py-1.5 rounded-lg border text-[11px] font-bold transition-all",
                                inventoryStats.page <= 1
                                    ? "bg-slate-900/50 border-slate-800 text-slate-600 cursor-not-allowed"
                                    : "bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white"
                            )}
                        >
                            Previous
                        </button>
                        <button
                            onClick={() => handlePageChange(inventoryStats.page + 1)}
                            disabled={inventoryStats.page >= inventoryStats.pages}
                            className={clsx(
                                "px-4 py-1.5 rounded-lg border text-[11px] font-bold transition-all",
                                inventoryStats.page >= inventoryStats.pages
                                    ? "bg-slate-900/50 border-slate-800 text-slate-600 cursor-not-allowed"
                                    : "bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white"
                            )}
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {showAdjustModal && (
                    <AdjustStockModal
                        isOpen={showAdjustModal}
                        onClose={() => setShowAdjustModal(false)}
                        product={adjustProduct}
                    />
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default ProductsList;
