import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    User, Mail, Phone, MapPin, Globe,
    Shield, Clock, Calendar, Lock, LogOut,
    TrendingUp, Package, CheckCircle2, AlertCircle,
    Camera, Edit3, X, Save
} from 'lucide-react';
import { clsx } from 'clsx';

const UserProfile = () => {
    const [isEditing, setIsEditing] = useState(false);

    const activities = [
        { id: 1, action: 'Updated stock for 12 products', time: 'Today at 09:18 • From Dashboard', type: 'inventory', icon: Package, color: 'text-purple-400' },
        { id: 2, action: 'Approved supplier "Northline Logistics"', time: 'Yesterday at 15:42 • From Suppliers', type: 'suppliers', icon: CheckCircle2, color: 'text-cyan-400' },
        { id: 3, action: 'Invited new user "operations@nexus.com"', time: 'Mar 02 at 11:06 • From User Management', type: 'users', icon: User, color: 'text-emerald-400' },
        { id: 4, action: 'Downloaded monthly stock report', time: 'Feb 28 at 17:21 • From Reports', type: 'reports', icon: TrendingUp, color: 'text-amber-400' },
    ];

    const adminInfo = {
        name: 'Alex Johnson',
        role: 'System Administrator',
        email: 'alex.johnson@example.com',
        phone: '+1 (555) 987-6543',
        location: 'New York, USA',
        status: 'Active',
        lastLogin: 'Today, 08:34',
        createdOn: 'Feb 12, 2024'
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.99 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-6 space-y-8"
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-500 text-[24px] font-bold uppercase tracking-widest">
                    User Profile
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 bg-slate-800 border border-slate-700 text-slate-300 px-5 py-2 rounded-xl hover:bg-slate-700 transition-all text-xs font-bold uppercase tracking-widest leading-none">
                        <Lock className="w-4 h-4" />
                        Reset password
                    </button>
                    <button
                        onClick={() => setIsEditing(!isEditing)}
                        className="flex items-center gap-2 bg-linear-to-r from-purple-600 to-cyan-600 text-white px-5 py-2 rounded-xl hover:brightness-110 transition-all text-xs font-bold uppercase tracking-widest leading-none shadow-lg shadow-purple-500/20"
                    >
                        {isEditing ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                        {isEditing ? 'Save Changes' : 'Save changes'}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Profile Sidebar */}
                <div className="lg:col-span-1 space-y-6">
                    <section className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8 flex flex-col items-center text-center relative overflow-hidden group">
                        <div className="absolute top-0 inset-x-0 h-24 bg-linear-to-br from-purple-500/10 to-cyan-500/10" />
                        <div className="relative mt-8">
                            <div className="w-32 h-32 rounded-full border-4 border-slate-950 bg-slate-800 p-1 relative shadow-2xl">
                                <img
                                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                                    alt="Profile"
                                    className="w-full h-full rounded-full object-cover"
                                />
                                <button className="absolute bottom-1 right-1 w-10 h-10 bg-slate-900 border border-slate-700 rounded-full flex items-center justify-center text-slate-400 hover:text-white transition-all shadow-xl group-hover:scale-110">
                                    <Camera className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        <div className="mt-6 space-y-1">
                            <h3 className="text-2xl font-bold text-white tracking-tight">{adminInfo.name}</h3>
                            <p className="text-purple-400 text-xs font-bold uppercase tracking-[0.2em]">{adminInfo.role}</p>
                        </div>

                        <div className="w-full mt-10 space-y-4 text-left border-t border-slate-800/50 pt-8">
                            {[
                                { label: 'Email', value: adminInfo.email, icon: Mail },
                                { label: 'Status', value: adminInfo.status, icon: CheckCircle2, status: true },
                                { label: 'Last Login', value: adminInfo.lastLogin, icon: Clock },
                                { label: 'Created On', value: adminInfo.createdOn, icon: Calendar },
                            ].map(item => (
                                <div key={item.label} className="flex flex-col gap-1">
                                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{item.label}</span>
                                    <div className="flex items-center gap-2 text-sm text-slate-300 font-semibold truncate">
                                        {item.status ? (
                                            <span className="flex items-center gap-1.5 text-emerald-400 text-xs">
                                                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                                                {item.value}
                                            </span>
                                        ) : (
                                            <span className="truncate">{item.value}</span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Profile Details Content */}
                <div className="lg:col-span-3 space-y-8 pb-10">
                    <section className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8 space-y-8">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-2 h-6 bg-purple-500 rounded-full" />
                            <h3 className="text-xl font-bold text-white tracking-tight">Personal Information</h3>
                        </div>

                        <div className="grid grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-slate-500 text-[10px] font-bold uppercase tracking-widest ml-1">First Name</label>
                                <input type="text" defaultValue="Alex" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3.5 text-white font-semibold focus:outline-none focus:border-purple-500/50" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-slate-500 text-[10px] font-bold uppercase tracking-widest ml-1">Last Name</label>
                                <input type="text" defaultValue="Johnson" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3.5 text-white font-semibold focus:outline-none focus:border-purple-500/50" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-slate-500 text-[10px] font-bold uppercase tracking-widest ml-1">Email Address</label>
                                <input type="email" defaultValue="alex.johnson@example.com" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3.5 text-white font-semibold focus:outline-none focus:border-purple-500/50" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-slate-500 text-[10px] font-bold uppercase tracking-widest ml-1">Phone Number</label>
                                <input type="text" defaultValue="+1 (555) 987-6543" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3.5 text-white font-semibold focus:outline-none focus:border-purple-500/50" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-slate-500 text-[10px] font-bold uppercase tracking-widest ml-1">Timezone</label>
                                <select className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3.5 text-white font-semibold focus:outline-none focus:border-purple-500/50">
                                    <option>GMT-05:00 (Eastern Time)</option>
                                    <option>GMT-08:00 (Pacific Time)</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-slate-500 text-[10px] font-bold uppercase tracking-widest ml-1">Language</label>
                                <select className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3.5 text-white font-semibold focus:outline-none focus:border-purple-500/50">
                                    <option>English (US)</option>
                                    <option>Spanish (ES)</option>
                                </select>
                            </div>
                        </div>
                    </section>

                    <section className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8 space-y-8">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-6 bg-cyan-500 rounded-full" />
                                <h3 className="text-xl font-bold text-white tracking-tight">Activity History</h3>
                            </div>
                            <button className="text-[10px] text-slate-500 font-bold uppercase tracking-widest hover:text-white transition-colors">See all activity</button>
                        </div>

                        <div className="space-y-5">
                            {activities.map(act => (
                                <div key={act.id} className="flex items-center justify-between p-5 bg-slate-950/40 border border-slate-800/80 rounded-2xl hover:border-slate-700 transition-all group">
                                    <div className="flex items-center gap-5">
                                        <div className={clsx("w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center border border-slate-800 group-hover:bg-slate-800 transition-colors shadow-lg shadow-black/20", act.color)}>
                                            <act.icon className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="text-white font-bold text-sm leading-tight">{act.action}</p>
                                            <p className="text-slate-500 text-[11px] font-medium mt-1 leading-none">{act.time}</p>
                                        </div>
                                    </div>
                                    <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest border border-slate-800 px-2.5 py-1 rounded-md bg-slate-900">
                                        {act.type}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="bg-red-500/5 border border-red-500/20 rounded-3xl p-8 space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 text-red-500">
                                <div className="w-10 h-10 bg-red-500/10 rounded-xl flex items-center justify-center border border-red-500/20">
                                    <AlertCircle className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white tracking-tight leading-none mb-1">Danger Zone</h3>
                                    <p className="text-red-500/60 text-[10px] font-bold uppercase tracking-widest leading-none">Sensitive actions for this account</p>
                                </div>
                            </div>
                            <button className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold uppercase tracking-widest leading-none transition-all shadow-lg shadow-red-500/10">
                                Deactivate Account
                            </button>
                        </div>
                    </section>
                </div>
            </div>
        </motion.div>
    );
};

export default UserProfile;
