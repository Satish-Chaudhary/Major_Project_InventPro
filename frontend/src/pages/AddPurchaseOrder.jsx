import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
    X, Check, Plus, Trash2, 
    Truck, Calendar, DollarSign, 
    Hash, Info, Package
} from 'lucide-react';
import { clsx } from 'clsx';
import { useNavigate } from 'react-router-dom';
import { useGetVendorsQuery, useCreatePurchaseOrderMutation } from '../redux/slices/vendorSlice';
import { useGetProductsQuery } from '../redux/slices/productSlice';
import { toast } from 'react-hot-toast';

const AddPurchaseOrder = () => {
    const navigate = useNavigate();
    const { data: vendorsData } = useGetVendorsQuery();
    const { data: productsData } = useGetProductsQuery();
    const [createPurchaseOrder] = useCreatePurchaseOrderMutation();

    const suppliers = vendorsData?.suppliers || [];
    const inventory = productsData?.products || [];

    const [formData, setFormData] = useState({
        poNumber: `PO-${Date.now().toString().slice(-6)}`,
        supplier: '',
        expectedDate: '',
        notes: '',
        items: []
    });

    const addItem = () => {
        setFormData({
            ...formData,
            items: [...formData.items, { product: '', quantity: 1, unitPrice: 0 }]
        });
    };

    const removeItem = (idx) => {
        setFormData({
            ...formData,
            items: formData.items.filter((_, i) => i !== idx)
        });
    };

    const updateItem = (idx, field, value) => {
        const newItems = [...formData.items];
        newItems[idx][field] = value;
        
        // Auto-fetch price if product selected
        if (field === 'product') {
            const product = inventory.find(p => p._id === value);
            if (product) newItems[idx].unitPrice = product.costPrice || 0;
        }
        
        setFormData({ ...formData, items: newItems });
    };

    const totalAmount = formData.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);

    const handleSave = async () => {
        if (!formData.supplier || formData.items.length === 0) {
            toast.error("Please fill in all required fields and add at least one item.");
            return;
        }

        try {
            await createPurchaseOrder({
                ...formData,
                totalAmount
            }).unwrap();

            toast.success("Purchase Order created successfully!");
            navigate('/purchase-orders');
        } catch (error) {
            toast.error(error.data?.message || "Failed to create PO");
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="absolute inset-0 bg-[#050505]/80 backdrop-blur-md"
                onClick={() => navigate('/purchase-orders')}
            />
            
            <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="relative w-full max-w-6xl bg-[#0a0a0a] border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
                <div className="px-8 py-6 border-b border-slate-800 flex items-center justify-between bg-linear-to-r from-purple-500/5 to-cyan-500/5">
                    <div>
                        <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
                            <Truck className="w-6 h-6 text-purple-400" />
                            Draft Purchase Order
                        </h2>
                    </div>
                    <div className="flex items-center gap-3">
                        <button onClick={() => navigate('/purchase-orders')} className="px-6 py-2.5 rounded-xl border border-slate-700 text-slate-300 font-bold hover:bg-slate-800 transition-all text-[10px] uppercase tracking-widest">
                            Dismiss
                        </button>
                        <button onClick={handleSave} className="px-8 py-2.5 rounded-xl bg-linear-to-r from-purple-600 to-cyan-600 text-white font-black hover:brightness-110 shadow-lg shadow-purple-500/20 flex items-center gap-2 transition-all text-[10px] uppercase tracking-widest leading-none">
                            <Check className="w-4 h-4" />
                            Finalize PO
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                        <div className="lg:col-span-2 space-y-8">
                            <section className="bg-slate-900/30 border border-slate-800/50 rounded-4xl p-8 space-y-6">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-black text-white tracking-tight">Order Line Items</h3>
                                    <button onClick={addItem} className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors font-bold text-xs uppercase tracking-widest">
                                        <Plus className="w-4 h-4" />
                                        Add SKU
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    {formData.items.map((item, idx) => (
                                        <div key={idx} className="grid grid-cols-12 gap-4 items-end bg-slate-950/50 p-4 rounded-2xl border border-slate-800/50">
                                            <div className="col-span-12 md:col-span-5 space-y-2">
                                                <label className="text-slate-500 text-[10px] font-black uppercase tracking-widest ml-1">Product SKU</label>
                                                <select 
                                                    value={item.product}
                                                    onChange={(e) => updateItem(idx, 'product', e.target.value)}
                                                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-purple-500/50"
                                                >
                                                    <option value="">Select Product</option>
                                                    {inventory.map(p => (
                                                        <option key={p._id} value={p._id}>{p.productName} ({p.sku})</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="col-span-6 md:col-span-2 space-y-2">
                                                <label className="text-slate-500 text-[10px] font-black uppercase tracking-widest ml-1">Qty</label>
                                                <input 
                                                    type="number"
                                                    value={item.quantity}
                                                    onChange={(e) => updateItem(idx, 'quantity', parseInt(e.target.value))}
                                                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-purple-500/50"
                                                />
                                            </div>
                                            <div className="col-span-6 md:col-span-3 space-y-2 relative">
                                                <label className="text-slate-500 text-[10px] font-black uppercase tracking-widest ml-1">Unit Cost</label>
                                                <div className="relative">
                                                     <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
                                                     <input 
                                                        type="number"
                                                        value={item.unitPrice}
                                                        onChange={(e) => updateItem(idx, 'unitPrice', parseFloat(e.target.value))}
                                                        className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-white text-sm focus:outline-none focus:border-purple-500/50"
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-span-12 md:col-span-2 flex justify-end">
                                                <button onClick={() => removeItem(idx)} className="p-3 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all">
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    {formData.items.length === 0 && (
                                        <div className="text-center py-20 border-2 border-dashed border-slate-800 rounded-3xl">
                                             <Package className="w-12 h-12 text-slate-800 mx-auto mb-4" />
                                             <p className="text-slate-600 text-sm font-medium">No items added to this PO yet.</p>
                                        </div>
                                    )}
                                </div>
                            </section>

                            <section className="bg-slate-900/30 border border-slate-800/50 rounded-4xl p-8 space-y-4">
                                <h3 className="text-lg font-black text-white tracking-tight">Additional Notes</h3>
                                <textarea 
                                    rows="4" 
                                    value={formData.notes}
                                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                                    placeholder="Enter instructions for the vendor or internal comments..."
                                    className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-5 py-4 text-white text-sm focus:outline-none focus:border-purple-500/50"
                                />
                            </section>
                        </div>

                        <div className="space-y-8">
                            <section className="bg-slate-900/30 border border-slate-800/50 rounded-4xl p-8 space-y-6">
                                <h3 className="text-lg font-black text-white tracking-tight">PO Context</h3>
                                
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-slate-500 text-[10px] font-black uppercase tracking-widest ml-1">Reference Number</label>
                                        <div className="relative">
                                            <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                            <input 
                                                value={formData.poNumber}
                                                onChange={(e) => setFormData({...formData, poNumber: e.target.value})}
                                                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-12 pr-4 py-3 text-white text-sm focus:outline-none" 
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-slate-500 text-[10px] font-black uppercase tracking-widest ml-1">Vendor/Supplier</label>
                                        <select 
                                            value={formData.supplier}
                                            onChange={(e) => setFormData({...formData, supplier: e.target.value})}
                                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none border-l-4 border-l-purple-500"
                                        >
                                            <option value="">Select Supplier</option>
                                            {suppliers.map(s => (
                                                <option key={s._id} value={s._id}>{s.company}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-slate-500 text-[10px] font-black uppercase tracking-widest ml-1">Expected Delivery</label>
                                        <div className="relative">
                                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                            <input 
                                                type="date"
                                                value={formData.expectedDate}
                                                onChange={(e) => setFormData({...formData, expectedDate: e.target.value})}
                                                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-12 pr-4 py-3 text-white text-sm focus:outline-none" 
                                            />
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section className="bg-linear-to-br from-purple-600/20 to-cyan-600/20 border border-purple-500/20 rounded-4xl p-8 space-y-6 shadow-xl">
                                <h3 className="text-lg font-black text-white tracking-tight">Summary</h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between text-slate-400 text-xs font-bold uppercase">
                                        <span>Subtotal</span>
                                        <span className="text-white font-black font-mono">${totalAmount.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-slate-400 text-xs font-bold uppercase">
                                        <span>Shipping/Tax</span>
                                        <span className="text-white font-black font-mono">$0.00</span>
                                    </div>
                                    <div className="pt-4 border-t border-slate-800 flex justify-between items-end">
                                        <span className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">Grand Total</span>
                                        <span className="text-3xl font-black text-white tabular-nums font-mono">${totalAmount.toLocaleString()}</span>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default AddPurchaseOrder;
