const SECTION_ORDER = ['experience', 'projects', 'summary'];

function collectClassifications(tailoredSections) {
  const scores = [];
  if (!tailoredSections) return scores;

  for (const key of SECTION_ORDER) {
    const data = tailoredSections[key];
    if (!data) continue;

    if (key === 'summary') continue;

    const entries = Array.isArray(data) ? data : [];
    for (const entry of entries) {
      for (const bullet of entry.bullets ?? []) {
        if (bullet.classification) scores.push(bullet.classification);
      }
    }
  }
  return scores;
}

function deriveScore(result) {
  if (result?.ats_score != null && !Number.isNaN(Number(result.ats_score))) {
    return Math.min(100, Math.max(0, Math.round(Number(result.ats_score))));
  }

  const classifications = collectClassifications(result?.tailored_sections);
  if (classifications.length === 0) {
    const keywordCount = result?.jd_keywords_used?.length ?? 0;
    if (keywordCount === 0) return null;
    return Math.min(92, 58 + keywordCount * 4);
  }

  const weights = { GOOD: 100, MID: 68, BAD: 38 };
  const total = classifications.reduce(
    (sum, c) => sum + (weights[c] ?? 50),
    0
  );
  return Math.round(total / classifications.length);
}

function scoreLabel(score) {
  if (score >= 85) return 'Strong match';
  if (score >= 70) return 'Solid alignment';
  if (score >= 55) return 'Room to sharpen';
  return 'Needs focus';
}

export default function AtsScore({ result }) {
  const score = deriveScore(result);
  if (score == null) return null;

  const circumference = 2 * Math.PI * 52;
  const offset = circumference - (score / 100) * circumference;
  const label = scoreLabel(score);

  return (
    <div className="flex flex-col gap-lg border border-resuem-border bg-resuem-surface p-xl sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0 flex-1">
        <p className="label-editorial">ATS alignment</p>
        <p className="mt-sm font-display text-2xl text-resuem-text sm:text-3xl">
          {label}
        </p>
        <p className="mt-md max-w-prose text-sm leading-relaxed text-resuem-text-secondary">
          Estimated from keyword coverage and bullet quality signals in this
          tailoring run.
        </p>
      </div>

      <div
        className="relative mx-auto shrink-0 sm:mx-0"
        style={{ width: 140, height: 140 }}
        aria-label={`ATS alignment score ${score} out of 100`}
      >
        <svg
          width="140"
          height="140"
          viewBox="0 0 120 120"
          className="ats-ring"
          role="img"
        >
          <circle
            cx="60"
            cy="60"
            r="52"
            fill="none"
            stroke="var(--color-border)"
            strokeWidth="3"
          />
          <circle
            cx="60"
            cy="60"
            r="52"
            fill="none"
            stroke="var(--color-accent)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="ats-ring-progress"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-mono-tabular text-4xl font-medium text-resuem-accent-bright">
            {score}
          </span>
          <span className="label-editorial mt-xs">/ 100</span>
        </div>
      </div>
    </div>
  );
}
