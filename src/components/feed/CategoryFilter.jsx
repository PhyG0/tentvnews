import { CATEGORIES } from '../../utils/constants';

const CategoryFilter = ({ selected, onSelect }) => {
    const { t } = useTranslation();

    const categories = ['All', ...CATEGORIES];

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
