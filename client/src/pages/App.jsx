import { useState } from 'react';
import { Link } from 'react-router-dom';
import { UserButton } from '@clerk/clerk-react';
import ResumeUploader from '../components/ResumeUploader';
import SectionSelector from '../components/SectionSelector';
import OutputTabs from '../components/OutputTabs';
import UsageBadge from '../components/UsageBadge';
import PaywallModal from '../components/PaywallModal';
import { AppHeader, PageMain } from '../components/AppShell';
import { useTailoring } from '../hooks/useTailoring';
import { useUsage } from '../hooks/useUsage';

export default function AppPage() {
  const [resumePaste, setResumePaste] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [uploadMode, setUploadMode] = useState('paste');
  const [jobDescription, setJobDescription] = useState('');
  const [sections, setSections] = useState(['experience', 'projects', 'summary']);
  const [paywallOpen, setPaywallOpen] = useState(false);
  const [paywallReason, setPaywallReason] = useState('limit');
  const [planNotice, setPlanNotice] = useState(null);

  const { tailor, loading, result, error } = useTailoring();
  const { usage, atLimit, isPro, refresh } = useUsage();

  const hasResume =
    uploadMode === 'paste' ? resumePaste.trim().length > 0 : Boolean(resumeFile);

  const openPaywall = (reason = 'limit') => {
    setPaywallReason(reason);
    setPaywallOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isPro && atLimit) {
      openPaywall('limit');
      return;
    }

    try {
      await tailor({
        resumeText: uploadMode === 'paste' ? resumePaste : undefined,
        resumeFile: uploadMode === 'pdf' ? resumeFile : undefined,
        jobDescription,
        sections,
      });
      await refresh();
    } catch (err) {
      if (err?.code === 'PAYWALL') {
        openPaywall('limit');
        return;
      }
    }
  };

  return (
    <div className="min-h-[100dvh] bg-resuem-bg">
      <AppHeader>
        <Link to="/dashboard" className="link-subtle hidden sm:inline">
          Dashboard
        </Link>
        <UsageBadge count={usage.count} limit={usage.limit} isPro={isPro} />
        <UserButton afterSignOutUrl="/" />
      </AppHeader>

      <PageMain narrow={!result}>
        <header className="max-w-prose border-b border-resuem-border pb-xl">
          <p className="label-editorial">Tailor</p>
          <h1 className="font-display mt-sm text-3xl font-medium tracking-tight text-resuem-text sm:text-4xl">
            Shape your resume for this role
          </h1>
          <p className="mt-md text-sm leading-relaxed text-resuem-text-secondary">
            Upload a PDF or paste text, add a job description, and get tailored sections.
          </p>
        </header>

        {planNotice && (
          <p className="mt-lg border border-resuem-success/30 bg-resuem-success-dim px-lg py-md text-sm text-resuem-success">
            {planNotice}
          </p>
        )}

        <form onSubmit={handleSubmit} className="mt-2xl space-y-2xl">
          <div className="space-y-md">
            <label className="label-editorial">Resume</label>
            <ResumeUploader
              mode={uploadMode}
              onModeChange={setUploadMode}
              pasteValue={resumePaste}
              onPasteChange={setResumePaste}
              file={resumeFile}
              onFileChange={setResumeFile}
            />
          </div>

          <div className="space-y-md">
            <label className="label-editorial" htmlFor="job-description">
              Job description
            </label>
            <textarea
              id="job-description"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job posting..."
              rows={8}
              required
              className="input-field min-h-[180px] resize-y"
            />
          </div>

          <SectionSelector selected={sections} onChange={setSections} />

          <button
            type="submit"
            disabled={loading || !jobDescription || !hasResume}
            className="btn-primary w-full sm:w-auto"
          >
            {loading ? 'Tailoring...' : 'Tailor resume'}
          </button>
        </form>

        {error && (
          <p className="mt-lg text-sm text-resuem-error" role="alert">
            {error}
          </p>
        )}

        {result && (
          <div className="mt-3xl border-t border-resuem-border pt-3xl">
            <OutputTabs
              result={result}
              isPro={isPro}
              onRequestPaywall={() => openPaywall('download')}
            />
          </div>
        )}
      </PageMain>

      <PaywallModal
        open={paywallOpen}
        onClose={() => setPaywallOpen(false)}
        reason={paywallReason}
        onPlanActivated={() => {
          refresh();
          setPlanNotice('Welcome to Pro! Unlimited tailorings and PDF export are now unlocked.');
        }}
      />
    </div>
  );
}
