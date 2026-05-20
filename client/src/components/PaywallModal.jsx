export default function PaywallModal({ open, onClose, reason }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <h2 className="text-xl font-semibold text-polished-950">Upgrade to continue</h2>
        <p className="mt-2 text-sm text-polished-600">
          {reason === 'download'
            ? 'PDF download is available on Pro.'
            : 'You\'ve used your free tailoring for today. Upgrade for unlimited runs.'}
        </p>
        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-lg border border-polished-200 px-4 py-2 text-sm font-medium text-polished-700 hover:bg-polished-50"
          >
            Maybe later
          </button>
          <a
            href="/api/checkout"
            className="flex-1 rounded-lg bg-polished-900 px-4 py-2 text-center text-sm font-medium text-white hover:bg-polished-800"
          >
            Upgrade — $9/mo
          </a>
        </div>
      </div>
    </div>
  );
}
