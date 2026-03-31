import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Settings, X, Check, AlertTriangle, ArrowUp, ArrowDown, Package, TrendingUp, TrendingDown } from 'lucide-react';
import { clsx } from 'clsx';
import { toast } from 'react-hot-toast';

import { useUpdateStockMutation } from '../redux/slices/productSlice';

const AdjustStockModal = ({ isOpen, onClose, product }) => {
    const [updateStock, { isLoading }] = useUpdateStockMutation();
    const [formData, setFormData] = useState({
        quantity: '',
        type: 'addition',
        reason: 'Restocking'
    });

    if (!isOpen || !product) return null;

    const currentQty = product.initialQty || 0;
    const qty = parseInt(formData.quantity, 10) || 0;
    const adjustment = formData.type === 'addition' ? qty : -qty;
    const resultQty = currentQty + adjustment;

    // Validation
    const validationError = useMemo(() => {
        if (!formData.quantity) return null;
        if (qty <= 0) return 'Quantity must be greater than 0';
        if (qty > 999999) return 'Quantity exceeds maximum allowed (999,999)';
        if (formData.type === 'subtraction' && qty > currentQty) {
            return `Cannot subtract ${qty} — only ${currentQty} in stock`;
        }
        return null;
    }, [formData.quantity, formData.type, qty, currentQty]);

    const handleQtyChange = (e) => {
        // Only allow whole positive numbers
        const val = e.target.value.replace(/[^0-9]/g, '');
        setFormData({ ...formData, quantity: val });
    };

    const handleSubmit = async () => {
        if (!formData.quantity || qty <= 0) {
            toast.error('Please enter a valid quantity greater than 0');
            return;
        }
        if (validationError) {
            toast.error(validationError);
            return;
        }

        try {
            const result = await updateStock({
                id: product._id,
                adjustment,
                reason: formData.reason
            }).unwrap();

            if (result.success) {
                toast.success(`Stock updated: ${currentQty} → ${resultQty} units`);
                onClose();
            }
        } catch (error) {
            toast.error(error.data?.message || 'Adjustment failed');
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

                <div className="p-6 space-y-5">
                    {/* Product Info + Live Preview */}
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center gap-4">
                        <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center border border-slate-700">
                            <Package className="w-6 h-6 text-slate-500" />
                        </div>
                        <div className="flex-1">
                            <p className="text-white font-bold text-sm tracking-tight">{product.productName}</p>
                            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Current: {currentQty} Units</p>
                        </div>
                        {qty > 0 && !validationError && (
                            <div className={clsx(
                                "text-right shrink-0",
                                formData.type === 'addition' ? 'text-emerald-400' : 'text-rose-400'
                            )}>
                                <div className="flex items-center gap-1 justify-end">
                                    {formData.type === 'addition'
                                        ? <TrendingUp className="w-3.5 h-3.5" />
                                        : <TrendingDown className="w-3.5 h-3.5" />
                                    }
                                    <span className="text-lg font-black">{resultQty}</span>
                                </div>
                                <p className="text-[9px] font-bold uppercase tracking-widest opacity-70">After Adjust</p>
                            </div>
                        )}
                    </div>

                    {/* Type Toggle */}
                    <div className="grid grid-cols-2 gap-2">
                        {[
                            { id: 'addition', label: 'Add Stock', icon: <ArrowUp className="w-4 h-4" />, colorOn: 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400' },
                            { id: 'subtraction', label: 'Remove Stock', icon: <ArrowDown className="w-4 h-4" />, colorOn: 'bg-rose-500/10 border-rose-500/50 text-rose-400' }
                        ].map((type) => (
                            <button
                                key={type.id}
                                onClick={() => setFormData({ ...formData, type: type.id })}
                                className={clsx(
                                    "flex items-center justify-center gap-2 py-3 rounded-xl border text-xs font-black uppercase tracking-widest transition-all",
                                    formData.type === type.id
                                        ? type.colorOn
                                        : "bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-700"
                                )}
                            >
                                {type.icon}
                                {type.label}
                            </button>
                        ))}
                    </div>

                    {/* Quantity Input */}
                    <div>
                        <label className="block text-slate-500 text-[10px] font-black uppercase tracking-widest mb-2">
                            Adjustment Quantity
                        </label>
                        <input
                            type="text"
                            inputMode="numeric"
                            value={formData.quantity}
                            onChange={handleQtyChange}
                            className={clsx(
                                "w-full bg-slate-950 border rounded-xl px-4 py-3 text-white focus:outline-none transition-all tabular-nums font-bold text-lg",
                                validationError && formData.quantity
                                    ? "border-rose-500/50 focus:border-rose-500"
                                    : "border-slate-800 focus:border-purple-500"
                            )}
                            placeholder="0"
                            maxLength={7}
                        />
                        {validationError && formData.quantity ? (
                            <p className="mt-1.5 text-rose-400 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
                                <AlertTriangle className="w-3 h-3" /> {validationError}
                            </p>
                        ) : null}
                    </div>

                    {/* Reason */}
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
                            <option>Customer Return</option>
                            <option>Correction</option>
                            <option>Other</option>
                        </select>
                    </div>

                    {/* Warning */}
                    <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4 flex gap-3">
                        <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                        <p className="text-[10px] text-amber-500/80 font-bold leading-relaxed uppercase tracking-wider">
                            Warning: Stock adjustments are permanent and recorded in the audit trail for compliance.
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
                        disabled={isLoading || !!validationError || !formData.quantity}
                        className="flex-1 py-3 rounded-xl bg-linear-to-r from-purple-600 to-cyan-600 text-white text-xs font-black uppercase tracking-widest hover:brightness-110 shadow-lg shadow-purple-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                        ) : (
                            <Check className="w-4 h-4" />
                        )}
                        Apply Adjustment
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default AdjustStockModal;
