import { useState } from 'react';
import { loginWithGoogle, loginWithEmail } from '../../services/auth';
import { X } from 'lucide-react';

const LoginModal = ({ isOpen, onClose }) => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [activeTab, setActiveTab] = useState('google'); // 'google' or 'email'

    if (!isOpen) return null;

    const handleGoogleLogin = async () => {
        setIsLoading(true);
        setMessage('');

        const result = await loginWithGoogle();

        if (result.success) {
            setMessage('Login successful!');
            setTimeout(() => {
                onClose();
            }, 1000);
        } else {
            setMessage(result.error || 'Login failed');
        }

        setIsLoading(false);
    };

    const handleEmailLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage('');

        const result = await loginWithEmail(email);

        if (result.success) {
            setMessage('Login link sent! Check your email.');
            setEmail('');
        } else {
            setMessage(result.error || 'Failed to send login link');
        }

        setIsLoading(false);
    };

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={handleBackdropClick}
        >
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Welcome to TenTV News</h2>
                        <p className="text-sm text-gray-600 mt-1">Sign in to continue</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        aria-label="Close"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-200">
                    <button
                        className={`flex-1 px-6 py-3 text-sm font-semibold transition-colors ${activeTab === 'google'
                                ? 'text-gray-900 border-b-2 border-gray-900'
                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                            }`}
                        onClick={() => setActiveTab('google')}
                    >
                        Google
                    </button>
                    <button
                        className={`flex-1 px-6 py-3 text-sm font-semibold transition-colors ${activeTab === 'email'
                                ? 'text-gray-900 border-b-2 border-gray-900'
                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                            }`}
                        onClick={() => setActiveTab('email')}
                    >
                        Email
                    </button>
                </div>

                {/* Body */}
                <div className="p-6">
                    {activeTab === 'google' && (
                        <div>
                            <p className="text-sm text-gray-600 mb-4">
                                Sign in with your Google account for quick access
                            </p>
                            <button
                                className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-white border-2 border-gray-300 rounded-lg text-gray-900 font-medium hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                onClick={handleGoogleLogin}
                                disabled={isLoading}
                            >
                                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                                    <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4" />
                                    <path d="M9.003 18c2.43 0 4.467-.806 5.956-2.18L12.05 13.56c-.806.54-1.836.86-3.047.86-2.344 0-4.328-1.584-5.036-3.711H.96v2.332C2.44 15.983 5.485 18 9.003 18z" fill="#34A853" />
                                    <path d="M3.964 10.712c-.18-.54-.282-1.117-.282-1.71 0-.593.102-1.17.282-1.71V4.96H.957C.347 6.175 0 7.55 0 9.002c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05" />
                                    <path d="M9.003 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.464.891 11.426 0 9.003 0 5.485 0 2.44 2.017.96 4.959L3.967 7.29c.708-2.127 2.692-3.71 5.036-3.71z" fill="#EA4335" />
                                </svg>
                                {isLoading ? 'Signing in...' : 'Continue with Google'}
                            </button>
                        </div>
                    )}

                    {activeTab === 'email' && (
                        <div>
                            <p className="text-sm text-gray-600 mb-4">
                                We'll send you a secure login link to your email
                            </p>
                            <form onSubmit={handleEmailLogin} className="space-y-4">
                                <input
                                    type="email"
                                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    disabled={isLoading}
                                />
                                <button
                                    type="submit"
                                    className="w-full px-6 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                    disabled={isLoading || !email}
                                >
                                    {isLoading ? 'Sending...' : 'Send Login Link'}
                                </button>
                            </form>
                        </div>
                    )}

                    {message && (
                        <div className={`mt-4 p-4 rounded-lg text-sm ${message.includes('successful') || message.includes('sent')
                                ? 'bg-green-50 text-green-800 border border-green-200'
                                : 'bg-red-50 text-red-800 border border-red-200'
                            }`}>
                            {message}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LoginModal;
