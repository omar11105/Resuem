import { useEffect, useState } from 'react';
import api from '../lib/api';
import UsageBadge from './UsageBadge';
import { useUsage } from '../hooks/useUsage';

export default function Dashboard() {
  const { usage } = useUsage();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/history')
      .then(({ data }) => setHistory(data.items ?? []))
      .catch(() => setHistory([]))
      .finally(() => setLoading(false));
  }, []);

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
          <ul className="mt-4 divide-y divide-polished-100 rounded-xl border border-polished-200 bg-white">
            {history.map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between gap-4 px-4 py-3"
              >
                <div className="min-w-0">
                  {item.company_name && (
                    <p className="truncate text-sm font-medium text-polished-900">
                      {item.company_name}
                    </p>
                  )}
                  <p
                    className={`truncate text-sm ${
                      item.company_name ? 'text-polished-500' : 'font-medium text-polished-900'
                    }`}
                  >
                    {item.job_title}
                  </p>
                </div>
                <time className="shrink-0 text-xs text-polished-400">
                  {new Date(item.created_at).toLocaleDateString()}
                </time>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
