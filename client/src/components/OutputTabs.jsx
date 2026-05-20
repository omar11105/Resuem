import { useState } from 'react';

const VIEW_TABS = [
  { id: 'diff', label: 'Side-by-side' },
  { id: 'copy', label: 'Clean copy' },
  { id: 'changes', label: 'What changed' },
];

const CLASSIFICATION_STYLES = {
  GOOD: 'bg-emerald-100 text-emerald-800',
  MID: 'bg-amber-100 text-amber-800',
  BAD: 'bg-rose-100 text-rose-800',
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

export default function OutputTabs({ result }) {
  const [activeView, setActiveView] = useState('diff');

  if (!result?.tailored_sections) return null;

  const { tailored_sections, overall_explanation, jd_keywords_used, warnings } = result;

  const cleanCopy = [
    tailored_sections.experience?.length
      ? `## Experience\n\n${formatBulletList(tailored_sections.experience)}`
      : null,
    tailored_sections.projects?.length
      ? `## Projects\n\n${formatBulletList(tailored_sections.projects)}`
      : null,
    tailored_sections.summary?.tailored
      ? `## Summary\n\n${tailored_sections.summary.tailored}`
      : null,
  ]
    .filter(Boolean)
    .join('\n\n');

  const diffSections = ['experience', 'projects', 'summary'].filter(
    (key) => tailored_sections[key]
  );

  const allChanges = [
    ...collectBullets(tailored_sections, 'experience'),
    ...collectBullets(tailored_sections, 'projects'),
    ...collectBullets(tailored_sections, 'summary'),
  ];

  return (
    <div className="space-y-4">
      {(warnings?.length > 0 || overall_explanation) && (
        <div className="space-y-3">
          {warnings?.map((w, i) => (
            <p
              key={i}
              className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800"
            >
              {w}
            </p>
          ))}
          {overall_explanation && (
            <p className="rounded-lg border border-polished-200 bg-polished-50 px-4 py-3 text-sm text-polished-700">
              {overall_explanation}
            </p>
          )}
          {jd_keywords_used?.length > 0 && (
            <p className="text-xs text-polished-500">
              Keywords used: {jd_keywords_used.join(', ')}
            </p>
          )}
        </div>
      )}

      <div className="rounded-xl border border-polished-200 bg-white shadow-sm">
        <div className="flex border-b border-polished-200">
          {VIEW_TABS.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => setActiveView(id)}
              className={`px-4 py-3 text-sm font-medium transition-colors ${
                activeView === id
                  ? 'border-b-2 border-polished-900 text-polished-900'
                  : 'text-polished-500 hover:text-polished-700'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {activeView === 'diff' && (
            <div className="space-y-8">
              {diffSections.map((sectionKey) => {
                if (sectionKey === 'summary') {
                  const { original, tailored } = tailored_sections.summary;
                  return (
                    <div key="summary">
                      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-polished-500">
                        Summary
                      </h3>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="rounded-lg border border-polished-200 bg-polished-50 p-4">
                          <p className="mb-2 text-xs font-medium text-polished-400">Before</p>
                          <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-polished-700">
                            {original || '—'}
                          </pre>
                        </div>
                        <div className="rounded-lg border border-polished-700 bg-polished-950 p-4">
                          <p className="mb-2 text-xs font-medium text-polished-300">After</p>
                          <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-polished-100">
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
                    <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-polished-500">
                      {sectionKey === 'experience' ? 'Experience' : 'Projects'}
                    </h3>
                    {entries.map((entry, ei) => (
                      <div key={ei} className="mb-6">
                        {(entry.company || entry.role) && (
                          <p className="mb-3 text-sm font-medium text-polished-800">
                            {[entry.company, entry.role].filter(Boolean).join(' — ')}
                          </p>
                        )}
                        <div className="space-y-4">
                          {(entry.bullets ?? []).map((bullet, bi) => (
                            <div key={bi} className="grid gap-4 md:grid-cols-2">
                              <div className="rounded-lg border border-polished-200 bg-polished-50 p-4">
                                <p className="mb-2 text-xs font-medium text-polished-400">Before</p>
                                <p className="text-sm leading-relaxed text-polished-700">
                                  {bullet.original}
                                </p>
                              </div>
                              <div className="rounded-lg border border-polished-700 bg-polished-950 p-4">
                                <p className="mb-2 text-xs font-medium text-polished-300">After</p>
                                <p className="text-sm leading-relaxed text-polished-100">
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
              <button
                type="button"
                onClick={() => navigator.clipboard.writeText(cleanCopy)}
                className="mb-4 rounded-lg border border-polished-200 px-3 py-1.5 text-xs font-medium text-polished-700 hover:bg-polished-50"
              >
                Copy all
              </button>
              <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-polished-800">
                {cleanCopy}
              </pre>
            </div>
          )}

          {activeView === 'changes' && (
            <ul className="space-y-4">
              {allChanges.length === 0 ? (
                <p className="text-sm text-polished-500">No change notes returned.</p>
              ) : (
                allChanges.map((change, i) => (
                  <li
                    key={i}
                    className="rounded-lg border border-polished-200 p-4 text-sm"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      {change.context && (
                        <span className="text-xs font-medium uppercase tracking-wider text-polished-400">
                          {change.context}
                        </span>
                      )}
                      {change.classification && (
                        <span
                          className={`rounded px-1.5 py-0.5 text-xs font-medium ${
                            CLASSIFICATION_STYLES[change.classification] ??
                            'bg-polished-100 text-polished-700'
                          }`}
                        >
                          {change.classification}
                        </span>
                      )}
                    </div>
                    <div className="mt-2 grid gap-2 text-polished-600 md:grid-cols-2">
                      <p>
                        <span className="font-medium text-polished-500">Was: </span>
                        {change.original}
                      </p>
                      <p>
                        <span className="font-medium text-polished-500">Now: </span>
                        {change.tailored}
                      </p>
                    </div>
                    <p className="mt-2 text-polished-800">{change.explanation}</p>
                  </li>
                ))
              )}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
