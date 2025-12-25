import { FEED_WEIGHTS } from '../utils/constants';

// Calculate recency score (exponential decay)
const calculateRecencyScore = (createdAt) => {
    if (!createdAt) return 0;

    const now = Date.now();
    const articleTime = createdAt.toMillis ? createdAt.toMillis() : createdAt;
    const ageInHours = (now - articleTime) / (1000 * 60 * 60);

    // Exponential decay: articles lose half their recency value every RECENCY_DECAY_HOURS
    const decayFactor = Math.exp(-ageInHours / FEED_WEIGHTS.RECENCY_DECAY_HOURS);

    return decayFactor;
};

// Calculate engagement score
const calculateEngagementScore = (viewCount) => {
    // Logarithmic scale to prevent viral articles from dominating too much
    return Math.log10((viewCount || 0) + 1);
};

// Calculate final ranking score
const calculateRankingScore = (article) => {
    const recencyScore = calculateRecencyScore(article.createdAt);
    const engagementScore = calculateEngagementScore(article.viewCount);

    // Weighted combination
    const finalScore =
        recencyScore * FEED_WEIGHTS.FRESHNESS_WEIGHT +
        engagementScore * FEED_WEIGHTS.VIEW_COUNT_WEIGHT;

    return finalScore;
};

// Rank articles for feed
export const rankArticlesForFeed = (articles) => {
    if (!articles || articles.length === 0) {
        return [];
    }

    // Separate featured articles
    const featured = articles.filter(article => article.isFeatured);
    const regular = articles.filter(article => !article.isFeatured);

    // Calculate scores for regular articles
    const scoredArticles = regular.map(article => ({
        ...article,
        _rankingScore: calculateRankingScore(article)
    }));

    // Sort by score (descending)
    scoredArticles.sort((a, b) => b._rankingScore - a._rankingScore);

    // Featured articles always come first
    return [...featured, ...scoredArticles];
};

// Filter articles by category
export const filterByCategory = (articles, category) => {
    if (!category || category === 'All') {
        return articles;
    }

    return articles.filter(article => article.category === category);
};

// Get trending articles (high engagement in last 48 hours)
export const getTrendingArticles = (articles, count = 5) => {
    const now = Date.now();
    const twoHoursDays = 48 * 60 * 60 * 1000;

    const recentArticles = articles.filter(article => {
        const articleTime = article.createdAt?.toMillis ? article.createdAt.toMillis() : article.createdAt;
        return (now - articleTime) < twoHoursDays;
    });

    // Sort by view count
    recentArticles.sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0));

    return recentArticles.slice(0, count);
};
