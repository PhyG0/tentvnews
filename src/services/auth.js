import {
    signInWithPopup,
    GoogleAuthProvider,
    sendSignInLinkToEmail,
    isSignInWithEmailLink,
    signInWithEmailLink,
    signOut
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './firebase';
import { ROLES } from '../utils/roles';

const googleProvider = new GoogleAuthProvider();

// Login with Google
export const loginWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;

        // Create or update user profile
        await createUserProfile(user, 'google');

        return { success: true, user };
    } catch (error) {
        console.error('Google login error:', error);
        return { success: false, error: error.message };
    }
};

// Send email login link
export const loginWithEmail = async (email) => {
    try {
        const actionCodeSettings = {
            url: window.location.origin + '/auth/complete',
            handleCodeInApp: true,
        };

        await sendSignInLinkToEmail(auth, email, actionCodeSettings);

        // Save email locally for completion
        window.localStorage.setItem('emailForSignIn', email);

        return { success: true };
    } catch (error) {
        console.error('Email login error:', error);
        return { success: false, error: error.message };
    }
};

// Complete email login
export const completeEmailLogin = async (url) => {
    try {
        if (isSignInWithEmailLink(auth, url)) {
            let email = window.localStorage.getItem('emailForSignIn');

            if (!email) {
                email = window.prompt('Please provide your email for confirmation');
            }

            const result = await signInWithEmailLink(auth, email, url);
            window.localStorage.removeItem('emailForSignIn');

            // Create or update user profile
            await createUserProfile(result.user, 'email');

            return { success: true, user: result.user };
        }

        return { success: false, error: 'Invalid sign-in link' };
    } catch (error) {
        console.error('Complete email login error:', error);
        return { success: false, error: error.message };
    }
};

// Create user profile in Firestore
export const createUserProfile = async (user, authProvider) => {
    if (!user) return;

    const userRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userRef);

    // Only create if doesn't exist
    if (!userDoc.exists()) {
        const userData = {
            userId: user.uid,
            name: user.displayName || 'Anonymous User',
            email: user.email,
            profileImageUrl: user.photoURL || '',
            bio: '',
            role: ROLES.VIEWER, // Default role
            authProvider: authProvider,
            joinedAt: serverTimestamp(),
            articleCount: 0
        };

        await setDoc(userRef, userData);
        return userData;
    }

    return userDoc.data();
};

// Logout
export const logout = async () => {
    try {
        await signOut(auth);
        return { success: true };
    } catch (error) {
        console.error('Logout error:', error);
        return { success: false, error: error.message };
    }
};
