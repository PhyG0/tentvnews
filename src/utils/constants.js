// App constants
export const APP_NAME = 'tentvnews';

// Categories
export const CATEGORIES = [
    'Politics',
    'Sports',
    'Technology',
    'Entertainment',
    'Business',
    'Health',
    'Science',
    'Education',
    'Lifestyle',
    'World'
];

// States (for multi-select filtering)
export const STATES = [
    'Andhra Pradesh',
    'Telangana'
];

// Article status
export const ARTICLE_STATUS = {
    DRAFT: 'draft',
    PUBLISHED: 'published',
    ARCHIVED: 'archived'
};

// Image upload constraints
export const IMAGE_CONSTRAINTS = {
    MAX_SIZE: 5 * 1024 * 1024, // 5MB
    ALLOWED_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
    FOLDER_ARTICLES: 'articles',
    FOLDER_PROFILES: 'profiles',
    FOLDER_TEMP: 'temp'
};

// Pagination
export const PAGINATION = {
    ARTICLES_PER_PAGE: 12,
    INITIAL_LOAD: 12
};

// Feed algorithm weights
export const FEED_WEIGHTS = {
    RECENCY_DECAY_HOURS: 48,
    VIEW_COUNT_WEIGHT: 0.3,
    FRESHNESS_WEIGHT: 0.7
};
