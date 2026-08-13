import { useState, useCallback } from 'react';
import { Phone, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface SMSLoginProps {
  onSuccess?: () => void;
}

export function SMSLogin({ onSuccess }: SMSLoginProps) {
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState<'phone' | 'code'>('phone');
  const { loading, error, sendCode, verifyCode } = useAuth();

  const handleSendCode = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const cleaned = phone.replace(/\D/g, '');
      if (cleaned.length < 10) return;
      await sendCode(cleaned);
      setStep('code');
    },
    [phone, sendCode],
  );

  const handleVerify = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (code.length < 4) return;
      const cleaned = phone.replace(/\D/g, '');
      const ok = await verifyCode(cleaned, code);
      if (ok) onSuccess?.();
    },
    [phone, code, verifyCode, onSuccess],
  );

  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 10);
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  };

  return (
    <div className="max-w-sm mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-market-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Phone size={28} className="text-market-700" />
        </div>
        <h2 className="text-xl font-display font-bold text-gray-900 mb-2">
          {step === 'phone' ? 'Welcome Back' : 'Check Your Phone'}
        </h2>
        <p className="text-gray-500 text-sm">
          {step === 'phone'
            ? 'Enter your phone number to sign in and track your market trips.'
            : `We sent a 6-digit code to ${formatPhone(phone)}`}
        </p>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-xl p-3 flex items-start gap-2">
          <AlertCircle size={16} className="text-red-500 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {step === 'phone' ? (
        <form onSubmit={handleSendCode} className="space-y-4">
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(formatPhone(e.target.value))}
            placeholder="(555) 123-4567"
            className="input-field text-center text-lg tracking-wide"
            autoFocus
          />
          <button
            type="submit"
            disabled={phone.replace(/\D/g, '').length < 10 || loading}
            className="btn-primary w-full"
          >
            {loading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <>
                Send Code
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerify} className="space-y-4">
          <input
            type="text"
            inputMode="numeric"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            placeholder="000000"
            className="input-field text-center text-2xl tracking-[0.5em] font-mono"
            autoFocus
          />
          <button
            type="submit"
            disabled={code.length < 4 || loading}
            className="btn-primary w-full"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : 'Verify & Sign In'}
          </button>
          <button
            type="button"
            onClick={() => setStep('phone')}
            className="btn-ghost w-full text-sm"
          >
            ← Use a different number
          </button>
        </form>
      )}

      <p className="text-xs text-gray-400 text-center mt-6">
        By signing in, you agree to our Terms. We only use your number for login
        — no marketing messages.
      </p>
    </div>
  );
}
