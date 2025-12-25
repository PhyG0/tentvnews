import { useTranslation } from '../../hooks/useTranslation';

const CategoryFilter = ({ selected, onSelect }) => {
    const { t } = useTranslation();

    const categories = [
        'All',
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

    const getCategoryLabel = (cat) => {
        if (cat === 'All') return t('allCategories');
        return t(cat.toLowerCase());
    };

    return (
        <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
                <button
                    key={cat}
                    onClick={() => onSelect(cat)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selected === cat
                            ? 'bg-black text-white shadow-sm'
                            : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                        }`}
                >
                    {getCategoryLabel(cat)}
                </button>
            ))}
        </div>
    );
};

export default CategoryFilter;
