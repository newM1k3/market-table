import { useState, useRef, useCallback } from 'react';
import { MapPin, Store, Maximize2 } from 'lucide-react';

interface StallMarker {
  id: string;
  label: string;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  vendorName: string;
  category: string;
}

interface MarketMapProps {
  floorPlanUrl?: string;
  stalls: StallMarker[];
  onStallClick?: (stall: StallMarker) => void;
  highlightedStallIds?: string[];
}

export function MarketMap({
  floorPlanUrl,
  stalls,
  onStallClick,
  highlightedStallIds = [],
}: MarketMapProps) {
  const [selectedStall, setSelectedStall] = useState<StallMarker | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleStallClick = useCallback(
    (stall: StallMarker) => {
      setSelectedStall(stall);
      onStallClick?.(stall);
    },
    [onStallClick],
  );

  if (!floorPlanUrl && stalls.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <MapPin size={28} className="text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Map Coming Soon</h3>
        <p className="text-gray-500 max-w-sm">
          The market floor plan is being set up. Check back before your next visit!
        </p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Map container */}
      <div
        ref={containerRef}
        className="relative bg-gray-100 rounded-xl overflow-hidden"
        style={{ aspectRatio: '4/3' }}
      >
        {floorPlanUrl ? (
          <img
            src={floorPlanUrl}
            alt="Market floor plan"
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <div className="text-center">
              <Maximize2 size={32} className="mx-auto mb-2" />
              <p className="text-sm">Floor plan placeholder</p>
            </div>
          </div>
        )}

        {/* Stall markers */}
        {stalls.map((stall) => {
          const isHighlighted = highlightedStallIds.includes(stall.id);
          const isSelected = selectedStall?.id === stall.id;
          return (
            <button
              key={stall.id}
              onClick={() => handleStallClick(stall)}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center transition-all ${
                isHighlighted ? 'z-20 scale-110' : 'z-10'
              }`}
              style={{ left: `${stall.x}%`, top: `${stall.y}%` }}
              aria-label={`Stall ${stall.label}: ${stall.vendorName}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-all ${
                  isHighlighted
                    ? 'bg-market-600 text-white ring-4 ring-market-200'
                    : isSelected
                      ? 'bg-earth-500 text-white'
                      : 'bg-white text-market-700 border-2 border-market-300'
                }`}
              >
                <Store size={14} />
              </div>
              <span
                className={`text-[10px] font-bold mt-1 px-1.5 py-0.5 rounded-full ${
                  isHighlighted
                    ? 'bg-market-600 text-white'
                    : 'bg-white text-gray-700 shadow-sm border border-gray-200'
                }`}
              >
                {stall.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Selected stall detail */}
      {selectedStall && (
        <div className="card p-4 mt-3 mx-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold bg-market-100 text-market-800 px-2 py-0.5 rounded-full">
                  {selectedStall.label}
                </span>
                <span className="text-xs text-gray-400 capitalize">{selectedStall.category}</span>
              </div>
              <h3 className="font-semibold text-gray-900">{selectedStall.vendorName}</h3>
            </div>
            <button
              onClick={() => setSelectedStall(null)}
              className="text-gray-400 hover:text-gray-600 text-sm"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="flex items-center gap-4 px-4 mt-3 text-xs text-gray-500">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-white border-2 border-market-300" />
          <span>Vendor</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-market-600" />
          <span>On your list</span>
        </div>
      </div>
    </div>
  );
}
