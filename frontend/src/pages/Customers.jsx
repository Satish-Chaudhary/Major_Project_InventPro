import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Users, Search, Plus, Filter, 
    MoreVertical, Mail, Phone, MapPin, 
    TrendingUp, CreditCard, ChevronRight,
    Trash2, Edit2, ExternalLink
} from 'lucide-react';
import { clsx } from 'clsx';
import { useNavigate } from 'react-router-dom';
import { useGetCustomersQuery, useDeleteCustomerMutation } from '../redux/slices/customerSlice';
import { toast } from 'react-hot-toast';

const Customers = () => {
    const navigate = useNavigate();
    const { data, isLoading } = useGetCustomersQuery();
    const [deleteCustomer] = useDeleteCustomerMutation();
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState('All');

    const customers = data?.customers || [];

    const filteredCustomers = useMemo(() => {
        return customers.filter(c => {
            const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                 c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                 c.customerNumber?.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesType = filterType === 'All' || c.customerType === filterType.toLowerCase();
            return matchesSearch && matchesType;
        });
    }, [customers, searchQuery, filterType]);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this customer?')) {
            try {
                await deleteCustomer(id).unwrap();
                toast.success('Customer removed successfully');
            } catch (err) {
                toast.error(err.data?.message || 'Failed to delete customer');
            }
        }
    };

    if (isLoading) return <div className="p-8 text-white animate-pulse">Loading Customer Intelligence...</div>;

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 space-y-8"
        >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Customer Registry</h1>
                    <p className="text-slate-400 mt-1">Manage your business relationships and credit profiles</p>
                </div>
                <button 
                    onClick={() => navigate('/add-customer')}
                    className="flex items-center gap-2 bg-linear-to-r from-purple-600 to-cyan-600 text-white px-6 py-3 rounded-2xl font-bold hover:brightness-110 transition-all shadow-xl shadow-purple-500/20 active:scale-95"
                >
                    <Plus className="w-5 h-5" />
                    Add Customer
                </button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Total Customers', value: customers.length, icon: Users, color: 'text-purple-400', bg: 'bg-purple-400/10' },
                    { label: 'Business Accounts', value: customers.filter(c => c.customerType === 'business').length, icon: TrendingUp, color: 'text-cyan-400', bg: 'bg-cyan-400/10' },
                    { label: 'Outstanding Balance', value: `$${customers.reduce((acc, c) => acc + (c.currentBalance || 0), 0).toLocaleString()}`, icon: CreditCard, color: 'text-emerald-400', bg: 'bg-emerald-400/10' }
                ].map((stat, i) => (
                    <motion.div 
                        key={i}
                        whileHover={{ y: -5 }}
                        className="bg-slate-900/40 border border-slate-800 p-6 rounded-3xl backdrop-blur-xl"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">{stat.label}</p>
                                <h3 className="text-2xl font-black text-white mt-2">{stat.value}</h3>
                            </div>
                            <div className={clsx("p-3 rounded-2xl", stat.bg)}>
                                <stat.icon className={clsx("w-6 h-6", stat.color)} />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Filters */}
            <div className="bg-slate-900/20 border border-slate-800 p-4 rounded-3xl flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <input 
                        type="text"
                        placeholder="Search by name, email or ID..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-slate-900/40 border border-slate-800 rounded-2xl py-3 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all placeholder:text-slate-600"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Filter className="w-5 h-5 text-slate-500" />
                    <select 
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="bg-slate-900/40 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none"
                    >
                        <option value="All">All Types</option>
                        <option value="individual">Individual</option>
                        <option value="business">Business</option>
                    </select>
                </div>
            </div>

            {/* Customers Table */}
            <div className="bg-slate-900/40 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-xl">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-slate-800/20 text-slate-500 font-bold text-[10px] uppercase tracking-[0.2em] border-b border-slate-800">
                            <th className="px-8 py-5">Customer</th>
                            <th className="px-8 py-5">Contact Info</th>
                            <th className="px-8 py-5">Type</th>
                            <th className="px-8 py-5">Balance</th>
                            <th className="px-8 py-5 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                        <AnimatePresence>
                            {filteredCustomers.map((customer) => (
                                <motion.tr 
                                    key={customer._id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="hover:bg-slate-800/30 transition-colors group"
                                >
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-slate-800 to-slate-900 border border-slate-700 flex items-center justify-center group-hover:border-purple-500/50 transition-all">
                                                <Users className="w-6 h-6 text-slate-400 group-hover:text-purple-400 transition-colors" />
                                            </div>
                                            <div>
                                                <p className="text-white font-bold text-sm leading-tight">{customer.name}</p>
                                                <p className="text-slate-500 text-xs mt-1 uppercase tracking-tighter font-bold">{customer.customerNumber}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 text-xs text-slate-300">
                                                <Mail className="w-3 h-3 text-slate-500" />
                                                {customer.email}
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-slate-500">
                                                <Phone className="w-3 h-3" />
                                                {customer.phone}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={clsx(
                                            "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-inner",
                                            customer.customerType === 'business' 
                                                ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/20" 
                                                : "bg-purple-500/10 text-purple-400 border-purple-500/20"
                                        )}>
                                            {customer.customerType}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col">
                                            <span className={clsx(
                                                "font-black text-sm",
                                                (customer.currentBalance || 0) > 0 ? "text-amber-400" : "text-emerald-400"
                                            )}>
                                                ${(customer.currentBalance || 0).toLocaleString()}
                                            </span>
                                            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter mt-1">
                                                Spent: ${(customer.totalSpent || 0).toLocaleString()}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex items-center justify-end gap-3 transition-all">
                                            <button 
                                                onClick={() => navigate(`/customer/${customer._id}`)}
                                                className="p-2.5 bg-slate-800/50 text-slate-400 hover:text-cyan-400 hover:bg-cyan-400/10 rounded-xl transition-all border border-slate-700 hover:border-cyan-500/50 shadow-lg"
                                                title="View History & Performance"
                                            >
                                                <ExternalLink className="w-4 h-4" />
                                            </button>
                                            <button 
                                                onClick={() => navigate(`/edit-customer/${customer._id}`)}
                                                className="p-2.5 bg-slate-800/50 text-slate-400 hover:text-purple-400 hover:bg-purple-400/10 rounded-xl transition-all border border-slate-700 hover:border-purple-500/50 shadow-lg"
                                                title="Edit Client Profile"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(customer._id)}
                                                className="p-2.5 bg-slate-800/50 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all border border-slate-700 hover:border-red-500/50 shadow-lg"
                                                title="Purge Relationship"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </AnimatePresence>
                        {filteredCustomers.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-8 py-12 text-center text-slate-500 font-bold italic">
                                    No customer intel found matching your parameters.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </motion.div>
    );
};

export default Customers;
