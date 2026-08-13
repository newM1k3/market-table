// ── Core domain types for Market Table ──

export interface Market {
  id: string;
  name: string;
  slug: string;
  location: string;
  floor_plan_url: string;
  created_at: string;
}

export interface Stall {
  id: string;
  market_id: string;
  label: string;
  x: number;
  y: number;
  category: StallCategory;
}

export type StallCategory = 'produce' | 'bakery' | 'dairy' | 'meat' | 'prepared' | 'flowers' | 'pantry' | 'other';

export interface Vendor {
  id: string;
  market_id: string;
  name: string;
  description: string;
  stall_id: string;
  logo_url: string;
  claimed: boolean;
  contact_email: string;
  created_at: string;
  expand?: {
    stall_id: Stall;
  };
}

export interface Product {
  id: string;
  vendor_id: string;
  name: string;
  category: string;
  price_estimate: string;
  seasonal_tags: string[];
}

export interface SeasonalAvailability {
  id: string;
  product_name: string;
  season: 'spring' | 'summer' | 'fall' | 'winter' | 'year-round';
  months: number[];
  source: string;
  updated_at: string;
}

export interface Recipe {
  id: string;
  market_id: string;
  title: string;
  description: string;
  image_url: string;
  source: 'curated' | 'community';
  author_id: string;
  status: 'pending' | 'approved' | 'rejected';
  cook_time_min: number;
  servings: number;
  seasonal_tags: string[];
  foodland_url: string;
  created_at: string;
}

export interface RecipeIngredient {
  id: string;
  recipe_id: string;
  product_name: string;
  quantity: string;
  unit: string;
}

export interface Shopper {
  id: string;
  phone_hash: string;
  market_id: string;
  display_name: string;
  created_at: string;
}

export interface PantryItem {
  id: string;
  shopper_id: string;
  product_name: string;
  vendor_id: string;
  quantity: string;
  purchased_at: string;
}

export interface ScanLog {
  id: string;
  market_id: string;
  shopper_id: string;
  vendor_id: string;
  recipe_id: string;
  items: ScanItem[];
  scanned_at: string;
}

export interface ScanItem {
  product_name: string;
  quantity: string;
  unit: string;
}

// ── Computed / UI types ──

export interface VendorMatch {
  ingredient: RecipeIngredient;
  vendors: (Vendor & { stall?: Stall; products: Product[] })[];
}

export interface ShoppingListItem {
  ingredient: RecipeIngredient;
  vendorMatch: (Vendor & { stall?: Stall }) | null;
  checked: boolean;
  estimatedCost: string;
}

export interface BudgetSummary {
  totalEstimate: number;
  spent: number;
  remaining: number;
  itemCount: number;
  checkedCount: number;
}
