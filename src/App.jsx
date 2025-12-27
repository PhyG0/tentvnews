import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './components/auth/AuthProvider';
import { LanguageProvider } from './contexts/LanguageContext';
import Header from './components/common/Header';
import HomePage from './pages/HomePage';
import ArticleDetailPage from './pages/ArticleDetailPage';
import CreateArticlePage from './pages/CreateArticlePage';
import EditArticlePage from './pages/EditArticlePage';
import MyArticlesPage from './pages/MyArticlesPage';
import AdminPage from './pages/AdminPage';
import ProfilePage from './pages/ProfilePage';
import AboutPage from './pages/AboutPage';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { useEffect } from 'react';

const App = () => {
    // Content Protection
    useEffect(() => {
        const isProtectedParams = () => {
            const path = window.location.pathname;
            // Allow copy/paste on Create, Edit, and Admin pages
            if (path.startsWith('/create') || path.startsWith('/edit') || path.startsWith('/admin')) {
                return false;
            }
            return true;
        };

        const handleContextMenu = (e) => {
            if (!isProtectedParams()) return;
            e.preventDefault();
            return false;
        };

        const handleKeyDown = (e) => {
            if (!isProtectedParams()) return;

            // Prevent Ctrl+C, Ctrl+U, Ctrl+S, Ctrl+P, F12
            if (
                (e.ctrlKey && (e.key === 'c' || e.key === 'u' || e.key === 's' || e.key === 'p')) ||
                e.key === 'F12'
            ) {
                e.preventDefault();
                return false;
            }
        };

        document.addEventListener('contextmenu', handleContextMenu);
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('contextmenu', handleContextMenu);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    return (
        <Router>
            <LanguageProvider>
                <AuthProvider>
                    <div className="app">
                        <Header />
                        <main style={{ minHeight: 'calc(100vh - var(--header-height))' }}>
                            <Routes>
                                {/* Public Routes */}
                                <Route path="/" element={<HomePage />} />
                                <Route path="/article/:slug" element={<ArticleDetailPage />} />
                                <Route path="/profile" element={<ProfilePage />} />
                                <Route path="/profile/:userId" element={<ProfilePage />} />
                                <Route path="/about" element={<AboutPage />} />

                                {/* Creator Routes */}
                                <Route
                                    path="/create"
                                    element={
                                        <ProtectedRoute requiredRole="creator">
                                            <CreateArticlePage />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/my-articles"
                                    element={
                                        <ProtectedRoute requiredRole="creator">
                                            <MyArticlesPage />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/edit/:slug"
                                    element={
                                        <ProtectedRoute requiredRole="creator">
                                            <EditArticlePage />
                                        </ProtectedRoute>
                                    }
                                />

                                {/* Admin Routes */}
                                <Route
                                    path="/admin"
                                    element={
                                        <ProtectedRoute requiredRole="admin">
                                            <AdminPage />
                                        </ProtectedRoute>
                                    }
                                />

                                {/* 404 */}
                                {/* 404 */}
                                <Route path="*" element={
                                    <div className="container text-center pt-16">
                                        <h1>404 - Page Not Found</h1>
                                        <p>The page you're looking for doesn't exist.</p>
                                        <a href="/" className="btn btn-primary mt-4">Go Home</a>
                                    </div>
                                } />
                                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                            </Routes>
                        </main>
                        <Footer />
                    </div>
                </AuthProvider>
            </LanguageProvider>
        </Router>
    );
}

export default App;
