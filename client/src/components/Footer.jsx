import { Link } from 'react-router-dom';

const LEGAL_LINKS = [
  { to: '/pricing', label: 'Pricing' },
  { to: '/terms', label: 'Terms' },
  { to: '/privacy', label: 'Privacy' },
  { to: '/refund', label: 'Refund Policy' },
];

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-resuem-border bg-resuem-bg-subtle">
      <div className="mx-auto flex max-w-editorial flex-col gap-lg px-lg py-xl sm:flex-row sm:items-center sm:justify-between sm:px-xl">
        <p className="text-xs text-resuem-muted">
          © 2025 Omar Mohamed. All rights reserved.
        </p>

        <nav
          className="flex flex-wrap items-center gap-x-lg gap-y-sm"
          aria-label="Legal and pricing"
        >
          {LEGAL_LINKS.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className="text-xs text-resuem-text-secondary transition-colors duration-fast hover:text-resuem-accent-bright"
            >
              {label}
            </Link>
          ))}
        </nav>

        <p className="text-xs text-resuem-muted">
          Support:{' '}
          <a
            href="mailto:support@resuem.org"
            className="text-resuem-text-secondary transition-colors duration-fast hover:text-resuem-accent-bright"
          >
            support@resuem.org
          </a>
        </p>
      </div>
    </footer>
  );
}
