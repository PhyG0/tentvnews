import {
    collection,
    doc,
    getDoc,
    getDocs,
    setDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    limit,
    startAfter,
    increment,
    serverTimestamp
} from 'firebase/firestore';
import { db } from './firebase';

// ========== USERS ==========

export const getUserProfile = async (userId) => {
    try {
        const userRef = doc(db, 'users', userId);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
            return { success: true, data: userDoc.data() };
        }

        return { success: false, error: 'User not found' };
    } catch (error) {
        console.error('Get user profile error:', error);
        return { success: false, error: error.message };
    }
};

export const updateUserProfile = async (userId, data) => {
    try {
        const userRef = doc(db, 'users', userId);
        await updateDoc(userRef, {
            ...data,
            updatedAt: serverTimestamp()
        });

        return { success: true };
    } catch (error) {
        console.error('Update user profile error:', error);
        return { success: false, error: error.message };
    }
};

export const updateUserRole = async (userId, role) => {
    try {
        const userRef = doc(db, 'users', userId);
        await updateDoc(userRef, {
            role: role,
            updatedAt: serverTimestamp()
        });

        return { success: true };
    } catch (error) {
        console.error('Update user role error:', error);
        return { success: false, error: error.message };
    }
};

export const getAllUsers = async () => {
    try {
        const usersRef = collection(db, 'users');
        const snapshot = await getDocs(usersRef);

        const users = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        return { success: true, data: users };
    } catch (error) {
        console.error('Get all users error:', error);
        return { success: false, error: error.message };
    }
};

// ========== ARTICLES ==========

export const createArticle = async (article) => {
    try {
        const articlesRef = collection(db, 'articles');
        const newArticleRef = doc(articlesRef);

        const articleData = {
            articleId: newArticleRef.id,
            ...article,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            viewCount: 0,
            isFeatured: false
        };

        await setDoc(newArticleRef, articleData);

        return { success: true, articleId: newArticleRef.id };
    } catch (error) {
        console.error('Create article error:', error);
        return { success: false, error: error.message };
    }
};

export const updateArticle = async (articleId, data) => {
    try {
        const articleRef = doc(db, 'articles', articleId);
        await updateDoc(articleRef, {
            ...data,
            updatedAt: serverTimestamp()
        });

        return { success: true };
    } catch (error) {
        console.error('Update article error:', error);
        return { success: false, error: error.message };
    }
};

export const deleteArticle = async (articleId) => {
    try {
        // First, get the article to extract image URLs
        const articleRef = doc(db, 'articles', articleId);
        const articleSnap = await getDoc(articleRef);

        if (!articleSnap.exists()) {
            return { success: false, error: 'Article not found' };
        }

        const article = articleSnap.data();

        // Import Azure functions dynamically to avoid circular dependency
        const { deleteBlob, extractBlobPath, extractImageUrlsFromContent } = await import('./azure');

        // Collect all image URLs
        const imageUrls = [];

        // Add cover image
        if (article.coverImageUrl) {
            imageUrls.push(article.coverImageUrl);
        }

        // Extract inline images from content
        if (article.content) {
            const inlineImages = extractImageUrlsFromContent(article.content);
            imageUrls.push(...inlineImages);
        }

        // Delete blobs from Azure Storage
        for (const url of imageUrls) {
            const blobPath = extractBlobPath(url);
            if (blobPath) {
                await deleteBlob(blobPath);
                console.log(`Deleted blob: ${blobPath}`);
            }
        }

        // Finally, delete the Firestore document
        await deleteDoc(articleRef);

        return { success: true };
    } catch (error) {
        console.error('Delete article error:', error);
        return { success: false, error: error.message };
    }
};

export const getArticle = async (articleId) => {
    try {
        const articleRef = doc(db, 'articles', articleId);
        const articleDoc = await getDoc(articleRef);

        if (articleDoc.exists()) {
            return { success: true, data: { id: articleDoc.id, ...articleDoc.data() } };
        }

        return { success: false, error: 'Article not found' };
    } catch (error) {
        console.error('Get article error:', error);
        return { success: false, error: error.message };
    }
};

