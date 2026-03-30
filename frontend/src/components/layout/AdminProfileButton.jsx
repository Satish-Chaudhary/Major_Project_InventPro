import { clsx } from 'clsx'
import { Link } from 'react-router-dom'

import { useAppSelector } from '../../redux/hooks';
import { selectActiveTab } from '../../redux/slices/uiSlice';
import { selectUser } from '../../redux/slices/authSlice';

const AdminProfileButton = () => {
    const activeTab = useAppSelector(selectActiveTab);
    const user = useAppSelector(selectUser);
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
                    <div className="w-10 h-10 bg-linear-to-br from-purple-600 to-cyan-600 rounded-full flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform uppercase font-black text-white">
                        {user?.fullName?.charAt(0) || 'U'}
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-white font-black text-xs truncate uppercase tracking-tighter">{user?.fullName || 'User'}</p>
                        <p className="text-slate-500 text-[10px] truncate font-bold italic">{user?.email || 'user@example.com'}</p>
                    </div>
                </div>
            </Link>
        </>
    )
}

export default AdminProfileButton