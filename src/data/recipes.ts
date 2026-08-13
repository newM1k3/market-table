import type { Recipe, RecipeIngredient } from '../lib/types';

// Seed curated recipes for launch.
// In production, these are stored in PocketBase and managed via the admin dashboard.

export interface SeedRecipe {
  recipe: Omit<Recipe, 'id' | 'created_at'>;
  ingredients: Omit<RecipeIngredient, 'id' | 'recipe_id'>[];
}

export const CURATED_RECIPES: SeedRecipe[] = [
  {
    recipe: {
      market_id: '',
      title: 'Ontario Summer Salad',
      description:
        'A bright, fresh salad that captures peak summer in Ontario. Juicy heirloom tomatoes, crisp cucumbers, and sweet corn off the cob, tossed with fragrant basil and a simple vinaigrette.',
      image_url: '',
      source: 'curated',
      author_id: '',
      status: 'approved',
      cook_time_min: 15,
      servings: 4,
      seasonal_tags: ['summer', 'salad', 'quick'],
      foodland_url: 'https://www.ontario.ca/foodland/recipes/browse?ingredient=tomatoes',
    },
    ingredients: [
      { product_name: 'Heirloom Tomatoes', quantity: '4', unit: 'whole' },
      { product_name: 'Cucumbers', quantity: '1', unit: 'whole' },
      { product_name: 'Sweet Corn', quantity: '2', unit: 'ears' },
      { product_name: 'Basil', quantity: '1', unit: 'bunch' },
      { product_name: 'Red Onion', quantity: '1', unit: 'whole' },
    ],
  },
  {
    recipe: {
      market_id: '',
      title: 'Roasted Squash & Apple Soup',
      description:
        'A velvety autumn soup that pairs sweet roasted squash with tart Ontario apples. Finished with a swirl of cream and fresh thyme.',
      image_url: '',
      source: 'curated',
      author_id: '',
      status: 'approved',
      cook_time_min: 45,
      servings: 6,
      seasonal_tags: ['fall', 'soup', 'comfort'],
      foodland_url: 'https://www.ontario.ca/foodland/recipes/browse?ingredient=squash',
    },
    ingredients: [
      { product_name: 'Butternut Squash', quantity: '1', unit: 'whole' },
      { product_name: 'Apples', quantity: '2', unit: 'whole' },
      { product_name: 'Onions', quantity: '1', unit: 'whole' },
      { product_name: 'Carrots', quantity: '2', unit: 'whole' },
      { product_name: 'Fresh Thyme', quantity: '1', unit: 'bunch' },
    ],
  },
  {
    recipe: {
      market_id: '',
      title: 'Berry Crumble with Ontario Peaches',
      description:
        'A rustic dessert showcasing summer berries and ripe peaches under a buttery oat crumble. Serve warm with locally-made vanilla ice cream.',
      image_url: '',
      source: 'curated',
      author_id: '',
      status: 'approved',
      cook_time_min: 40,
      servings: 8,
      seasonal_tags: ['summer', 'dessert', 'baking'],
      foodland_url: 'https://www.ontario.ca/foodland/recipes/browse?ingredient=peaches',
    },
    ingredients: [
      { product_name: 'Peaches', quantity: '4', unit: 'whole' },
      { product_name: 'Blueberries', quantity: '2', unit: 'cups' },
      { product_name: 'Raspberries', quantity: '1', unit: 'cup' },
      { product_name: 'Butter', quantity: '1', unit: 'cup' },
    ],
  },
  {
    recipe: {
      market_id: '',
      title: 'Grilled Vegetable Platter with Herb Dressing',
      description:
        'A showstopping platter of grilled seasonal vegetables — zucchini, eggplant, bell peppers, and asparagus — drizzled with a bright herb dressing. Perfect for entertaining.',
      image_url: '',
      source: 'curated',
      author_id: '',
      status: 'approved',
      cook_time_min: 30,
      servings: 6,
      seasonal_tags: ['summer', 'grill', 'entertaining'],
      foodland_url: 'https://www.ontario.ca/foodland/recipes/browse?ingredient=zucchini',
    },
    ingredients: [
      { product_name: 'Zucchini', quantity: '2', unit: 'whole' },
      { product_name: 'Eggplant', quantity: '1', unit: 'whole' },
      { product_name: 'Bell Peppers', quantity: '3', unit: 'whole' },
      { product_name: 'Asparagus', quantity: '1', unit: 'bunch' },
      { product_name: 'Basil', quantity: '1', unit: 'bunch' },
      { product_name: 'Garlic', quantity: '3', unit: 'cloves' },
    ],
  },
  {
    recipe: {
      market_id: '',
      title: 'Spring Asparagus & Mushroom Frittata',
      description:
        'A quick, protein-packed frittata with tender asparagus and earthy mushrooms. Great for brunch or a light dinner with a side salad.',
      image_url: '',
      source: 'curated',
      author_id: '',
      status: 'approved',
      cook_time_min: 25,
      servings: 4,
      seasonal_tags: ['spring', 'breakfast', 'quick'],
      foodland_url: 'https://www.ontario.ca/foodland/recipes/browse?ingredient=asparagus',
    },
    ingredients: [
      { product_name: 'Asparagus', quantity: '1', unit: 'bunch' },
      { product_name: 'Mushrooms', quantity: '2', unit: 'cups' },
      { product_name: 'Eggs', quantity: '8', unit: 'whole' },
      { product_name: 'Onions', quantity: '1', unit: 'whole' },
      { product_name: 'Fresh Chives', quantity: '1', unit: 'bunch' },
    ],
  },
  {
    recipe: {
      market_id: '',
      title: 'Apple Cider Glazed Root Vegetables',
      description:
        'Carrots, parsnips, and sweet potatoes roasted with local apple cider and fresh rosemary. The perfect Thanksgiving or harvest dinner side.',
      image_url: '',
      source: 'curated',
      author_id: '',
      status: 'approved',
      cook_time_min: 45,
      servings: 6,
      seasonal_tags: ['fall', 'side dish', 'holiday'],
      foodland_url: 'https://www.ontario.ca/foodland/recipes/browse?ingredient=apples',
    },
    ingredients: [
      { product_name: 'Carrots', quantity: '4', unit: 'whole' },
      { product_name: 'Root Vegetables', quantity: '3', unit: 'whole' },
      { product_name: 'Apples', quantity: '2', unit: 'whole' },
      { product_name: 'Fresh Rosemary', quantity: '1', unit: 'bunch' },
      { product_name: 'Onions', quantity: '2', unit: 'whole' },
    ],
  },
];
