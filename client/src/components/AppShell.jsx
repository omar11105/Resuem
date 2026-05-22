import { Link } from 'react-router-dom';

export function BrandMark({ className = '' }) {
  return (
    <Link
      to="/"
      className={`font-display text-xl font-medium tracking-tight text-resuem-text hover:text-resuem-accent-bright transition-colors duration-fast ${className}`}
    >
      Resuem
    </Link>
  );
}

export function AppHeader({ children, className = '' }) {
  return (
    <header
      className={`sticky top-0 z-40 border-b border-resuem-border bg-resuem-bg/90 backdrop-blur-md ${className}`}
    >
      <div className="mx-auto flex max-w-editorial items-center justify-between gap-md px-lg py-md sm:px-xl">
        <BrandMark />
        <nav className="flex items-center gap-md sm:gap-lg">{children}</nav>
      </div>
    </header>
  );
}

export function PageMain({ children, className = '', narrow = false }) {
  return (
    <main
      className={`mx-auto px-lg py-section sm:px-xl ${
        narrow ? 'max-w-content' : 'max-w-editorial'
      } ${className}`}
    >
      {children}
    </main>
  );
}