export const getArticleBySlug = async (slug) => {
    try {
        const articlesRef = collection(db, 'articles');
        const q = query(articlesRef, where('slug', '==', slug), limit(1));
        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
            const doc = snapshot.docs[0];
            return { success: true, data: { id: doc.id, ...doc.data() } };
        }

        return { success: false, error: 'Article not found' };
    } catch (error) {
        console.error('Get article by slug error:', error);
        return { success: false, error: error.message };
    }
};

export const getUserArticles = async (userId, statusFilter = null) => {
    try {
        const articlesRef = collection(db, 'articles');
        let q = query(
            articlesRef,
            where('authorId', '==', userId),
            orderBy('createdAt', 'desc')
        );

        if (statusFilter) {
            q = query(
                articlesRef,
                where('authorId', '==', userId),
                where('status', '==', statusFilter),
                orderBy('createdAt', 'desc')
            );
        }

        const snapshot = await getDocs(q);
        const articles = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        return { success: true, data: articles };
    } catch (error) {
        console.error('Get user articles error:', error);
        return { success: false, error: error.message };
    }
};

export const getFeedArticles = async (limitCount = 12, lastDocument = null) => {
    try {
        const articlesRef = collection(db, 'articles');
        let q = query(
            articlesRef,
            where('status', '==', 'published'),
            orderBy('createdAt', 'desc'),
            limit(limitCount)
        );

        if (lastDocument) {
            q = query(
                articlesRef,
                where('status', '==', 'published'),
                orderBy('createdAt', 'desc'),
                startAfter(lastDocument),
                limit(limitCount)
            );
        }

        const snapshot = await getDocs(q);
        const articles = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        const lastDoc = snapshot.docs[snapshot.docs.length - 1];

        return {
            success: true,
            data: articles,
            lastDocument: lastDoc,
            hasMore: snapshot.docs.length === limitCount
        };
    } catch (error) {
        console.error('Get feed articles error:', error);
        return { success: false, error: error.message };
    }
};

export const getArticlesByCategory = async (category, limitCount = 12) => {
    try {
        const articlesRef = collection(db, 'articles');
        const q = query(
            articlesRef,
            where('status', '==', 'published'),
            where('category', '==', category),
            orderBy('createdAt', 'desc'),
            limit(limitCount)
        );

        const snapshot = await getDocs(q);
        const articles = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        return { success: true, data: articles };
    } catch (error) {
        console.error('Get articles by category error:', error);
        return { success: false, error: error.message };
    }
};

export const searchArticles = async (searchTerm) => {
    try {
        const articlesRef = collection(db, 'articles');
        const q = query(
            articlesRef,
            where('status', '==', 'published'),
            orderBy('createdAt', 'desc'),
            limit(50)
        );

        const snapshot = await getDocs(q);
        const allArticles = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        // Client-side filtering (Firestore doesn't support full-text search natively)
        const filteredArticles = allArticles.filter(article => {
            const searchLower = searchTerm.toLowerCase();
            return (
                article.title?.toLowerCase().includes(searchLower) ||
                article.tags?.some(tag => tag.toLowerCase().includes(searchLower))
            );
        });

        return { success: true, data: filteredArticles };
    } catch (error) {
        console.error('Search articles error:', error);
        return { success: false, error: error.message };
    }
};

// ========== ANALYTICS ==========

export const incrementViewCount = async (articleId) => {
    try {
        const articleRef = doc(db, 'articles', articleId);
        await updateDoc(articleRef, {
            viewCount: increment(1)
        });

        return { success: true };
    } catch (error) {
        console.error('Increment view count error:', error);
        return { success: false, error: error.message };
    }
};

export const getArticleAnalytics = async (articleId) => {
    try {
        const articleRef = doc(db, 'articles', articleId);
        const articleDoc = await getDoc(articleRef);

        if (articleDoc.exists()) {
            const data = articleDoc.data();
            return {
                success: true,
                data: {
                    viewCount: data.viewCount || 0,
                    createdAt: data.createdAt,
                    updatedAt: data.updatedAt
                }
            };
        }

        return { success: false, error: 'Article not found' };
    } catch (error) {
        console.error('Get article analytics error:', error);
        return { success: false, error: error.message };
    }
};
