import { AlertCircle, CheckCircle, X } from 'lucide-react';

const ConfirmDialog = ({
    isOpen,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    type = 'warning', // warning, danger, info
    onConfirm,
    onCancel
}) => {
    if (!isOpen) return null;

    const typeStyles = {
        warning: {
            icon: <AlertCircle size={24} className="text-yellow-600" />,
            confirmButton: 'bg-yellow-600 hover:bg-yellow-700 text-white'
        },
        danger: {
            icon: <AlertCircle size={24} className="text-red-600" />,
            confirmButton: 'bg-red-600 hover:bg-red-700 text-white'
        },
        info: {
            icon: <CheckCircle size={24} className="text-blue-600" />,
            confirmButton: 'bg-blue-600 hover:bg-blue-700 text-white'
        }
    };

    const style = typeStyles[type];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onCancel}
            ></div>

            {/* Dialog */}
            <div className="relative bg-white rounded-xl shadow-2xl max-w-md w-full animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-start gap-4 p-6 border-b border-gray-200">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                        {style.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-gray-900 mb-1">{title}</h3>
                        <p className="text-sm text-gray-600 leading-relaxed">{message}</p>
                    </div>
                    <button
                        onClick={onCancel}
                        className="flex-shrink-0 p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 p-6">
                    <button
                        onClick={onCancel}
                        className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`px-5 py-2.5 text-sm font-medium rounded-lg transition-all ${style.confirmButton}`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDialog;
