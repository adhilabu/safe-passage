import React from 'react';
import { X, AlertCircle, CheckCircle, Info } from 'lucide-react';

export type NotificationType = 'error' | 'success' | 'info';

interface NotificationModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    message: string;
    type?: NotificationType;
}

const NotificationModal: React.FC<NotificationModalProps> = ({
    isOpen,
    onClose,
    title,
    message,
    type = 'info'
}) => {
    if (!isOpen) return null;

    const getIcon = () => {
        switch (type) {
            case 'error':
                return <AlertCircle className="w-6 h-6 text-red-600" />;
            case 'success':
                return <CheckCircle className="w-6 h-6 text-green-600" />;
            default:
                return <Info className="w-6 h-6 text-blue-600" />;
        }
    };

    const getHeaderColor = () => {
        switch (type) {
            case 'error':
                return 'bg-red-50 border-red-100 text-red-900';
            case 'success':
                return 'bg-green-50 border-green-100 text-green-900';
            default:
                return 'bg-blue-50 border-blue-100 text-blue-900';
        }
    };

    const getButtonColor = () => {
        switch (type) {
            case 'error':
                return 'bg-red-600 hover:bg-red-700 focus:ring-red-500';
            case 'success':
                return 'bg-green-600 hover:bg-green-700 focus:ring-green-500';
            default:
                return 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500';
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div
                className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all"
                role="dialog"
                aria-modal="true"
            >
                {/* Header */}
                <div className={`px-6 py-4 border-b flex items-center justify-between ${getHeaderColor()}`}>
                    <div className="flex items-center gap-3">
                        {getIcon()}
                        <h3 className="font-semibold text-lg">{title}</h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 transition-colors p-1 hover:bg-black/5 rounded-full"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6">
                    <p className="text-gray-600 leading-relaxed">
                        {message}
                    </p>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-gray-50 border-t flex justify-end">
                    <button
                        onClick={onClose}
                        className={`px-6 py-2.5 text-white font-medium rounded-xl shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 ${getButtonColor()}`}
                    >
                        Dismiss
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NotificationModal;
