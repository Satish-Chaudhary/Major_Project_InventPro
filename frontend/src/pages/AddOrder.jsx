import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus, X, Check, Search, Trash2, Calendar,
    ChevronRight, ArrowRightLeft, Package, User, Warehouse, DollarSign
} from 'lucide-react';
import { clsx } from 'clsx';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const AddOrder = ({ isOpen = true }) => {
    const navigate = useNavigate();
    const { addOrder } = useApp();
    const onClose = () => navigate('/orders');

    const [items, setItems] = useState([
        { id: 1, name: 'Mechanical Keyboard - K95', sku: 'KEY-092', quantity: 5, price: 120.00, total: 600.00 },
        { id: 2, name: 'Wireless Mouse - LogiTech M150', sku: 'MSF-881', quantity: 10, price: 25.00, total: 250.00 }
    ]);

    const [formData, setFormData] = useState({
        orderType: 'Purchase (Inward)',
        supplier: '',
        date: '2023-10-25',
        referenceNumber: '',
        warehouse: 'Main Warehouse - New York'
    });

    const calculateGrandTotal = () => {
        return items.reduce((sum, item) => sum + item.total, 0).toFixed(2);
    };

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
                initial={{ opacity: 0, scale: 0.98, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, y: 10 }}
                className="relative w-full max-w-6xl bg-[#0a0a0a] border border-slate-800 rounded-3xl shadow-2xl overflow-hidden max-h-[95vh] flex flex-col"
            >
                {/* Header */}
                <div className="px-8 py-6 border-b border-slate-800 flex items-center justify-between bg-linear-to-r from-purple-500/5 to-cyan-500/5">
                    <div>
                        <h2 className="text-2xl font-bold text-white tracking-tight">Create New Order</h2>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={onClose}
                            className="px-6 py-2.5 rounded-xl border border-slate-700 text-slate-300 font-bold hover:bg-slate-800 transition-all text-xs uppercase tracking-widest"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => {
                                addOrder({
                                    id: '#ORD-' + Math.floor(Math.random() * 10000),
                                    date: formData.date || 'Oct 25, 2023',
                                    time: '10:00 AM',
                                    type: formData.orderType.toLowerCase().includes('purchase') ? 'inward' : 'outward',
                                    entity: formData.supplier || 'General Entity',
                                    items: items.length + ' items',
                                    value: '$' + calculateGrandTotal(),
                                    status: 'processing'
                                });
                                onClose();
                            }}
                            className="px-6 py-2.5 rounded-xl bg-linear-to-r from-purple-600 to-cyan-600 text-white font-bold hover:brightness-110 shadow-lg shadow-purple-500/20 flex items-center gap-2 transition-all text-xs uppercase tracking-widest"
                        >
                            <Check className="w-4 h-4" />
                            Create Order
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar space-y-8">
                    {/* Order Details Section */}
                    <section className="bg-slate-900/40 border border-slate-800/60 rounded-4xl p-8 space-y-8">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-1.5 h-5 bg-purple-500 rounded-full" />
                            <h3 className="text-lg font-bold text-white tracking-tight">Order Details</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2 group">
                                <label className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] ml-1">Order Type</label>
                                <div className="relative">
                                    <ArrowRightLeft className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                                    <select
                                        className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-12 pr-5 py-4 text-white text-sm focus:outline-none focus:border-purple-500/50 appearance-none cursor-pointer"
                                        value={formData.orderType}
                                        onChange={(e) => setFormData({ ...formData, orderType: e.target.value })}
                                    >
                                        <option>Purchase (Inward)</option>
                                        <option>Sale (Outward)</option>
                                        <option>Transfer</option>
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-2 group">
                                <label className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] ml-1">Supplier / Customer</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                                    <select
                                        className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-12 pr-5 py-4 text-white text-sm focus:outline-none focus:border-purple-500/50 appearance-none cursor-pointer"
                                    >
                                        <option value="">Select Entity...</option>
                                        <option>Acme Corporation</option>
                                        <option>Global Logistics Ltd</option>
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-2 group">
                                <label className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] ml-1">Date</label>
                                <div className="relative">
                                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                                    <input
                                        type="date"
                                        value={formData.date}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-12 pr-5 py-4 text-white text-sm focus:outline-none focus:border-purple-500/50"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2 group md:col-span-2">
                                <label className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] ml-1">Reference Number (Optional)</label>
                                <input
                                    type="text"
                                    placeholder="e.g. PO-2023-001"
                                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-white text-sm focus:outline-none focus:border-purple-500/50"
                                />
                            </div>
                            <div className="space-y-2 group">
                                <label className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] ml-1">Warehouse</label>
                                <div className="relative">
                                    <Warehouse className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                                    <select
                                        className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-12 pr-5 py-4 text-white text-sm focus:outline-none focus:border-purple-500/50 appearance-none cursor-pointer"
                                        value={formData.warehouse}
                                    >
                                        <option>Main Warehouse - New York</option>
                                        <option>West Coast Distribution</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Order Items Section */}
                    <section className="bg-slate-900/40 border border-slate-800/60 rounded-4xl p-8 space-y-6">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-1.5 h-5 bg-cyan-500 rounded-full" />
                            <h3 className="text-lg font-bold text-white tracking-tight">Order Items</h3>
                        </div>

                        {/* Add Item Row */}
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end bg-slate-950/50 border border-slate-800 p-6 rounded-2xl">
                            <div className="md:col-span-4 space-y-2">
                                <label className="text-slate-500 text-[10px] font-bold uppercase tracking-widest ml-1">Product</label>
                                <div className="relative">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                                    <select className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-12 pr-5 py-3 text-white text-sm focus:outline-none focus:border-cyan-500/50 appearance-none cursor-pointer">
                                        <option>Search product...</option>
                                        <option>Mechanical Keyboard - K95</option>
                                        <option>Wireless Mouse - LogiTech M150</option>
                                    </select>
                                </div>
                            </div>
                            <div className="md:col-span-2 space-y-2">
                                <label className="text-slate-500 text-[10px] font-bold uppercase tracking-widest ml-1">Quantity</label>
                                <input type="number" placeholder="1" className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-cyan-500/50" />
                            </div>
                            <div className="md:col-span-2 space-y-2">
                                <label className="text-slate-500 text-[10px] font-bold uppercase tracking-widest ml-1">Unit Price</label>
                                <input type="number" placeholder="0.00" className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-cyan-500/50 tabular-nums" />
                            </div>
                            <div className="md:col-span-2 space-y-2">
                                <label className="text-slate-500 text-[10px] font-bold uppercase tracking-widest ml-1">Total</label>
                                <input type="text" value="0.00" disabled className="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-4 py-3 text-slate-500 text-sm cursor-not-allowed tabular-nums" />
                            </div>
                            <div className="md:col-span-2">
                                <button className="w-full bg-linear-to-r from-cyan-600 to-blue-600 text-white font-bold py-3 rounded-xl hover:brightness-110 shadow-lg shadow-cyan-500/10 transition-all text-xs uppercase tracking-widest flex items-center justify-center gap-2">
                                    <Plus className="w-4 h-4" />
                                    Add
                                </button>
                            </div>
                        </div>

                        {/* Items Table */}
                        <div className="border border-slate-800 rounded-2xl overflow-hidden">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-slate-800/30 text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em] border-b border-slate-800">
                                        <th className="px-6 py-4">Product Details</th>
                                        <th className="px-6 py-4">SKU</th>
                                        <th className="px-6 py-4">Quantity</th>
                                        <th className="px-6 py-4 text-right">Unit Price</th>
                                        <th className="px-6 py-4 text-right">Total</th>
                                        <th className="px-6 py-4 text-center w-20"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800/50">
                                    {items.map((item) => (
                                        <tr key={item.id} className="hover:bg-slate-800/20 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center border border-slate-700">
                                                        <Package className="w-4 h-4 text-slate-500" />
                                                    </div>
                                                    <div>
                                                        <p className="text-white text-sm font-bold">{item.name}</p>
                                                        <p className="text-slate-500 text-[11px]">Electronics &gt; Peripherals</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-slate-400 text-xs font-mono">{item.sku}</td>
                                            <td className="px-6 py-4 text-white text-sm font-medium">{item.quantity}</td>
                                            <td className="px-6 py-4 text-white text-sm text-right tabular-nums">${item.price.toFixed(2)}</td>
                                            <td className="px-6 py-4 text-white text-sm text-right font-bold tabular-nums">${item.total.toFixed(2)}</td>
                                            <td className="px-6 py-4 text-center">
                                                <button className="p-2 text-slate-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr className="bg-slate-800/10 border-t border-slate-800">
                                        <td colSpan="4" className="px-6 py-4 text-right text-slate-400 text-xs font-bold uppercase tracking-widest">Grand Total</td>
                                        <td className="px-6 py-4 text-right text-xl font-black text-white bg-linear-to-r from-transparent to-purple-500/5 tabular-nums">
                                            <span className="text-purple-500 mr-2">$</span>
                                            {calculateGrandTotal()}
                                        </td>
                                        <td></td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </section>
                </div>
            </motion.div>
        </div>
    );
};

export default AddOrder;
