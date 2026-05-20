import { Link } from 'react-router-dom';
import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/clerk-react';
import BeforeAfterDemo from '../components/BeforeAfterDemo';

export default function Home() {
  return (
    <div className="min-h-screen">
      <header className="flex items-center justify-between px-6 py-4">
        <span className="text-lg font-semibold tracking-tight">Polished</span>
        <nav className="flex items-center gap-4">
          <SignedIn>
            <Link to="/dashboard" className="text-sm text-polished-600 hover:text-polished-900">
              Dashboard
            </Link>
            <Link
              to="/app"
              className="rounded-lg bg-polished-900 px-4 py-2 text-sm font-medium text-white hover:bg-polished-800"
            >
              Tailor resume
            </Link>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal">
              <button
                type="button"
                className="rounded-lg bg-polished-900 px-4 py-2 text-sm font-medium text-white hover:bg-polished-800"
              >
                Sign in
              </button>
            </SignInButton>
          </SignedOut>
        </nav>
      </header>

      <BeforeAfterDemo />

      <div className="pb-16 text-center">
        <SignedIn>
          <Link
            to="/app"
            className="inline-flex rounded-lg bg-polished-900 px-6 py-3 text-sm font-medium text-white hover:bg-polished-800"
          >
            Tailor resume
          </Link>
        </SignedIn>
        <SignedOut>
          <SignInButton mode="modal">
            <button
              type="button"
              className="inline-flex rounded-lg bg-polished-900 px-6 py-3 text-sm font-medium text-white hover:bg-polished-800"
            >
              Get started — it&apos;s free
            </button>
          </SignInButton>
        </SignedOut>
      </div>
    </div>
  );
}
