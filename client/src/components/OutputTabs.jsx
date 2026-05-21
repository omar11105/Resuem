import { useState } from 'react';
import AtsScore from './AtsScore';

const VIEW_TABS = [
  { id: 'diff', label: 'Side-by-side' },
  { id: 'copy', label: 'Clean copy' },
  { id: 'changes', label: 'What changed' },
];

const CLASSIFICATION_STYLES = {
  GOOD: 'border-resuem-success/40 bg-resuem-success-dim text-resuem-success',
  MID: 'border-resuem-warning/40 bg-resuem-warning-dim text-resuem-warning',
  BAD: 'border-resuem-error/40 bg-resuem-error-dim text-resuem-error',
};

function formatBulletList(entries) {
  if (!entries?.length) return '';

  return entries
    .map((entry) => {
      const header = [entry.company, entry.role].filter(Boolean).join(' — ');
      const bullets = (entry.bullets ?? [])
        .map((b) => `• ${b.tailored}`)
        .join('\n');
      return header ? `${header}\n${bullets}` : bullets;
    })
    .filter(Boolean)
    .join('\n\n');
}

function collectBullets(tailoredSections, sectionKey) {
  const data = tailoredSections?.[sectionKey];
  if (!data) return [];

  if (sectionKey === 'summary') {
    return data.original
      ? [{ original: data.original, tailored: data.tailored, classification: null, explanation: data.explanation }]
      : [];
  }

  return (Array.isArray(data) ? data : []).flatMap((entry) =>
    (entry.bullets ?? []).map((b) => ({
      ...b,
      context: [entry.company, entry.role].filter(Boolean).join(' — ') || entry.name || null,
    }))
  );
}

const SECTION_ORDER = ['experience', 'projects', 'summary'];

