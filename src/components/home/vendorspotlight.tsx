import { Store } from 'lucide-react';

const MOCK_VENDORS = [
  { name: 'Green Acres Farm', category: 'Produce', description: 'Organic vegetables & herbs' },
  { name: 'Bee Happy Honey', category: 'Pantry', description: 'Raw wildflower honey' },
  { name: 'Meadow Bakery', category: 'Bakery', description: 'Sourdough & pastries' },
];

export function VendorSpotlight() {
  return (
    <section>
      <div className="flex items-center justify-between mb-3 px-1">
        <h2 className="section-title">Stall Spotlight</h2>
        <button className="text-sm text-market-700 font-medium hover:underline">
          View All
        </button>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 snap-x">
        {MOCK_VENDORS.map((vendor) => (
          <div
            key={vendor.name}
            className="card-interactive flex-shrink-0 w-44 snap-start p-4"
          >
            <div className="w-12 h-12 bg-market-100 rounded-xl flex items-center justify-center mb-3">
              <Store size={22} className="text-market-700" />
            </div>
            <h3 className="font-semibold text-sm text-gray-900 mb-1">{vendor.name}</h3>
            <p className="text-xs text-market-600 font-medium mb-1">{vendor.category}</p>
            <p className="text-xs text-gray-500 line-clamp-2">{vendor.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
