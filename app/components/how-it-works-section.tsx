import { OpenPredictionModalButton } from "./open-prediction-modal-button";

export function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="mt-10 rounded-2xl border border-indigo-200/80 bg-linear-to-br from-indigo-50 via-white to-blue-50 p-6 shadow-sm dark:border-indigo-900/60 dark:from-indigo-950/50 dark:via-zinc-900 dark:to-blue-950/30 sm:p-8"
    >
      <div className="max-w-3xl">
        <p className="inline-flex rounded-full border border-indigo-200 bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-indigo-700 dark:border-indigo-800 dark:bg-zinc-900/70 dark:text-indigo-300">
          How it works
        </p>
        <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
          From your answers to the on-screen forecast
        </h2>
        <p className="mt-3 text-sm leading-6 text-zinc-600 dark:text-zinc-300 sm:text-base">
          The flow from your profile to the placement outlook follows four steps.
        </p>
      </div>

      <ol className="mt-8 grid gap-4 sm:grid-cols-2">
        <li className="flex gap-3">
          <span
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-sm font-bold text-indigo-800 dark:bg-indigo-950 dark:text-indigo-200"
            aria-hidden
          >
            1
          </span>
          <div>
            <p className="font-medium text-zinc-900 dark:text-zinc-100">
              Build your profile
            </p>
            <p className="mt-1 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
              You submit CGPA, department, languages, soft skills, projects,
              internships, and related fields—the same signals stored for past
              students.
            </p>
          </div>
        </li>
        <li className="flex gap-3">
          <span
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-sm font-bold text-indigo-800 dark:bg-indigo-950 dark:text-indigo-200"
            aria-hidden
          >
            2
          </span>
          <div>
            <p className="font-medium text-zinc-900 dark:text-zinc-100">
              Compare every feature
            </p>
            <p className="mt-1 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
              Numeric fields use scaled distance; categorical fields match or
              differ. Those differences are averaged across all profile dimensions.
            </p>
          </div>
        </li>
        <li className="flex gap-3">
          <span
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-sm font-bold text-indigo-800 dark:bg-indigo-950 dark:text-indigo-200"
            aria-hidden
          >
            3
          </span>
          <div>
            <p className="font-medium text-zinc-900 dark:text-zinc-100">
              Find nearest neighbors
            </p>
            <p className="mt-1 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
              The dataset rows closest to your profile are selected (k-nearest
              neighbors). Their recorded job outcomes are what the model leans on.
            </p>
          </div>
        </li>
        <li className="flex gap-3">
          <span
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-sm font-bold text-indigo-800 dark:bg-indigo-950 dark:text-indigo-200"
            aria-hidden
          >
            4
          </span>
          <div>
            <p className="font-medium text-zinc-900 dark:text-zinc-100">
              Vote and confidence
            </p>
            <p className="mt-1 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
              Labels among those neighbors are tallied. The predicted class is the
              majority; the confidence bar reflects the fraction voting &quot;Got a
              job.&quot;
            </p>
          </div>
        </li>
      </ol>

      <div className="mt-8 flex flex-wrap gap-3">
        <a
          href="#profile-to-prediction"
          className="inline-flex items-center justify-center rounded-lg border border-indigo-200 bg-white px-4 py-2.5 text-sm font-semibold text-indigo-900 transition hover:bg-indigo-50 dark:border-indigo-800 dark:bg-zinc-900/80 dark:text-indigo-100 dark:hover:bg-indigo-950/50"
        >
          See model &amp; data stats
        </a>
        <OpenPredictionModalButton className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700">
          Start prediction
        </OpenPredictionModalButton>
      </div>
    </section>
  );
}