export default function OutputTabs({ result, isPro = false, onRequestPaywall }) {
  const [activeView, setActiveView] = useState('diff');

  if (!result?.tailored_sections) return null;

  const { tailored_sections, overall_explanation, jd_keywords_used, warnings } = result;

  const activeSections = (
    result.sections_tailored?.length
      ? SECTION_ORDER.filter((s) => result.sections_tailored.includes(s))
      : SECTION_ORDER.filter((s) => tailored_sections[s])
  );

  const cleanCopy = activeSections
    .map((key) => {
      if (key === 'summary' && tailored_sections.summary?.tailored) {
        return `## Summary\n\n${tailored_sections.summary.tailored}`;
      }
      if (key === 'experience' && tailored_sections.experience?.length) {
        return `## Experience\n\n${formatBulletList(tailored_sections.experience)}`;
      }
      if (key === 'projects' && tailored_sections.projects?.length) {
        return `## Projects\n\n${formatBulletList(tailored_sections.projects)}`;
      }
      return null;
    })
    .filter(Boolean)
    .join('\n\n');

  const diffSections = activeSections.filter((key) => tailored_sections[key]);

  const allChanges = activeSections.flatMap((key) =>
    collectBullets(tailored_sections, key)
  );

  return (
    <div className="space-y-xl">
      <AtsScore result={result} />

      {(warnings?.length > 0 || overall_explanation) && (
        <div className="space-y-md">
          {warnings?.map((w, i) => (
            <p
              key={i}
              className="border border-resuem-warning/30 bg-resuem-warning-dim px-lg py-md text-sm text-resuem-warning"
            >
              {w}
            </p>
          ))}
          {overall_explanation && (
            <p className="border-l-2 border-resuem-accent bg-resuem-surface px-lg py-md text-sm leading-relaxed text-resuem-text-secondary">
              {overall_explanation}
            </p>
          )}
          {jd_keywords_used?.length > 0 && (
            <p className="text-xs text-resuem-muted">
              <span className="label-editorial mr-sm">Keywords</span>
              {jd_keywords_used.join(', ')}
            </p>
          )}
        </div>
      )}

      <div className="surface-panel overflow-hidden">
        <div
          className="flex overflow-x-auto border-b border-resuem-border"
          role="tablist"
        >
          {VIEW_TABS.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={activeView === id}
              data-active={activeView === id}
              onClick={() => setActiveView(id)}
              className="tab-trigger shrink-0"
            >
              {label}
            </button>
          ))}
        </div>

        <div className="p-lg sm:p-xl" role="tabpanel">
          <div key={activeView} className="tab-panel-enter">
            {activeView === 'diff' && (
              <div className="space-y-2xl">
                {diffSections.map((sectionKey) => {
                  if (sectionKey === 'summary') {
                    const { original, tailored } = tailored_sections.summary;
                    return (
                      <div key="summary">
                        <h3 className="label-editorial mb-lg">Summary</h3>
                        <div className="grid gap-md md:grid-cols-2">
                          <div className="border border-resuem-border bg-resuem-before p-lg">
                            <p className="label-editorial mb-md text-resuem-muted">Before</p>
                            <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-resuem-text-secondary">
                              {original || '—'}
                            </pre>
                          </div>
                          <div className="border border-resuem-accent/30 bg-resuem-after p-lg">
                            <p className="label-editorial mb-md text-resuem-accent">After</p>
                            <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-resuem-text">
                              {tailored || '—'}
                            </pre>
                          </div>
                        </div>
                      </div>
                    );
                  }

                  const entries = tailored_sections[sectionKey] ?? [];
                  return (
                    <div key={sectionKey}>
                      <h3 className="label-editorial mb-lg">
                        {sectionKey === 'experience' ? 'Experience' : 'Projects'}
                      </h3>
                      {entries.map((entry, ei) => (
                        <div key={ei} className="mb-xl last:mb-0">
                          {(entry.company || entry.role) && (
                            <p className="mb-lg font-display text-lg text-resuem-text">
                              {[entry.company, entry.role].filter(Boolean).join(' — ')}
                            </p>
                          )}
                          <div className="space-y-lg">
                            {(entry.bullets ?? []).map((bullet, bi) => (
                              <div key={bi} className="grid gap-md md:grid-cols-2">
                                <div className="border border-resuem-border bg-resuem-before p-lg">
                                  <p className="label-editorial mb-md text-resuem-muted">Before</p>
                                  <p className="text-sm leading-relaxed text-resuem-text-secondary">
                                    {bullet.original}
                                  </p>
                                </div>
                                <div className="border border-resuem-accent/30 bg-resuem-after p-lg">
                                  <p className="label-editorial mb-md text-resuem-accent">After</p>
                                  <p className="text-sm leading-relaxed text-resuem-text">
                                    {bullet.tailored}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            )}

            {activeView === 'copy' && (
              <div>
                <div className="mb-lg flex flex-wrap gap-sm">
                  <button
                    type="button"
                    onClick={() => navigator.clipboard.writeText(cleanCopy)}
                    className="btn-secondary"
                  >
                    Copy all
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (!isPro) {
                        onRequestPaywall?.();
                        return;
                      }
                      const blob = new Blob([cleanCopy], { type: 'text/plain' });
                      const url = URL.createObjectURL(blob);
                      const link = document.createElement('a');
                      link.href = url;
                      link.download = 'tailored-resume.txt';
                      document.body.appendChild(link);
                      link.click();
                      link.remove();
                      URL.revokeObjectURL(url);
                    }}
                    className="btn-secondary"
                  >
                    Download PDF
                  </button>
                </div>
                <pre className="whitespace-pre-wrap border border-resuem-border bg-resuem-bg-subtle p-lg font-mono text-[0.8125rem] leading-relaxed text-resuem-text-secondary">
                  {cleanCopy}
                </pre>
              </div>
            )}

            {activeView === 'changes' && (
              <ul className="space-y-lg">
                {allChanges.length === 0 ? (
                  <p className="text-sm text-resuem-muted">No change notes returned.</p>
                ) : (
                  allChanges.map((change, i) => (
                    <li
                      key={i}
                      className="border border-resuem-border bg-resuem-surface p-lg text-sm"
                    >
                      <div className="flex flex-wrap items-center gap-sm">
                        {change.context && (
                          <span className="label-editorial">{change.context}</span>
                        )}
                        {change.classification && (
                          <span
                            className={`border px-sm py-xs text-xs font-medium uppercase tracking-wider ${
                              CLASSIFICATION_STYLES[change.classification] ??
                              'border-resuem-border bg-resuem-accent-dim text-resuem-text-secondary'
                            }`}
                          >
                            {change.classification}
                          </span>
                        )}
                      </div>
                      <div className="mt-lg grid gap-md text-resuem-text-secondary md:grid-cols-2">
                        <p>
                          <span className="label-editorial mr-sm">Was</span>
                          {change.original}
                        </p>
                        <p>
                          <span className="label-editorial mr-sm">Now</span>
                          <span className="text-resuem-text">{change.tailored}</span>
                        </p>
                      </div>
                      <p className="mt-md border-t border-resuem-border pt-md text-resuem-text">
                        {change.explanation}
                      </p>
                    </li>
                  ))
                )}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
