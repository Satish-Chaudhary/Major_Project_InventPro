import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Mail, ArrowRight, Eye, ShieldCheck, EyeOff, KeyRound } from 'lucide-react';
import InventProLogo from '../components/layout/InventProLogo';
import { toast } from 'react-hot-toast';
import { ClipLoader } from 'react-spinners';
import { useNavigate, useLocation } from 'react-router-dom';
import { clsx } from 'clsx'

import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { login, selectAuthLoading } from '../redux/slices/authSlice';

const Login = () => {
    const dispatch = useAppDispatch();
    const loading = useAppSelector(selectAuthLoading);
    const navigate = useNavigate();
    const location = useLocation();

    // Check if we came from admin registration
    const [isFlipped, setIsFlipped] = useState(location.state?.isAdmin || false);
    const [showPassword, setShowPassword] = useState(false);

    // Form inputs
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        if (location.state?.isAdmin) {
            setIsFlipped(true);
        }
    }, [location.state]);

    const handleLogin = async (e, type) => {
        e.preventDefault();
        const action = await dispatch(login({ email, password }));
        if (login.fulfilled.match(action)) {
            toast.success(`Welcome back, ${action.payload.user.fullName}!`);
            navigate('/dashboard');
        } else {
            const msg = action.payload?.message || 'Login failed';
            if (msg === 'Approval Pending') {
                toast('⏳ Your account is awaiting admin approval. Please check back later.', { icon: '🕐', style: { background: '#1e293b', color: '#94a3b8' } });
            } else if (msg === 'Account Inactive') {
                toast.error('🚫 Your account has been deactivated. Contact your administrator.');
            } else if (msg === 'Request Denied') {
                toast.error('❌ Your access request was denied. Contact your administrator.');
            } else {
                toast.error(msg);
            }
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 relative overflow-hidden perspective-1000">
            {/* Background Glows */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none" />

            {/* Global Top-Right Toggle Button */}
            <div className="absolute top-8 right-8 z-50">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsFlipped(!isFlipped)}
                    className="bg-slate-900/80 backdrop-blur-xl hover:bg-slate-800 border border-slate-800/50 px-5 py-2.5 rounded-full flex items-center gap-3 transition-all group shadow-2xl shadow-black/50"
                >
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 group-hover:text-white transition-colors">
                        {isFlipped ? "Staff Portal" : "Admin Portal"}
                    </span>
                    <div className={clsx(
                        "w-8 h-8 rounded-full flex items-center justify-center transition-all",
                        isFlipped ? "bg-purple-500/20 text-purple-400" : "bg-slate-800 text-slate-500"
                    )}>
                        <ShieldCheck className="w-4 h-4" />
                    </div>
                </motion.button>
            </div>

            <div className="w-full max-w-md flex flex-col items-center gap-8">
                <div className="w-full relative h-[520px]">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={isFlipped ? "admin" : "staff"}
                            initial={{ rotateY: isFlipped ? -180 : 180, opacity: 0 }}
                            animate={{ rotateY: 0, opacity: 1 }}
                            exit={{ rotateY: isFlipped ? 180 : -180, opacity: 0 }}
                            transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
                            className="w-full h-full"
                            style={{ transformStyle: "preserve-3d" }}
                        >
                            <div className="bg-slate-900/40 backdrop-blur-2xl border border-slate-800/60 rounded-3xl px-10 py-16 shadow-3xl relative h-full flex flex-col justify-center">

                                <div className="mb-8">
                                    <InventProLogo view="login" />
                                    <h2 className="text-center text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mt-2">
                                        {isFlipped ? "🔐 Administrative Access" : "🏢 Staff Workstation"}
                                    </h2>
                                </div>

                                <form className="space-y-6" onSubmit={(e) => handleLogin(e, isFlipped ? 'admin' : 'staff')}>
                                    <div className="space-y-4">
                                        <div className="relative group">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-purple-400 transition-colors" />
                                            <input
                                                type="email"
                                                placeholder={isFlipped ? "Admin Email Address" : "Staff Email Address"}
                                                required
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-purple-500/50 transition-all font-medium"
                                            />
                                        </div>

                                        <div className="relative group">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-purple-400 transition-colors" />
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                placeholder={isFlipped ? "Admin Password" : "Staff Password"}
                                                required
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-12 pr-12 py-4 text-white focus:outline-none focus:border-purple-500/50 transition-all font-medium"
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
                                        disabled={loading}
                                        className={clsx(
                                            "w-full text-white font-black uppercase tracking-widest py-4 rounded-xl shadow-xl transition-all flex items-center justify-center gap-3 group mt-4 h-14",
                                            "bg-linear-to-r from-purple-600 to-indigo-600 shadow-purple-500/20"
                                        )}
                                    >
                                        {loading ? <ClipLoader color='#fff' size={24} /> : <>Secure Login <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></>}
                                    </button>

                                    {/* Forgot Password Link */}
                                    <div className="text-center pt-2">
                                        <button
                                            type="button"
                                            onClick={() => navigate('/reset-password')}
                                            className="text-slate-500 hover:text-purple-400 text-[11px] font-bold uppercase tracking-[0.15em] transition-colors flex items-center justify-center gap-1.5 mx-auto group"
                                        >
                                            <KeyRound className="w-3.5 h-3.5 group-hover:rotate-12 transition-transform" />
                                            Forgot Password?
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Outside Container Footer */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-center"
                >
                    {!isFlipped ? (
                        <p className="text-slate-500 text-[11px] font-bold uppercase tracking-[0.2em] flex items-center gap-2">
                            Don't have an account?
                            <button
                                onClick={() => navigate('/request-access')}
                                className="text-purple-400 hover:text-purple-300 hover:underline transition-all"
                            >
                                Request Access
                            </button>
                        </p>
                    ) : (
                        <p className="text-slate-500 text-[11px] font-bold uppercase tracking-[0.2em] flex items-center gap-2">
                            Primary Admin Registration?
                            <button
                                onClick={() => navigate('/register-admin')}
                                className="text-cyan-400 hover:text-cyan-300 hover:underline transition-all"
                            >
                                Register Admin
                            </button>
                        </p>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default Login;
