import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { format } from 'date-fns';
import { getArticleBySlug, incrementViewCount, deleteArticle, getUserProfile } from '../services/firestore';
import Toast from '../components/common/Toast';
import ConfirmDialog from '../components/common/ConfirmDialog';
import { useAuthContext } from '../components/auth/AuthProvider';
import { ArticleDetailSkeleton } from '../components/common/LoadingStates';
import { isCreator, isAdmin } from '../utils/roles';
import { Calendar, Eye, Edit, Trash2, ArrowLeft } from 'lucide-react';

const ArticleDetailPage = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { currentUser, userProfile } = useAuthContext();

    const [article, setArticle] = useState(null);
    const [author, setAuthor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [toast, setToast] = useState(null);
    const [confirmDialog, setConfirmDialog] = useState(null);

    useEffect(() => {
        loadArticle();
    }, [slug]);

    const loadArticle = async () => {
        try {
            setLoading(true);
            const result = await getArticleBySlug(slug);

            if (result.success) {
                setArticle(result.data);

                // Increment view count (only once per session)
                const viewedKey = `viewed_${result.data.id}`;
                if (!sessionStorage.getItem(viewedKey)) {
                    await incrementViewCount(result.data.id);
                    sessionStorage.setItem(viewedKey, 'true');
                }

                // Load author profile
                const authorResult = await getUserProfile(result.data.authorId);
                if (authorResult.success) {
                    setAuthor(authorResult.data);
                }
            } else {
                setError(result.error);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const showConfirm = (title, message, onConfirm, type = 'danger') => {
        setConfirmDialog({ title, message, onConfirm, type });
    };

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
    };

    const handleDelete = () => {
        showConfirm(
            'Delete Article',
            `Are you sure you want to delete "${article.title}"? This action cannot be undone and will permanently remove the article.`,
            async () => {
                setIsDeleting(true);
                setConfirmDialog(null);
                const result = await deleteArticle(article.id);

                if (result.success) {
                    navigate('/', { state: { message: 'Article deleted successfully' } });
                } else {
                    showToast('Failed to delete article: ' + result.error, 'error');
                    setIsDeleting(false);
                }
            },
            'danger'
        );
    };

    const canEdit = currentUser && (
        article?.authorId === currentUser.uid ||
        isAdmin(userProfile?.role)
    );

    if (loading) {
        return <ArticleDetailSkeleton />;
    }

    if (error || !article) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
                <div className="text-center max-w-md">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Article Not Found</h1>
                    <p className="text-gray-600 mb-8">{error || "The article you're looking for doesn't exist."}</p>
                    <Link to="/" className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-all">
                        <ArrowLeft size={20} /> Go Home
                    </Link>
                </div>
            </div>
        );
    }

    const formatDate = (timestamp) => {
        if (!timestamp) return '';
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return format(date, 'MMMM dd, yyyy');
    };

    return (
        <article className="min-h-screen bg-gray-50">
            {/* Toast Notification */}
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}

            {/* Confirmation Dialog */}
            {confirmDialog && (
                <ConfirmDialog
                    isOpen={true}
                    title={confirmDialog.title}
                    message={confirmDialog.message}
                    type={confirmDialog.type}
                    onConfirm={confirmDialog.onConfirm}
                    onCancel={() => setConfirmDialog(null)}
                />
            )}
            {/* Back Button */}
            <div className="bg-white border-b border-gray-100">
                <div className="container mx-auto px-4 py-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        <ArrowLeft size={18} />
                        Back
                    </button>
                </div>
            </div>

            {/* Article Header */}
            <header className="bg-white border-b border-gray-100">
                <div className="container mx-auto px-4 py-12 max-w-4xl">
                    {/* Category & View Count */}
                    <div className="flex items-center gap-4 mb-6">
                        <span className="inline-block px-3 py-1 text-xs font-bold text-primary-600 uppercase bg-primary-50 rounded-full tracking-wider">
                            {article.category}
                        </span>
                        {article.isFeatured && (
                            <span className="inline-block px-3 py-1 text-xs font-bold text-yellow-700 uppercase bg-yellow-50 rounded-full tracking-wider">
                                Featured
                            </span>
                        )}
                        <div className="flex items-center gap-1.5 text-sm text-gray-500">
                            <Eye size={16} />
                            <span>{article.viewCount || 0} views</span>
                        </div>
                    </div>

                    {/* Title */}
                    <h1 className="text-4xl md:text-5xl font-display font-extrabold text-gray-900 mb-8 leading-tight tracking-tight">
                        {article.title}
                    </h1>

                    {/* Author & Date */}
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3">
                            {author?.profileImageUrl ? (
                                <img
                                    src={author.profileImageUrl}
                                    alt={author.name}
                                    className="w-12 h-12 rounded-full object-cover border-2 border-gray-100"
                                />
                            ) : (
                                <div className="w-12 h-12 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-semibold text-lg">
                                    {author?.name?.charAt(0) || article.authorName?.charAt(0) || 'A'}
                                </div>
                            )}
                            <div>
                                <Link
                                    to={`/profile/${article.authorId}`}
                                    className="font-semibold text-gray-900 hover:text-primary-600 transition-colors"
                                >
                                    {author?.name || article.authorName || 'Anonymous'}
                                </Link>
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <Calendar size={14} />
                                    {formatDate(article.createdAt)}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Cover Image */}
            {article.coverImageUrl && (
                <div className="bg-white">
                    <div className="container mx-auto px-4 py-8 max-w-5xl">
                        <img
                            src={article.coverImageUrl}
                            alt={article.title}
                            className="w-full h-auto rounded-2xl shadow-2xl object-cover"
                            style={{ maxHeight: '600px' }}
                        />
                    </div>
                </div>
            )}

            {/* Article Body */}
            <div className="bg-white py-12">
                <div className="container mx-auto px-4 max-w-3xl">
                    <div
                        className="prose prose-lg prose-gray max-w-none
                            prose-headings:font-display prose-headings:font-bold prose-headings:tracking-tight
                            prose-p:text-gray-700 prose-p:leading-relaxed
                            prose-a:text-primary-600 prose-a:no-underline hover:prose-a:underline
                            prose-img:rounded-xl prose-img:shadow-lg
                            prose-blockquote:border-l-4 prose-blockquote:border-primary-500 prose-blockquote:bg-gray-50 prose-blockquote:py-2 prose-blockquote:px-6
                            prose-code:bg-gray-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm"
                        dangerouslySetInnerHTML={{ __html: article.content }}
                    />

                    {/* Tags */}
                    {article.tags && article.tags.length > 0 && (
                        <div className="mt-12 pt-8 border-t border-gray-200">
                            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Tags</h3>
                            <div className="flex flex-wrap gap-2">
                                {article.tags.map(tag => (
                                    <span
                                        key={tag}
                                        className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
                                    >
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Actions */}
            {canEdit && (
                <div className="bg-white border-t border-gray-100 py-6">
                    <div className="container mx-auto px-4 max-w-3xl flex items-center justify-end gap-3">
                        <button
                            onClick={() => navigate(`/edit/${article.slug}`)}
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-all text-sm font-medium"
                        >
                            <Edit size={18} />
                            Edit Article
                        </button>
                        <button
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm font-medium"
                        >
                            <Trash2 size={18} />
                            {isDeleting ? 'Deleting...' : 'Delete Article'}
                        </button>
                    </div>
                </div>
            )}
        </article>
    );
};

export default ArticleDetailPage;
