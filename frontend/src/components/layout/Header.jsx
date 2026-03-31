import React, { useState, useEffect, useRef } from 'react';
import { Bell, Package, AlertTriangle, CheckCircle, Info, ShoppingCart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import Notification from './Notification.jsx';
import NotificationBox from './NotificationBox.jsx';
import SideNavHeader from './SideNavHeader.jsx';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { useGetActivitiesQuery } from '../../redux/slices/activitySlice';
import { selectLastReadAuditTime, clearAuditNotifications } from '../../redux/slices/uiSlice';
import { selectCartCount } from '../../redux/slices/cartSlice';
import { useNavigate } from 'react-router-dom';

const NotificationTicker = () => {
    const { data: activityData } = useGetActivitiesQuery({ limit: 10 });
    const auditLogs = activityData?.activities || [];
    const [index, setIndex] = useState(0);
    const recentLogs = auditLogs.slice(0, 4);

    useEffect(() => {
        if (recentLogs.length > 0) {
            const timer = setInterval(() => {
                setIndex((prev) => (prev + 1) % recentLogs.length);
            }, 4000);
            return () => clearInterval(timer);
        }
    }, [recentLogs]);

    if (recentLogs.length === 0) return null;

    const current = recentLogs[index];

    return (
        <div className="hidden md:flex items-center gap-3 bg-slate-900/40 border border-slate-800/60 rounded-full px-4 py-1.5 max-w-sm overflow-hidden group hover:border-purple-500/30 transition-all cursor-default">
            <AnimatePresence mode="wait">
                <motion.div
                    key={index}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    className="flex items-center gap-3 overflow-hidden"
                >
                    <div className={clsx(
                        "p-1.5 rounded-full bg-purple-500/10 text-purple-400"
                    )}>
                        <Info className="w-3 h-3" />
                    </div>
                    <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest truncate max-w-[200px]">
                        {current.action}
                    </span>
                    <span className="text-[8px] font-black text-slate-600 uppercase tracking-tighter shrink-0">
                        {current.createdAt ? new Date(current.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'}
                    </span>
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

const Header = () => {
    const dispatch = useAppDispatch();
    const { data: activityData } = useGetActivitiesQuery({ limit: 10 });
    const auditLogs = activityData?.activities || [];
    const lastReadTime = useAppSelector(selectLastReadAuditTime);
    const cartCount = useAppSelector(selectCartCount);
    const notifications = auditLogs.filter(log => new Date(log.createdAt).getTime() > lastReadTime);
    const navigate = useNavigate();
    const [showNotifications, setShowNotifications] = useState(false);
    const notificationRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                setShowNotifications(false);
            }
        };

        if (showNotifications) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showNotifications]);

    return (
        <header className="bg-[#0a0a0a]/80 backdrop-blur-md border-b border-slate-800 px-6 py-4 flex items-center justify-between sticky top-0 z-30 h-16">
            <SideNavHeader name={'InventPro'} Package={Package} />
            
            <div className="flex items-center gap-6">
                {/* Replaced SearchBar with NotificationTicker */}
                <NotificationTicker />

                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => navigate('/cart')}
                        className="relative p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-400 hover:text-white hover:border-indigo-500/50 transition-all group"
                        title="Shopping Cart"
                    >
                        <ShoppingCart className="w-5 h-5 transition-transform group-active:scale-90" />
                        {cartCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-[10px] font-black min-w-4 h-4 px-1 rounded-full flex items-center justify-center border-2 border-[#0a0a0a]">
                                {cartCount}
                            </span>
                        )}
                    </button>

                    <div className="relative" ref={notificationRef}>
                    <Notification 
                        notifications={notifications} 
                        setShowNotifications={setShowNotifications} 
                        showNotifications={showNotifications} 
                    />
                    <AnimatePresence>
                        {showNotifications && (
                            <NotificationBox 
                                notifications={notifications} 
                                showNotifications={showNotifications} 
                                setShowNotifications={setShowNotifications}
                            />
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    </header>
);
};

export default Header;
