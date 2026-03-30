import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, X, Check, AlertTriangle, ArrowUp, ArrowDown, Package } from 'lucide-react';
import { clsx } from 'clsx';
import { toast } from 'react-hot-toast';

import { useUpdateStockMutation } from '../redux/slices/productSlice';

const AdjustStockModal = ({ isOpen, onClose, product }) => {
    const [updateStock, { isLoading }] = useUpdateStockMutation();
    const [formData, setFormData] = useState({
        quantity: 0,
        type: 'addition', // addition or subtraction
        reason: 'Restocking'
    });

    if (!isOpen || !product) return null;

    const handleSubmit = async () => {
        if (formData.quantity <= 0) {
            toast.error("Please enter a valid quantity");
            return;
        }

        const adjustment = formData.type === 'addition' ? Number(formData.quantity) : -Number(formData.quantity);

        try {
            const result = await updateStock({
                id: product._id,
                adjustment,
                reason: formData.reason
            }).unwrap();

            if (result.success) {
                toast.success('Stock adjusted successfully');
                onClose();
            }
        } catch (error) {
            toast.error(error.data?.message || "Adjustment failed");
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden"
            >
                <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-800/20">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <Settings className="w-5 h-5 text-purple-400" />
                        Adjust Stock
                    </h3>
                    <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center gap-4">
                        <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center border border-slate-700">
                            <Package className="w-6 h-6 text-slate-500" />
                        </div>
                        <div>
                            <p className="text-white font-bold text-sm tracking-tight">{product.productName}</p>
                            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Current: {product.initialQty} Units</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-2">
                            {[
                                { id: 'addition', label: 'Addition', icon: <ArrowUp className="w-4 h-4" />, color: 'emerald' },
                                { id: 'subtraction', label: 'Subtraction', icon: <ArrowDown className="w-4 h-4" />, color: 'rose' }
                            ].map((type) => (
                                <button
                                    key={type.id}
                                    onClick={() => setFormData({ ...formData, type: type.id })}
                                    className={clsx(
                                        "flex items-center justify-center gap-2 py-3 rounded-xl border text-xs font-black uppercase tracking-widest transition-all",
                                        formData.type === type.id 
                                            ? `bg-${type.color}-500/10 border-${type.color}-500/50 text-${type.color}-400`
                                            : "bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-700"
                                    )}
                                >
                                    {type.icon}
                                    {type.label}
                                </button>
                            ))}
                        </div>

                        <div>
                            <label className="block text-slate-500 text-[10px] font-black uppercase tracking-widest mb-2">Adjustment Quantity</label>
                            <input
                                type="number"
                                value={formData.quantity}
                                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 tabular-nums font-bold"
                                placeholder="Enter amount..."
                            />
                        </div>

                        <div>
                            <label className="block text-slate-500 text-[10px] font-black uppercase tracking-widest mb-2">Reason</label>
                            <select
                                value={formData.reason}
                                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 appearance-none cursor-pointer text-sm"
                            >
                                <option>Restocking</option>
                                <option>Inventory Audit</option>
                                <option>Damaged Goods</option>
                                <option>Return to Vendor</option>
                                <option>Correction</option>
                                <option>Other</option>
                            </select>
                        </div>
                    </div>

                    <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4 flex gap-3">
                        <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
                        <p className="text-[10px] text-amber-500/80 font-bold leading-relaxed uppercase tracking-wider">
                            Warning: Stock adjustments are final and will be recorded in the audit logs for compliance tracking.
                        </p>
                    </div>
                </div>

                <div className="px-6 py-4 bg-slate-800/20 border-t border-slate-800 flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 py-3 rounded-xl border border-slate-700 text-slate-300 text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="flex-1 py-3 rounded-xl bg-linear-to-r from-purple-600 to-cyan-600 text-white text-xs font-black uppercase tracking-widest hover:brightness-110 shadow-lg shadow-purple-500/20 transition-all flex items-center justify-center gap-2"
                    >
                        {isLoading ? <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : <Check className="w-4 h-4" />}
                        Apply
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default AdjustStockModal;
