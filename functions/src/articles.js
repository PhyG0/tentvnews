const functions = require('firebase-functions');
const admin = require('firebase-admin');

// Triggered when an article is published
exports.onArticlePublished = functions.firestore
    .document('articles/{articleId}')
    .onUpdate(async (change, context) => {
        const beforeData = change.before.data();
        const afterData = change.after.data();

        // Check if status changed to published
        if (beforeData.status !== 'published' && afterData.status === 'published') {
            try {
                const db = admin.firestore();

                // Increment author's article count
                const authorRef = db.collection('users').doc(afterData.authorId);
                await authorRef.update({
                    articleCount: admin.firestore.FieldValue.increment(1)
                });

                console.log('Article published, author count updated:', afterData.authorId);
            } catch (error) {
                console.error('Error updating author count:', error);
            }
        }
    });

// Triggered when an article is deleted
exports.onArticleDeleted = functions.firestore
    .document('articles/{articleId}')
    .onDelete(async (snap, context) => {
        const articleData = snap.data();

        try {
            const db = admin.firestore();

            // Decrement author's article count if it was published
            if (articleData.status === 'published') {
                const authorRef = db.collection('users').doc(articleData.authorId);
                await authorRef.update({
                    articleCount: admin.firestore.FieldValue.increment(-1)
                });
            }

            // TODO: Delete associated images from Azure
            // This would require Azure Storage SDK and cleanup logic

            console.log('Article deleted, cleanup completed:', context.params.articleId);
        } catch (error) {
            console.error('Error on article deletion:', error);
        }
    });
