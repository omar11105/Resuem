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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-lg backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-md border border-resuem-border bg-resuem-surface-raised p-2xl shadow-2xl">
        <p className="label-editorial">Upgrade</p>
        <h2 className="font-display mt-sm text-2xl font-medium text-resuem-text">
          Continue with Pro
        </h2>
        <p className="mt-md text-sm leading-relaxed text-resuem-text-secondary">
          {activating
            ? 'Thanks! Your plan is activating — this usually takes a few seconds.'
            : reason === 'download'
              ? 'PDF download is available on Pro.'
              : "You've used your free tailoring for today. Upgrade for unlimited runs and PDF export."}
        </p>
        <div className="mt-xl flex flex-col gap-sm sm:flex-row">
          <button
            type="button"
            onClick={onClose}
            disabled={activating}
            className="btn-secondary flex-1 justify-center disabled:opacity-50"
          >
            Maybe later
          </button>
          <button
            type="button"
            onClick={handleUpgrade}
            disabled={activating}
            className="btn-primary flex-1 disabled:opacity-50"
          >
            {activating ? 'Activating…' : 'Upgrade to Pro — $9/month'}
          </button>
        </div>
      </div>
    </div>
  );
}
