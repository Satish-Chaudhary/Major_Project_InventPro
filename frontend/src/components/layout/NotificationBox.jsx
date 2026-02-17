import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import { AlertTriangle, CheckCircle, Package } from 'lucide-react'

const NotificationBox = ({ notifications, showNotifications }) => {
    return (
        <>
            {showNotifications && (
                <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-3 w-80 bg-[#0f172a] border border-slate-800 rounded-xl shadow-2xl z-50 overflow-hidden"
                >
                    <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
                        <h3 className="text-white font-semibold text-sm">Notifications</h3>
                        <button className="text-xs text-purple-400 hover:text-purple-300 font-medium">Mark as read</button>
                    </div>
                    <div className="max-h-[350px] overflow-y-auto custom-scrollbar">
                        {notifications.map(n => (
                            <div key={n.id} className={clsx("p-4 border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors flex gap-3 cursor-pointer", !n.read && "bg-purple-500/5")}>
                                <div className={clsx(
                                    "w-9 h-9 rounded-full flex items-center justify-center shrink-0",
                                    n.type === 'warning' ? "bg-amber-500/10 text-amber-500" :
                                        n.type === 'success' ? "bg-emerald-500/10 text-emerald-500" : "bg-purple-500/10 text-purple-500"
                                )}>
                                    {n.type === 'warning' ? <AlertTriangle className="w-4 h-4" /> :
                                        n.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <Package className="w-4 h-4" />}
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs font-semibold text-white">{n.title}</p>
                                    <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2 leading-relaxed">{n.message}</p>
                                    <p className="text-[10px] text-slate-500 mt-1.5">{n.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="p-3 text-center bg-slate-900/50">
                        <button className="text-xs text-slate-400 hover:text-white font-medium transition-colors">View all activity</button>
                    </div>
                </motion.div>
            )}
        </>
    )
}

export default NotificationBox