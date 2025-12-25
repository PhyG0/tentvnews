import { useState } from 'react';
import { Search, X } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { searchArticles } from '../../services/firestore';

const SearchBar = ({ onResults }) => {
    const { t } = useTranslation();
    const [query, setQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();

        // If search is empty, clear results
        if (!query.trim()) {
            onResults(null, '');
            return;
        }

        setIsSearching(true);
        const result = await searchArticles(query);

        if (result.success) {
            onResults(result.data, query);
        }

        setIsSearching(false);
    };

    const handleClear = () => {
        setQuery('');
        onResults(null, '');
    };

    return (
        <form onSubmit={handleSearch} className="w-full">
            <div className="relative flex items-center gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        className="w-full pl-11 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent focus:bg-white transition-all placeholder-gray-500 text-sm"
                        placeholder={t('searchPlaceholder')}
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    {query && (
                        <button
                            type="button"
                            onClick={handleClear}
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-700 hover:bg-gray-200 rounded transition-all"
                            aria-label="Clear search"
                        >
                            <X size={16} />
                        </button>
                    )}
                </div>
                <button
                    type="submit"
                    className="px-6 py-3 bg-gray-900 text-white rounded-lg font-medium text-sm hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all whitespace-nowrap"
                    disabled={isSearching || !query.trim()}
                >
                    {isSearching ? t('loading') : t('search')}
                </button>
            </div>
        </form>
    );
};

export default SearchBar;
