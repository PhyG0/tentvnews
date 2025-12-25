import { useState, useEffect } from 'react';
import { useAuthContext } from '../components/auth/AuthProvider';
import { getUserArticles } from '../services/firestore';
import ArticleCard from '../components/articles/ArticleCard';
import { ListSkeleton } from '../components/common/LoadingStates';
import { EmptyDrafts } from '../components/common/EmptyStates';

const MyArticlesPage = () => {
    const { currentUser } = useAuthContext();
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, published, draft

    useEffect(() => {
        loadArticles();
    }, [currentUser, filter]);

    const loadArticles = async () => {
        if (!currentUser) return;

        setLoading(true);
        const statusFilter = filter === 'all' ? null : filter;
        const result = await getUserArticles(currentUser.uid, statusFilter);

        if (result.success) {
            setArticles(result.data);
        }

        setLoading(false);
    };

    return (
        <div className="container pt-8 pb-16">
            <div className="flex justify-between items-center mb-8">
                <h1>My Articles</h1>
                <a href="/create" className="btn btn-primary">
                    Write New Article
                </a>
            </div>

            <div className="flex gap-2 mb-6">
                <button
                    className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-ghost'} btn-sm`}
                    onClick={() => setFilter('all')}
                >
                    All
                </button>
                <button
                    className={`btn ${filter === 'published' ? 'btn-primary' : 'btn-ghost'} btn-sm`}
                    onClick={() => setFilter('published')}
                >
                    Published
                </button>
                <button
                    className={`btn ${filter === 'draft' ? 'btn-primary' : 'btn-ghost'} btn-sm`}
                    onClick={() => setFilter('draft')}
                >
                    Drafts
                </button>
            </div>

            {loading ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 'var(--space-6)' }}>
                    <ListSkeleton count={3} />
                </div>
            ) : articles.length > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 'var(--space-6)' }}>
                    {articles.map(article => (
                        <ArticleCard key={article.id} article={article} />
                    ))}
                </div>
            ) : (
                <EmptyDrafts />
            )}
        </div>
    );
};

export default MyArticlesPage;
