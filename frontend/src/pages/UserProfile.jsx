import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    User, Mail, Phone, MapPin, Globe,
    Shield, Clock, Calendar, Lock, LogOut,
    TrendingUp, Package, CheckCircle2, AlertCircle,
    Camera, Edit3, X, Save
} from 'lucide-react';
import { clsx } from 'clsx';

import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { selectUser, updateProfile } from '../redux/slices/authSlice';
import { useGetActivitiesQuery } from '../redux/slices/activitySlice';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';

const UserProfile = () => {
    const dispatch = useAppDispatch();
    const user = useAppSelector(selectUser);
    const { data: activityData } = useGetActivitiesQuery({ limit: 4 });
    const userActivities = activityData?.activities?.filter(act => act.user === user?.fullName) || [];
    
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        fullName: user?.fullName || '',
        email: user?.email || '',
        phone: user?.phone || '',
        timezone: 'GMT-05:00 (Eastern Time)',
        language: 'English (US)'
    });

    if (!user) return <div className="p-6 text-slate-500">Loading profile...</div>;

    const handleSave = async () => {
        if (isEditing) {
            try {
                const action = await dispatch(updateProfile(formData));
                if (updateProfile.fulfilled.match(action)) {
                    toast.success('Profile updated successfully!');
                    setIsEditing(false);
                } else {
                    toast.error(action.payload?.message || 'Update failed');
                }
            } catch (error) {
                toast.error('Network error occurred');
            }
        } else {
            setIsEditing(true);
        }
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
                        onClick={handleSave}
                        className="flex items-center gap-2 bg-linear-to-r from-purple-600 to-cyan-600 text-white px-5 py-2 rounded-xl hover:brightness-110 transition-all text-xs font-bold uppercase tracking-widest leading-none shadow-lg shadow-purple-500/20"
                    >
                        {isEditing ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                        {isEditing ? 'Save Changes' : 'Update profile'}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Profile Sidebar */}
                <div className="lg:col-span-1 space-y-6">
                    <section className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8 flex flex-col items-center text-center relative overflow-hidden group">
                        <div className="absolute top-0 inset-x-0 h-24 bg-linear-to-br from-purple-500/10 to-cyan-500/10" />
                        <div className="relative mt-8">
                            <div className="w-32 h-32 rounded-full border-4 border-slate-950 bg-slate-800 p-1 relative shadow-2xl transition-transform group-hover:scale-105">
                                <img
                                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                                    alt="Profile"
                                    className="w-full h-full rounded-full object-cover"
                                />
                                <button className="absolute bottom-1 right-1 w-10 h-10 bg-slate-900 border border-slate-700 rounded-full flex items-center justify-center text-slate-400 hover:text-white transition-all shadow-xl">
                                    <Camera className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        <div className="mt-6 space-y-1">
                            <h3 className="text-2xl font-bold text-white tracking-tight">{user.fullName}</h3>
                            <p className="text-purple-400 text-xs font-bold uppercase tracking-[0.2em]">{user.role}</p>
                        </div>

                        <div className="w-full mt-10 space-y-4 text-left border-t border-slate-800/50 pt-8">
                            {[
                                { label: 'Email', value: user.email, icon: Mail },
                                { label: 'Status', value: user.status === 'active' ? 'Verified' : 'Pending', icon: CheckCircle2, status: true },
                                { label: 'Joined On', value: format(new Date(user.createdAt), 'MMM dd, yyyy'), icon: Calendar },
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
                                <label className="text-slate-500 text-[10px] font-bold uppercase tracking-widest ml-1">Full Name</label>
                                <input 
                                    type="text" 
                                    disabled={!isEditing}
                                    value={formData.fullName} 
                                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3.5 text-white font-semibold focus:outline-none focus:border-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed" 
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-slate-500 text-[10px] font-bold uppercase tracking-widest ml-1">Email Address</label>
                                <input 
                                    type="email" 
                                    disabled={!isEditing}
                                    value={formData.email} 
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3.5 text-white font-semibold focus:outline-none focus:border-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed" 
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-slate-500 text-[10px] font-bold uppercase tracking-widest ml-1">Phone Number</label>
                                <input 
                                    type="text" 
                                    disabled={!isEditing}
                                    value={formData.phone} 
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3.5 text-white font-semibold focus:outline-none focus:border-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed" 
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-slate-500 text-[10px] font-bold uppercase tracking-widest ml-1">Timezone</label>
                                <select 
                                    disabled={!isEditing}
                                    value={formData.timezone}
                                    onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3.5 text-white font-semibold focus:outline-none focus:border-purple-500/50 disabled:opacity-50"
                                >
                                    <option>GMT-05:00 (Eastern Time)</option>
                                    <option>GMT-08:00 (Pacific Time)</option>
                                </select>
                            </div>
                        </div>
                    </section>

                    <section className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8 space-y-8">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-6 bg-cyan-500 rounded-full" />
                                <h3 className="text-xl font-bold text-white tracking-tight">Recent Activity</h3>
                            </div>
                            <button className="text-[10px] text-slate-500 font-bold uppercase tracking-widest hover:text-white transition-colors" onClick={() => navigate('/audit')}>See all history</button>
                        </div>

                        <div className="space-y-5">
                            {userActivities.length > 0 ? userActivities.map((act, idx) => (
                                <div key={idx} className="flex items-center justify-between p-5 bg-slate-950/40 border border-slate-800/80 rounded-2xl hover:border-slate-700 transition-all group">
                                    <div className="flex items-center gap-5">
                                        <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center border border-slate-800 group-hover:bg-slate-800 transition-colors shadow-lg shadow-black/20 text-purple-400">
                                            <Package className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="text-white font-bold text-sm leading-tight">{act.action}</p>
                                            <p className="text-slate-500 text-[11px] font-medium mt-1 leading-none">{format(new Date(act.createdAt), 'PPp')}</p>
                                        </div>
                                    </div>
                                    <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest border border-slate-800 px-2.5 py-1 rounded-md bg-slate-900">
                                        {act.module}
                                    </span>
                                </div>
                            )) : (
                                <div className="text-center py-8 text-slate-500 font-bold uppercase tracking-widest text-[10px] border-2 border-dashed border-slate-800 rounded-2xl">
                                    No recent activity found
                                </div>
                            )}
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
