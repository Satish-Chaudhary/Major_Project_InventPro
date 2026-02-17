import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Lock, Mail, ArrowRight, Eye, EyeOff } from 'lucide-react';
import RequestAccess from './RequestAccess';
import ResetPassword from './ResetPassword';

const Login = ({ onLogin }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [view, setView] = useState('login'); // 'login', 'request', 'reset'

    if (view === 'request') {
        return <RequestAccess onBack={() => setView('login')} />;
    }

    if (view === 'reset') {
        return <ResetPassword onBack={() => setView('login')} />;
    }

    return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Glows */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                <div className="bg-slate-900/40 backdrop-blur-2xl border border-slate-800/60 rounded-3xl p-10 shadow-3xl">
                    <div className="flex flex-col items-center text-center mb-10">
                        <div className="w-14 h-14 bg-linear-to-br from-purple-600 to-cyan-600 rounded-2xl flex items-center justify-center shadow-xl shadow-purple-500/20 mb-6 group cursor-default">
                            <Package className="w-8 h-8 text-white group-hover:scale-110 transition-transform" />
                        </div>
                        <h1 className="text-3xl font-bold text-white tracking-tight leading-none mb-2">InventPro</h1>
                        <p className="text-slate-400 text-sm mt-1 tracking-wide">Enter your credentials to access the admin portal.</p>
                    </div>

                    <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); onLogin(); }}>
                        <div className="space-y-2 group">
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-purple-400 transition-colors" />
                                <input
                                    type="email"
                                    placeholder='Enter Your Email'
                                    className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-purple-500/50 transition-all focus:ring-4 focus:ring-purple-500/5"
                                />
                            </div>
                        </div>

                        <div className="space-y-2 group">
                            <div className="flex justify-end pr-1">
                                <button
                                    type="button"
                                    onClick={() => setView('reset')}
                                    className="text-[10px] text-purple-400 hover:text-purple-300 font-black uppercase tracking-widest transition-colors"
                                >
                                    Forgot password?
                                </button>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-purple-400 transition-colors" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder='Enter Your password'
                                    className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-12 pr-12 py-4 text-white focus:outline-none focus:border-purple-500/50 transition-all focus:ring-4 focus:ring-purple-500/5"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-linear-to-r from-purple-600 to-cyan-600 text-white font-black uppercase tracking-widest py-4 rounded-xl shadow-xl shadow-purple-500/20 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-3 group mt-8"
                        >
                            LogIn
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </form>
                </div>

                <p className="text-center text-slate-500 text-sm mt-8 font-medium">
                    Don't have an account? <button onClick={() => setView('request')} className="text-purple-400 hover:text-purple-300 font-bold transition-colors">Request Access</button>
                </p>
            </motion.div>
        </div>
    );
};

export default Login;
