import { Link } from 'react-router-dom';
import { UserButton } from '@clerk/clerk-react';
import Dashboard from '../components/Dashboard';
import { AppHeader, PageMain } from '../components/AppShell';

export default function DashboardPage() {
  return (
    <div className="min-h-[100dvh] bg-resuem-bg">
      <AppHeader>
        <Link to="/app" className="btn-primary">
          New tailoring
        </Link>
        <UserButton afterSignOutUrl="/" />
      </AppHeader>
      <PageMain narrow>
        <Dashboard />
      </PageMain>
    </div>
  );
}
