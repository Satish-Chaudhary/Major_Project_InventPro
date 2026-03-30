import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus, X, Check, Search, Trash2, Calendar,
    ChevronRight, ArrowRightLeft, Package, User, Warehouse, DollarSign
} from 'lucide-react';
import { clsx } from 'clsx';
import { useNavigate } from 'react-router-dom';
import { useGetProductsQuery } from '../redux/slices/productSlice';
import { useGetVendorsQuery } from '../redux/slices/vendorSlice';
import { useCreateOrderMutation } from '../redux/slices/orderSlice';
import { toast } from 'react-hot-toast';

const AddOrder = ({ isOpen = true }) => {
    const navigate = useNavigate();
    const { data: productsData } = useGetProductsQuery();
    const { data: vendorsData } = useGetVendorsQuery();
    const [createOrder, { isLoading: isCreating }] = useCreateOrderMutation();

    const inventory = productsData?.products || [];
    const suppliers = vendorsData?.vendors || [];
    const onClose = () => navigate('/orders');

    const [items, setItems] = useState([]);
    const [formData, setFormData] = useState({
        orderType: 'Purchase (Inward)',
        supplier: '',
        date: new Date().toISOString().split('T')[0],
        referenceNumber: '',
        warehouse: 'Main Warehouse - New York'
    });

    const [selectedProductId, setSelectedProductId] = useState('');
    const [itemQty, setItemQty] = useState(1);
    const [itemPrice, setItemPrice] = useState(0);

    const calculateGrandTotal = () => {
        return items.reduce((sum, item) => sum + item.total, 0).toFixed(2);
    };

    const handleAddItem = () => {
        if (!selectedProductId) return;
        const product = inventory.find(p => p._id === selectedProductId);
        if (!product) return;

        if (formData.orderType.toLowerCase().includes('outward')) {
            if (itemQty > product.initialQty) {
                toast.error(`Not enough stock. Available: ${product.initialQty}`);
                return;
            }
        }

        const existingItemIndex = items.findIndex(item => item.productId === product._id);

        if (existingItemIndex !== -1) {
            const newItems = [...items];
            const existingItem = newItems[existingItemIndex];
            const updatedQty = existingItem.quantity + Number(itemQty);
            const updatedPrice = Number(itemPrice);

            newItems[existingItemIndex] = {
                ...existingItem,
                quantity: updatedQty,
                price: updatedPrice,
                total: updatedQty * updatedPrice
            };
            setItems(newItems);
            toast.success(`Updated ${product.productName} quantity`);
        } else {
            const newItem = {
                id: Date.now(),
                productId: product._id,
                name: product.productName,
                sku: product.skuId || 'N/A',
                quantity: Number(itemQty),
                price: Number(itemPrice),
                total: Number(itemQty) * Number(itemPrice)
            };
            setItems([...items, newItem]);
            toast.success(`Added ${product.productName} to order`);
        }

        // Reset inputs
        setSelectedProductId('');
        setItemQty(1);
        setItemPrice(0);
    };

    const removeItem = (id) => {
        setItems(items.filter(item => item.id !== id));
    };

    const handleCreateOrder = async () => {
        if (items.length === 0) {
            toast.error("Please add at least one item to the order.");
            return;
        }

        const orderData = {
            orderId: formData.referenceNumber || '#ORD-' + Math.floor(Math.random() * 100000),
            date: formData.date,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            type: formData.orderType.toLowerCase().includes('purchase') ? 'inward' : 'outward',
            entity: formData.supplier || 'N/A',
            items: items.map(({ productId, name, quantity, price, total }) => ({
                productId, name, quantity, price, total
            })),
            itemSummary: `${items.length} item(s) - ${items.map(i => i.name).join(', ')}`,
            value: Number(calculateGrandTotal()),
            status: 'pending'
        };

        try {
            await createOrder(orderData).unwrap();
            toast.success('Order created successfully');
            onClose();
        } catch (error) {
            toast.error(error.data?.message || 'Failed to create order');
        }
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
                className="relative w-full max-w-7xl bg-[#0a0a0a] border border-slate-800 rounded-3xl shadow-2xl overflow-hidden max-h-[95vh] flex flex-col"
            >
                {/* Header */}
                <div className="px-8 py-6 border-b border-slate-800 flex items-center justify-between bg-linear-to-r from-purple-500/5 to-cyan-500/5">
                    <div>
                        <h2 className="text-2xl font-bold text-white tracking-tight">Create New Order</h2>
                        <p className="text-slate-500 text-xs font-medium uppercase tracking-widest">Order Customization</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={onClose}
                            className="px-6 py-2.5 rounded-xl border border-slate-700 text-slate-300 font-bold hover:bg-slate-800 transition-all text-xs uppercase tracking-widest"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleCreateOrder}
                            disabled={isCreating}
                            className="px-6 py-2.5 rounded-xl bg-linear-to-r from-purple-600 to-cyan-600 text-white font-bold hover:brightness-110 shadow-lg shadow-purple-500/20 flex items-center gap-2 transition-all text-xs uppercase tracking-widest disabled:opacity-50"
                        >
                            {isCreating ? <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : <Check className="w-4 h-4" />}
                            {isCreating ? 'Creating...' : 'Create Order'}
                        </button>
                    </div>
                </div>

                {/* Content - 2 Column Split */}
                <div className="flex-1 flex flex-col lg:flex-row overflow-hidden bg-slate-950/20">

                    {/* Left Column: Form Inputs */}
                    <div className="w-full lg:w-96 border-r border-slate-800/60 overflow-y-auto p-8 custom-scrollbar space-y-8">
                        <div className="space-y-6">
                            <div className="flex items-center gap-2">
                                <div className="w-1 h-4 bg-purple-500 rounded-full" />
                                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Order Details</h3>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-2 group">
                                    <label className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] ml-1">Order Type</label>
                                    <div className="relative">
                                        <ArrowRightLeft className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                                        <select
                                            className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-12 pr-5 py-3.5 text-white text-sm focus:outline-none focus:border-purple-500/50 appearance-none cursor-pointer"
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
                                            className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-12 pr-5 py-3.5 text-white text-sm focus:outline-none focus:border-purple-500/50 appearance-none cursor-pointer"
                                            value={formData.supplier}
                                            onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                                        >
                                            <option value="">Select Entity...</option>
                                            {suppliers.map(s => (
                                                <option key={s._id} value={s.company}>{s.company}</option>
                                            ))}
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
                                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                            className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-12 pr-5 py-3.5 text-white text-sm focus:outline-none focus:border-purple-500/50"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2 group">
                                    <label className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] ml-1">Reference Number</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. PO-2023-001"
                                        value={formData.referenceNumber}
                                        onChange={(e) => setFormData({ ...formData, referenceNumber: e.target.value })}
                                        className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-5 py-3.5 text-white text-sm focus:outline-none focus:border-purple-500/50"
                                    />
                                </div>

                                <div className="space-y-2 group">
                                    <label className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] ml-1">Warehouse</label>
                                    <div className="relative">
                                        <Warehouse className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                                        <select
                                            className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-12 pr-5 py-3.5 text-white text-sm focus:outline-none focus:border-purple-500/50 appearance-none cursor-pointer"
                                            value={formData.warehouse}
                                            onChange={(e) => setFormData({ ...formData, warehouse: e.target.value })}
                                        >
                                            <option>Main Warehouse - New York</option>
                                            <option>West Coast Distribution</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6 pt-6 border-t border-slate-800/60">
                            <div className="flex items-center gap-2">
                                <div className="w-1 h-4 bg-cyan-500 rounded-full" />
                                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Add Products</h3>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-2 group">
                                    <label className="text-slate-500 text-[10px] font-bold uppercase tracking-widest ml-1">Product</label>
                                    <div className="relative">
                                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                                        <select
                                            className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-12 pr-5 py-3 text-white text-sm focus:outline-none focus:border-cyan-500/50 appearance-none cursor-pointer"
                                            value={selectedProductId}
                                            onChange={(e) => {
                                                const prod = inventory.find(p => p._id === e.target.value);
                                                setSelectedProductId(e.target.value);
                                                if (prod) setItemPrice(prod.basePrice || 0);
                                            }}
                                        >
                                            <option value="">Search product...</option>
                                            {inventory.map(p => (
                                                <option key={p._id} value={p._id}>{p.productName} ({p.skuId || 'No SKU'})</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2 group">
                                        <label className="text-slate-500 text-[10px] font-bold uppercase tracking-widest ml-1">Quantity</label>
                                        <input
                                            type="number"
                                            placeholder="1"
                                            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-cyan-500/50"
                                            value={itemQty}
                                            onChange={(e) => setItemQty(e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2 group">
                                        <label className="text-slate-500 text-[10px] font-bold uppercase tracking-widest ml-1">Unit Price</label>
                                        <input
                                            type="number"
                                            placeholder="0.00"
                                            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-cyan-500/50 tabular-nums"
                                            value={itemPrice}
                                            onChange={(e) => setItemPrice(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleAddItem}
                                    className="w-full bg-linear-to-r from-cyan-600 to-blue-600 text-white font-bold py-3.5 rounded-2xl hover:brightness-110 shadow-lg shadow-cyan-500/10 transition-all text-xs uppercase tracking-widest flex items-center justify-center gap-2"
                                >
                                    <Plus className="w-4 h-4" />
                                    Add to Order
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Order Items & Summary */}
                    <div className="flex-1 overflow-y-auto p-8 custom-scrollbar space-y-8 bg-slate-900/5">
                        <section className="bg-slate-900/40 border border-slate-800/60 rounded-4xl p-8 space-y-6 shadow-2xl">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-5 bg-cyan-500 rounded-full" />
                                    <h3 className="text-lg font-bold text-white tracking-tight">Order Items</h3>
                                </div>
                                <div className="px-4 py-2 bg-slate-800/50 rounded-xl border border-slate-700/50 backdrop-blur-md">
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Grand Total</p>
                                    <p className="text-xl font-black text-white tabular-nums">${calculateGrandTotal()}</p>
                                </div>
                            </div>

                            <div className="border border-slate-800 rounded-3xl overflow-hidden bg-slate-950/20 backdrop-blur-md">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-slate-800/30 text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em] border-b border-slate-800">
                                            <th className="px-6 py-4">Product Details</th>
                                            <th className="px-6 py-4 text-center">Quantity</th>
                                            <th className="px-6 py-4 text-right">Unit Price</th>
                                            <th className="px-6 py-4 text-right">Total</th>
                                            <th className="px-6 py-4 text-center w-20"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-800/50">
                                        {items.length > 0 ? (
                                            items.map((item) => (
                                                <tr key={item.id} className="hover:bg-slate-800/20 transition-colors group">
                                                    <td className="px-6 py-5">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center border border-slate-700">
                                                                <Package className="w-5 h-5 text-slate-400" />
                                                            </div>
                                                            <div>
                                                                <p className="text-white text-sm font-bold">{item.name}</p>
                                                                <p className="text-slate-500 text-[10px] uppercase font-mono tracking-tighter">{item.sku}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-5 text-white text-sm font-medium text-center">{item.quantity}</td>
                                                    <td className="px-6 py-5 text-white text-sm text-right tabular-nums">${item.price.toFixed(2)}</td>
                                                    <td className="px-6 py-5 text-white text-sm text-right font-bold tabular-nums">${item.total.toFixed(2)}</td>
                                                    <td className="px-6 py-5 text-center">
                                                        <button
                                                            onClick={() => removeItem(item.id)}
                                                            className="p-2 text-slate-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="5" className="px-6 py-20 text-center">
                                                    <div className="flex flex-col items-center gap-4 opacity-30">
                                                        <div className="w-16 h-16 bg-slate-800 rounded-3xl flex items-center justify-center border-2 border-dashed border-slate-600">
                                                            <Package className="w-8 h-8 text-slate-500" />
                                                        </div>
                                                        <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.2em]">Add products to see the breakdown</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </section>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default AddOrder;
