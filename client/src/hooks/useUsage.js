import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@clerk/clerk-react';
import api from '../lib/api';

const FREE_DAILY_LIMIT = 1;

export function useUsage() {
  const { isSignedIn, isLoaded } = useAuth();
  const [usage, setUsage] = useState({
    count: 0,
    limit: FREE_DAILY_LIMIT,
    plan: 'free',
  });
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!isSignedIn) {
      setUsage({ count: 0, limit: FREE_DAILY_LIMIT, plan: 'free' });
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.get('/usage');
      setUsage({
        count: data.count ?? 0,
        limit: data.limit ?? FREE_DAILY_LIMIT,
        plan: data.plan ?? 'free',
      });
    } catch {
      setUsage({ count: 0, limit: FREE_DAILY_LIMIT, plan: 'free' });
    } finally {
      setLoading(false);
    }
  }, [isSignedIn]);

  useEffect(() => {
    if (isLoaded) refresh();
  }, [isLoaded, refresh]);

  const isPro = usage.plan === 'pro';
  const remaining = Math.max(0, usage.limit - usage.count);
  const atLimit = !isPro && usage.count >= usage.limit;

  return { usage, remaining, atLimit, isPro, loading, refresh };
}
