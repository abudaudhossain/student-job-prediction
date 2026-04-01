"use client";

/** Full-screen overlay loader themed for Student Job Prediction (placement / data signals). */
export function PredictionFormLoader() {
  return (
    <div
      className="absolute inset-0 z-30 flex flex-col items-center justify-center rounded-b-2xl bg-white/85 backdrop-blur-md dark:bg-zinc-950/90"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="relative flex h-20 w-20 items-center justify-center">
        <div
          className="absolute inset-0 rounded-full border-4 border-blue-100 dark:border-blue-950"
          aria-hidden
        />
        <div
          className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-blue-600 border-r-indigo-500 dark:border-t-blue-400 dark:border-r-indigo-400"
          style={{ animationDuration: "0.9s" }}
        />
        <svg
          className="relative h-9 w-9 text-blue-600 dark:text-blue-400"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          aria-hidden
        >
          <path d="M4 16V8m8 8V4m8 12v-6" />
          <path d="M3 20h18" />
        </svg>
      </div>
      <p className="mt-5 max-w-xs text-center text-sm font-semibold text-zinc-900 dark:text-zinc-100">
        Predicting placement outcome
      </p>
      <p className="mt-1.5 max-w-[18rem] text-center text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
        Matching your profile to similar students and running the k-nearest neighbor
        model on the dataset…
      </p>
      <div className="mt-5 h-1.5 w-44 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
        <div className="h-full w-full animate-pulse bg-linear-to-r from-blue-500 via-indigo-500 to-blue-600 opacity-90" />
      </div>
    </div>
  );
}
