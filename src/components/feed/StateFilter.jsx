import { useTranslation } from '../../hooks/useTranslation';
import { STATES } from '../../utils/constants';

const StateFilter = ({ selected, onSelect }) => {
    const { t } = useTranslation();

    const toggleState = (state) => {
        if (selected.includes(state)) {
            // Remove if already selected
            onSelect(selected.filter(s => s !== state));
        } else {
            // Add if not selected
            onSelect([...selected, state]);
        }
    };

    const getStateLabel = (state) => {
        return t(state.toLowerCase().replace(' ', ' '));
    };

    return (
        <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
                స్టేట్ (Multi-select)
            </label>
            <div className="flex flex-wrap gap-2">
                {STATES.map((state) => (
                    <button
                        key={state}
                        onClick={() => toggleState(state)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${selected.includes(state)
                                ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-md'
                                : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                            }`}
                    >
                        {getStateLabel(state)}
                    </button>
                ))}
                {selected.length > 0 && (
                    <button
                        onClick={() => onSelect([])}
                        className="px-4 py-2 rounded-lg text-sm font-medium bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 transition-all"
                    >
                        Clear All
                    </button>
                )}
            </div>
        </div>
    );
};

export default StateFilter;
