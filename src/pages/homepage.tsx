import { useNavigate } from 'react-router-dom';
import { Sprout, ShoppingBag, ArrowRight } from 'lucide-react';
import { WhatsFresh } from '../components/home/WhatsFresh';
import { VendorSpotlight } from '../components/home/VendorSpotlight';
import { RecipeCard } from '../components/recipes/RecipeCard';
import { CURATED_RECIPES } from '../data/recipes';

export function HomePage() {
  const navigate = useNavigate();

  // Show top 2 curated recipes as featured
  const featured = CURATED_RECIPES.slice(0, 2).map((r) => ({
    ...r.recipe,
    id: r.recipe.title,
    created_at: '',
  }));

  return (
    <div className="safe-top">
      {/* Header */}
      <header className="px-4 pt-6 pb-4">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 bg-market-700 rounded-xl flex items-center justify-center">
            <Sprout size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-display font-bold text-gray-900">Market Table</h1>
            <p className="text-xs text-gray-500">Good things grow in Ontario</p>
          </div>
        </div>
      </header>

      {/* Hero CTA */}
      <section className="px-4 mb-6">
        <div className="card bg-gradient-to-br from-market-700 to-market-900 p-6 text-white">
          <h2 className="text-lg font-display font-bold mb-2">
            Shop the market by recipe
          </h2>
          <p className="text-market-100 text-sm mb-4">
            Pick a recipe, find the vendors, track your budget — all in one trip.
          </p>
          <button
            onClick={() => navigate('/recipes')}
            className="inline-flex items-center gap-2 bg-white text-market-800 px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-market-50 transition-colors"
          >
            <ShoppingBag size={16} />
            Browse Recipes
            <ArrowRight size={16} />
          </button>
        </div>
      </section>

      {/* What's Fresh */}
      <section className="px-4 mb-6">
        <WhatsFresh />
      </section>

      {/* Vendor Spotlight */}
      <section className="px-4 mb-6">
        <VendorSpotlight />
      </section>

      {/* Featured Recipes */}
      <section className="px-4 mb-6">
        <div className="flex items-center justify-between mb-3 px-1">
          <h2 className="section-title">Featured Recipes</h2>
          <button
            onClick={() => navigate('/recipes')}
            className="text-sm text-market-700 font-medium hover:underline"
          >
            View All
          </button>
        </div>
        <div className="grid gap-4">
          {featured.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              onClick={() => navigate(`/recipes/${encodeURIComponent(recipe.title)}`)}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
