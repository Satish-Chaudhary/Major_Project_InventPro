import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Package, Mail, User, Lock,
    Send, ArrowLeft, CheckCircle2, Info,
    ShieldCheck, ArrowRight, Eye, EyeOff
} from 'lucide-react';
import { clsx } from 'clsx';
import InventProLogo from '../components/layout/InventProLogo';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { serverUrl } from '../config/api';
import { ClipLoader } from 'react-spinners';
import { toast } from 'react-hot-toast';

const RequestAccess = () => {
    const navigate = useNavigate();

    const [submitted, setSubmitted] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Request access state
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [requestedRole, setRequestedRole] = useState('staff');
    const [message, setMessage] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState('');

    const requestAccess = async () => {
        setLoading(true);
        setErr('');
        try {
            const response = await axios.post(`${serverUrl}/api/auth/request-access`,
                {
                    fullName,
                    email,
                    role: requestedRole,
                    password,
                    confirmPassword
                },
                { withCredentials: true })

            if (response.data.success) {
                setLoading(false);
                setSubmitted(true);
            }

        } catch (error) {
            console.log(error);
            const errorMessage = error.response?.data?.message || error.message;
            setErr(errorMessage);
            toast.error(errorMessage);
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 relative overflow-hidden font-sans">
            {/* Background Glows */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none" />

            {/* Top Left Navigation */}
            <button
                onClick={() => navigate('/login')}
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
                                <InventProLogo view="request access" />

                                <form
                                    className="space-y-4 text-left"
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        requestAccess();
                                    }}
                                >
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2 group">
                                            <div className="relative">
                                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-purple-400 transition-colors" />
                                                <input
                                                    type="text"
                                                    required
                                                    value={fullName}
                                                    onChange={(e) => {
                                                        setFullName(e.target.value);
                                                    }}
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
                                                    value={email}
                                                    onChange={(e) => {
                                                        setEmail(e.target.value);
                                                    }}
                                                    placeholder="jane.doe@company.com"
                                                    className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-12 pr-4 py-4 text-white text-sm focus:outline-none focus:border-cyan-500/50 transition-all focus:ring-4 focus:ring-cyan-500/5"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2 group">
                                        <div className="relative">
                                            <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-purple-400 transition-colors" />
                                            <select
                                                required
                                                value={requestedRole}
                                                onChange={(e) => setRequestedRole(e.target.value)}
                                                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-12 pr-4 py-4 text-white text-sm focus:outline-none focus:border-purple-500/50 transition-all focus:ring-4 focus:ring-purple-500/5 appearance-none"
                                            >
                                                <option value="staff">Staff</option>
                                                <option value="manager">Manager</option>
                                                <option value="accountant">Accountant</option>
                                                <option value="admin">Admin</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2 group">
                                            <div className="relative">
                                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-purple-400 transition-colors" />
                                                <input
                                                    type={showPassword ? "text" : "password"}
                                                    required
                                                    value={password}
                                                    onChange={(e) => {
                                                        setPassword(e.target.value)
                                                    }}
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
                                                    value={confirmPassword}
                                                    onChange={(e) => {
                                                        setConfirmPassword(e.target.value)
                                                    }}
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
                                            value={message}
                                            onChange={(e) => {
                                                setMessage(e.target.value)
                                            }}
                                            placeholder="Briefly describe your role..."
                                            className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-purple-500/50 transition-all focus:ring-4 focus:ring-purple-500/5 h-24 resize-none"
                                        />
                                    </div>

                                    {err && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center gap-3"
                                        >
                                            <Info className="w-5 h-5 text-red-500 shrink-0" />
                                            <p className="text-red-500 text-xs font-bold uppercase tracking-wider">{err}</p>
                                        </motion.div>
                                    )}

                                    <button
                                        type="submit"
                                        className="w-full bg-linear-to-r from-purple-600 to-cyan-600 text-white font-black uppercase tracking-[0.2em] py-4 rounded-xl shadow-xl shadow-purple-500/20 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-3 mt-4 group"
                                    >
                                        {loading ? <ClipLoader color='#fff' size={30} /> : <>Send Request <Send className="w-5 h-5 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" /></>}

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
                                    onClick={() => navigate('/login')}
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
