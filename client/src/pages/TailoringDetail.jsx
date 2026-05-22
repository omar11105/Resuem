import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { UserButton } from '@clerk/clerk-react';
import api from '../lib/api';
import OutputTabs from '../components/OutputTabs';
import { AppHeader, PageMain } from '../components/AppShell';

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
    <div className="min-h-[100dvh] bg-resuem-bg">
      <AppHeader>
        <Link to="/dashboard" className="link-subtle hidden sm:inline">
          Dashboard
        </Link>
        <Link to="/app" className="btn-primary">
          New tailoring
        </Link>
        <UserButton afterSignOutUrl="/" />
      </AppHeader>

      <PageMain>
        <Link to="/dashboard" className="link-subtle inline-flex items-center gap-xs">
          <span aria-hidden="true">←</span> Back to dashboard
        </Link>

        {loading && (
          <div className="mt-2xl space-y-md">
            <div className="h-8 w-48 animate-pulse bg-resuem-surface" />
            <div className="h-4 w-32 animate-pulse bg-resuem-surface" />
          </div>
        )}

        {error && (
          <p className="mt-2xl text-sm text-resuem-error" role="alert">
            {error}
          </p>
        )}

        {data && (
          <>
            <header className="mt-xl max-w-prose border-b border-resuem-border pb-xl">
              <p className="label-editorial">Past tailoring</p>
              <h1 className="font-display mt-sm text-3xl font-medium text-resuem-text sm:text-4xl">
                {title || 'Past tailoring'}
              </h1>
              <p className="mt-md font-mono text-xs text-resuem-muted">
                {new Date(data.created_at).toLocaleString()}
              </p>
            </header>

            <div className="mt-3xl">
              <OutputTabs result={data.result} />
            </div>
          </>
        )}
      </PageMain>
    </div>
  );
}
