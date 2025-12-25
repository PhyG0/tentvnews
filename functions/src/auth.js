const functions = require('firebase-functions');
const admin = require('firebase-admin');

// Triggered when a new user is created via Firebase Auth
exports.onUserCreated = functions.auth.user().onCreate(async (user) => {
    try {
        const db = admin.firestore();

        const userDoc = {
            userId: user.uid,
            name: user.displayName || 'Anonymous User',
            email: user.email,
            profileImageUrl: user.photoURL || '',
            bio: '',
            role: 'viewer', // Default role
            authProvider: user.providerData[0]?.providerId || 'unknown',
            joinedAt: admin.firestore.FieldValue.serverTimestamp(),
            articleCount: 0
        };

        await db.collection('users').doc(user.uid).set(userDoc);

        console.log('User profile created:', user.uid);
    } catch (error) {
        console.error('Error creating user profile:', error);
    }
});
