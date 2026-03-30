import { Bell } from 'lucide-react'
import { clsx } from 'clsx';
import { useGetNotificationsQuery } from '../../redux/slices/notificationSlice';

const Notification = ({ setShowNotifications, showNotifications }) => {
    const { data: notificationData } = useGetNotificationsQuery();
    const notifications = notificationData?.notifications || [];

    return (
        <>
            <button
                onClick={() => setShowNotifications(!showNotifications)}
                className={clsx(
                    "relative p-2 rounded-lg transition-all duration-200",
                    showNotifications ? "bg-slate-800 text-white" : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                )}
            >
                <Bell className="w-5 h-5" />
                {notifications.some(n => !n.read) && (
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-[#0a0a0a] animate-pulse"></span>
                )}
            </button>
        </>
    )
}

export default Notification