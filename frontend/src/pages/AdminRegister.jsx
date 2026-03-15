import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Mail, User, Phone, ArrowRight, ShieldCheck } from 'lucide-react';
import InventProLogo from '../components/layout/InventProLogo';
import { toast } from 'react-hot-toast';
import { ClipLoader } from 'react-spinners';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { serverUrl } from '../App.jsx';

const AdminRegister = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axios.post(`${serverUrl}/api/auth/register-admin`, formData);
            if (response.data.success) {
                toast.success('Admin registered successfully!');
                navigate('/login');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 relative overflow-hidden">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-lg"
            >
                <div className="bg-slate-900/40 backdrop-blur-2xl border border-slate-800/60 rounded-3xl p-10 shadow-3xl">
                    <div className="flex justify-center mb-6">
                        <div className="bg-purple-500/10 p-4 rounded-full border border-purple-500/20">
                            <ShieldCheck className="w-10 h-10 text-purple-500" />
                        </div>
                    </div>
                    <h2 className="text-2xl font-black text-center text-white uppercase tracking-[0.2em] mb-8">Admin Registration</h2>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-purple-400" />
                                <input
                                    type="text"
                                    placeholder="Full Name"
                                    required
                                    value={formData.fullName}
                                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                    className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-purple-500/50"
                                />
                            </div>
                            <div className="relative group">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-purple-400" />
                                <input
                                    type="tel"
                                    placeholder="Phone Number"
                                    required
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-purple-500/50"
                                />
                            </div>
                        </div>

                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-purple-400" />
                            <input
                                type="email"
                                placeholder="Email Address"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-purple-500/50"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-purple-400" />
                                <input
                                    type="password"
                                    placeholder="Password"
                                    required
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-purple-500/50"
                                />
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-purple-400" />
                                <input
                                    type="password"
                                    placeholder="Confirm Password"
                                    required
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-purple-500/50"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-linear-to-r from-purple-600 to-cyan-600 text-white font-black uppercase tracking-widest py-4 rounded-xl shadow-xl shadow-purple-500/20 hover:brightness-110 transition-all flex items-center justify-center gap-3 mt-4"
                        >
                            {loading ? <ClipLoader color="#fff" size={24} /> : <>Register Admin <ArrowRight className="w-5 h-5" /></>}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <button onClick={() => navigate('/login')} className="text-slate-500 text-sm hover:text-white transition-colors">
                            Already have an account? <span className="text-purple-400 font-bold underline">Login</span>
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default AdminRegister;
