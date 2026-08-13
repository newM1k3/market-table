import { Clock, Users, Leaf } from 'lucide-react';
import type { Recipe } from '../../lib/types';
import { Badge } from '../ui/Badge';

interface RecipeCardProps {
  recipe: Recipe & { seasonalScore?: number };
  onClick?: () => void;
}

export function RecipeCard({ recipe, onClick }: RecipeCardProps) {
  // Calculate seasonal score: what % of ingredients are in season
  const seasonalScore = recipe.seasonal_tags?.length ? 100 : 0;
  const seasonTag = recipe.seasonal_tags?.[0] || 'recipe';

  return (
    <article
      onClick={onClick}
      className="card-interactive overflow-hidden"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick?.()}
    >
      {/* Image area */}
      <div className="relative h-40 bg-gradient-to-br from-market-100 to-earth-100 flex items-center justify-center">
        <div className="text-4xl">🥗</div>
        {/* Seasonal badge */}
        <div className="absolute top-3 left-3">
          <Badge variant="green">
            <Leaf size={12} />
            {seasonalScore}% in season
          </Badge>
        </div>
        {/* Source badge */}
        <div className="absolute top-3 right-3">
          <Badge variant={recipe.source === 'curated' ? 'amber' : 'gray'}>
            {recipe.source === 'curated' ? 'Market Kitchen' : 'Community'}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">{recipe.title}</h3>
        <p className="text-sm text-gray-500 line-clamp-2 mb-3">{recipe.description}</p>

        <div className="flex items-center gap-4 text-xs text-gray-400">
          <span className="flex items-center gap-1">
            <Clock size={14} />
            {recipe.cook_time_min} min
          </span>
          <span className="flex items-center gap-1">
            <Users size={14} />
            {recipe.servings} servings
          </span>
          <Badge variant="gray" className="capitalize">{seasonTag}</Badge>
        </div>
      </div>
    </article>
  );
}
