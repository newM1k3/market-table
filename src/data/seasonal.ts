import type { SeasonalAvailability } from '../lib/types';

// Seed data for seasonal availability (Ontario-focused).
// In production, this is replaced by the weekly CKAN API sync.
// Fallback when the API is unavailable or before the first sync.

export const SEASONAL_SEED: Omit<SeasonalAvailability, 'id' | 'updated_at'>[] = [
  // Spring
  { product_name: 'Asparagus', season: 'spring', months: [4, 5, 6], source: 'foodland-ontario' },
  { product_name: 'Radishes', season: 'spring', months: [4, 5, 6], source: 'foodland-ontario' },
  { product_name: 'Rhubarb', season: 'spring', months: [4, 5, 6], source: 'foodland-ontario' },
  { product_name: 'Greenhouse Cucumbers', season: 'spring', months: [3, 4, 5, 6], source: 'foodland-ontario' },
  { product_name: 'Greenhouse Tomatoes', season: 'spring', months: [3, 4, 5, 6], source: 'foodland-ontario' },

  // Summer
  { product_name: 'Strawberries', season: 'summer', months: [6, 7], source: 'foodland-ontario' },
  { product_name: 'Raspberries', season: 'summer', months: [7, 8], source: 'foodland-ontario' },
  { product_name: 'Blueberries', season: 'summer', months: [7, 8], source: 'foodland-ontario' },
  { product_name: 'Cherries', season: 'summer', months: [7], source: 'foodland-ontario' },
  { product_name: 'Sweet Corn', season: 'summer', months: [7, 8, 9], source: 'foodland-ontario' },
  { product_name: 'Zucchini', season: 'summer', months: [7, 8, 9], source: 'foodland-ontario' },
  { product_name: 'Green Beans', season: 'summer', months: [7, 8, 9], source: 'foodland-ontario' },
  { product_name: 'Peaches', season: 'summer', months: [8, 9], source: 'foodland-ontario' },
  { product_name: 'Tomatoes', season: 'summer', months: [7, 8, 9], source: 'foodland-ontario' },
  { product_name: 'Basil', season: 'summer', months: [6, 7, 8, 9], source: 'foodland-ontario' },
  { product_name: 'Cucumbers', season: 'summer', months: [7, 8, 9], source: 'foodland-ontario' },
  { product_name: 'Bell Peppers', season: 'summer', months: [7, 8, 9], source: 'foodland-ontario' },
  { product_name: 'Eggplant', season: 'summer', months: [8, 9], source: 'foodland-ontario' },

  // Fall
  { product_name: 'Apples', season: 'fall', months: [8, 9, 10, 11], source: 'foodland-ontario' },
  { product_name: 'Pears', season: 'fall', months: [9, 10], source: 'foodland-ontario' },
  { product_name: 'Pumpkins', season: 'fall', months: [9, 10], source: 'foodland-ontario' },
  { product_name: 'Squash', season: 'fall', months: [9, 10, 11], source: 'foodland-ontario' },
  { product_name: 'Grapes', season: 'fall', months: [9, 10], source: 'foodland-ontario' },
  { product_name: 'Root Vegetables', season: 'fall', months: [9, 10, 11], source: 'foodland-ontario' },

  // Year-round
  { product_name: 'Mushrooms', season: 'year-round', months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], source: 'foodland-ontario' },
  { product_name: 'Carrots', season: 'year-round', months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], source: 'foodland-ontario' },
  { product_name: 'Onions', season: 'year-round', months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], source: 'foodland-ontario' },
];

export function getCurrentSeason(): string {
  const month = new Date().getMonth() + 1; // 1-based
  if (month >= 3 && month <= 5) return 'spring';
  if (month >= 6 && month <= 8) return 'summer';
  if (month >= 9 && month <= 11) return 'fall';
  return 'winter';
}

export function getSeasonalForMonth(month: number): string[] {
  return SEASONAL_SEED
    .filter((item) => item.months.includes(month))
    .map((item) => item.product_name);
}

export function isInSeason(productName: string): boolean {
  const month = new Date().getMonth() + 1;
  return SEASONAL_SEED.some(
    (item) =>
      item.product_name.toLowerCase() === productName.toLowerCase() &&
      item.months.includes(month),
  );
}
