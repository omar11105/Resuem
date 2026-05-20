import { Link } from 'react-router-dom';
import BeforeAfterDemo from '../components/BeforeAfterDemo';

export default function Home() {
  return (
    <div className="min-h-screen">
      <header className="flex items-center justify-between px-6 py-4">
        <span className="text-lg font-semibold tracking-tight">Polished</span>
        <Link
          to="/app"
          className="rounded-lg bg-polished-900 px-4 py-2 text-sm font-medium text-white hover:bg-polished-800"
        >
          Tailor resume
        </Link>
      </header>

      <BeforeAfterDemo />

      <div className="pb-16 text-center">
        <Link
          to="/app"
          className="inline-flex rounded-lg bg-polished-900 px-6 py-3 text-sm font-medium text-white hover:bg-polished-800"
        >
          Get started
        </Link>
      </div>
    </div>
  );
}
