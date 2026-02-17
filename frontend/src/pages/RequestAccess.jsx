import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Package, Mail, User, Building2, Lock,
    Send, ArrowLeft, CheckCircle2, Info,
    ShieldCheck, ArrowRight, Eye, EyeOff
} from 'lucide-react';
import { clsx } from 'clsx';

const RequestAccess = ({ onBack }) => {
    const [submitted, setSubmitted] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 relative overflow-hidden font-sans">
            {/* Background Glows */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none" />

            {/* Top Left Navigation */}
            <button
                onClick={onBack}
                className="absolute top-10 left-10 flex items-center gap-3 text-slate-500 hover:text-white transition-all font-bold group z-50"
            >
                <div className="w-10 h-10 rounded-full bg-slate-900/50 backdrop-blur-xl border border-slate-800 flex items-center justify-center group-hover:bg-purple-500/10 group-hover:border-purple-500/30 transition-all">
                    <ArrowLeft className="w-5 h-5" />
                </div>
                <span className="text-xs uppercase tracking-[0.2em] font-black">Back to Login</span>
            </button>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: 'spring', damping: 20 }}
                className="w-full max-w-md"
            >
                <div className="bg-slate-900/40 backdrop-blur-2xl border border-slate-800/60 rounded-3xl p-10 shadow-3xl">
                    <AnimatePresence mode="wait">
                        {!submitted ? (
                            <motion.div
                                key="request-form"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="space-y-6"
                            >
                                <div className="flex flex-col items-center text-center">
                                    <div className="w-14 h-14 bg-linear-to-br from-purple-600 to-cyan-600 rounded-2xl flex items-center justify-center shadow-xl shadow-purple-500/20 mb-6 group cursor-default">
                                        <Package className="w-8 h-8 text-white group-hover:scale-110 transition-transform" />
                                    </div>
                                    <h1 className="text-3xl font-bold text-white tracking-tight leading-none mb-2">Request Access</h1>
                                    <p className="text-slate-400 text-sm mt-1 tracking-wide">Nexus Inventory is currently invite-only. Fill out the form below.</p>
                                </div>

                                <form
                                    className="space-y-4 text-left"
                                    onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}
                                >
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2 group">
                                            <div className="relative">
                                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-purple-400 transition-colors" />
                                                <input
                                                    type="text"
                                                    required
                                                    placeholder="Jane Doe"
                                                    className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-12 pr-4 py-4 text-white text-sm focus:outline-none focus:border-purple-500/50 transition-all focus:ring-4 focus:ring-purple-500/5"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2 group">
                                            <div className="relative">
                                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
                                                <input
                                                    type="email"
                                                    required
                                                    placeholder="jane.doe@company.com"
                                                    className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-12 pr-4 py-4 text-white text-sm focus:outline-none focus:border-cyan-500/50 transition-all focus:ring-4 focus:ring-cyan-500/5"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2 group">
                                        <div className="relative">
                                            <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
                                            <input
                                                type="text"
                                                required
                                                placeholder="Operations"
                                                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-12 pr-4 py-4 text-white text-sm focus:outline-none focus:border-emerald-500/50 transition-all focus:ring-4 focus:ring-emerald-500/5"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2 group">
                                            <div className="relative">
                                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-purple-400 transition-colors" />
                                                <input
                                                    type={showPassword ? "text" : "password"}
                                                    required
                                                    className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-12 pr-12 py-4 text-white text-sm focus:outline-none focus:border-purple-500/50 transition-all focus:ring-4 focus:ring-purple-500/5"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors p-1"
                                                >
                                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                </button>
                                            </div>
                                        </div>

                                        <div className="space-y-2 group">
                                            <div className="relative">
                                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
                                                <input
                                                    type={showConfirmPassword ? "text" : "password"}
                                                    required
                                                    className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-12 pr-12 py-4 text-white text-sm focus:outline-none focus:border-cyan-500/50 transition-all focus:ring-4 focus:ring-cyan-500/5"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors p-1"
                                                >
                                                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2 group">
                                        <textarea
                                            required
                                            placeholder="Briefly describe your role..."
                                            className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-purple-500/50 transition-all focus:ring-4 focus:ring-purple-500/5 h-24 resize-none"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full bg-linear-to-r from-purple-600 to-cyan-600 text-white font-black uppercase tracking-[0.2em] py-4 rounded-xl shadow-xl shadow-purple-500/20 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-3 mt-4 group"
                                    >
                                        Send Request
                                        <Send className="w-5 h-5 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </form>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="success-message"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="space-y-6 py-6 text-center"
                            >
                                <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto border border-emerald-500/20 mb-2 shadow-3xl shadow-emerald-500/5">
                                    <CheckCircle2 className="w-10 h-10 text-emerald-400" />
                                </div>
                                <div className="space-y-2">
                                    <h2 className="text-2xl font-bold text-white tracking-tight">Request Sent!</h2>
                                    <p className="text-slate-400 text-sm font-medium leading-relaxed">
                                        Our administration team will review your request.
                                    </p>
                                </div>
                                <button
                                    onClick={onBack}
                                    className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-4 rounded-xl transition-all border border-slate-700 flex items-center justify-center gap-2 group"
                                >
                                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                                    Return to Login
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
};

export default RequestAccess;
