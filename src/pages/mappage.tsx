import { useSearchParams } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import { MarketMap } from '../components/map/MarketMap';

// Mock stall data — in production, fetched from PocketBase
const MOCK_STALLS = [
  { id: 's1', label: 'A1', x: 15, y: 25, vendorName: 'Meadow Bakery', category: 'bakery' },
  { id: 's2', label: 'A3', x: 15, y: 50, vendorName: 'Green Acres Farm', category: 'produce' },
  { id: 's3', label: 'A5', x: 15, y: 75, vendorName: 'Root & Soil', category: 'produce' },
  { id: 's4', label: 'B1', x: 40, y: 25, vendorName: 'Sunny Fields', category: 'produce' },
  { id: 's5', label: 'B3', x: 40, y: 50, vendorName: 'Happy Hen Co.', category: 'dairy' },
  { id: 's6', label: 'B5', x: 40, y: 75, vendorName: 'Bee Happy Honey', category: 'pantry' },
  { id: 's7', label: 'C2', x: 65, y: 37, vendorName: 'Herb Haven', category: 'produce' },
  { id: 's8', label: 'C4', x: 65, y: 63, vendorName: 'Flower & Field', category: 'flowers' },
  { id: 's9', label: 'D1', x: 85, y: 25, vendorName: 'Forest Floor Fungi', category: 'produce' },
  { id: 's10', label: 'D3', x: 85, y: 55, vendorName: 'Riverbend Cheese', category: 'dairy' },
  { id: 's11', label: 'D5', x: 85, y: 80, vendorName: 'Maple Ridge Farm', category: 'pantry' },
];

export function MapPage() {
  const [searchParams] = useSearchParams();
  const highlightedVendor = searchParams.get('vendor');

  const handleStallClick = (stall: typeof MOCK_STALLS[number]) => {
    // Future: navigate to vendor detail or trigger scan
    console.log('Stall clicked:', stall);
  };

  return (
    <div className="safe-top">
      <header className="px-4 pt-6 pb-4">
        <div className="flex items-center gap-2">
          <MapPin size={22} className="text-market-700" />
          <h1 className="text-xl font-display font-bold text-gray-900">Market Map</h1>
        </div>
        <p className="text-sm text-gray-500 mt-1">
          Find your vendors and plan your route
        </p>
      </header>

      <MarketMap
        stalls={MOCK_STALLS}
        onStallClick={handleStallClick}
        highlightedStallIds={highlightedVendor ? ['s2'] : []}
      />

      {/* Vendor list below map */}
      <section className="px-4 mt-6 mb-8">
        <h2 className="section-title mb-3">All Vendors</h2>
        <div className="space-y-2">
          {MOCK_STALLS.map((stall) => (
            <div key={stall.id} className="card p-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-market-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-bold text-market-700">{stall.label}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm text-gray-900">{stall.vendorName}</h3>
                <p className="text-xs text-gray-400 capitalize">{stall.category}</p>
              </div>
              <button className="btn-ghost text-xs px-3 py-1.5">
                <MapPin size={14} />
                Locate
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
