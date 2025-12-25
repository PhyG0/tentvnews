import { Link } from 'react-router-dom';
import ArticleCard from '../articles/ArticleCard';
import { useTranslation } from '../../hooks/useTranslation';
import { ArrowRight } from 'lucide-react';

const CategorySection = ({ title, articles, category }) => {
    const { t } = useTranslation();

    if (!articles || articles.length === 0) return null;

    return (
        <section className="mb-12">
            {/* Section Header */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                    <div className="w-1 h-8 bg-gradient-to-b from-primary-600 to-primary-400 rounded-full"></div>
                    {title}
                </h2>
                <Link
                    to={`/?category=${category}`}
                    className="text-sm font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1 transition-colors"
                >
                    {t('viewMore')}
                    <ArrowRight size={16} />
                </Link>
            </div>

            {/* Articles Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {articles.slice(0, 6).map(article => (
                    <ArticleCard key={article.id} article={article} compact />
                ))}
            </div>
        </section>
    );
};

export default CategorySection;
