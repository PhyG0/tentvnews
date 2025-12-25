import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import ArticleCard from '../components/articles/ArticleCard';
import CategoryFilter from '../components/feed/CategoryFilter';
import StateFilter from '../components/feed/StateFilter';
import SearchBar from '../components/feed/SearchBar';
import CategorySection from '../components/common/CategorySection';
import { ListSkeleton } from '../components/common/LoadingStates';
import { EmptyArticles, EmptySearchResults } from '../components/common/EmptyStates';
import { useArticles } from '../hooks/useArticles';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import { rankArticlesForFeed } from '../services/feedAlgorithm';
import { useLanguage } from '../contexts/LanguageContext';
import { useTranslation } from '../hooks/useTranslation';
import { Clock, TrendingUp, Eye } from 'lucide-react';
import { format } from 'date-fns';

const HomePage = () => {
    const { t } = useTranslation();
    const { currentLanguage } = useLanguage();
    const [searchParams, setSearchParams] = useSearchParams();
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedStates, setSelectedStates] = useState([]);
    const [searchResults, setSearchResults] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    // Read category from URL on mount and when it changes
    useEffect(() => {
        const categoryFromUrl = searchParams.get('category');
        if (categoryFromUrl) {
            setSelectedCategory(categoryFromUrl);
            // Scroll to top when navigating via "View More"
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [searchParams]);

    // Clear search when navigating to home (fresh page load)
    useEffect(() => {
        // Only clear if there are no URL params (clean home navigation)
        if (!searchParams.get('category')) {
            setSearchResults(null);
            setSearchQuery('');
        }
    }, []); // Run once on mount

    const { articles, loading, error, hasMore, loadMore } = useArticles(
        selectedCategory === 'All' ? null : selectedCategory
    );

    const [isFetchingMore] = useInfiniteScroll(loadMore, hasMore && !searchResults);

    // Filter articles by language
    const languageFilteredArticles = (searchResults || articles).filter(
        article => article.language === currentLanguage || !article.language
    );

    const rankedArticles = rankArticlesForFeed(languageFilteredArticles);

    // Filter by selected states (multi-select)
    const stateFilteredArticles = selectedStates.length > 0
        ? rankedArticles.filter(article => {
            // Handle both old 'state' field and new 'states' array
            if (Array.isArray(article.states)) {
                return article.states.some(state => selectedStates.includes(state));
            } else if (article.state) {
                return selectedStates.includes(article.state);
            }
            return false;
        })
        : rankedArticles;

    // Group articles by category
    const getArticlesByCategory = (category) => {
        return stateFilteredArticles.filter(article => article.category === category);
    };

    const handleSearchResults = (results, query) => {
        setSearchResults(results);
        setSearchQuery(query);
    };

    if (loading && !articles.length) return <ListSkeleton count={6} />;
    if (error) return <div className="container mx-auto px-4 py-8 text-center text-red-600">{error}</div>;

    return (
        <div className="min-h-screen bg-gray-50 pt-20">
            <div className="container mx-auto px-4 py-6">
                {/* Search & Filter Section */}
                <div className="mb-8 space-y-4">
                    {/* Search Bar */}
                    <SearchBar onResults={handleSearchResults} />

                    {/* Category Filter */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            {t('categories')}
                        </label>
                        <CategoryFilter
                            selected={selectedCategory}
                            onSelect={setSelectedCategory}
                        />
                    </div>

                    {/* State Filter */}
                    <StateFilter
                        selected={selectedStates}
                        onSelect={setSelectedStates}
                    />
                </div>

                {searchResults ? (
                    /* Search Results */
                    <div className="mb-12">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">
                                {t('searchResults')} <span className="text-primary-600">"{searchQuery}"</span>
                            </h2>
                            <button
                                className="text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
                                onClick={() => handleSearchResults(null, '')}
                            >
                                {t('clearSearch')}
                            </button>
                        </div>

                        {stateFilteredArticles.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {stateFilteredArticles.map(article => (
                                    <ArticleCard key={article.id} article={article} compact />
                                ))}
                            </div>
                        ) : (
                            <EmptySearchResults />
                        )}
                    </div>
                ) : (
                    /* Main Content */
                    <>
                        {stateFilteredArticles.length === 0 ? (
                            <EmptyArticles />
                        ) : (
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                                {/* Main Content Column */}
                                <div className="lg:col-span-8">
                                    {/* Latest Articles Grid */}
                                    <section className="mb-12">
                                        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                                            <div className="w-1 h-8 bg-gradient-to-b from-primary-600 to-primary-400 rounded-full"></div>
                                            {t('latestNews')}
                                        </h2>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                                            {stateFilteredArticles.slice(0, 9).map(article => (
                                                <ArticleCard key={article.id} article={article} compact />
                                            ))}
                                        </div>
                                    </section>

                                    {/* Category Sections */}
                                    <CategorySection
                                        title={t('politics')}
                                        articles={getArticlesByCategory('Politics')}
                                        category="Politics"
                                    />

                                    <CategorySection
                                        title={t('sports')}
                                        articles={getArticlesByCategory('Sports')}
                                        category="Sports"
                                    />

                                    <CategorySection
                                        title={t('entertainment')}
                                        articles={getArticlesByCategory('Entertainment')}
                                        category="Entertainment"
                                    />

                                    <CategorySection
                                        title={t('technology')}
                                        articles={getArticlesByCategory('Technology')}
                                        category="Technology"
                                    />

                                    <CategorySection
                                        title={t('business')}
                                        articles={getArticlesByCategory('Business')}
                                        category="Business"
                                    />
                                </div>

                                {/* Sidebar */}
                                <aside className="lg:col-span-4">
                                    {/* Trending Section */}
                                    <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-24 mb-6">
                                        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                            <TrendingUp size={22} className="text-red-600" />
                                            {t('trendingNow')}
                                        </h3>
                                        <div className="space-y-4">
                                            {stateFilteredArticles
                                                .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
                                                .slice(0, 8)
                                                .map((article, index) => (
                                                    <Link
                                                        key={article.id}
                                                        to={`/article/${article.slug}`}
                                                        className="flex gap-3 group"
                                                    >
                                                        <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-primary-600 to-primary-400 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                                                            {index + 1}
                                                        </div>
                                                        <div className="flex-1">
                                                            <h4 className="text-sm font-semibold text-gray-900 line-clamp-2 group-hover:text-primary-600 transition-colors mb-1">
                                                                {article.title}
                                                            </h4>
                                                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                                                <span className="flex items-center gap-1">
                                                                    <Eye size={12} />
                                                                    {article.viewCount || 0}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </Link>
                                                ))}
                                        </div>
                                    </div>
                                </aside>
                            </div>
                        )}
                    </>
                )}

                {/* Load More Indicator */}
                {isFetchingMore && !searchResults && (
                    <div className="py-8 text-center">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary-600 border-t-transparent"></div>
                        <p className="mt-2 text-sm text-gray-600">{t('loading')}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HomePage;
