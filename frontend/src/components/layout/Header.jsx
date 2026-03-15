import React, { useState } from 'react';
import { Search, Bell, Plus, AlertTriangle, CheckCircle, Package } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import SearchBar from './SearchBar.jsx'
import Notification from './Notification.jsx';
import NotificationBox from './NotificationBox.jsx';
import { Link } from 'react-router-dom'
import SideNavHeader from './SideNavHeader.jsx';

import { useApp } from '../../context/AppContext';

const Header = () => {
    const {
        notifications,
        setShowAddModal
    } = useApp();
    const [showNotifications, setShowNotifications] = useState(false);

    return (
        <header className="bg-[#0a0a0a]/80 backdrop-blur-md border-b border-slate-800 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
            <SideNavHeader name={'InventPro'} Package={Package} />
            <div className="flex items-center gap-4">
                <SearchBar />
                <div className="relative">
                    <Notification notifications={notifications} setShowNotifications={setShowNotifications} showNotifications={showNotifications} />
                    <AnimatePresence>
                        <NotificationBox notifications={notifications} showNotifications={showNotifications} />
                    </AnimatePresence>
                </div>
                {/* <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-2 bg-linear-to-r from-purple-600 to-cyan-600 text-white px-4 py-2 rounded-lg hover:brightness-110 transition-all font-medium text-sm shadow-lg shadow-purple-500/20 active:scale-95">
                    <Plus className="w-4 h-4" />
                    Add Product
                </button> */}
            </div>
        </header>
    );
};

export default Header;
