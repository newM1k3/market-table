import { Check, Store, MapPin, ChevronRight } from 'lucide-react';
import type { ShoppingListItem } from '../../lib/types';

interface ShoppingListProps {
  items: ShoppingListItem[];
  onToggle: (index: number) => void;
  onVendorClick?: (vendorId: string) => void;
}

export function ShoppingList({ items, onToggle, onVendorClick }: ShoppingListProps) {
  if (items.length === 0) {
    return (
      <div className="text-center py-12 px-6">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Store size={28} className="text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Shopping List Yet</h3>
        <p className="text-gray-500">
          Choose a recipe and tap "Shop This Recipe" to build your market shopping list.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {items.map((item, index) => (
        <div
          key={item.ingredient.product_name + index}
          className={`card p-4 transition-all ${
            item.checked ? 'opacity-60 bg-gray-50' : ''
          }`}
        >
          <div className="flex items-start gap-3">
            {/* Checkbox */}
            <button
              onClick={() => onToggle(index)}
              className={`mt-0.5 w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                item.checked
                  ? 'bg-market-600 border-market-600 text-white'
                  : 'border-gray-300 hover:border-market-400'
              }`}
              aria-label={`Mark ${item.ingredient.product_name} as purchased`}
            >
              {item.checked && <Check size={14} />}
            </button>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h4
                  className={`font-semibold text-sm ${
                    item.checked ? 'text-gray-400 line-through' : 'text-gray-900'
                  }`}
                >
                  {item.ingredient.product_name}
                </h4>
                {item.estimatedCost && (
                  <span className="text-sm font-medium text-market-700 flex-shrink-0">
                    ~${item.estimatedCost}
                  </span>
                )}
              </div>

              <p className="text-xs text-gray-400 mt-0.5">
                {item.ingredient.quantity} {item.ingredient.unit}
              </p>

              {/* Vendor match */}
              {item.vendorMatch ? (
                <button
                  onClick={() => onVendorClick?.(item.vendorMatch!.id)}
                  className="mt-2 flex items-center gap-2 text-xs text-market-700 bg-market-50 rounded-lg px-3 py-1.5 hover:bg-market-100 transition-colors w-full"
                >
                  <MapPin size={12} />
                  <span className="font-medium flex-1 text-left">
                    {item.vendorMatch.name}
                    {item.vendorMatch.stall && ` · Stall ${item.vendorMatch.stall.label}`}
                  </span>
                  <ChevronRight size={14} />
                </button>
              ) : (
                <p className="mt-2 text-xs text-gray-400 italic">
                  Ask vendors directly — or check back as stalls update
                </p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
