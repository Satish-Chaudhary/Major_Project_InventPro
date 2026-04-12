import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Download, X, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../redux/hooks';
import { selectUser } from '../redux/slices/authSlice';

const BackupReminder = () => {
    const [showPopup, setShowPopup] = useState(false);
    const [lastBackup, setLastBackup] = useState(null);
    const navigate = useNavigate();
    const user = useAppSelector(selectUser);

    useEffect(() => {
        // Only show for admin/root
        if (user?.role !== 'admin' && user?.role !== 'root') return;

        const checkBackupStatus = async () => {
            try {
                const response = await fetch('/api/settings/get', {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                });
                const data = await response.json();
                
                if (data.success && data.settings.backupReminderEnabled) {
                    const lastBackupDate = new Date(data.settings.lastBackupTime);
                    setLastBackup(lastBackupDate);
                    
                    const now = new Date();
                    const diffHours = (now - lastBackupDate) / (1000 * 60 * 60);
                    
                    // Show if more than 24 hours
                    if (diffHours >= 24) {
                        setShowPopup(true);
                    }
                }
            } catch (error) {
                console.error("Backup check failed:", error);
            }
        };

        checkBackupStatus();
        // Check every hour
        const interval = setInterval(checkBackupStatus, 3600000);
        return () => clearInterval(interval);
    }, [user]);

    const handleLater = () => {
        setShowPopup(false);
        // Silently snooze for 4 hours in local session
        sessionStorage.setItem('backup_snoozed', Date.now().toString());
    };

    if (!showPopup) return null;

    // Check if snoozed in this session
    const snoozedAt = sessionStorage.getItem('backup_snoozed');
    if (snoozedAt && (Date.now() - parseInt(snoozedAt)) < 4 * 3600000) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="fixed bottom-8 right-8 z-50 max-w-sm"
            >
                <div className="bg-slate-900 border border-amber-500/30 rounded-3xl p-6 shadow-2xl shadow-amber-500/10 backdrop-blur-xl relative overflow-hidden">
                    {/* Background Glow */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 blur-3xl rounded-full -mr-16 -mt-16" />
                    
                    <button 
                        onClick={() => setShowPopup(false)}
                        className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>

                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center shrink-0">
                            <AlertTriangle className="w-6 h-6 text-amber-500" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-lg font-black text-white tracking-tight">Security Alert</h3>
                            <p className="text-slate-400 text-xs font-medium leading-relaxed">
                                System hasn't been backed up in over 24 hours. Regular backups are critical for data integrity.
                            </p>
                        </div>
                    </div>

                    <div className="mt-6 flex items-center gap-3">
                        <button
                            onClick={() => {
                                setShowPopup(false);
                                navigate('/backup-export');
                            }}
                            className="flex-1 py-3 bg-amber-500 hover:bg-amber-600 text-black text-[10px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2"
                        >
                            <Download className="w-3.5 h-3.5" />
                            Take Backup Now
                        </button>
                        <button
                            onClick={handleLater}
                            className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all"
                        >
                            Later
                        </button>
                    </div>

                    <div className="mt-4 flex items-center justify-center gap-2">
                        <Clock className="w-3 h-3 text-slate-600" />
                        <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">
                            Last Backup: {lastBackup ? lastBackup.toLocaleDateString() : 'Never'}
                        </span>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default BackupReminder;
