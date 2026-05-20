import { Link } from 'react-router-dom';
import Dashboard from '../components/Dashboard';

export default function DashboardPage() {
  return (
    <div className="min-h-screen">
      <header className="flex items-center justify-between border-b border-polished-200 px-6 py-4">
        <Link to="/" className="text-lg font-semibold tracking-tight">
          Polished
        </Link>
        <Link
          to="/app"
          className="rounded-lg bg-polished-900 px-4 py-2 text-sm font-medium text-white hover:bg-polished-800"
        >
          New tailoring
        </Link>
      </header>
      <Dashboard />
    </div>
  );
}
