import { Filter, X } from 'lucide-react';
import { Badge } from '../ui/Badge';

export type RecipeFilter = {
  mealType: string | null;
  season: string | null;
  source: string | null;
};

interface RecipeFiltersProps {
  filters: RecipeFilter;
  onChange: (filters: RecipeFilter) => void;
}

const MEAL_TYPES = ['breakfast', 'lunch', 'dinner', 'dessert', 'snack', 'side dish'];
const SEASONS = ['spring', 'summer', 'fall', 'winter'];
const SOURCES = ['curated', 'community'];

export function RecipeFilters({ filters, onChange }: RecipeFiltersProps) {
  const hasActive = filters.mealType || filters.season || filters.source;

  const toggleFilter = (key: keyof RecipeFilter, value: string) => {
    onChange({ ...filters, [key]: filters[key] === value ? null : value });
  };

  const clearAll = () => onChange({ mealType: null, season: null, source: null });

  return (
    <div className="px-4 py-3 space-y-3 border-b border-gray-100 bg-white">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Filter size={16} />
          <span className="font-medium">Filters</span>
        </div>
        {hasActive && (
          <button
            onClick={clearAll}
            className="text-xs text-market-700 font-medium flex items-center gap-1"
          >
            <X size={14} />
            Clear all
          </button>
        )}
      </div>

      {/* Meal type chips */}
      <div className="flex flex-wrap gap-2">
        {MEAL_TYPES.map((type) => (
          <button
            key={type}
            onClick={() => toggleFilter('mealType', type)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors capitalize ${
              filters.mealType === type
                ? 'bg-market-700 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Season chips */}
      <div className="flex flex-wrap gap-2">
        {SEASONS.map((season) => (
          <button
            key={season}
            onClick={() => toggleFilter('season', season)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors capitalize ${
              filters.season === season
                ? 'bg-earth-500 text-white'
                : 'bg-earth-50 text-earth-700 hover:bg-earth-100'
            }`}
          >
            {season}
          </button>
        ))}
      </div>

      {/* Source chips */}
      <div className="flex flex-wrap gap-2">
        {SOURCES.map((source) => (
          <button
            key={source}
            onClick={() => toggleFilter('source', source)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors capitalize ${
              filters.source === source
                ? 'bg-gray-700 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {source === 'curated' ? 'Market Kitchen' : 'Community'}
          </button>
        ))}
      </div>

      {hasActive && (
        <div className="flex gap-2 items-center text-xs text-gray-400">
          <span>Active:</span>
          {filters.mealType && <Badge variant="green">{filters.mealType}</Badge>}
          {filters.season && <Badge variant="amber">{filters.season}</Badge>}
          {filters.source && <Badge variant="gray">{filters.source}</Badge>}
        </div>
      )}
    </div>
  );
}
