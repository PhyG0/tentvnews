import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthContext } from '../auth/AuthProvider';
import { logout } from '../../services/auth';
import LoginModal from '../auth/LoginModal';
import LanguageSelector from './LanguageSelector';
import { useTranslation } from '../../hooks/useTranslation';
import { isCreator, isAdmin } from '../../utils/roles';
import { Menu, X, User, LogOut, PenTool, LayoutDashboard, FileText } from 'lucide-react';

const Header = () => {
    const { t } = useTranslation();
    const { currentUser, userProfile } = useAuthContext();
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const location = useLocation();

    // Close mobile menu when route changes
    useEffect(() => {
        setShowMobileMenu(false);
        setShowUserMenu(false);
    }, [location]);

    const handleLogout = async () => {
        await logout();
        setShowUserMenu(false);
    };

    return (
        <>
            <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3 group">
                        <img
                            src="/logo.png"
                            alt="10TV News"
                            className="h-10 w-auto transition-transform group-hover:scale-105"
                        />
                        <span className="hidden sm:block font-display font-bold text-xl tracking-tight text-gray-900">
                            10TV<span className="text-primary-600">News</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-8">
                        <Link to="/" className={`text-sm font-medium transition-colors hover:text-primary-600 ${location.pathname === '/' ? 'text-primary-600' : 'text-gray-600'}`}>
                            {t('home')}
                        </Link>
                        <Link to="/about" className={`text-sm font-medium transition-colors hover:text-primary-600 ${location.pathname === '/about' ? 'text-primary-600' : 'text-gray-600'}`}>
                            About Us
                        </Link>
                        {isCreator(userProfile?.role) && (
                            <>
                                <Link to="/create" className={`text-sm font-medium transition-colors hover:text-primary-600 ${location.pathname === '/create' ? 'text-primary-600' : 'text-gray-600'}`}>
                                    {t('write')}
                                </Link>
                                <Link to="/my-articles" className={`text-sm font-medium transition-colors hover:text-primary-600 ${location.pathname === '/my-articles' ? 'text-primary-600' : 'text-gray-600'}`}>
                                    {t('myArticles')}
                                </Link>
                            </>
                        )}
                        {isAdmin(userProfile?.role) && (
                            <Link to="/admin" className={`text-sm font-medium transition-colors hover:text-primary-600 ${location.pathname === '/admin' ? 'text-primary-600' : 'text-gray-600'}`}>
                                {t('admin')}
                            </Link>
                        )}
                    </nav>

                    {/* User Section - Desktop Only */}
                    <div className="hidden md:flex items-center gap-4">
                        {currentUser ? (
                            <div className="relative">
                                <button
                                    onClick={() => setShowUserMenu(!showUserMenu)}
                                    className="flex items-center gap-2 p-1 pl-2 pr-3 rounded-full hover:bg-gray-100 transition-colors border border-transparent hover:border-gray-200"
                                >
                                    {userProfile?.profileImageUrl ? (
                                        <img
                                            src={userProfile.profileImageUrl}
                                            alt={userProfile.name}
                                            className="w-8 h-8 rounded-full object-cover border border-gray-200"
                                        />
                                    ) : (
                                        <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-semibold text-sm">
                                            {userProfile?.name?.charAt(0) || 'U'}
                                        </div>
                                    )}
                                    <span className="text-sm font-medium text-gray-700">
                                        {userProfile?.name || 'User'}
                                    </span>
                                </button>

                                {/* Dropdown Menu */}
                                {showUserMenu && (
                                    <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                                        <div className="px-4 py-3 border-b border-gray-100">
                                            <p className="text-sm font-semibold text-gray-900">{userProfile?.name}</p>
                                            <p className="text-xs text-gray-500">{currentUser.email}</p>
                                        </div>

                                        <Link
                                            to="/profile"
                                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                        >
                                            <User size={16} /> Profile
                                        </Link>

                                        {isCreator(userProfile?.role) && (
                                            <Link
                                                to="/my-articles"
                                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                            >
                                                <FileText size={16} /> My Articles
                                            </Link>
                                        )}

                                        {isAdmin(userProfile?.role) && (
                                            <Link
                                                to="/admin"
                                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                            >
                                                <LayoutDashboard size={16} /> Dashboard
                                            </Link>
                                        )}

                                        <div className="h-px bg-gray-100 my-2"></div>

                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                        >
                                            <LogOut size={16} /> {t('logout')}
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <button
                                onClick={() => setShowLoginModal(true)}
                                className="inline-flex items-center justify-center px-5 py-2 rounded-full font-medium bg-black text-white text-sm hover:bg-gray-800 transition-all shadow-sm hover:-translate-y-0.5"
                            >
                                {t('login')}
                            </button>
                        )}

                        <LanguageSelector />
                    </div>

                    {/* Mobile - Language + Menu Only */}
                    <div className="md:hidden flex items-center gap-3">
                        <LanguageSelector />

                        {/* Mobile Menu Toggle */}
                        <button
                            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            onClick={() => setShowMobileMenu(!showMobileMenu)}
                        >
                            {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {showMobileMenu && (
                    <div className="md:hidden border-t border-gray-200 bg-white absolute w-full left-0 animate-in slide-in-from-top-5 duration-200 shadow-lg">
                        <div className="p-4 flex flex-col gap-2">
                            {/* User Profile Section in Mobile Menu */}
                            {currentUser ? (
                                <>
                                    <div className="px-4 py-3 mb-2 bg-gray-50 rounded-lg">
                                        <div className="flex items-center gap-3 mb-2">
                                            {userProfile?.profileImageUrl ? (
                                                <img
                                                    src={userProfile.profileImageUrl}
                                                    alt={userProfile.name}
                                                    className="w-10 h-10 rounded-full object-cover border-2 border-primary-200"
                                                />
                                            ) : (
                                                <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-semibold">
                                                    {userProfile?.name?.charAt(0) || 'U'}
                                                </div>
                                            )}
                                            <div>
                                                <p className="text-sm font-bold text-gray-900">
                                                    {userProfile?.name || 'User'}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {currentUser.email}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <Link
                                        to="/profile"
                                        className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
                                        onClick={() => setShowMobileMenu(false)}
                                    >
                                        <User size={18} /> {t('profile')}
                                    </Link>
                                </>
                            ) : (
                                <button
                                    onClick={() => {
                                        setShowLoginModal(true);
                                        setShowMobileMenu(false);
                                    }}
                                    className="flex items-center gap-3 px-4 py-3 rounded-lg bg-black text-white hover:bg-gray-800 font-medium justify-center mb-2"
                                >
                                    {t('login')}
                                </button>
                            )}

                            {/* Navigation Links */}
                            <div className="border-t border-gray-200 pt-2 mt-2">
                                <Link to="/" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 font-medium" onClick={() => setShowMobileMenu(false)}>
                                    {t('home')}
                                </Link>
                                {isCreator(userProfile?.role) && (
                                    <>
                                        <Link to="/create" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 font-medium" onClick={() => setShowMobileMenu(false)}>
                                            <PenTool size={18} /> {t('write')}
                                        </Link>
                                        <Link to="/my-articles" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 font-medium" onClick={() => setShowMobileMenu(false)}>
                                            <FileText size={18} /> {t('myArticles')}
                                        </Link>
                                    </>
                                )}
                                {isAdmin(userProfile?.role) && (
                                    <Link to="/admin" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 font-medium" onClick={() => setShowMobileMenu(false)}>
                                        <LayoutDashboard size={18} /> {t('admin')}
                                    </Link>
                                )}
                                <Link to="/about" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 font-medium" onClick={() => setShowMobileMenu(false)}>
                                    <span className="w-[18px] text-center">ℹ️</span> About Us
                                </Link>
                            </div>

                            {/* Logout Button for Mobile */}
                            {currentUser && (
                                <button
                                    onClick={() => {
                                        handleLogout();
                                        setShowMobileMenu(false);
                                    }}
                                    className="flex items-center gap-3 px-4 py-3 mt-2 rounded-lg text-red-600 hover:bg-red-50 font-medium border-t border-gray-200 pt-4"
                                >
                                    <LogOut size={18} /> {t('logout')}
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </header>

            {/* Spacer for fixed header */}
            <div className="h-16"></div>

            <LoginModal
                isOpen={showLoginModal}
                onClose={() => setShowLoginModal(false)}
            />
        </>
    );
};

export default Header;
