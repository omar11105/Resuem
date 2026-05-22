import { Link } from 'react-router-dom';
import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/clerk-react';
import BeforeAfterDemo from '../components/BeforeAfterDemo';
import { AppHeader } from '../components/AppShell';

export default function Home() {
  return (
    <div className="bg-resuem-bg">
      <AppHeader>
        <SignedIn>
          <Link to="/dashboard" className="link-subtle hidden sm:inline">
            Dashboard
          </Link>
          <Link to="/app" className="btn-primary">
            Tailor resume
          </Link>
          <UserButton afterSignOutUrl="/" />
        </SignedIn>
        <SignedOut>
          <SignInButton mode="modal">
            <button type="button" className="btn-primary">
              Sign in
            </button>
          </SignInButton>
        </SignedOut>
      </AppHeader>

      <BeforeAfterDemo />

      <section className="border-t border-resuem-border px-lg py-2xl text-center sm:px-xl">
        <SignedIn>
          <Link to="/app" className="btn-primary">
            Tailor resume
          </Link>
        </SignedIn>
        <SignedOut>
          <SignInButton mode="modal">
            <button type="button" className="btn-primary">
              Get started — it&apos;s free
            </button>
          </SignInButton>
        </SignedOut>
        <p className="mt-xl label-editorial">
          Built for CS students and job seekers
        </p>
      </section>
    </div>
  );
}
