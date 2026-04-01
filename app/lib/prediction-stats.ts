const STORAGE_KEY = "student-job-prediction:prediction-count";

export function getPredictionCount(): number {
  if (typeof window === "undefined") return 0;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const n = raw ? Number.parseInt(raw, 10) : 0;
    return Number.isFinite(n) && n >= 0 ? n : 0;
  } catch {
    return 0;
  }
}

export function incrementPredictionCount(): number {
  if (typeof window === "undefined") return 0;
  try {
    const next = getPredictionCount() + 1;
    window.localStorage.setItem(STORAGE_KEY, String(next));
    window.dispatchEvent(new CustomEvent("prediction-count-changed"));
    return next;
  } catch {
    return getPredictionCount();
  }
}
