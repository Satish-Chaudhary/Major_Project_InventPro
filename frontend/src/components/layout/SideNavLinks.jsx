import { clsx } from 'clsx';
import { Link } from 'react-router-dom'

import { useApp } from '../../context/AppContext';

const SideNavLinks = ({ id, Icon, label }) => {
    const { activeTab, setActiveTab } = useApp();

    return (
        <>
            <Link
                to={id}
                onClick={() => setActiveTab(id)}
                className={clsx(
                    'w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group',
                    activeTab === id
                        ? 'bg-linear-to-r from-purple-500/20 to-cyan-500/20 text-white border border-purple-500/30'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                )}
            >
                <Icon className={clsx(
                    "w-5 h-5 transition-colors",
                    activeTab === id ? "text-purple-400" : "group-hover:text-cyan-400"
                )} />
                <span className="font-medium">{label}</span>
                {activeTab === id && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]" />
                )}
            </Link>
        </>
    )
}

export default SideNavLinks