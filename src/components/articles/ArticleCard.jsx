import { Link } from 'react-router-dom';
import { formatDistance } from 'date-fns';
import { Eye, Clock } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';

const ArticleCard = ({ article, compact = false }) => {
    const { t } = useTranslation();

    const formatDate = (timestamp) => {
        if (!timestamp) return '';
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return formatDistance(date, new Date(), { addSuffix: true });
    };

    const getExcerpt = (content, maxLength = 120) => {
        if (!content) return '';
        const strippedContent = content.replace(/<[^>]*>/g, '');
        if (strippedContent.length <= maxLength) return strippedContent;
        return strippedContent.substring(0, maxLength) + '...';
    };

    if (compact) {
        // Compact variant for grid layout
        return (
            <Link
                to={`/article/${article.slug}`}
                state={{ fromApp: true }}
                className="group block bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg hover:border-primary-300 transition-all duration-200"
            >
                {/* Compact Image */}
                <div className="relative h-44 overflow-hidden bg-gray-100">
                    {article.coverImageUrl ? (
                        <img
                            src={article.coverImageUrl}
                            alt={article.title}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            loading="lazy"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                            No Image
                        </div>
                    )}

                    {/* Category badge */}
                    <span className="absolute top-2 left-2 bg-primary-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                        {article.category}
                    </span>

                    {/* Featured badge */}
                    {article.isFeatured && (
                        <span className="absolute top-2 right-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-[9px] uppercase font-bold px-2 py-0.5 rounded shadow-md">
                            ★ Featured
                        </span>
                    )}
                </div>

                {/* Compact Content */}
                <div className="p-3">
                    <h3 className="text-sm font-bold text-gray-900 line-clamp-3 mb-2 group-hover:text-primary-600 transition-colors leading-snug">
                        {article.title}
                    </h3>

                    <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                            <Clock size={12} />
                            {formatDate(article.createdAt)}
                        </span>
                        {article.viewCount > 0 && (
                            <span className="flex items-center gap-1">
                                <Eye size={12} />
                                {article.viewCount}
                            </span>
                        )}
                    </div>
                </div>
            </Link>
        );
    }

    // Default card (existing design - enhanced)
    return (
        <Link
            to={`/article/${article.slug}`}
            state={{ fromApp: true }}
            className="group flex flex-col bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl hover:border-primary-200 hover:-translate-y-1 transition-all duration-300 h-full"
        >
            {/* Image Container */}
            <div className="relative aspect-video overflow-hidden bg-gray-100">
                {article.coverImageUrl ? (
                    <img
                        src={article.coverImageUrl}
                        alt={article.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                        No Image
                    </div>
                )}

                {article.isFeatured && (
                    <span className="absolute top-3 right-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-[10px] uppercase font-bold px-2.5 py-1 rounded-full shadow-lg">
                        {t('featured')}
                    </span>
                )}
            </div>

            {/* Content */}
            <div className="flex flex-col flex-1 p-5">
                <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-primary-700 uppercase tracking-wider bg-primary-50 px-2.5 py-1 rounded-md">
                        {article.category}
                    </span>
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Clock size={14} />
                        {formatDate(article.createdAt)}
                    </span>
                </div>

                <h2 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors leading-tight">
                    {article.title}
                </h2>

                <p className="text-sm text-gray-600 mb-4 line-clamp-3 flex-1">
                    {getExcerpt(article.content)}
                </p>

                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <span className="text-sm text-gray-700 font-medium">
                        {article.authorName}
                    </span>
                    {article.viewCount > 0 && (
                        <span className="flex items-center gap-1 text-sm text-gray-500">
                            <Eye size={16} />
                            {article.viewCount}
                        </span>
                    )}
                </div>
            </div>
        </Link>
    );
};

export default ArticleCard;
