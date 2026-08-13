import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Users, ExternalLink, ShoppingCart, Leaf } from 'lucide-react';
import { CURATED_RECIPES } from '../data/recipes';
import { Badge } from '../components/ui/Badge';
import { useShoppingList } from '../hooks/useShoppingList';
import { ShoppingList } from '../components/shopping/ShoppingList';
import { BudgetTracker } from '../components/shopping/BudgetTracker';

// Vendor-product matching (demo data for future PocketBase integration)

export function RecipeDetailPage() {
  const { recipeTitle } = useParams<{ recipeTitle: string }>();
  const navigate = useNavigate();

  const decodedTitle = decodeURIComponent(recipeTitle || '');
  const seedRecipe = CURATED_RECIPES.find((r) => r.recipe.title === decodedTitle);

  if (!seedRecipe) {
    return (
      <div className="safe-top px-4 pt-6">
        <button onClick={() => navigate(-1)} className="btn-ghost mb-4">
          <ArrowLeft size={18} />
          Back
        </button>
        <div className="text-center py-16">
          <p className="text-gray-500">Recipe not found.</p>
        </div>
      </div>
    );
  }

  const { recipe, ingredients } = seedRecipe;
  const {
    items,
    toggleChecked,
    summary,
  } = useShoppingList(ingredients as any);

  const foodlandUrl = recipe.foodland_url;
  const seasonalScore = recipe.seasonal_tags?.length ? 100 : 0;

  // Auto-match vendors for demo
  // In production, this calls findVendorsForProduct() from pocketbase.ts

  return (
    <div className="safe-top">
      {/* Header image */}
      <div className="relative h-48 bg-gradient-to-br from-market-100 to-earth-100 flex items-center justify-center">
        <div className="text-6xl">🥗</div>
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 w-10 h-10 bg-white/90 backdrop-blur rounded-xl flex items-center justify-center shadow-sm"
        >
          <ArrowLeft size={20} className="text-gray-700" />
        </button>
      </div>

      {/* Content */}
      <div className="px-4 -mt-6 relative z-10">
        <div className="card p-5">
          <div className="flex flex-wrap gap-2 mb-3">
            {recipe.seasonal_tags?.map((tag) => (
              <Badge key={tag} variant="green" className="capitalize">
                <Leaf size={12} />
                {tag}
              </Badge>
            ))}
            <Badge variant={recipe.source === 'curated' ? 'amber' : 'gray'}>
              {recipe.source === 'curated' ? 'Market Kitchen' : 'Community'}
            </Badge>
          </div>

          <h1 className="text-xl font-display font-bold text-gray-900 mb-2">
            {recipe.title}
          </h1>
          <p className="text-sm text-gray-500 mb-4">{recipe.description}</p>

          <div className="flex items-center gap-4 text-sm text-gray-400">
            <span className="flex items-center gap-1">
              <Clock size={16} />
              {recipe.cook_time_min} min
            </span>
            <span className="flex items-center gap-1">
              <Users size={16} />
              {recipe.servings} servings
            </span>
            <Badge variant="green">
              <Leaf size={12} />
              {seasonalScore}% in season
            </Badge>
          </div>

          {foodlandUrl && (
            <a
              href={foodlandUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 mt-4 text-sm text-market-700 hover:text-market-800 font-medium"
            >
              <ExternalLink size={14} />
              View on Foodland Ontario
            </a>
          )}
        </div>

        {/* Budget tracker */}
        <div className="mt-4">
          <BudgetTracker summary={summary} />
        </div>

        {/* Shopping list */}
        <section className="mt-4 mb-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="section-title flex items-center gap-2">
              <ShoppingCart size={18} />
              Shopping List
            </h2>
            <span className="text-xs text-gray-400">
              {summary.checkedCount}/{summary.itemCount} found
            </span>
          </div>

          <ShoppingList
            items={items}
            onToggle={toggleChecked}
            onVendorClick={(vendorId) => navigate(`/map?vendor=${vendorId}`)}
          />
        </section>
      </div>
    </div>
  );
}
