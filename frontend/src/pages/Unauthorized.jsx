import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

const Unauthorized = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-[120px] animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-[120px] animate-pulse delay-1000"></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative z-10 max-w-md w-full bg-[#0a0a0a]/80 backdrop-blur-3xl border border-white/5 rounded-[32px] p-10 text-center shadow-2xl"
            >
                <div className="w-20 h-20 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-inner shadow-red-500/5">
                    <ShieldAlert size={40} className="text-red-400" />
                </div>

                <h1 className="text-3xl font-black text-white mb-4 tracking-tight">Access Restricted</h1>
                <p className="text-slate-400 mb-10 leading-relaxed text-sm">
                    Your current role does not have the necessary permissions to access this high-level intelligence module.
                </p>

                <div className="space-y-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="w-full h-14 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl text-white font-bold transition-all duration-300 flex items-center justify-center gap-3 active:scale-95"
                    >
                        <ArrowLeft size={18} />
                        Go Back
                    </button>

                    <button
                        onClick={() => navigate('/dashboard')}
                        className="w-full h-14 bg-linear-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 rounded-2xl text-white font-bold transition-all duration-300 flex items-center justify-center gap-3 active:scale-95 shadow-lg shadow-violet-500/20"
                    >
                        Return to Hub
                    </button>
                    
                    <button
                        onClick={() => navigate('/request-access')}
                        className="w-full py-4 text-xs font-black uppercase tracking-[0.2em] text-slate-500 hover:text-slate-300 transition-colors"
                    >
                        Request Higher Access Elevate
                    </button>
                </div>

                <div className="mt-10 pt-10 border-t border-white/5 flex items-center justify-center gap-2 text-slate-600">
                    <Lock size={12} />
                    <span className="text-[10px] font-black uppercase tracking-widest italic">Encrypted Connection Valid</span>
                </div>
            </motion.div>
        </div>
    );
};

export default Unauthorized;
