import { useState } from 'react';
import { useLanguage, LANGUAGES, LANGUAGE_NAMES } from '../../contexts/LanguageContext';
import { Globe, ChevronDown } from 'lucide-react';

const LanguageSelector = () => {
    const { currentLanguage, setLanguage, languages } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);

    const handleLanguageChange = (code) => {
        setLanguage(code);
        setIsOpen(false);
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
                <Globe size={18} />
                <span>{LANGUAGE_NAMES[currentLanguage]}</span>
                <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown */}
            {isOpen && (
                <>
                    {/* Backdrop for mobile */}
                    <div
                        className="fixed inset-0 z-40 md:hidden"
                        onClick={() => setIsOpen(false)}
                    />

                    <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="py-2">
                            {Object.entries(languages).map(([key, code]) => (
                                <button
                                    key={code}
                                    onClick={() => handleLanguageChange(code)}
                                    className={`w-full px-4 py-2 text-left text-sm transition-colors ${currentLanguage === code
                                            ? 'bg-primary-50 text-primary-700 font-semibold'
                                            : 'text-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    {LANGUAGE_NAMES[code]}
                                </button>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default LanguageSelector;
