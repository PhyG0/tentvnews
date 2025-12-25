import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../services/firebase';
import { getUserProfile } from '../services/firestore';

export const useAuth = () => {
    const [currentUser, setCurrentUser] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setCurrentUser(user);

            if (user) {
                // Fetch user profile from Firestore
                const result = await getUserProfile(user.uid);
                if (result.success) {
                    setUserProfile(result.data);
                }
            } else {
                setUserProfile(null);
            }

            setLoading(false);
        });

        return unsubscribe;
    }, []);

    return { currentUser, userProfile, loading };
};
