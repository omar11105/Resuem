import { useState } from 'react';
import { Link } from 'react-router-dom';
import { UserButton } from '@clerk/clerk-react';
import ResumeUploader from '../components/ResumeUploader';
import SectionSelector from '../components/SectionSelector';
import OutputTabs from '../components/OutputTabs';
import UsageBadge from '../components/UsageBadge';
import PaywallModal from '../components/PaywallModal';
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
    <div className="min-h-screen">
      <header className="flex items-center justify-between border-b border-polished-200 px-6 py-4">
        <Link to="/" className="text-lg font-semibold tracking-tight">
          Polished
        </Link>
        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="text-sm text-polished-600 hover:text-polished-900">
            Dashboard
          </Link>
          <UsageBadge count={usage.count} limit={usage.limit} isPro={isPro} />
          <UserButton afterSignOutUrl="/" />
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-10">
        <h1 className="text-2xl font-semibold text-polished-950">Tailor your resume</h1>
        <p className="mt-1 text-sm text-polished-600">
          Upload a PDF or paste text, add a job description, and get tailored sections.
        </p>

        {planNotice && (
          <p className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            {planNotice}
          </p>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-8">
          <div>
            <label className="text-sm font-medium text-polished-800">Resume</label>
            <div className="mt-2">
              <ResumeUploader
                mode={uploadMode}
                onModeChange={setUploadMode}
                pasteValue={resumePaste}
                onPasteChange={setResumePaste}
                file={resumeFile}
                onFileChange={setResumeFile}
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-polished-800">
              Job description
            </label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job posting..."
              rows={8}
              required
              className="mt-2 w-full rounded-xl border border-polished-200 bg-white px-4 py-3 text-sm focus:border-polished-500 focus:outline-none focus:ring-1 focus:ring-polished-500"
            />
          </div>

          <SectionSelector selected={sections} onChange={setSections} />

          <button
            type="submit"
            disabled={loading || !jobDescription || !hasResume}
            className="w-full rounded-xl bg-polished-900 py-3 text-sm font-medium text-white hover:bg-polished-800 disabled:opacity-50"
          >
            {loading ? 'Tailoring...' : 'Tailor resume'}
          </button>
        </form>

        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

        {result && (
          <div className="mt-10">
            <OutputTabs
              result={result}
              isPro={isPro}
              onRequestPaywall={() => openPaywall('download')}
            />
          </div>
        )}
      </main>

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
