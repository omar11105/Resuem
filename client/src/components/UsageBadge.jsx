export default function UsageBadge({ count = 0, limit = 1, isPro = false }) {
  if (isPro) {
    return (
      <span className="label-editorial border border-resuem-success/40 bg-resuem-success-dim px-md py-xs text-resuem-success">
        Pro
      </span>
    );
  }

  return (
    <span className="font-mono text-xs text-resuem-muted">
      <span className="text-resuem-text-secondary">{count}</span>
      <span className="text-resuem-muted">/</span>
      <span className="text-resuem-text-secondary">{limit}</span>
      <span className="ml-xs hidden sm:inline">today</span>
    </span>
  );
}
