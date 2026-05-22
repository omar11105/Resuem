import { Link } from 'react-router-dom';
import { SignInButton } from '@clerk/clerk-react';
import { AppHeader } from '../components/AppShell';

const FREE_FEATURES = [
  '1 resume tailoring per day',
  'AI-powered bullet point scoring',
  'Side-by-side comparison view',
  'Clean tailored version to copy',
  'Change explanations',
];

const PRO_FEATURES = [
  'Unlimited resume tailorings',
  'Everything in Free',
  'PDF download',
  'Full tailoring history',
  'Priority support',
];

const FAQ = [
  {
    q: 'Can I cancel anytime?',
    a: 'Yes. Cancel from your dashboard at any time. No questions asked.',
  },
  {
    q: 'What happens when I hit the free limit?',
    a: "You can still use the app — you'll be prompted to upgrade for additional tailorings that day.",
  },
  {
    q: 'Is my resume data stored?',
    a: "Your tailoring history is saved to your account. We don't sell or share your data.",
  },
  {
    q: 'Do you offer refunds?',
    a: (
      <>
        Yes — see our{' '}
        <Link to="/refund" className="text-resuem-accent hover:text-resuem-accent-bright">
          30-day no-questions-asked refund policy
        </Link>
        .
      </>
    ),
  },
];

function FeatureList({ items }) {
  return (
    <ul className="mt-lg space-y-sm">
      {items.map((item) => (
        <li key={item} className="flex gap-sm text-sm text-resuem-text-secondary">
          <span className="text-resuem-accent" aria-hidden="true">
            •
          </span>
          {item}
        </li>
      ))}
    </ul>
  );
}

export default function Pricing() {
  const handleProClick = () => {
    console.log('Upgrade to Pro');
  };

  return (
    <>
      <AppHeader />
      <div className="mx-auto max-w-[900px] px-lg py-section sm:px-xl">
        <header className="text-center">
          <p className="label-editorial">Pricing</p>
          <h1 className="font-display mt-sm text-3xl font-medium text-resuem-text sm:text-4xl">
            Simple, Transparent Pricing
          </h1>
          <p className="mt-md text-resuem-text-secondary">
            Start free. Upgrade when you&apos;re ready.
          </p>
        </header>

        <div className="mt-2xl grid gap-lg md:grid-cols-2">
          <div className="flex flex-col border border-resuem-border bg-resuem-surface p-xl">
            <p className="label-editorial">Free</p>
            <p className="mt-md font-mono-tabular text-3xl text-resuem-text">$0</p>
            <p className="text-sm text-resuem-muted">/ month</p>
            <p className="mt-md text-sm text-resuem-text-secondary">
              Perfect for trying Resuem
            </p>
            <FeatureList items={FREE_FEATURES} />
            <div className="mt-auto pt-xl">
              <SignInButton mode="modal">
                <button type="button" className="btn-secondary w-full justify-center">
                  Get Started Free
                </button>
              </SignInButton>
            </div>
          </div>

          <div className="relative flex flex-col border border-resuem-accent bg-resuem-surface-raised p-xl shadow-[0_0_40px_var(--color-accent-glow)]">
            <span className="absolute right-lg top-lg label-editorial border border-resuem-accent bg-resuem-accent-dim px-sm py-xs text-resuem-accent-bright">
              Most Popular
            </span>
            <p className="label-editorial">Pro</p>
            <p className="mt-md font-mono-tabular text-3xl text-resuem-accent-bright">$9</p>
            <p className="text-sm text-resuem-muted">/ month</p>
            <p className="mt-md text-sm text-resuem-text-secondary">
              For active job seekers
            </p>
            <FeatureList items={PRO_FEATURES} />
            <div className="mt-auto pt-xl">
              <button
                type="button"
                onClick={handleProClick}
                className="btn-primary w-full"
              >
                Upgrade to Pro
              </button>
            </div>
          </div>
        </div>

        <section className="mt-3xl border-t border-resuem-border pt-2xl">
          <h2 className="font-display text-xl font-medium text-resuem-text">
            Frequently asked questions
          </h2>
          <dl className="mt-xl space-y-lg">
            {FAQ.map(({ q, a }) => (
              <div key={q}>
                <dt className="text-sm font-medium text-resuem-text">{q}</dt>
                <dd className="mt-sm text-sm leading-relaxed text-resuem-text-secondary">
                  {a}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      </div>
    </>
  );
}
