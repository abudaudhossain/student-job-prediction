export function LandingSections() {
  return (
    <>
      <section className="relative overflow-hidden rounded-2xl border border-blue-100 bg-linear-to-r from-blue-50 via-white to-indigo-50 p-6 dark:border-blue-900/50 dark:from-zinc-900 dark:via-zinc-900 dark:to-indigo-950/40 sm:p-8">
        <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-blue-200/50 blur-3xl dark:bg-blue-700/30" />
        <div className="pointer-events-none absolute -bottom-20 -left-16 h-48 w-48 rounded-full bg-indigo-200/40 blur-3xl dark:bg-indigo-700/30" />
        <div className="relative grid gap-8 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="inline-flex rounded-full border border-blue-200 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-700 dark:border-blue-800 dark:bg-zinc-900/60 dark:text-blue-300">
              Data-Driven Career Intelligence
            </p>
            <h1 className="mt-4 text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
              Build Your Career Strategy with Student Job Prediction
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-6 text-zinc-600 dark:text-zinc-300 sm:text-base">
              A professional employability prediction platform that connects your
              academic profile, technical growth, and real-world readiness to a
              placement outcome forecast.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="#prediction-form"
                className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Start Prediction
              </a>
              <a
                href="#about-us"
                className="rounded-lg border border-zinc-300 px-4 py-2.5 text-sm font-semibold transition hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
              >
                Learn More
              </a>
            </div>
          </div>
          <div className="rounded-xl border border-zinc-200 bg-white/80 p-5 shadow-sm backdrop-blur dark:border-zinc-700 dark:bg-zinc-900/70">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-lg bg-blue-100 p-2 text-blue-700 dark:bg-blue-900/70 dark:text-blue-300">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                >
                  <path d="M4 16V8m8 8V4m8 12v-6" />
                  <path d="M3 20h18" />
                </svg>
              </div>
              <h2 className="text-base font-semibold">At a glance</h2>
            </div>
            <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-300">
              Map your profile to the same signals the model uses, then get a
              placement outlook from historical outcomes—not a single exam score.
            </p>
            <div className="mt-5 flex flex-col gap-2">
              <a
                href="#how-it-works"
                className="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                How it works
              </a>
              <a
                href="#profile-to-prediction"
                className="inline-flex w-full items-center justify-center rounded-lg border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-semibold text-blue-800 transition hover:bg-blue-100 dark:border-blue-900 dark:bg-blue-950/50 dark:text-blue-200 dark:hover:bg-blue-900/40"
              >
                Model &amp; data stats
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="about-us" className="mt-8 grid gap-4 sm:grid-cols-2">
        <article className="rounded-xl border border-zinc-200 bg-zinc-50 p-5 dark:border-zinc-700 dark:bg-zinc-800/50">
          <h2 className="text-lg font-semibold">About Us</h2>
          <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
            We are focused on helping students and educators make informed career
            decisions through practical data analysis and transparent outcomes.
          </p>
        </article>
        <article className="rounded-xl border border-zinc-200 bg-zinc-50 p-5 dark:border-zinc-700 dark:bg-zinc-800/50">
          <h2 className="text-lg font-semibold">Our Goal</h2>
          <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
            Our goal is to identify strengths and gaps early so students can improve
            interview readiness, build strong portfolios, and increase job success.
          </p>
        </article>
      </section>

      <section className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-5 dark:border-emerald-900 dark:bg-emerald-950/40">
        <h2 className="text-lg font-semibold text-emerald-800 dark:text-emerald-300">
          Related Insights
        </h2>
        <p className="mt-2 text-sm leading-6 text-emerald-900/90 dark:text-emerald-200">
          Placement outcomes are influenced by a combination of academics, consistent
          skills practice, project depth, and professional exposure. Use this tool as a
          benchmark, then focus on improving the areas that matter most.
        </p>
      </section>
    </>
  );
}
