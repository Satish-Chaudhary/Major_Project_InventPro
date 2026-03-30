import { toast } from 'react-hot-toast';

/**
 * A reusable hook for handling deletions with a custom toast confirmation.
 * @returns {confirmDelete} A function to trigger the deletion process.
 */
export const useDeleteWithConfirm = () => {
    /**
     * Triggers the deletion confirmation.
     * @param {Object} options Configuration for the deletion.
     * @param {string} options.title - The title or name of the item being deleted.
     * @param {Function} options.onConfirm - The async function to perform the deletion.
     * @param {string} [options.message] - The custom confirmation message.
     */
    const confirmDelete = ({ title, onConfirm, message }) => {
        const toastId = toast((t) => (
            <div className="flex flex-col gap-4 p-1 min-w-[240px]">
                <div className="space-y-1">
                    <p className="text-sm font-bold text-slate-100 leading-tight">
                        {message || `Are you sure you want to delete "${title}"?`}
                    </p>
                    <p className="text-[10px] text-slate-400 font-medium italic">
                        This action cannot be undone.
                    </p>
                </div>
                <div className="flex items-center gap-2 justify-end">
                    <button
                        onClick={() => toast.dismiss(t.id)}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={async () => {
                            toast.dismiss(t.id);
                            const loadingId = toast.loading(`Deleting ${title}...`);
                            try {
                                await onConfirm();
                                toast.success(`${title} deleted successfully!`, { id: loadingId });
                            } catch (error) {
                                toast.error(error?.message || `Failed to delete ${title}`, { id: loadingId });
                            }
                        }}
                        className="px-4 py-1.5 rounded-lg bg-red-500 hover:bg-red-600 text-white text-xs font-black shadow-lg shadow-red-500/20 active:scale-95 transition-all"
                    >
                        Delete Now
                    </button>
                </div>
            </div>
        ), {
            duration: Infinity,
            position: 'top-center',
            style: {
                background: '#0a0a0a',
                border: '1px solid #1e293b',
                padding: '12px',
                borderRadius: '16px',
            },
        });
    };

    return confirmDelete;
};
