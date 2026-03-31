import { useEffect } from "react";
import { useSocketContext } from "../context/SocketContext";
import { useAppDispatch } from "../redux/hooks";
import { toast } from "react-hot-toast";
import { adminApi } from "../redux/slices/adminSlice";
import { productApi } from "../redux/slices/productSlice";
import { orderApi } from "../redux/slices/orderSlice";
import { notificationApi } from "../redux/slices/notificationSlice";
import { reportApi } from "../redux/slices/reportSlice";
import { activityApi } from "../redux/slices/activitySlice";

export const useRealTimeUpdates = () => {
    const { socket } = useSocketContext();
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (!socket) return;

        const refreshSummary = () => {
             // Invalidate Summary reports and Dashboard metrics
             dispatch(reportApi.util.invalidateTags(['Report']));
             dispatch(adminApi.util.invalidateTags(['SecuritySummary', 'AuditLog']));
             dispatch(activityApi.util.invalidateTags(['Activity']));
        };

        socket.on("stock:updated", (data) => {
            // Invalidate Product markers and relevant lists
            dispatch(productApi.util.invalidateTags([{ type: 'Product', id: 'LIST' }, { type: 'Product', id: data._id }]));
            refreshSummary();
            
            if (!data.deleted) {
                toast.success(`Inventory Sync: ${data.productName} updated live`, {
                    icon: '🔄',
                    style: { background: '#0f172a', color: '#fff', border: '1px solid #1e293b' }
                });
            }
        });

        socket.on("order:updated", (order) => {
            // Invalidate Order markers and relevant lists
            dispatch(orderApi.util.invalidateTags([{ type: 'Order', id: 'LIST' }, { type: 'Order', id: order._id }]));
            refreshSummary();
            
            toast.success(`Order Sync: ${order.orderId} is now ${order.status}`, {
                icon: '📦',
                style: { background: '#0f172a', color: '#fff', border: '1px solid #1e293b' }
            });
        });

        socket.on("new:notification", (notification) => {
            // Refresh notification list
            dispatch(notificationApi.util.invalidateTags(['Notification']));
            
            toast.success(`${notification.title}: ${notification.message}`, {
                icon: notification.type === 'stock' ? '⚠️' : '🔔',
                duration: 5000,
                style: { background: '#0f172a', color: '#fff', border: '1px solid #1e293b' }
            });
        });

        return () => {
            socket.off("stock:updated");
            socket.off("order:updated");
            socket.off("new:notification");
        };
    }, [socket, dispatch]);
};
