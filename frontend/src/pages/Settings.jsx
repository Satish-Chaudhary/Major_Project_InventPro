import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Settings as SettingsIcon, Building2, ShieldCheck,
    BellRing, UserCog, Mail, Globe, Lock,
    Key, Database, Check, Save
} from 'lucide-react';
import { clsx } from 'clsx';

const Settings = () => {
    const [activeSettingsTab, setActiveSettingsTab] = useState('general');

    const tabs = [
        { id: 'general', label: 'General', icon: Building2 },
        { id: 'inventory', label: 'Inventory', icon: Database },
        { id: 'security', label: 'Security', icon: ShieldCheck },
        { id: 'notifications', label: 'Notifications', icon: BellRing },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 space-y-8"
        >
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-white tracking-tight">System Settings</h2>
                    <p className="text-slate-400 text-sm mt-1">Configure your organization and system wide defaults.</p>
                </div>
                <button className="flex items-center gap-2 bg-linear-to-r from-purple-600 to-cyan-600 text-white px-6 py-2.5 rounded-xl hover:brightness-110 transition-all font-bold text-sm shadow-xl shadow-purple-500/20 active:scale-95">
                    <Save className="w-4 h-4" />
                    Save Changes
                </button>
            </div>

            <div className="flex gap-1.5 p-1.5 bg-slate-900 border border-slate-800 rounded-2xl w-fit">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveSettingsTab(tab.id)}
                        className={clsx(
                            "flex items-center gap-2 px-6 py-2 rounded-xl transition-all font-bold text-sm",
                            activeSettingsTab === tab.id
                                ? "bg-slate-800 text-white shadow-lg"
                                : "text-slate-500 hover:text-slate-300"
                        )}
                    >
                        <tab.icon className={clsx("w-4 h-4", activeSettingsTab === tab.id ? "text-purple-400" : "text-slate-500")} />
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    {activeSettingsTab === 'general' && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="space-y-6"
                        >
                            <section className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8 space-y-8">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center border border-purple-500/20">
                                        <Building2 className="w-5 h-5 text-purple-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-white">Company Information</h3>
                                        <p className="text-slate-500 text-xs">Manage your company details and system preferences.</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6 pt-4">
                                    <div className="space-y-2">
                                        <label className="text-slate-500 text-[10px] font-bold uppercase tracking-widest ml-1">Company Name</label>
                                        <input type="text" defaultValue="Nexus Inventory Systems" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:border-purple-500/50 transition-all focus:ring-4 focus:ring-purple-500/5 focus:outline-none" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-slate-500 text-[10px] font-bold uppercase tracking-widest ml-1">Support Email</label>
                                        <input type="email" defaultValue="support@nexus.com" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:border-purple-500/50 transition-all focus:ring-4 focus:ring-purple-500/5 focus:outline-none" />
                                    </div>
                                    <div className="col-span-2 space-y-2">
                                        <label className="text-slate-500 text-[10px] font-bold uppercase tracking-widest ml-1">Company Address</label>
                                        <input type="text" defaultValue="123 Business Parkway, Suite 100, Tech City, CA 94000" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:border-purple-500/50" />
                                    </div>
                                </div>
                            </section>

                            <section className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8 space-y-8">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-cyan-500/10 rounded-xl flex items-center justify-center border border-cyan-500/20">
                                        <Globe className="w-5 h-5 text-cyan-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-white">Localization</h3>
                                        <p className="text-slate-500 text-xs">Set your preferred currency and time zones.</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6 pt-4">
                                    <div className="space-y-2">
                                        <label className="text-slate-500 text-[10px] font-bold uppercase tracking-widest ml-1">System Language</label>
                                        <select className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-purple-500/50 cursor-pointer">
                                            <option>English (US)</option>
                                            <option>Spanish (ES)</option>
                                            <option>French (FR)</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-slate-500 text-[10px] font-bold uppercase tracking-widest ml-1">Default Currency</label>
                                        <select className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-purple-500/50 cursor-pointer">
                                            <option>USD ($)</option>
                                            <option>EUR (€)</option>
                                            <option>GBP (£)</option>
                                        </select>
                                    </div>
                                </div>
                            </section>
                        </motion.div>
                    )}

                    {activeSettingsTab !== 'general' && (
                        <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-20 text-center flex flex-col items-center justify-center">
                            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4 border border-slate-700">
                                <SettingsIcon className="w-8 h-8 text-slate-500 animate-[spin_5s_linear_infinite]" />
                            </div>
                            <h3 className="text-white font-bold text-xl uppercase tracking-widest">Configuration module</h3>
                            <p className="text-slate-500 text-sm mt-3">The {activeSettingsTab} settings are being migrated to the new system.</p>
                        </div>
                    )}
                </div>

                <div className="space-y-6">
                    <section className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-purple-500/10 transition-colors" />
                        <h3 className="text-white font-bold mb-6 flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4 text-purple-400" />
                            Security Status
                        </h3>
                        <div className="space-y-6">
                            <div className="flex items-center justify-between p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl">
                                <div className="flex items-center gap-3">
                                    <Check className="w-4 h-4 text-emerald-500" />
                                    <span className="text-xs text-emerald-400 font-bold uppercase tracking-wider">Firewall Active</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-slate-800/10 border border-slate-700 rounded-2xl">
                                <div className="flex flex-col">
                                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-none mb-1">Backup Frequency</span>
                                    <span className="text-sm text-white font-bold leading-none">Every 24 Hours</span>
                                </div>
                                <button className="text-[10px] text-purple-400 hover:text-purple-300 font-bold uppercase tracking-widest">Modify</button>
                            </div>
                            <button className="w-full py-3 bg-slate-800 hover:bg-slate-750 text-white rounded-xl text-xs font-bold uppercase tracking-widest border border-slate-700 transition-all">
                                Run System Audit
                            </button>
                        </div>
                    </section>

                    <section className="bg-linear-to-br from-purple-500/10 to-cyan-500/10 border border-purple-500/20 rounded-3xl p-8">
                        <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                            <Database className="w-4 h-4 text-cyan-400" />
                            System Data
                        </h3>
                        <div className="space-y-4">
                            <p className="text-xs text-slate-400 leading-relaxed font-medium">All sensitive information is encrypted with AES-256 standards before being stored in our obsidian layer.</p>
                            <div className="flex items-center justify-between text-xs font-bold pt-2">
                                <span className="text-slate-500 uppercase tracking-widest">Database Usage</span>
                                <span className="text-white">42.8 GB / 100 GB</span>
                            </div>
                            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                <div className="w-[42%] h-full bg-linear-to-r from-purple-500 to-cyan-500 shadow-[0_0_10px_rgba(168,85,247,0.3)]" />
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </motion.div>
    );
};

export default Settings;
