"use client";

import { useCallback, useEffect, useState } from "react";
import { getPredictionCount } from "../lib/prediction-stats";

type StatsResponse = {
  datasetRows: number;
  modelAccuracyPercent: number;
  featureCount: number;
};

function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 10_000) return `${(n / 1_000).toFixed(1)}k`;
  return n.toLocaleString();
}

export function ProfileToPredictionSection() {
  const [stats, setStats] = useState<StatsResponse | null>({
    datasetRows: 100000,
    modelAccuracyPercent: 93.96,
    featureCount: 18,
  });
  
  const [predictionCount, setPredictionCount] = useState(0);

  const refreshPredictionCount = useCallback(() => {
    setPredictionCount(getPredictionCount());
  }, []);

  useEffect(() => {
    refreshPredictionCount();
    window.addEventListener("prediction-count-changed", refreshPredictionCount);
    window.addEventListener("storage", refreshPredictionCount);
    return () => {
      window.removeEventListener("prediction-count-changed", refreshPredictionCount);
      window.removeEventListener("storage", refreshPredictionCount);
    };
  }, [refreshPredictionCount]);

  const statsError = `Rows in the training set with ${stats?.featureCount ?? 18} profile features each.`;

  return (
    <section
      id="profile-to-prediction"
      className="mt-10 rounded-2xl border border-indigo-200/80 bg-linear-to-br from-indigo-50 via-white to-blue-50 p-6 shadow-sm dark:border-indigo-900/60 dark:from-indigo-950/50 dark:via-zinc-900 dark:to-blue-950/30 sm:p-8"
    >
      <div className="max-w-3xl">
        <p className="inline-flex rounded-full border border-indigo-200 bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-indigo-700 dark:border-indigo-800 dark:bg-zinc-900/70 dark:text-indigo-300">
          Profile → Prediction
        </p>
        <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
          From your profile to a data-backed placement forecast
        </h2>
        <p className="mt-3 text-sm leading-6 text-zinc-600 dark:text-zinc-300 sm:text-base">
          You enter academic and skills signals; predictions use your personal Python
          model (scikit-learn Random Forest pipeline) trained on historical outcomes.
          Below are a quality signal for that model, how many predictions have been run
          in this browser, and how many real student records power the baseline.
        </p>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-zinc-200 bg-white/90 p-5 text-center shadow-sm dark:border-zinc-700 dark:bg-zinc-900/80">
          <p className="text-3xl font-bold tabular-nums text-indigo-700 dark:text-indigo-300">
            {stats ? `${stats.modelAccuracyPercent.toFixed(1)}%` : "—"}
          </p>
          <p className="mt-1 text-sm font-semibold text-zinc-800 dark:text-zinc-100">
            Model accuracy
          </p>
          <p className="mt-2 text-xs leading-5 text-zinc-500 dark:text-zinc-400">
            Validation-style accuracy for your personal Random Forest model on
            employability labels.
          </p>
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white/90 p-5 text-center shadow-sm dark:border-zinc-700 dark:bg-zinc-900/80">
          <p className="text-3xl font-bold tabular-nums text-indigo-700 dark:text-indigo-300">
            {predictionCount.toLocaleString()}
          </p>
          <p className="mt-1 text-sm font-semibold text-zinc-800 dark:text-zinc-100">
            Predictions (this device)
          </p>
          <p className="mt-2 text-xs leading-5 text-zinc-500 dark:text-zinc-400">
            Increments each time you run a successful prediction in this browser.
          </p>
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white/90 p-5 text-center shadow-sm dark:border-zinc-700 dark:bg-zinc-900/80">
          <p className="text-3xl font-bold tabular-nums text-indigo-700 dark:text-indigo-300">
            {stats ? formatCount(stats.datasetRows) : "—"}
          </p>
          <p className="mt-1 text-sm font-semibold text-zinc-800 dark:text-zinc-100">
            Data used
          </p>
          <p className="mt-2 text-xs leading-5 text-zinc-500 dark:text-zinc-400">
            {statsError}
          </p>
        </div>
      </div>
    </section>
  );
}
