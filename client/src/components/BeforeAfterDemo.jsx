export default function BeforeAfterDemo() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-16">
      <div className="text-center">
        <h1 className="text-4xl font-semibold tracking-tight text-polished-950 sm:text-5xl">
          Tailor your resume to every job
        </h1>
        <p className="mt-4 text-lg text-polished-600">
          Paste a job description. Get experience bullets, projects, and a summary
          rewritten to match — in seconds.
        </p>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-polished-200 bg-white p-6 shadow-sm">
          <span className="text-xs font-medium uppercase tracking-wider text-polished-400">
            Before
          </span>
          <p className="mt-3 text-sm leading-relaxed text-polished-700">
            Led cross-functional team to deliver platform features improving user
            engagement.
          </p>
        </div>
        <div className="rounded-xl border border-polished-600 bg-polished-950 p-6 text-white shadow-sm">
          <span className="text-xs font-medium uppercase tracking-wider text-polished-300">
            After
          </span>
          <p className="mt-3 text-sm leading-relaxed text-polished-100">
            Drove 23% lift in activation by shipping onboarding experiments with PM
            and design, aligned to the role&apos;s growth metrics.
          </p>
        </div>
      </div>
    </section>
  );
}
