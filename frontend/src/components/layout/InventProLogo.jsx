import { Package } from 'lucide-react';

const InventProLogo = ({ view }) => {
    const isLogin = view === 'login';
    const title = isLogin ? 'InventPro' : view;
    const description = isLogin
        ? 'Enter your credentials to access the admin portal.'
        : view === 'request access'
            ? 'Nexus Inventory is currently invite-only. Fill out the form below.'
            : 'Securely update your account credentials.';

    return (
        <div className="flex flex-col items-center text-center mb-10">
            <div className="w-14 h-14 bg-linear-to-br from-purple-600 to-cyan-600 rounded-2xl flex items-center justify-center shadow-xl shadow-purple-500/20 mb-6 group cursor-default">
                <Package className="w-8 h-8 text-white group-hover:scale-110 transition-transform" />
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight leading-none mb-2 capitalize">{title}</h1>
            <p className="text-slate-400 text-sm mt-1 tracking-wide">{description}</p>
        </div>
    )
}

export default InventProLogo