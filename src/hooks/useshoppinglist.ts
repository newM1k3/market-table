import { useState, useCallback, useMemo } from 'react';
import type { RecipeIngredient, ShoppingListItem, BudgetSummary, Vendor, Stall } from '../lib/types';

// Vendor and Stall types used in setVendorMatch parameter

export function useShoppingList(ingredients: RecipeIngredient[]) {
  const [items, setItems] = useState<ShoppingListItem[]>(() =>
    ingredients.map((ing) => ({
      ingredient: ing,
      vendorMatch: null,
      checked: false,
      estimatedCost: '',
    })),
  );

  const setVendorMatch = useCallback(
    (ingredientIndex: number, vendor: (Vendor & { stall?: Stall }) | null, cost?: string) => {
      setItems((prev) =>
        prev.map((item, i) =>
          i === ingredientIndex
            ? { ...item, vendorMatch: vendor, estimatedCost: cost || item.estimatedCost }
            : item,
        ),
      );
    },
    [],
  );

  const toggleChecked = useCallback((index: number) => {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, checked: !item.checked } : item)),
    );
  }, []);

  const clearList = useCallback(() => {
    setItems([]);
  }, []);

  const summary: BudgetSummary = useMemo(() => {
    const checkedCount = items.filter((i) => i.checked).length;
    const totalEstimate = items.reduce((sum, item) => {
      const cost = parseFloat(item.estimatedCost.replace(/[^0-9.]/g, ''));
      return sum + (isNaN(cost) ? 0 : cost);
    }, 0);
    const spent = items
      .filter((i) => i.checked)
      .reduce((sum, item) => {
        const cost = parseFloat(item.estimatedCost.replace(/[^0-9.]/g, ''));
        return sum + (isNaN(cost) ? 0 : cost);
      }, 0);
    return {
      totalEstimate,
      spent,
      remaining: totalEstimate - spent,
      itemCount: items.length,
      checkedCount,
    };
  }, [items]);

  return { items, setVendorMatch, toggleChecked, clearList, summary };
}
