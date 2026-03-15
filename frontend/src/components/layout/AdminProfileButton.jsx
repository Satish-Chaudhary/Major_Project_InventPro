import { clsx } from 'clsx'
import { Link } from 'react-router-dom'

import { useApp } from '../../context/AppContext';

const AdminProfileButton = () => {
    const { activeTab } = useApp();
    return (
        <>
            <Link
                to="/profile"
                className={clsx(
                    "w-full p-4 rounded-xl border transition-all duration-200 text-left group block",
                    activeTab === 'profile'
                        ? "bg-linear-to-br from-purple-500/20 to-cyan-500/20 border-purple-500/40 shadow-lg shadow-purple-500/10"
                        : "bg-linear-to-br from-purple-500/10 to-cyan-500/10 border-purple-500/20 hover:border-purple-500/40"
                )}
            >
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-linear-to-br from-purple-600 to-cyan-600 rounded-full flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform">
                        <span className="text-white font-bold">A</span>
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-white font-medium text-sm truncate">Admin User</p>
                        <p className="text-slate-400 text-xs truncate">admin@inventpro.com</p>
                    </div>
                </div>
            </Link>
        </>
    )
}

export default AdminProfileButton