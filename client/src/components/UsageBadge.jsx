export default function UsageBadge({ count = 0, limit = 1, isPro = false }) {
  if (isPro) {
    return (
      <span className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-800">
        Pro
      </span>
    );
  }

  return (
    <span className="inline-flex items-center rounded-full bg-polished-100 px-3 py-1 text-xs font-medium text-polished-700">
      {count}/{limit} tailorings used today
    </span>
  );
}
