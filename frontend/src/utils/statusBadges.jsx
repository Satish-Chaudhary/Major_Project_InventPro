import { clsx } from 'clsx';
import React from 'react';

export const getStatusBadge = (status) => {
    if (!status) return null;
    const badges = {
        'in-stock': { bg: 'bg-emerald-500/10', text: 'text-emerald-400', label: 'In Stock' },
        'low-stock': { bg: 'bg-amber-500/10', text: 'text-amber-400', label: 'Low Stock' },
        'out-of-stock': { bg: 'bg-red-500/10', text: 'text-red-400', label: 'Out of Stock' },
        'in stock': { bg: 'bg-emerald-500/10', text: 'text-emerald-400', label: 'In Stock' },
        'low stock': { bg: 'bg-amber-500/10', text: 'text-amber-400', label: 'Low Stock' },
        'out of stock': { bg: 'bg-red-500/10', text: 'text-red-400', label: 'Out of Stock' },
        'active': { bg: 'bg-emerald-500/10', text: 'text-emerald-400', label: 'Active' },
        'inactive': { bg: 'bg-slate-500/10', text: 'text-slate-400', label: 'Inactive' },
        'pending': { bg: 'bg-amber-500/10', text: 'text-amber-400', label: 'Pending' },
        'offline': { bg: 'bg-slate-500/10', text: 'text-slate-400', label: 'Offline' },
        'delivered': { bg: 'bg-emerald-500/10', text: 'text-emerald-400', label: 'Delivered' },
        'cancelled': { bg: 'bg-red-500/10', text: 'text-red-400', label: 'Cancelled' },
    };
    const normalized = status.toLowerCase();
    const badge = badges[normalized] || { bg: 'bg-slate-500/10', text: 'text-slate-400', label: status };
    
    return (
        <span className={clsx(
            'px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border border-transparent',
            badge.bg,
            badge.text,
            (normalized === 'low-stock' || normalized === 'low stock') ? 'border-amber-500/20' : (normalized === 'out-of-stock' || normalized === 'out of stock') ? 'border-red-500/20' : 'border-emerald-500/20'
        )}>
            {badge.label}
        </span>
    );
};
