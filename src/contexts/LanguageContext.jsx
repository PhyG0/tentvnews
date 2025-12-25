import { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const LANGUAGES = {
    TELUGU: 'te',
    ENGLISH: 'en'
};

export const LANGUAGE_NAMES = {
    [LANGUAGES.TELUGU]: 'తెలుగు',
    [LANGUAGES.ENGLISH]: 'English'
};

export const LanguageProvider = ({ children }) => {
    const [currentLanguage, setCurrentLanguage] = useState(() => {
        // Get from localStorage or default to Telugu
        const saved = localStorage.getItem('tentvnews_language');
        return saved || LANGUAGES.TELUGU;
    });

    useEffect(() => {
        // Persist language preference
        localStorage.setItem('tentvnews_language', currentLanguage);
    }, [currentLanguage]);

    const value = {
        currentLanguage,
        setLanguage: setCurrentLanguage,
        languages: LANGUAGES,
        languageNames: LANGUAGE_NAMES,
        isTelugu: currentLanguage === LANGUAGES.TELUGU,
        isEnglish: currentLanguage === LANGUAGES.ENGLISH
    };

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within LanguageProvider');
    }
    return context;
};
