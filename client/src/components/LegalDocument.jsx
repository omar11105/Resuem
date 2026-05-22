import { AppHeader } from './AppShell';

export default function LegalDocument({ title, lastUpdated, children }) {
  return (
    <>
      <AppHeader />
      <article className="legal-doc mx-auto max-w-[720px] px-lg py-section sm:px-xl">
        <header className="border-b border-resuem-border pb-xl">
          <h1 className="font-display text-3xl font-medium text-resuem-text">{title}</h1>
          {lastUpdated && (
            <p className="mt-md text-sm text-resuem-muted">Last Updated: {lastUpdated}</p>
          )}
        </header>
        <div className="mt-xl space-y-xl">{children}</div>
      </article>
    </>
  );
}
