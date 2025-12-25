import { useState, useEffect } from 'react';
import { getFeedArticles, getArticlesByCategory } from '../services/firestore';

export const useArticles = (category = null) => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lastDocument, setLastDocument] = useState(null);
    const [hasMore, setHasMore] = useState(true);

    const loadArticles = async (isLoadMore = false) => {
        try {
            setLoading(true);

            // Add timeout to prevent infinite loading
            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Request timeout')), 10000)
            );

            let result;
            if (category && category !== 'All') {
                result = await Promise.race([
                    getArticlesByCategory(category),
                    timeoutPromise
                ]);
            } else {
                result = await Promise.race([
                    getFeedArticles(12, isLoadMore ? lastDocument : null),
                    timeoutPromise
                ]);
            }

            if (result.success) {
                if (isLoadMore) {
                    setArticles(prev => [...prev, ...result.data]);
                } else {
                    setArticles(result.data);
                }

                if (result.lastDocument) {
                    setLastDocument(result.lastDocument);
                }

                setHasMore(result.hasMore !== undefined ? result.hasMore : false);
                setError(null); // Clear any previous errors
            } else {
                setError(result.error);
            }
        } catch (err) {
            console.error('Load articles error:', err);
            setError(err.message);
            // Set empty array on error to show empty state instead of infinite loading
            if (!isLoadMore) {
                setArticles([]);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadArticles();
    }, [category]);

    const loadMore = () => {
        if (hasMore && !loading) {
            return loadArticles(true);
        }
        return Promise.resolve();
    };

    const refresh = () => {
        setLastDocument(null);
        setHasMore(true);
        return loadArticles(false);
    };

    return { articles, loading, error, hasMore, loadMore, refresh };
};
