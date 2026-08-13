import { Leaf, Sun, CloudRain, Wind, Snowflake } from 'lucide-react';
import { getCurrentSeason, getSeasonalForMonth } from '../../data/seasonal';
import { Badge } from '../ui/Badge';

const SEASON_ICONS: Record<string, typeof Leaf> = {
  spring: CloudRain,
  summer: Sun,
  fall: Wind,
  winter: Snowflake,
};

export function WhatsFresh() {
  const month = new Date().getMonth() + 1;
  const season = getCurrentSeason();
  const freshItems = getSeasonalForMonth(month);
  const displayItems = freshItems.slice(0, 8); // Show first 8, rest via "view all"
  const hasMore = freshItems.length > 8;

  const SeasonIcon = SEASON_ICONS[season] || Leaf;

  return (
    <section className="card p-5">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-market-100 rounded-xl flex items-center justify-center">
          <SeasonIcon size={20} className="text-market-700" />
        </div>
        <div>
          <h2 className="section-title">What's Fresh Today</h2>
          <p className="text-sm text-gray-500 capitalize">{season} harvest in Ontario</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {displayItems.map((item) => (
          <Badge key={item} variant="green">
            <Leaf size={12} />
            {item}
          </Badge>
        ))}
        {hasMore && (
          <Badge variant="gray">+{freshItems.length - 8} more</Badge>
        )}
      </div>

      <p className="text-xs text-gray-400 mt-4">
        Seasonal data from Foodland Ontario. Updated weekly.
      </p>
    </section>
  );
}
