import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@clerk/clerk-react';
import api, { setAuthToken } from '../lib/api';

const FREE_DAILY_LIMIT = 1;

export function useUsage() {
  const { isSignedIn, getToken } = useAuth();
  const [usage, setUsage] = useState({ count: 0, limit: FREE_DAILY_LIMIT });
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!isSignedIn) {
      setUsage({ count: 0, limit: FREE_DAILY_LIMIT });
      setLoading(false);
      return;
    }

    setAuthToken(getToken);
    setLoading(true);
    try {
      const { data } = await api.get('/usage');
      setUsage({ count: data.count, limit: data.limit ?? FREE_DAILY_LIMIT });
    } catch {
      setUsage({ count: 0, limit: FREE_DAILY_LIMIT });
    } finally {
      setLoading(false);
    }
  }, [isSignedIn, getToken]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const remaining = Math.max(0, usage.limit - usage.count);
  const atLimit = usage.count >= usage.limit;

  return { usage, remaining, atLimit, loading, refresh };
}
