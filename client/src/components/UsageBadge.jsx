export default function UsageBadge({ count = 0, limit = 1 }) {
  return (
    <span className="inline-flex items-center rounded-full bg-polished-100 px-3 py-1 text-xs font-medium text-polished-700">
      {count}/{limit} tailorings used today
    </span>
  );
}
