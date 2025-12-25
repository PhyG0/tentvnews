import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../components/auth/AuthProvider';
import RichTextEditor from '../components/editor/RichTextEditor';
import ImageUploader from '../components/editor/ImageUploader';
import { getArticleBySlug, updateArticle } from '../services/firestore';
import { uploadImage } from '../services/azure';
import { CATEGORIES, ARTICLE_STATUS } from '../utils/constants';
import { Save, Send, ArrowLeft } from 'lucide-react';

const EditArticlePage = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { currentUser, userProfile } = useAuthContext();

    const [articleId, setArticleId] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        category: CATEGORIES[0],
        tags: '',
        content: '',
        status: ARTICLE_STATUS.DRAFT
    });

    const [coverImage, setCoverImage] = useState(null);
    const [coverImageUrl, setCoverImageUrl] = useState('');
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadArticle();
    }, [slug]);

    const loadArticle = async () => {
        setLoading(true);
        setError(null);

        try {
            // Using slug to fetch because navigation links use slug
            const result = await getArticleBySlug(slug);

            if (result.success) {
                const article = result.data;

                // Check if user owns this article or is admin
                if (article.authorId !== currentUser?.uid && userProfile?.role !== 'admin') {
                    setError('You do not have permission to edit this article');
                    setLoading(false);
                    return;
                }

                setArticleId(article.id);
                setFormData({
                    title: article.title,
                    slug: article.slug,
                    category: article.category,
                    tags: article.tags?.join(', ') || '',
                    content: article.content,
                    status: article.status
                });
                setCoverImageUrl(article.coverImageUrl || '');
            } else {
                setError(result.error || 'Article not found');
            }
        } catch (err) {
            console.error('Error loading article:', err);
            setError('Failed to load article');
        }

        setLoading(false);
    };

    const handleTitleChange = (e) => {
        const title = e.target.value;
        setFormData(prev => ({
            ...prev,
            title
        }));
    };

    const handleContentChange = (content) => {
        setFormData(prev => ({ ...prev, content }));
    };

    const handleImageSelect = (file) => {
        setCoverImage(file);
    };

    const handleEditorImageUpload = async (file) => {
        try {
            const uploadResult = await uploadImage(
                file,
                `articles/${currentUser.uid}/inline`
            );

            if (!uploadResult.success) {
                throw new Error('Failed to upload image: ' + uploadResult.error);
            }

            return uploadResult.url;
        } catch (err) {
            console.error('Image upload failed:', err);
            throw err;
        }
    };

    const handleSubmit = async (e, publishNow = false) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);

        try {
            // Validate
            if (!formData.title.trim()) {
                throw new Error('Title is required');
            }
            if (!formData.content.trim()) {
                throw new Error('Content is required');
            }

            let imageUrl = coverImageUrl;

            // Upload new cover image if selected
            if (coverImage) {
                const uploadResult = await uploadImage(
                    coverImage,
                    `articles/${currentUser.uid}`
                );

                if (!uploadResult.success) {
                    throw new Error('Failed to upload image: ' + uploadResult.error);
                }

                imageUrl = uploadResult.url;
            }

            // Prepare updated article data
            const articleData = {
                title: formData.title.trim(),
                slug: formData.slug,
                content: formData.content,
                category: formData.category,
                tags: formData.tags
                    .split(',')
                    .map(tag => tag.trim())
                    .filter(tag => tag),
                coverImageUrl: imageUrl,
                status: publishNow ? ARTICLE_STATUS.PUBLISHED : formData.status
            };

            // Update article
            const result = await updateArticle(articleId, articleData);

            if (result.success) {
                navigate(`/article/${formData.slug}`);
            } else {
                throw new Error(result.error || 'Failed to update article');
            }
        } catch (err) {
            setError(err.message);
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading article...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
                <div className="text-center max-w-md">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Error</h1>
                    <p className="text-gray-600 mb-8">{error}</p>
                    <button
                        onClick={() => navigate('/my-articles')}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-all"
                    >
                        <ArrowLeft size={20} />
                        Back to My Articles
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate(-1)}
                            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Edit Article</h1>
                            <p className="text-sm text-gray-500">Update and republish your story</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={(e) => handleSubmit(e, false)}
                            disabled={isSubmitting}
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm font-medium"
                        >
                            <Save size={18} />
                            {isSubmitting ? 'Saving...' : 'Save Changes'}
                        </button>
                        <button
                            onClick={(e) => handleSubmit(e, true)}
                            disabled={isSubmitting}
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm font-medium"
                        >
                            <Send size={18} />
                            {isSubmitting ? 'Publishing...' : 'Update & Publish'}
                        </button>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8 max-w-4xl">
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-600 font-medium">{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Title */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Article Title *
                        </label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={handleTitleChange}
                            placeholder="Enter a compelling title..."
                            className="w-full px-4 py-3 text-2xl font-bold border-0 focus:outline-none focus:ring-0 placeholder-gray-300"
                            required
                        />
                        <div className="mt-4 pt-4 border-t border-gray-100">
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                                URL Slug
                            </label>
                            <input
                                type="text"
                                value={formData.slug}
                                onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                                placeholder="url-slug"
                                className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                            <p className="mt-1 text-xs text-gray-500">
                                Changing the slug will change the article URL
                            </p>
                        </div>
                    </div>

                    {/* Category & Tags */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Category *
                            </label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                                required
                            >
                                {CATEGORIES.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>

                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Tags
                            </label>
                            <input
                                type="text"
                                value={formData.tags}
                                onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                                placeholder="politics, india, breaking (comma separated)"
                                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all text-sm"
                            />
                            <p className="mt-2 text-xs text-gray-500">
                                Separate multiple tags with commas
                            </p>
                        </div>
                    </div>

                    {/* Cover Image */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <label className="block text-sm font-semibold text-gray-700 mb-4">
                            Cover Image
                        </label>
                        <ImageUploader
                            onImageSelect={handleImageSelect}
                            existingImageUrl={coverImageUrl}
                        />
                    </div>

                    {/* Rich Text Editor */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <label className="block text-sm font-semibold text-gray-700 mb-4">
                            Article Content *
                        </label>
                        <RichTextEditor
                            value={formData.content}
                            onChange={handleContentChange}
                            onImageUpload={handleEditorImageUpload}
                            placeholder="Write your article content here..."
                        />
                    </div>

                    {/* Mobile Actions */}
                    <div className="md:hidden flex flex-col gap-3">
                        <button
                            type="button"
                            onClick={(e) => handleSubmit(e, true)}
                            disabled={isSubmitting}
                            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
                        >
                            <Send size={18} />
                            {isSubmitting ? 'Publishing...' : 'Update & Publish'}
                        </button>
                        <button
                            type="button"
                            onClick={(e) => handleSubmit(e, false)}
                            disabled={isSubmitting}
                            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
                        >
                            <Save size={18} />
                            {isSubmitting ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditArticlePage;
