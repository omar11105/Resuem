import { useEffect, useState, useCallback } from 'react';
import { useUser } from '@clerk/clerk-react';
import api from '../lib/api';
import { openProCheckout } from '../lib/paddle';

const POLL_INTERVAL_MS = 3000;
const MAX_POLLS = 5;

export default function PaywallModal({ open, onClose, reason, onPlanActivated }) {
  const { user } = useUser();
  const [activating, setActivating] = useState(false);

  const pollForPro = useCallback(async () => {
    setActivating(true);
    for (let i = 0; i < MAX_POLLS; i++) {
      if (i > 0) {
        await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));
      }
      try {
        const { data } = await api.get('/usage');
        if (data.plan === 'pro') {
          onPlanActivated?.();
          setActivating(false);
          onClose();
          return;
        }
      } catch {
        // keep polling
      }
    }
    setActivating(false);
  }, [onPlanActivated, onClose]);

  useEffect(() => {
    if (!open) return undefined;

    const handler = () => {
      pollForPro();
    };
    window.addEventListener('paddle:checkout:completed', handler);
    return () => window.removeEventListener('paddle:checkout:completed', handler);
  }, [open, pollForPro]);

  const handleUpgrade = () => {
    const email = user?.primaryEmailAddress?.emailAddress;
    const userId = user?.id;
    if (!email || !userId) {
      console.error('Cannot open Paddle checkout without signed-in user');
      return;
    }
    openProCheckout(email, userId);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <h2 className="text-xl font-semibold text-polished-950">Upgrade to continue</h2>
        <p className="mt-2 text-sm text-polished-600">
          {activating
            ? 'Thanks! Your plan is activating — this usually takes a few seconds.'
            : reason === 'download'
              ? 'PDF download is available on Pro.'
              : "You've used your free tailoring for today. Upgrade for unlimited runs and PDF export."}
        </p>
        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={activating}
            className="flex-1 rounded-lg border border-polished-200 px-4 py-2 text-sm font-medium text-polished-700 hover:bg-polished-50 disabled:opacity-50"
          >
            Maybe later
          </button>
          <button
            type="button"
            onClick={handleUpgrade}
            disabled={activating}
            className="flex-1 rounded-lg bg-polished-900 px-4 py-2 text-sm font-medium text-white hover:bg-polished-800 disabled:opacity-50"
          >
            {activating ? 'Activating…' : 'Upgrade to Pro — $9/month'}
          </button>
        </div>
      </div>
    </div>
  );
}
