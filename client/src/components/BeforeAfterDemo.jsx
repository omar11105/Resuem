import { useCallback, useRef, useState } from 'react';

export default function BeforeAfterDemo() {
  const containerRef = useRef(null);
  const [revealPct, setRevealPct] = useState(50);
  const dragging = useRef(false);

  const updateFromClientX = useCallback((clientX) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = Math.min(95, Math.max(5, ((clientX - rect.left) / rect.width) * 100));
    setRevealPct(pct);
  }, []);

  const onPointerDown = (e) => {
    dragging.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    updateFromClientX(e.clientX);
  };

  const onPointerMove = (e) => {
    if (!dragging.current) return;
    updateFromClientX(e.clientX);
  };

  const onPointerUp = () => {
    dragging.current = false;
  };

  return (
    <section className="mx-auto max-w-editorial px-lg pb-section sm:px-xl">
      <div className="grid gap-2xl lg:grid-cols-12 lg:gap-xl">
        <div className="lg:col-span-5 lg:pt-xl">
          <p className="label-editorial hero-reveal">Resume tailoring</p>
          <h1 className="font-display hero-reveal hero-reveal-delay-1 mt-md text-[clamp(2.25rem,5vw,3.75rem)] font-medium leading-[1.08] tracking-tight text-resuem-text">
            Every bullet,
            <br />
            <em className="font-normal text-resuem-accent">written for the role</em>
          </h1>
          <p className="hero-reveal hero-reveal-delay-2 mt-lg max-w-prose text-base leading-relaxed text-resuem-text-secondary">
            Paste a job description. Resuem rewrites experience, projects, and your
            summary to match — with a clear before and after.
          </p>
        </div>

        <div className="lg:col-span-7">
          <p className="label-editorial hero-reveal hero-reveal-delay-2 mb-md">
            Drag to compare
          </p>
          <div
            ref={containerRef}
            className="compare-reveal hero-reveal hero-reveal-delay-3 min-h-[220px] sm:min-h-[280px]"
            style={{ '--reveal-pct': `${revealPct}%` }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            role="presentation"
          >
            <div
              className="absolute inset-0 flex flex-col justify-end p-lg sm:p-xl"
              style={{
                clipPath: `inset(0 ${100 - revealPct}% 0 0)`,
              }}
            >
              <span className="label-editorial text-resuem-muted">Before</span>
              <p className="mt-sm max-w-md text-sm leading-relaxed text-resuem-text-secondary">
                Led cross-functional team to deliver platform features improving user
                engagement.
              </p>
            </div>

            <div
              className="absolute inset-0 flex flex-col justify-end bg-resuem-after p-lg sm:p-xl"
              style={{
                clipPath: `inset(0 0 0 ${revealPct}%)`,
              }}
            >
              <span className="label-editorial text-resuem-accent">After</span>
              <p className="mt-sm max-w-md text-sm leading-relaxed text-resuem-text">
                Drove 23% lift in activation by shipping onboarding experiments with PM
                and design, aligned to the role&apos;s growth metrics.
              </p>
            </div>

            <span className="compare-handle" aria-hidden="true">
              ↔
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
