import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../components/auth/AuthProvider';
import { useLanguage, LANGUAGES, LANGUAGE_NAMES } from '../contexts/LanguageContext';
import RichTextEditor from '../components/editor/RichTextEditor';
import ImageUploader from '../components/editor/ImageUploader';
import { createArticle } from '../services/firestore';
import { uploadImage } from '../services/azure';
import { CATEGORIES, STATES, ARTICLE_STATUS } from '../utils/constants';
import { Save, Send, ArrowLeft } from 'lucide-react';

const CreateArticlePage = () => {
    const navigate = useNavigate();
    const { currentUser, userProfile } = useAuthContext();
    const { currentLanguage } = useLanguage();

    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        category: CATEGORIES[0],
        states: [], // Multi-select states field
        authorName: userProfile?.name || '',
        tags: '',
        content: '',
        status: ARTICLE_STATUS.DRAFT,
        language: currentLanguage
    });

    const [coverImage, setCoverImage] = useState(null);
    const [coverImageUrl, setCoverImageUrl] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    // Auto-generate slug from title
    const generateSlug = (title) => {
        if (!title) return '';

        // Check if title contains Telugu or other non-Latin characters
        const hasNonLatin = /[^\u0000-\u007F]/.test(title);

        if (hasNonLatin) {
            // For Telugu/non-Latin titles, create a URL-safe slug using timestamp
            const timestamp = Date.now();
            const randomStr = Math.random().toString(36).substring(2, 7);
            return `article-${timestamp}-${randomStr}`;
        } else {
            // For English titles, use standard slugification
            return title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '');
        }
    };

    const handleTitleChange = (e) => {
        const title = e.target.value;
        setFormData(prev => ({
            ...prev,
            title,
            slug: generateSlug(title)
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
            if (!formData.slug || formData.slug.trim() === '') {
                throw new Error('Slug is required. Please ensure title generates a valid slug.');
            }

            let imageUrl = coverImageUrl;

            // Upload cover image if selected
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

            // Prepare article data
            const articleData = {
                title: formData.title.trim(),
                slug: formData.slug.trim(),
                content: formData.content,
                category: formData.category,
                tags: formData.tags
                    .split(',')
                    .map(tag => tag.trim())
                    .filter(tag => tag),
                coverImageUrl: imageUrl,
                authorId: currentUser.uid,
                authorName: formData.authorName || userProfile?.name || 'Anonymous',
                status: publishNow ? ARTICLE_STATUS.PUBLISHED : formData.status,
                language: formData.language,
                states: formData.states // Include states array
            };

            // Create article
            const result = await createArticle(articleData);

            if (result.success) {
                const navigationPath = publishNow ? `/article/${articleData.slug}` : '/my-articles';
                console.log('Navigating to:', navigationPath); // Debug log
                navigate(navigationPath);
            } else {
                throw new Error(result.error || 'Failed to create article');
            }
        } catch (err) {
            console.error('Article creation error:', err);
            setError(err.message);
            setIsSubmitting(false);
        }
    };

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
                            <h1 className="text-2xl font-bold text-gray-900">Create Article</h1>
                            <p className="text-sm text-gray-500">Write and publish your news story</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={(e) => handleSubmit(e, false)}
                            disabled={isSubmitting}
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm font-medium"
                        >
                            <Save size={18} />
                            {isSubmitting ? 'Saving...' : 'Save Draft'}
                        </button>
                        <button
                            onClick={(e) => handleSubmit(e, true)}
                            disabled={isSubmitting}
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm font-medium"
                        >
                            <Send size={18} />
                            {isSubmitting ? 'Publishing...' : 'Publish'}
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
                                placeholder="auto-generated-slug"
                                className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                            <p className="mt-1 text-xs text-gray-500">
                                Auto-generated from title, but you can customize it
                            </p>
                        </div>
                    </div>

                    {/* Category & Tags & Author */}
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
                                Article Written By
                            </label>
                            <input
                                type="text"
                                value={formData.authorName}
                                onChange={(e) => setFormData(prev => ({ ...prev, authorName: e.target.value }))}
                                placeholder="Enter author name"
                                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                            />
                        </div>

                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Language *
                            </label>
                            <select
                                value={formData.language}
                                onChange={(e) => setFormData(prev => ({ ...prev, language: e.target.value }))}
                                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                                required
                            >
                                {Object.entries(LANGUAGES).map(([key, code]) => (
                                    <option key={code} value={code}>{LANGUAGE_NAMES[code]}</option>
                                ))}
                            </select>
                        </div>

                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                స్టేట్ (Multi-select - Optional)
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {STATES.map(state => (
                                    <button
                                        key={state}
                                        type="button"
                                        onClick={() => {
                                            if (formData.states.includes(state)) {
                                                setFormData(prev => ({
                                                    ...prev,
                                                    states: prev.states.filter(s => s !== state)
                                                }));
                                            } else {
                                                setFormData(prev => ({
                                                    ...prev,
                                                    states: [...prev.states, state]
                                                }));
                                            }
                                        }}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${formData.states.includes(state)
                                            ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-md'
                                            : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                                            }`}
                                    >
                                        {state}
                                    </button>
                                ))}
                                {formData.states.length > 0 && (
                                    <button
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, states: [] }))}
                                        className="px-4 py-2 rounded-lg text-sm font-medium bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 transition-all"
                                    >
                                        Clear All
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Tags */}
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
                            {isSubmitting ? 'Publishing...' : 'Publish'}
                        </button>
                        <button
                            type="button"
                            onClick={(e) => handleSubmit(e, false)}
                            disabled={isSubmitting}
                            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
                        >
                            <Save size={18} />
                            {isSubmitting ? 'Saving...' : 'Save Draft'}
                        </button>
                    </div>
                </form>
            </div >
        </div >
    );
};

export default CreateArticlePage;
