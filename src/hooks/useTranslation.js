import { useLanguage } from '../contexts/LanguageContext';
import translations from '../utils/translations';

export const useTranslation = () => {
    const { currentLanguage } = useLanguage();

    const t = (key) => {
        return translations[currentLanguage][key] || key;
    };

    return { t, currentLanguage };
};
