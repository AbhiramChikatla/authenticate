import React from "react";
import { AlertTriangle, X } from "lucide-react";

const ConfirmDialog = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = "Delete",
    cancelText = "Cancel",
    variant = "danger",
}) => {
    if (!isOpen) return null;

    const handleConfirm = () => {
        onConfirm();
        onClose();
    };

    const variantStyles = {
        danger: {
            button: "bg-red-600 hover:bg-red-700 focus:ring-red-500",
            icon: "text-red-600",
            iconBg: "bg-red-100",
        },
        warning: {
            button: "bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500",
            icon: "text-yellow-600",
            iconBg: "bg-yellow-100",
        },
    };

    const styles = variantStyles[variant] || variantStyles.danger;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full shadow-xl animate-fadeIn">
                <div className="p-6">
                    <div className="flex items-start gap-4">
                        <div
                            className={`${styles.iconBg} rounded-full p-3 flex-shrink-0`}
                        >
                            <AlertTriangle className={styles.icon} size={24} />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                {title}
                            </h3>
                            <p className="text-sm text-gray-600">{message}</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 transition flex-shrink-0"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>
                <div className="bg-gray-50 px-6 py-4 flex gap-3 justify-end rounded-b-lg">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={handleConfirm}
                        className={`px-4 py-2 text-sm font-medium text-white ${styles.button} rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDialog;
