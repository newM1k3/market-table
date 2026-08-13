import { useState, useCallback, useEffect } from 'react';
import { pb, isAuthenticated, requestSMSLogin, verifySMSCode, logout } from '../lib/pocketbase';

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [authed, setAuthed] = useState(isAuthenticated());

  useEffect(() => {
    const unsubscribe = pb.authStore.onChange(() => {
      setAuthed(isAuthenticated());
    });
    return () => unsubscribe();
  }, []);

  const sendCode = useCallback(async (phone: string) => {
    setLoading(true);
    setError(null);
    try {
      await requestSMSLogin(phone);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to send code');
    } finally {
      setLoading(false);
    }
  }, []);

  const verifyCode = useCallback(async (phone: string, code: string) => {
    setLoading(true);
    setError(null);
    try {
      const ok = await verifySMSCode(phone, code);
      if (!ok) {
        setError('Invalid code. Please try again.');
      }
      return ok;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Verification failed');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const signOut = useCallback(() => {
    logout();
  }, []);

  return { authed, loading, error, sendCode, verifyCode, signOut };
}
