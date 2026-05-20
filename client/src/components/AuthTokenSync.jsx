import { useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { registerAuthTokenGetter } from '../lib/api';

/** Keeps the API client Authorization header in sync with Clerk session */
export default function AuthTokenSync() {
  const { getToken, isLoaded } = useAuth();

  useEffect(() => {
    if (!isLoaded) return;
    registerAuthTokenGetter(getToken);
  }, [getToken, isLoaded]);

  return null;
}
