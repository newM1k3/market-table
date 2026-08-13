import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { RecipeFilters, type RecipeFilter } from '../components/recipes/RecipeFilters';
import { RecipeGrid } from '../components/recipes/RecipeGrid';
import { CURATED_RECIPES } from '../data/recipes';

// Map seed recipes to the Recipe type expected by components
const ALL_RECIPES = CURATED_RECIPES.map((r) => ({
  ...r.recipe,
  id: r.recipe.title,
  created_at: '',
}));

export function RecipesPage() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<RecipeFilter>({
    mealType: null,
    season: null,
    source: null,
  });

  const filtered = useMemo(() => {
    return ALL_RECIPES.filter((recipe) => {
      if (filters.season && !recipe.seasonal_tags?.includes(filters.season)) return false;
      if (filters.source && recipe.source !== filters.source) return false;
      // Meal type: match against seasonal_tags (which include meal types in our seed data)
      if (filters.mealType && !recipe.seasonal_tags?.includes(filters.mealType)) return false;
      return true;
    });
  }, [filters]);

  return (
    <div className="safe-top">
      <header className="px-4 pt-6 pb-2">
        <h1 className="text-xl font-display font-bold text-gray-900">Recipes</h1>
        <p className="text-sm text-gray-500">
          Seasonal dishes curated for Ontario markets
        </p>
      </header>

      <RecipeFilters filters={filters} onChange={setFilters} />

      <RecipeGrid
        recipes={filtered}
        onRecipeClick={(recipe) =>
          navigate(`/recipes/${encodeURIComponent(recipe.title)}`)
        }
      />
    </div>
  );
}
