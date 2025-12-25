import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../components/auth/AuthProvider';
import { getUserProfile, getUserArticles } from '../services/firestore';
import ArticleCard from '../components/articles/ArticleCard';
import { ListSkeleton } from '../components/common/LoadingStates';
import { Calendar, Mail, FileText, Eye, Award, Edit3 } from 'lucide-react';

const ProfilePage = () => {
    const { userId: urlUserId } = useParams();
    const navigate = useNavigate();
    const { currentUser } = useAuthContext();

    // Use URL userId if provided, otherwise use current user's ID
    const userId = urlUserId || currentUser?.uid;

    const [profile, setProfile] = useState(null);
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [articlesLoading, setArticlesLoading] = useState(true);
    const [error, setError] = useState(null);

    const isOwnProfile = currentUser?.uid === userId;

    useEffect(() => {
        if (userId) {
            loadProfile();
            loadArticles();
        }
    }, [userId]);

    const loadProfile = async () => {
        setLoading(true);
        const result = await getUserProfile(userId);

        if (result.success) {
            setProfile(result.data);
        } else {
            setError(result.error || 'User not found');
        }

        setLoading(false);
    };

    const loadArticles = async () => {
        setArticlesLoading(true);
        const result = await getUserArticles(userId, 'published');

        if (result.success) {
            setArticles(result.data);
        }

        setArticlesLoading(false);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading profile...</p>
                </div>
            </div>
        );
    }

    if (error || !profile) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
                <div className="text-center max-w-md">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">User Not Found</h1>
                    <p className="text-gray-600 mb-8">{error || "The profile you're looking for doesn't exist."}</p>
                    <button
                        onClick={() => navigate('/')}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-all"
                    >
                        Go Home
                    </button>
                </div>
            </div>
        );
    }

    const formatDate = (timestamp) => {
        if (!timestamp) return '';
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
    };

    const totalViews = articles.reduce((sum, article) => sum + (article.viewCount || 0), 0);

    const getRoleBadgeColor = (role) => {
        switch (role) {
            case 'admin':
                return 'bg-purple-100 text-purple-700';
            case 'creator':
                return 'bg-blue-100 text-blue-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Profile Header */}
            <div className="bg-gradient-to-br from-primary-50 to-white border-b border-gray-200">
                <div className="container mx-auto px-4 py-12">
                    <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
                        {/* Avatar */}
                        <div className="relative">
                            {profile.profileImageUrl ? (
                                <img
                                    src={profile.profileImageUrl}
                                    alt={profile.name}
                                    className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-xl"
                                />
                            ) : (
                                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-bold text-5xl border-4 border-white shadow-xl">
                                    {profile.name?.charAt(0)?.toUpperCase() || 'U'}
                                </div>
                            )}
                        </div>

                        {/* Profile Info */}
                        <div className="flex-1">
                            <div className="flex flex-col md:flex-row md:items-center gap-3 mb-3">
                                <h1 className="text-4xl font-display font-bold text-gray-900">{profile.name}</h1>
                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${getRoleBadgeColor(profile.role)}`}>
                                    <Award size={14} />
                                    {profile.role}
                                </span>
                            </div>

                            {profile.bio && (
                                <p className="text-lg text-gray-600 mb-4 max-w-2xl leading-relaxed">{profile.bio}</p>
                            )}

                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6">
                                <div className="flex items-center gap-2">
                                    <Calendar size={16} />
                                    <span>Joined {formatDate(profile.joinedAt)}</span>
                                </div>
                                <span className="text-gray-300">•</span>
                                <div className="flex items-center gap-2">
                                    <Mail size={16} />
                                    <span>{profile.email}</span>
                                </div>
                            </div>

                            {isOwnProfile && (
                                <button
                                    onClick={() => navigate('/my-articles')}
                                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-all text-sm font-medium"
                                >
                                    <Edit3 size={18} />
                                    Manage My Articles
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="bg-white border-b border-gray-200">
                <div className="container mx-auto px-4 py-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl p-6 border border-blue-100">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <FileText size={24} className="text-blue-600" />
                                </div>
                                <div>
                                    <div className="text-3xl font-bold text-gray-900">{profile.articleCount || 0}</div>
                                    <div className="text-sm text-gray-600">Articles Published</div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-green-50 to-white rounded-xl p-6 border border-green-100">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                    <Eye size={24} className="text-green-600" />
                                </div>
                                <div>
                                    <div className="text-3xl font-bold text-gray-900">{totalViews.toLocaleString()}</div>
                                    <div className="text-sm text-gray-600">Total Views</div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-purple-50 to-white rounded-xl p-6 border border-purple-100">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                    <FileText size={24} className="text-purple-600" />
                                </div>
                                <div>
                                    <div className="text-3xl font-bold text-gray-900">{articles.length}</div>
                                    <div className="text-sm text-gray-600">Articles Shown</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Published Articles */}
            <div className="container mx-auto px-4 py-12">
                <h2 className="text-3xl font-display font-bold text-gray-900 mb-8">Published Articles</h2>

                {articlesLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <ListSkeleton count={3} />
                    </div>
                ) : articles.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {articles.map(article => (
                            <ArticleCard key={article.id} article={article} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FileText size={40} className="text-gray-400" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">No Articles Yet</h3>
                        <p className="text-gray-600 mb-6">
                            {isOwnProfile ? "You haven't published any articles yet." : "No published articles yet."}
                        </p>
                        {isOwnProfile && (
                            <button
                                onClick={() => navigate('/create')}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-all font-medium"
                            >
                                Write Your First Article
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfilePage;
