import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { UserButton } from '@clerk/clerk-react';
import api from '../lib/api';
import OutputTabs from '../components/OutputTabs';

export default function TailoringDetailPage() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    api
      .get(`/history/${id}`)
      .then(({ data: res }) => setData(res))
      .catch((err) => {
        setError(err.response?.data?.error ?? 'Failed to load tailoring');
      })
      .finally(() => setLoading(false));
  }, [id]);

  const title = [data?.company_name, data?.job_title].filter(Boolean).join(' — ');

  return (
    <div className="min-h-screen">
      <header className="flex items-center justify-between border-b border-polished-200 px-6 py-4">
        <Link to="/" className="text-lg font-semibold tracking-tight">
          Polished
        </Link>
        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="text-sm text-polished-600 hover:text-polished-900">
            Dashboard
          </Link>
          <Link
            to="/app"
            className="rounded-lg bg-polished-900 px-4 py-2 text-sm font-medium text-white hover:bg-polished-800"
          >
            New tailoring
          </Link>
          <UserButton afterSignOutUrl="/" />
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-10">
        <Link
          to="/dashboard"
          className="text-sm text-polished-500 hover:text-polished-800"
        >
          ← Back to dashboard
        </Link>

        {loading && (
          <p className="mt-8 text-sm text-polished-500">Loading tailoring...</p>
        )}

        {error && (
          <p className="mt-8 text-sm text-red-600">{error}</p>
        )}

        {data && (
          <>
            <div className="mt-6">
              <h1 className="text-2xl font-semibold text-polished-950">
                {title || 'Past tailoring'}
              </h1>
              <p className="mt-1 text-sm text-polished-500">
                {new Date(data.created_at).toLocaleString()}
              </p>
            </div>

            <div className="mt-10">
              <OutputTabs result={data.result} />
            </div>
          </>
        )}
      </main>
    </div>
  );
}
