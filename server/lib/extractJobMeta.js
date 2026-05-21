const SECTION_HEADER =
  /^(about(\s+us|\s+the\s+company|\s+the\s+role)?|job\s*description|description|overview|responsibilities|requirements|qualifications|who\s+we\s+are|what\s+you|what\s+we|benefits|how\s+to\s+apply|the\s+role|position\s+summary|company\s*overview|our\s+mission|equal\s+opportunity|eeo|salary|compensation|location|apply\s+now)$/i;

const TITLE_HINT =
  /\b(engineer|developer|manager|analyst|designer|scientist|architect|lead|director|coordinator|specialist|consultant|associate|intern|head of|vp|vice president|product|marketing|sales|operations|data|software|frontend|backend|full[- ]?stack|devops|sre|qa|tester|writer|recruiter|administrator|executive)\b/i;

/**
 * Resolve company + job title from Claude output, with heuristic fallback.
 */
export function resolveJobMeta(claudeResult, jobDescription) {
  const fromClaude = claudeResult?.job_meta;
  if (isValidMeta(fromClaude)) {
    return {
      jobTitle: truncate(fromClaude.job_title),
      companyName: truncate(fromClaude.company_name),
    };
  }
  return extractJobMeta(jobDescription);
}

export function isValidMeta(meta) {
  if (!meta?.job_title || !meta?.company_name) return false;
  if (isSectionHeader(meta.job_title) || isSectionHeader(meta.company_name)) {
    return false;
  }
  return meta.job_title.length >= 3 && meta.company_name.length >= 2;
}

/**
 * Best-effort extraction when Claude omits job_meta (or legacy rows).
 */
export function extractJobMeta(jobDescription) {
  const lines = jobDescription
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);

  const meaningful = lines.filter(
    (l) => !isSectionHeader(l) && l.length >= 3 && l.length <= 120
  );

  const labeled = extractLabeledFields(jobDescription);
  if (labeled.jobTitle && labeled.companyName && !isSectionHeader(labeled.jobTitle)) {
    return {
      jobTitle: truncate(labeled.jobTitle),
      companyName: truncate(labeled.companyName),
    };
  }

  for (const line of meaningful) {
    const atMatch = line.match(/^(.+?)\s+at\s+(.+)$/i);
    if (atMatch) {
      return {
        jobTitle: truncate(atMatch[1].trim()),
        companyName: truncate(atMatch[2].trim()),
      };
    }
  }

  const titleLine = meaningful.find((l) => TITLE_HINT.test(l));
  if (titleLine) {
    const idx = meaningful.indexOf(titleLine);
    const companyCandidate = meaningful[idx + 1] ?? meaningful[idx - 1];
    const companyName =
      companyCandidate && !TITLE_HINT.test(companyCandidate) && !isSectionHeader(companyCandidate)
        ? truncate(companyCandidate)
        : labeled.companyName
          ? truncate(labeled.companyName)
          : null;

    return {
      jobTitle: truncate(titleLine),
      companyName,
    };
  }

  const dashLine = meaningful.find((l) => /[-–—|]/.test(l) && l.length < 100);
  if (dashLine) {
    const parts = dashLine.split(/\s*[-–—|]\s*/);
    if (parts.length >= 2) {
      return {
        companyName: truncate(parts[0].trim()),
        jobTitle: truncate(parts[1].trim()),
      };
    }
  }

  if (meaningful.length >= 2) {
    return {
      jobTitle: truncate(meaningful[0]),
      companyName: truncate(meaningful[1]),
    };
  }

  if (meaningful.length === 1) {
    return { jobTitle: truncate(meaningful[0]), companyName: null };
  }

  return { jobTitle: 'Role', companyName: null };
}

function isSectionHeader(str) {
  return SECTION_HEADER.test(str.trim());
}

function extractLabeledFields(text) {
  const jobTitle = matchLabel(text, ['job title', 'position title', 'position', 'role']);
  const companyName = matchLabel(text, ['company name', 'company', 'employer', 'organization']);
  return { jobTitle, companyName };
}

function matchLabel(text, labels) {
  for (const label of labels) {
    const re = new RegExp(`^${label}\\s*[:\\-]\\s*(.+)$`, 'im');
    const m = text.match(re);
    if (m?.[1]) {
      const value = m[1].trim();
      if (!isSectionHeader(value)) return value;
    }
  }
  return null;
}

function truncate(str, max = 80) {
  if (!str) return null;
  return str.length > max ? `${str.slice(0, max)}…` : str;
}
