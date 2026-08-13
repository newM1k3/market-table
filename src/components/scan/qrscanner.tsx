import { useEffect, useRef, useState, useCallback } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { ScanLine, Camera, CameraOff, AlertTriangle } from 'lucide-react';

interface QRScannerProps {
  onScan: (vendorId: string) => void;
  onError?: (error: string) => void;
}

export function QRScanner({ onScan, onError }: QRScannerProps) {
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastScanned, setLastScanned] = useState<string | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  const startScanning = useCallback(async () => {
    setError(null);
    try {
      const scanner = new Html5Qrcode('qr-reader');
      scannerRef.current = scanner;

      await scanner.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText) => {
          // Debounce: ignore rapid re-scans of the same code within 3 seconds
          if (decodedText === lastScanned) return;

          setLastScanned(decodedText);

          // Parse vendor ID from URL: /scan/vendor-id → vendor-id
          const vendorId = decodedText.includes('/scan/')
            ? decodedText.split('/scan/').pop()?.split('?')[0]
            : decodedText;

          if (vendorId) {
            onScan(vendorId);
            // Debounce reset
            if (debounceRef.current) clearTimeout(debounceRef.current);
            debounceRef.current = setTimeout(() => setLastScanned(null), 3000);
          }
        },
        () => {
          // QR scan fail (non-fatal, keep trying)
        },
      );

      setScanning(true);
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Camera access denied';
      setError(msg);
      onError?.(msg);
    }
  }, [onScan, onError, lastScanned]);

  const stopScanning = useCallback(async () => {
    try {
      if (scannerRef.current) {
        await scannerRef.current.stop();
        scannerRef.current.clear();
        scannerRef.current = null;
      }
    } catch {
      // Scanner may already be stopped
    }
    setScanning(false);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopScanning();
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [stopScanning]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <AlertTriangle size={28} className="text-red-500" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Camera Unavailable</h3>
        <p className="text-gray-500 max-w-sm mb-4">{error}</p>
        <p className="text-sm text-gray-400 mb-6">
          You can also enter the vendor code manually below.
        </p>
        <ManualCodeEntry onSubmit={onScan} />
        <button onClick={startScanning} className="btn-secondary mt-4 text-sm">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      {/* Scanner viewport */}
      <div className="relative w-full max-w-sm mx-auto">
        <div
          id="qr-reader"
          className="w-full rounded-xl overflow-hidden"
          style={{ minHeight: 320 }}
        />
        {scanning && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div className="w-56 h-56 border-2 border-market-500 rounded-2xl opacity-50" />
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex gap-3 mt-4">
        {!scanning ? (
          <button onClick={startScanning} className="btn-primary">
            <Camera size={18} />
            Start Scanner
          </button>
        ) : (
          <button onClick={stopScanning} className="btn-secondary">
            <CameraOff size={18} />
            Stop Scanner
          </button>
        )}
      </div>

      {/* Manual entry fallback */}
      <div className="mt-8 w-full max-w-sm">
        <p className="text-sm text-gray-400 text-center mb-3">
          Or enter a stall code manually
        </p>
        <ManualCodeEntry onSubmit={onScan} />
      </div>
    </div>
  );
}

function ManualCodeEntry({ onSubmit }: { onSubmit: (code: string) => void }) {
  const [code, setCode] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.trim()) {
      onSubmit(code.trim().toUpperCase());
      setCode('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="e.g. A3 or B12"
        maxLength={5}
        className="input-field flex-1 text-center uppercase tracking-widest"
      />
      <button type="submit" className="btn-primary px-4" disabled={!code.trim()}>
        <ScanLine size={18} />
      </button>
    </form>
  );
}
