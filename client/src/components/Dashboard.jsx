import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../lib/api';
import UsageBadge from './UsageBadge';
import { useUsage } from '../hooks/useUsage';

export default function Dashboard() {
  const { usage, isPro } = useUsage();
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
    <div className="space-y-2xl">
      <div className="flex flex-col gap-md border-b border-resuem-border pb-xl sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="label-editorial">History</p>
          <h1 className="font-display mt-sm text-3xl font-medium text-resuem-text sm:text-4xl">
            Dashboard
          </h1>
        </div>
        <UsageBadge count={usage.count} limit={usage.limit} isPro={isPro} />
      </div>

      <section>
        <h2 className="label-editorial">Past tailorings</h2>
        {loading ? (
          <div className="mt-xl space-y-md">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-14 animate-pulse border border-resuem-border bg-resuem-surface"
              />
            ))}
          </div>
        ) : history.length === 0 ? (
          <p className="mt-xl text-sm text-resuem-muted">
            No tailorings yet.{' '}
            <Link to="/app" className="text-resuem-accent hover:text-resuem-accent-bright">
              Start one
            </Link>
          </p>
        ) : (
          <ul className="mt-lg divide-y divide-resuem-border border border-resuem-border">
            {history.map((item) => (
              <li key={item.id}>
                <Link
                  to={`/tailoring/${item.id}`}
                  className="group flex items-center justify-between gap-lg px-lg py-md transition-colors duration-fast hover:bg-resuem-accent-dim"
                >
                  <div className="min-w-0">
                    {item.company_name && (
                      <p className="truncate font-display text-base text-resuem-text">
                        {item.company_name}
                      </p>
                    )}
                    <p
                      className={`truncate text-sm ${
                        item.company_name
                          ? 'text-resuem-muted'
                          : 'font-display text-base text-resuem-text'
                      }`}
                    >
                      {item.job_title}
                    </p>
                  </div>
                  <time className="shrink-0 font-mono text-xs text-resuem-muted transition-colors duration-fast group-hover:text-resuem-accent">
                    {new Date(item.created_at).toLocaleDateString()}
                  </time>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
