import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Key, Mail, ShieldCheck, Lock,
    ArrowLeft, ArrowRight, RefreshCw,
    Package, CheckCircle2, ShieldAlert,
    Eye, EyeOff
} from 'lucide-react';
import { clsx } from 'clsx';

const ResetPassword = ({ onBack }) => {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const steps = [
        { id: 1, label: 'Email', icon: Mail },
        { id: 2, label: 'Verification', icon: ShieldCheck },
        { id: 3, label: 'New Password', icon: Key },
    ];

    return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 relative overflow-hidden font-sans">
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
                <span className="text-xs uppercase tracking-[0.2em] font-black">Cancel & Login</span>
            </button>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                <div className="bg-slate-900/40 backdrop-blur-2xl border border-slate-800/60 rounded-3xl p-10 shadow-3xl text-center">
                    <div className="flex flex-col items-center mb-10">
                        <div className="w-14 h-14 bg-linear-to-br from-purple-600 to-cyan-600 rounded-2xl flex items-center justify-center shadow-xl shadow-purple-500/20 mb-6 group cursor-default">
                            <Package className="w-8 h-8 text-white group-hover:scale-110 transition-transform" />
                        </div>
                        <h1 className="text-3xl font-bold text-white tracking-tight leading-none mb-2">Reset Password</h1>
                        <p className="text-slate-400 text-sm mt-1 tracking-wide">Securely update your account credentials.</p>
                    </div>

                    {/* Stepper */}
                    <div className="flex items-center justify-between relative mb-12 max-w-xs mx-auto">
                        <div className="absolute top-1/2 left-0 right-0 h-px bg-slate-800 -translate-y-1/2" />
                        {steps.map((s, idx) => (
                            <div key={s.id} className="relative z-10">
                                <div className={clsx(
                                    "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500 border-2",
                                    step >= s.id ? "bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-500/20" : "bg-slate-950 border-slate-800 text-slate-600"
                                )}>
                                    {step > s.id ? <CheckCircle2 className="w-5 h-5" /> : <s.icon className="w-5 h-5" />}
                                </div>
                                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap">
                                    <span className={clsx("text-[9px] font-black uppercase tracking-widest", step >= s.id ? "text-slate-300" : "text-slate-600")}>{s.label}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div className="text-left space-y-2 group">
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-purple-400 transition-colors" />
                                        <input
                                            type="email"
                                            placeholder="name@company.com"
                                            className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-12 pr-4 py-4 text-white text-sm focus:outline-none focus:border-purple-500/50 transition-all focus:ring-4 focus:ring-purple-500/5"
                                            onKeyDown={(e) => e.key === 'Enter' && setStep(2)}
                                        />
                                    </div>
                                </div>

                                <button
                                    onClick={() => setStep(2)}
                                    className="w-full bg-linear-to-r from-purple-600 to-cyan-600 text-white font-black uppercase tracking-[0.2em] py-4 rounded-xl shadow-xl shadow-purple-500/20 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-3 mt-4 group"
                                >
                                    Send Code
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div className="flex justify-center gap-3">
                                    {[1, 2, 3, 4, 5, 6].map(i => (
                                        <input
                                            key={i}
                                            type="text"
                                            maxLength={1}
                                            className="w-11 h-12 bg-slate-950 border border-slate-800 rounded-xl text-center text-lg font-bold text-white focus:outline-none focus:border-cyan-500/50 focus:ring-4 focus:ring-cyan-500/5 transition-all"
                                            autoFocus={i === 1}
                                        />
                                    ))}
                                </div>

                                <div className="space-y-4 pt-2">
                                    <button
                                        onClick={() => setStep(3)}
                                        className="w-full bg-linear-to-r from-purple-600 to-cyan-600 text-white font-black uppercase tracking-[0.2em] py-4 rounded-xl shadow-xl shadow-purple-500/20 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-3 group"
                                    >
                                        Verify Code
                                        <ShieldCheck className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                    </button>
                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                                        Didn't receive code? <button className="text-cyan-400 hover:text-cyan-300 transition-colors ml-1">Resend</button>
                                    </p>
                                </div>
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div className="space-y-4 text-left">
                                    <div className="space-y-2 group">
                                        <div className="relative">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-purple-400" />
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                placeholder="••••••••"
                                                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-12 pr-12 py-4 text-white text-sm focus:outline-none focus:border-purple-500/50"
                                            />
                                            <button onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors">
                                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-2 group">
                                        <div className="relative">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-purple-400" />
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                placeholder="••••••••"
                                                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-12 pr-12 py-4 text-white text-sm focus:outline-none focus:border-purple-500/50"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={onBack}
                                    className="w-full bg-linear-to-r from-purple-600 to-cyan-600 text-white font-black uppercase tracking-[0.2em] py-4 rounded-xl shadow-xl shadow-purple-500/20 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-3 mt-4 group"
                                >
                                    Update Password
                                    <CheckCircle2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
};

export default ResetPassword;
