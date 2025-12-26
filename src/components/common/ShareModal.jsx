import { useState } from 'react';
import { X, Copy, Check, MessageCircle } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';

const ShareModal = ({ isOpen, onClose, title, url }) => {
    const { t } = useTranslation();
    const [copied, setCopied] = useState(false);

    if (!isOpen) return null;

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy!', err);
        }
    };

    const handleWhatsApp = () => {
        const text = encodeURIComponent(`${title}\n${url}`);
        window.open(`https://wa.me/?text=${text}`, '_blank');
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in" onClick={onClose}>
            <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl animate-slide-up" onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                    <h3 className="font-bold text-gray-900">Share Article</h3>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200 transition-colors text-gray-500">
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-4">
                    {/* Copy Link */}
                    <div className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 bg-gray-50">
                        <div className="flex-1 min-w-0">
                            <p className="text-xs text-gray-500 mb-1">Page Link</p>
                            <p className="text-sm font-medium text-gray-900 truncate">{url}</p>
                        </div>
                        <button
                            onClick={handleCopy}
                            className={`p-2 rounded-lg transition-all ${copied ? 'bg-green-100 text-green-700' : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-400'
                                }`}
                        >
                            {copied ? <Check size={18} /> : <Copy size={18} />}
                        </button>
                    </div>

                    {/* Social Buttons */}
                    <div className="grid grid-cols-1 gap-3">
                        <button
                            onClick={handleWhatsApp}
                            className="flex items-center justify-center gap-3 w-full py-3 bg-[#25D366] text-white rounded-xl font-bold hover:opacity-90 transition-opacity"
                        >
                            <MessageCircle size={20} />
                            Share via WhatsApp
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShareModal;
