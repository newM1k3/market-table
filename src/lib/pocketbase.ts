import PocketBase from 'pocketbase';
import type {
  Market, Stall, Vendor, SeasonalAvailability,
  Recipe, RecipeIngredient, PantryItem, ScanLog,
} from './types';

const PB_URL = import.meta.env.VITE_POCKETBASE_URL || 'http://127.0.0.1:8090';

export const pb = new PocketBase(PB_URL);

// Auto-refresh auth
pb.authStore.onChange(() => {
  console.log('Auth state changed:', pb.authStore.isValid);
});

// ── Auth helpers ──

export async function requestSMSLogin(phone: string): Promise<void> {
  const res = await fetch('/.netlify/functions/sms-auth', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone, action: 'request' }),
  });
  if (!res.ok) throw new Error('Failed to send SMS code');
}

export async function verifySMSCode(phone: string, code: string): Promise<boolean> {
  const res = await fetch('/.netlify/functions/sms-auth', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone, code, action: 'verify' }),
  });
  if (!res.ok) return false;
  const { token } = await res.json();
  pb.authStore.save(token, null);
  return true;
}

export function isAuthenticated(): boolean {
  return pb.authStore.isValid;
}

export function logout(): void {
  pb.authStore.clear();
}

// ── Typed collection helpers ──

export const markets = pb.collection('markets');
export const stalls = pb.collection('stalls');
export const vendors = pb.collection('vendors');
export const products = pb.collection('products');
export const seasonalAvailability = pb.collection('seasonal_availability');
export const recipes = pb.collection('recipes');
export const recipeIngredients = pb.collection('recipe_ingredients');
export const shoppers = pb.collection('shoppers');
export const pantryItems = pb.collection('pantry_items');
export const scanLogs = pb.collection('scan_logs');

// ── Typed fetch helpers ──

export async function getMarket(slug: string): Promise<Market> {
  return await markets.getFirstListItem(`slug="${slug}"`);
}

export async function getStalls(marketId: string): Promise<Stall[]> {
  return await stalls.getFullList({ filter: `market_id="${marketId}"` });
}

export async function getVendors(marketId: string): Promise<Vendor[]> {
  return await vendors.getFullList({
    filter: `market_id="${marketId}"`,
    expand: 'stall_id',
  });
}

export async function getApprovedRecipes(marketId: string): Promise<Recipe[]> {
  return await recipes.getFullList({
    filter: `market_id="${marketId}" && status="approved"`,
    sort: '-created_at',
  });
}

export async function getRecipeWithIngredients(recipeId: string): Promise<{
  recipe: Recipe;
  ingredients: RecipeIngredient[];
}> {
  const recipe = await recipes.getOne(recipeId);
  const ingredients = await recipeIngredients.getFullList({
    filter: `recipe_id="${recipeId}"`,
  });
  return { recipe: recipe as unknown as Recipe, ingredients: ingredients as unknown as RecipeIngredient[] };
}

export async function getSeasonalProducts(month: number): Promise<SeasonalAvailability[]> {
  return await seasonalAvailability.getFullList({
    filter: `months~${month}`,
  });
}

export async function getPantry(shopperId: string): Promise<PantryItem[]> {
  return await pantryItems.getFullList({
    filter: `shopper_id="${shopperId}"`,
    sort: '-purchased_at',
  });
}

export async function addScanLog(log: Omit<ScanLog, 'id' | 'scanned_at'>): Promise<ScanLog> {
  return await scanLogs.create(log);
}

export async function findVendorsForProduct(
  marketId: string,
  productName: string,
): Promise<(Vendor & { expand?: { stall_id: Stall } })[]> {
  // Match vendors whose product names contain the ingredient
  const allVendors = await vendors.getFullList({
    filter: `market_id="${marketId}"`,
    expand: 'stall_id',
  });
  const allProducts = await products.getFullList();

  const matchingVendorIds = new Set(
    allProducts
      .filter(
        (p: any) =>
          p.name.toLowerCase().includes(productName.toLowerCase()) ||
          productName.toLowerCase().includes(p.name.toLowerCase()),
      )
      .map((p: any) => p.vendor_id),
  );

  return allVendors.filter((v: any) => matchingVendorIds.has(v.id)) as any;
}
