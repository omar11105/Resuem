import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import api, { setAuthToken } from '../lib/api';
import UsageBadge from './UsageBadge';
import { useUsage } from '../hooks/useUsage';

export default function Dashboard() {
  const { getToken } = useAuth();
  const { usage } = useUsage();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setAuthToken(getToken);
    api
      .get('/history')
      .then(({ data }) => setHistory(data.items ?? []))
      .catch(() => setHistory([]))
      .finally(() => setLoading(false));
  }, [getToken]);

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-polished-950">Dashboard</h1>
        <UsageBadge count={usage.count} limit={usage.limit} />
      </div>

      <section className="mt-8">
        <h2 className="text-sm font-medium uppercase tracking-wider text-polished-500">
          Past tailorings
        </h2>
        {loading ? (
          <p className="mt-4 text-sm text-polished-500">Loading...</p>
        ) : history.length === 0 ? (
          <p className="mt-4 text-sm text-polished-500">No tailorings yet.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {history.map((item) => (
              <li
                key={item.id}
                className="rounded-lg border border-polished-200 bg-white px-4 py-3 text-sm"
              >
                <span className="font-medium text-polished-900">
                  {item.job_title ?? 'Untitled role'}
                </span>
                <span className="ml-2 text-polished-400">
                  {new Date(item.created_at).toLocaleDateString()}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
