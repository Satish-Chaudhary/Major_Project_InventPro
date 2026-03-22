import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { AlertTriangle, CheckCircle, Package } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';

const NotificationBox = ({ setShowNotifications }) => {
    const { notifications, clearNotifications } = useApp();
    const navigate = useNavigate();
    
    return (
        <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 mt-3 w-80 bg-[#0f172a] border border-slate-800 rounded-xl shadow-2xl z-50 overflow-hidden"
        >
            <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
                <h3 className="text-white font-semibold text-sm tracking-tight">Notifications</h3>
                <button 
                    onClick={clearNotifications}
                    className="text-[10px] text-purple-400 hover:text-purple-300 font-bold uppercase tracking-widest transition-all hover:scale-105 active:scale-95"
                >
                    Mark as read
                </button>
            </div>
            <div className="max-h-[350px] overflow-y-auto custom-scrollbar">
                {notifications.length > 0 ? (
                    notifications.map((log, idx) => (
                        <div key={idx} className="p-4 border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors flex gap-3 cursor-pointer bg-purple-500/5">
                            <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 border border-slate-700/50 bg-purple-500/10 text-purple-400">
                                <Package className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold text-white truncate">
                                    {log.action.includes(':') ? log.action.split(':')[0] : log.action}
                                </p>
                                <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-2 leading-relaxed italic">
                                    {log.action} in {log.module}
                                </p>
                                <p className="text-[9px] text-slate-600 font-black uppercase tracking-widest mt-2">
                                    {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="p-10 text-center">
                        <CheckCircle className="w-8 h-8 text-slate-800 mx-auto mb-2" />
                        <p className="text-xs text-slate-500 font-medium">Clear history</p>
                    </div>
                )}
            </div>
            <div className="p-3 text-center bg-slate-900/50 border-t border-slate-800">
                <button 
                    onClick={() => {
                        navigate('/audit');
                        setShowNotifications(false);
                    }}
                    className="text-[10px] text-slate-500 hover:text-white font-black uppercase tracking-tighter transition-all"
                >
                    View all activity logs
                </button>
            </div>
        </motion.div>
    );
}

export default NotificationBox;