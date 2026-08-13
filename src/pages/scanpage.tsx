import { useState, useCallback } from 'react';
import { ScanLine, Store, Check, ArrowRight } from 'lucide-react';
import { QRScanner } from '../components/scan/QRScanner';
import { Badge } from '../components/ui/Badge';

// Mock vendor lookup — in production, fetched from PocketBase
const MOCK_VENDORS: Record<string, { name: string; stall: string; products: string[] }> = {
  'v1': { name: 'Green Acres Farm', stall: 'A3', products: ['Heirloom Tomatoes', 'Cucumbers', 'Zucchini', 'Asparagus', 'Basil'] },
  'v2': { name: 'Sunny Fields', stall: 'B1', products: ['Sweet Corn', 'Bell Peppers', 'Eggplant'] },
  'v3': { name: 'Herb Haven', stall: 'C2', products: ['Basil', 'Garlic', 'Fresh Thyme', 'Rosemary', 'Chives'] },
  'v4': { name: 'Root & Soil', stall: 'A5', products: ['Red Onion', 'Onions', 'Carrots', 'Potatoes'] },
  'v5': { name: 'Forest Floor Fungi', stall: 'D1', products: ['Mushrooms', 'Shiitake', 'Oyster Mushrooms'] },
  'v6': { name: 'Happy Hen Co.', stall: 'B3', products: ['Eggs'] },
};

export function ScanPage() {
  const [scannedVendor, setScannedVendor] = useState<string | null>(null);
  const [mode, setMode] = useState<'scan' | 'result'>('scan');
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

  const handleScan = useCallback((vendorId: string) => {
    // Try to match vendor ID
    const vendor = MOCK_VENDORS[vendorId];
    if (vendor) {
      setScannedVendor(vendorId);
      setCheckedItems(new Set());
      setMode('result');
    }
  }, []);

  const toggleItem = (product: string) => {
    setCheckedItems((prev) => {
      const next = new Set(prev);
      if (next.has(product)) {
        next.delete(product);
      } else {
        next.add(product);
      }
      return next;
    });
  };

  const handleDone = () => {
    setScannedVendor(null);
    setCheckedItems(new Set());
    setMode('scan');
  };

  const vendor = scannedVendor ? MOCK_VENDORS[scannedVendor] : null;

  return (
    <div className="safe-top">
      <header className="px-4 pt-6 pb-4">
        <div className="flex items-center gap-2">
          <ScanLine size={22} className="text-market-700" />
          <h1 className="text-xl font-display font-bold text-gray-900">Scan & Shop</h1>
        </div>
        <p className="text-sm text-gray-500 mt-1">
          Scan a vendor QR code to check off your purchases
        </p>
      </header>

      {mode === 'scan' ? (
        <div className="px-4">
          <QRScanner onScan={handleScan} />
        </div>
      ) : vendor ? (
        <div className="px-4">
          {/* Vendor info */}
          <div className="card p-5 mb-4 bg-market-50 border-market-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-market-200 rounded-xl flex items-center justify-center">
                <Store size={22} className="text-market-700" />
              </div>
              <div>
                <h2 className="font-display font-bold text-lg text-gray-900">
                  {vendor.name}
                </h2>
                <div className="flex items-center gap-2">
                  <Badge variant="green">Stall {vendor.stall}</Badge>
                </div>
              </div>
            </div>

            <p className="text-sm text-gray-600 mb-1">
              Check off what you bought here:
            </p>
          </div>

          {/* Product checklist */}
          <div className="space-y-2 mb-6">
            {vendor.products.map((product) => (
              <button
                key={product}
                onClick={() => toggleItem(product)}
                className={`card p-4 w-full text-left flex items-center gap-3 transition-all ${
                  checkedItems.has(product) ? 'bg-market-50 border-market-200' : ''
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                    checkedItems.has(product)
                      ? 'bg-market-600 border-market-600'
                      : 'border-gray-300'
                  }`}
                >
                  {checkedItems.has(product) && <Check size={14} className="text-white" />}
                </div>
                <span
                  className={`text-sm font-medium ${
                    checkedItems.has(product) ? 'text-market-800' : 'text-gray-900'
                  }`}
                >
                  {product}
                </span>
              </button>
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-3 mb-8">
            <button
              onClick={() => setMode('scan')}
              className="btn-secondary flex-1"
            >
              Different Stall
            </button>
            <button
              onClick={handleDone}
              disabled={checkedItems.size === 0}
              className="btn-primary flex-1"
            >
              <span>Done</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
