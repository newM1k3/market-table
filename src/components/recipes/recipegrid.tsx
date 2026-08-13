import { RecipeCard } from './RecipeCard';
import { CardSkeleton } from '../ui/Skeleton';
import { EmptyState } from '../ui/Skeleton';
import { BookOpen } from 'lucide-react';
import type { Recipe } from '../../lib/types';

interface RecipeGridProps {
  recipes: Recipe[];
  loading?: boolean;
  error?: string | null;
  onRecipeClick?: (recipe: Recipe) => void;
  onRetry?: () => void;
}

export function RecipeGrid({ recipes, loading, error, onRecipeClick, onRetry }: RecipeGridProps) {
  if (error) {
    return (
      <div className="p-4">
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
          <p className="text-red-700 text-sm mb-3">{error}</p>
          {onRetry && (
            <button onClick={onRetry} className="btn-secondary text-sm py-2">
              Try Again
            </button>
          )}
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-4 grid gap-4">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
    );
  }

  if (recipes.length === 0) {
    return (
      <EmptyState
        icon={<BookOpen size={48} />}
        title="No recipes found"
        description="Try adjusting your filters or check back soon for new seasonal recipes."
      />
    );
  }

  return (
    <div className="p-4 grid gap-4">
      {recipes.map((recipe) => (
        <RecipeCard
          key={recipe.id}
          recipe={recipe}
          onClick={() => onRecipeClick?.(recipe)}
        />
      ))}
    </div>
  );
}
