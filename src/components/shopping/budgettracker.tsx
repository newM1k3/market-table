import { ShoppingCart, DollarSign, CircleDollarSign, Receipt } from 'lucide-react';
import type { BudgetSummary } from '../../lib/types';

interface BudgetTrackerProps {
  summary: BudgetSummary;
}

export function BudgetTracker({ summary }: BudgetTrackerProps) {
  const progress =
    summary.totalEstimate > 0
      ? Math.round((summary.spent / summary.totalEstimate) * 100)
      : 0;

  return (
    <div className="card p-4">
      <div className="flex items-center gap-2 mb-3">
        <Receipt size={18} className="text-market-700" />
        <h3 className="text-sm font-semibold text-gray-900">Your Basket</h3>
        <span className="text-xs text-gray-400 ml-auto">
          {summary.checkedCount}/{summary.itemCount} items
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-3">
        <div
          className="h-full bg-market-500 rounded-full transition-all duration-500"
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-3 gap-3">
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 text-sm text-gray-400 mb-0.5">
            <ShoppingCart size={14} />
            <span className="text-xs">Budget</span>
          </div>
          <p className="font-bold text-gray-900">
            ${summary.totalEstimate.toFixed(2)}
          </p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 text-sm text-market-600 mb-0.5">
            <CircleDollarSign size={14} />
            <span className="text-xs">Spent</span>
          </div>
          <p className="font-bold text-market-700">
            ${summary.spent.toFixed(2)}
          </p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 text-sm text-gray-400 mb-0.5">
            <DollarSign size={14} />
            <span className="text-xs">Left</span>
          </div>
          <p
            className={`font-bold ${
              summary.remaining >= 0 ? 'text-gray-900' : 'text-red-500'
            }`}
          >
            ${summary.remaining.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Over budget warning */}
      {summary.remaining < 0 && (
        <div className="mt-3 bg-red-50 text-red-700 text-xs rounded-lg px-3 py-2 text-center font-medium">
          You're ${Math.abs(summary.remaining).toFixed(2)} over your estimated budget
        </div>
      )}
    </div>
  );
}
