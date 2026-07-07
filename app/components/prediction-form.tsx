"use client";

import { FormEvent, ReactNode, useEffect, useRef, useState } from "react";
import { incrementPredictionCount } from "../lib/prediction-stats";
import { PredictionFormLoader } from "./prediction-form-loader";
import { usePredictionModal } from "./prediction-modal-context";

type PredictionResponse = {
  status: "Got a Job" | "Did Not Get a Job";
  confidenceGotJob: number;
};

type FormState = {
  cgpa: string;
  department: string;
  programming_skill_score: string;
  problem_solving_score: string;
  database_skill_score: string;
  coding_contest_rating: string;
  coding_contest_platform: string;
  internships_count: string;
  hackathons_participated: string;
  freelance_experience: string;
  certifications_count: string;
  projects_count: string;
  github_repos: string;
  communication_skill_score: string;
  teamwork_score: string;
  leadership_score: string;
  extracurricular_score: string;
  presentation_skill_score: string;
  learning_consistency_score: string;
  aptitude_test_score: string;
  mock_interview_score: string;
  resume_quality_score: string;
};

const initialForm: FormState = {
  cgpa: "",
  department: "",
  programming_skill_score: "",
  problem_solving_score: "",
  database_skill_score: "",
  coding_contest_rating: "",
  coding_contest_platform: "",
  internships_count: "",
  hackathons_participated: "",
  freelance_experience: "",
  certifications_count: "",
  projects_count: "",
  github_repos: "",
  communication_skill_score: "",
  teamwork_score: "",
  leadership_score: "",
  extracurricular_score: "",
  presentation_skill_score: "",
  learning_consistency_score: "",
  aptitude_test_score: "",
  mock_interview_score: "",
  resume_quality_score: "",
};

const STEPS = [
  { id: 0, title: "Academic details", short: "CGPA & dept" },
  { id: 1, title: "Technical skills", short: "Coding & DB" },
  { id: 2, title: "Experience", short: "Projects & work" },
  { id: 3, title: "Soft skills & assessment", short: "Scores" },
] as const;

const LAST_STEP = STEPS.length - 1;

const inputClassName =
  "mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-zinc-700 dark:bg-zinc-800 dark:focus:ring-blue-900";

const labelClassName = "text-sm font-medium text-zinc-700 dark:text-zinc-200";

function RequiredMark() {
  return (
    <abbr
      className="inline-flex text-base leading-none text-red-500 no-underline"
      title="Required"
      aria-label="required"
    >
      *
    </abbr>
  );
}

function FormLabel({
  text,
  children,
  className = labelClassName,
}: {
  text: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={className}>
      <span className="inline-flex items-center gap-1">
        {text}
        <RequiredMark />
      </span>
      {children}
    </label>
  );
}

const departmentOptions = [
  "CSE",
  "EEE",
  "B.B.A",
  "Civil",
  "English",
  "Pharmacy",
];

const contestPlatformOptions = [
  "Codeforces",
  "CodeChef",
  "LeetCode",
  "HackerRank",
];

const contestScoreRules = {
  Codeforces: { min: 0, max: 3900, placeholder: "e.g. 1450" },
  CodeChef: { min: 0, max: 3500, placeholder: "e.g. 1620" },
  LeetCode: { min: 0, max: 3800, placeholder: "e.g. 1850" },
  HackerRank: { min: 0, max: 100, placeholder: "e.g. 92" },
} as const;

type ContestPlatform = keyof typeof contestScoreRules;

const SKILL_SCORE_LABEL_THRESHOLDS = [
  { label: "Outstanding", min: 97 },
  { label: "Excellent", min: 85 },
  { label: "Very Good", min: 70 },
  { label: "Good", min: 60 },
  { label: "Average", min: 50 },
  { label: "Needs Improvement", min: 35 },
  { label: "Poor", min: 20 },
] as const;

const SOFT_SKILL_SCORE_LABEL_THRESHOLDS = [
  { label: "Outstanding", min: 97 },
  { label: "Excellent", min: 85 },
  { label: "Very Good", min: 70 },
  { label: "Good", min: 60 },
  { label: "Average", min: 50 },
  { label: "Needs Improvement", min: 35 },
  { label: "Poor", min: 20 },
] as const;

type SkillScoreThreshold = { label: string; min: number };

function SkillScoreSelect({
  value,
  onChange,
  thresholds = SKILL_SCORE_LABEL_THRESHOLDS,
}: {
  value: string;
  onChange: (value: string) => void;
  thresholds?: readonly SkillScoreThreshold[];
}) {
  return (
    <select
      className={inputClassName}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required
    >
      <option value="">Select label</option>
      {thresholds.map(({ label, min }) => (
        <option key={label} value={String(min)}>
          {label}
        </option>
      ))}
    </select>
  );
}

function validateRequiredFields(
  form: FormState,
  keys: (keyof FormState)[],
  message: string,
): string | null {
  for (const key of keys) {
    if (!form[key].trim()) {
      return message;
    }
  }
  return null;
}

function validateContestScore(form: FormState): string | null {
  const platform = form.coding_contest_platform.trim();
  const ratingRaw = form.coding_contest_rating.trim();

  if (!platform || !ratingRaw) {
    return "Please complete all technical skill fields.";
  }

  if (!(platform in contestScoreRules)) {
    return "Please select a valid coding contest platform.";
  }

  const score = Number(ratingRaw);
  if (!Number.isFinite(score)) {
    return "Coding contest score must be a valid number.";
  }

  const { min, max } = contestScoreRules[platform as ContestPlatform];
  if (score < min || score > max) {
    return `${platform} score must be between ${min} and ${max}.`;
  }

  return null;
}

const academicFields: (keyof FormState)[] = ["cgpa", "department"];

const technicalFields: (keyof FormState)[] = [
  "programming_skill_score",
  "problem_solving_score",
  "database_skill_score",
  "coding_contest_rating",
  "coding_contest_platform",
  "learning_consistency_score",
];

const experienceFields: (keyof FormState)[] = [
  "internships_count",
  "hackathons_participated",
  "freelance_experience",
  "certifications_count",
  "projects_count",
  "github_repos",
];

const assessmentFields: (keyof FormState)[] = [
  "communication_skill_score",
  "teamwork_score",
  "leadership_score",
  "extracurricular_score",
  "presentation_skill_score",
  "aptitude_test_score",
  "mock_interview_score",
  "resume_quality_score",
];

const DEFAULT_PREDICT_API_URL =
  "http://localhost:8000/predict";
// "https://student-job-predition-server.onrender.com/predict";

function predictApiUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_PREDICT_API_URL?.trim();
  return fromEnv && fromEnv.length > 0 ? fromEnv : DEFAULT_PREDICT_API_URL;
}

/** Body shape expected by the external prediction server. */
function formToPredictApiBody(form: FormState) {
  return {
    cgpa: Number(form.cgpa),
    department: form.department.trim(),
    programming_skill_score: Number(form.programming_skill_score),
    problem_solving_score: Number(form.problem_solving_score),
    database_skill_score: Number(form.database_skill_score),
    coding_contest_rating: Number(form.coding_contest_rating),
    coding_contest_platform: form.coding_contest_platform.trim(),
    internships_count: Number(form.internships_count),
    hackathons_participated: Number(form.hackathons_participated),
    freelance_experience: Number(form.freelance_experience),
    certifications_count: Number(form.certifications_count),
    projects_count: Number(form.projects_count),
    github_repos: Number(form.github_repos),
    communication_skill_score: Number(form.communication_skill_score),
    teamwork_score: Number(form.teamwork_score),
    learning_consistency_score: Number(form.learning_consistency_score),
    aptitude_test_score: Number(form.aptitude_test_score),
    mock_interview_score: Number(form.mock_interview_score),
    resume_quality_score: Number(form.resume_quality_score),
    leadership_score: Number(form.leadership_score),
    extracurricular_score: Number(form.extracurricular_score),
    presentation_skill_score: Number(form.presentation_skill_score),
  };
}

function PredictionResult({
  result,
  standalone = false,
}: {
  result: PredictionResponse;
  standalone?: boolean;
}) {
  const gotJob = result.status === "Got a Job";
  const confidencePct = Math.min(
    100,
    Math.max(0, Math.round(result.confidenceGotJob * 100)),
  );
  const confidenceLabel = (result.confidenceGotJob * 100).toFixed(1);

  return (
    <div
      className={
        standalone
          ? "flex w-full max-w-md flex-col items-center"
          : "mt-8 flex justify-center border-t border-zinc-200 pt-8 dark:border-zinc-800"
      }
      role="status"
      aria-live="polite"
    >
      <div
        className={`w-full rounded-2xl border text-center shadow-sm ${
          standalone ? "p-5 sm:p-6" : "max-w-md p-6 sm:p-8"
        } ${
          gotJob
            ? "border-emerald-200/80 bg-linear-to-b from-emerald-50 to-white dark:border-emerald-900/60 dark:from-emerald-950/40 dark:to-zinc-900"
            : "border-amber-200/80 bg-linear-to-b from-amber-50 to-white dark:border-amber-900/60 dark:from-amber-950/30 dark:to-zinc-900"
        }`}
      >
        <div
          className={`mx-auto flex items-center justify-center rounded-full ${
            standalone ? "h-14 w-14" : "h-16 w-16"
          } ${
            gotJob
              ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-300"
              : "bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-300"
          }`}
        >
          {gotJob ? (
            <svg
              className={standalone ? "h-7 w-7" : "h-8 w-8"}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden
            >
              <path d="M9 12l2 2 4-4" />
              <circle cx="12" cy="12" r="9" />
            </svg>
          ) : (
            <svg
              className={standalone ? "h-7 w-7" : "h-8 w-8"}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden
            >
              <circle cx="12" cy="12" r="9" />
              <path d="M15 9l-6 6M9 9l6 6" />
            </svg>
          )}
        </div>

        <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
          Prediction result
        </p>

        <h3
          className={`mt-2 font-bold tracking-tight ${
            standalone ? "text-xl sm:text-2xl" : "text-2xl sm:text-3xl"
          } ${
            gotJob
              ? "text-emerald-700 dark:text-emerald-300"
              : "text-amber-800 dark:text-amber-200"
          }`}
        >
          {result.status}
        </h3>

        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
          {gotJob
            ? "Your profile aligns well with typical successful placements."
            : "Focus on strengthening key skills to improve placement chances."}
        </p>

        <div className="mx-auto mt-5 max-w-xs">
          <div className="flex items-end justify-center gap-1">
            <span
              className={`font-bold tabular-nums ${
                standalone ? "text-3xl" : "text-4xl"
              } ${
                gotJob
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-amber-700 dark:text-amber-300"
              }`}
            >
              {confidenceLabel}%
            </span>
          </div>
          <p className="mt-1 text-xs font-medium text-zinc-500 dark:text-zinc-400">
            Confidence (Got a Job)
          </p>

          <div
            className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-zinc-200/80 dark:bg-zinc-700"
            role="progressbar"
            aria-valuenow={confidencePct}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Confidence got a job: ${confidenceLabel} percent`}
          >
            <div
              className={`h-full rounded-full transition-all duration-700 ease-out ${
                gotJob
                  ? "bg-linear-to-r from-emerald-500 to-teal-500"
                  : "bg-linear-to-r from-amber-500 to-orange-500"
              }`}
              style={{ width: `${confidencePct}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function stepValidators(step: number, form: FormState): string | null {
  switch (step) {
    case 0:
      return validateRequiredFields(
        form,
        academicFields,
        "Please complete all academic fields.",
      );
    case 1:
      return (
        validateRequiredFields(
          form,
          technicalFields,
          "Please complete all technical skill fields.",
        ) ?? validateContestScore(form)
      );
    case 2:
      return validateRequiredFields(
        form,
        experienceFields,
        "Please complete all experience fields.",
      );
    case 3:
      return validateRequiredFields(
        form,
        assessmentFields,
        "Please complete all soft skills & assessment fields.",
      );
    default:
      return null;
  }
}

export function PredictionFormModal() {
  const { open, closeModal } = usePredictionModal();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [result, setResult] = useState<PredictionResponse | null>(null);
  const stepRef = useRef(step);
  stepRef.current = step;

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" && !loading) closeModal();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, closeModal, loading]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      setStep(0);
      setForm(initialForm);
      setResult(null);
      setError("");
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (stepRef.current !== LAST_STEP) return;

    for (let i = 0; i <= LAST_STEP; i++) {
      const err = stepValidators(i, form);
      if (err) {
        setError(err);
        setStep(i);
        return;
      }
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch(predictApiUrl(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formToPredictApiBody(form)),
      });

      let raw: Record<string, unknown>;
      try {
        raw = (await response.json()) as Record<string, unknown>;
      } catch {
        throw new Error(
          response.ok
            ? "Invalid response from prediction service."
            : `Prediction service returned ${response.status}.`,
        );
      }

      if (!response.ok) {
        const msg =
          typeof raw.error === "string"
            ? raw.error
            : typeof raw.detail === "string"
              ? raw.detail
              : `Prediction failed (${response.status}).`;
        throw new Error(msg);
      }

      const confidenceGotJob =
        typeof raw.confidenceGotJob === "number"
          ? raw.confidenceGotJob
          : typeof raw.confidence === "number"
            ? raw.confidence
            : 0;

      const status: PredictionResponse["status"] =
        raw.status === "Got a Job" || raw.status === "Did Not Get a Job"
          ? raw.status
          : "Did Not Get a Job";

      setResult({ status, confidenceGotJob });
      incrementPredictionCount();
    } catch (submitError) {
      const message =
        submitError instanceof Error ? submitError.message : "Prediction failed.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  function goNext() {
    setError("");
    const err = stepValidators(step, form);
    if (err) {
      setError(err);
      return;
    }
    if (step < LAST_STEP) {
      setStep((s) => s + 1);
    }
  }

  function goBack() {
    setError("");
    setStep((s) => Math.max(0, s - 1));
  }

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function updateContestPlatform(platform: string) {
    setForm((prev) => {
      const next = { ...prev, coding_contest_platform: platform };
      if (!(platform in contestScoreRules)) {
        next.coding_contest_rating = "";
        return next;
      }

      const { min, max } = contestScoreRules[platform as ContestPlatform];
      const currentScore = Number(prev.coding_contest_rating);
      if (
        !prev.coding_contest_rating.trim() ||
        !Number.isFinite(currentScore) ||
        currentScore < min ||
        currentScore > max
      ) {
        next.coding_contest_rating = platform === "None" ? "0" : "";
      }

      return next;
    });
  }

  const progressPct = ((step + 1) / STEPS.length) * 100;
  const selectedContestRule = form.coding_contest_platform
    ? contestScoreRules[form.coding_contest_platform as ContestPlatform]
    : null;
  const showingResult = result !== null;

  function resetForm() {
    setForm(initialForm);
    setStep(0);
    setResult(null);
    setError("");
  }

  return (
    <div
      className={
        open
          ? "fixed inset-0 z-100 flex items-end justify-center p-4 sm:items-center"
          : "hidden"
      }
      aria-hidden={!open}
    >
      <button
        type="button"
        className="absolute inset-0 bg-zinc-950/60 backdrop-blur-[2px] transition-opacity enabled:cursor-pointer disabled:cursor-not-allowed dark:bg-black/70"
        aria-label="Close prediction form"
        onClick={loading ? undefined : closeModal}
        disabled={loading}
      />
      <div
        id="prediction-form"
        role="dialog"
        aria-modal="true"
        aria-labelledby="prediction-modal-title"
        className="relative z-10 flex max-h-[min(90vh,920px)] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl dark:border-zinc-700 dark:bg-zinc-900"
      >
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-zinc-200 px-5 py-4 dark:border-zinc-700 sm:px-6">
          <div>
            <h2
              id="prediction-modal-title"
              className="text-xl font-bold tracking-tight sm:text-2xl"
            >
              Job Placement Prediction
            </h2>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">

              {showingResult
                ? "Your job placement prediction is ready"
                : "Enter your 22 employability features · Step " + step + 1 + " of " + STEPS.length + ": " + STEPS[step].title}

            </p>
          </div>
          <button
            type="button"
            onClick={loading ? undefined : closeModal}
            disabled={loading}
            className="rounded-lg p-2 text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-900 enabled:cursor-pointer disabled:opacity-40 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
            aria-label="Close"
          >
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {!showingResult && (
          <div className="shrink-0 border-b border-zinc-100 px-5 py-3 dark:border-zinc-800 sm:px-6">
            <ol className="flex flex-wrap gap-2 sm:gap-4" aria-label="Form steps">
              {STEPS.map((s, i) => (
                <li
                  key={s.id}
                  className={`flex items-center gap-2 text-xs sm:text-sm ${i === step
                      ? "font-semibold text-blue-700 dark:text-blue-300"
                      : i < step
                        ? "text-zinc-500 dark:text-zinc-400"
                        : "text-zinc-400 dark:text-zinc-500"
                    }`}
                >
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${i === step
                        ? "bg-blue-600 text-white"
                        : i < step
                          ? "bg-emerald-500/20 text-emerald-700 dark:text-emerald-300"
                          : "bg-zinc-200 text-zinc-500 dark:bg-zinc-700 dark:text-zinc-400"
                      }`}
                    aria-current={i === step ? "step" : undefined}
                  >
                    {i < step ? "✓" : i + 1}
                  </span>
                  <span className="hidden sm:inline">{s.title}</span>
                  <span className="sm:hidden">{s.short}</span>
                </li>
              ))}
            </ol>
            <div
              className="mt-3 h-1.5 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700"
              role="progressbar"
              aria-valuenow={step + 1}
              aria-valuemin={1}
              aria-valuemax={STEPS.length}
            >
              <div
                className="h-full rounded-full bg-linear-to-r from-blue-600 to-indigo-600 transition-[width] duration-300 ease-out dark:from-blue-500 dark:to-indigo-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        )}

        <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
          {loading && <PredictionFormLoader />}

          {showingResult ? (
            <div className="flex min-h-[min(52vh,480px)] flex-1 flex-col items-center justify-center overflow-hidden px-5 py-6 sm:min-h-[min(56vh,520px)] sm:px-8">
              <PredictionResult result={result} standalone />
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  Predict Again
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-lg border border-zinc-300 px-5 py-2.5 text-sm font-semibold transition hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
          <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6">
            <form
              id="student-job-prediction-form"
              className="space-y-6"
              onSubmit={onSubmit}
              noValidate
              onKeyDown={(e) => {
                if (e.key !== "Enter") return;
                if (stepRef.current >= LAST_STEP) return;
                const el = e.target as HTMLElement;
                if (el.tagName === "BUTTON" || el.tagName === "TEXTAREA") return;
                e.preventDefault();
              }}
            >
              {step === 0 && (
                <section aria-labelledby="step-academic">
                  <h3 id="step-academic" className="mb-3 text-lg font-semibold">
                    Academic details
                  </h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormLabel text="CGPA (0–4)">
                      <input
                        className={inputClassName}
                        type="number"
                        step="0.01"
                        min={0}
                        max={4}
                        placeholder="e.g. 3.75"
                        value={form.cgpa}
                        onChange={(e) => updateField("cgpa", e.target.value)}
                        required
                      />
                    </FormLabel>
                    <FormLabel text="Department">
                      <select
                        className={inputClassName}
                        value={form.department}
                        onChange={(e) => updateField("department", e.target.value)}
                        required
                      >
                        <option value="">Select department</option>
                        {departmentOptions.map((dept) => (
                          <option key={dept} value={dept}>
                            {dept}
                          </option>
                        ))}
                      </select>
                    </FormLabel>
                  </div>
                </section>
              )}

              {step === 1 && (
                <section aria-labelledby="step-technical">
                  <h3 id="step-technical" className="mb-3 text-lg font-semibold">
                    Technical skills
                  </h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormLabel text="Programming Skill">
                      <SkillScoreSelect
                        value={form.programming_skill_score}
                        onChange={(value) =>
                          updateField("programming_skill_score", value)
                        }
                      />
                    </FormLabel>
                    <FormLabel text="Problem Solving Skill">
                      <SkillScoreSelect
                        value={form.problem_solving_score}
                        onChange={(value) => updateField("problem_solving_score", value)}
                      />
                    </FormLabel>
                    <FormLabel text="Database Skill">
                      <SkillScoreSelect
                        value={form.database_skill_score}
                        onChange={(value) => updateField("database_skill_score", value)}
                      />
                    </FormLabel>
                    <FormLabel text="Learning Consistency">
                      <SkillScoreSelect
                        value={form.learning_consistency_score}
                        onChange={(value) =>
                          updateField("learning_consistency_score", value)
                        }
                      />
                    </FormLabel>
                    <FormLabel text="Coding Contest Platform">
                      <select
                        className={inputClassName}
                        value={form.coding_contest_platform}
                        onChange={(e) => updateContestPlatform(e.target.value)}
                        required
                      >
                        <option value="">Select platform</option>
                        {contestPlatformOptions.map((platform) => (
                          <option key={platform} value={platform}>
                            {platform}
                          </option>
                        ))}
                      </select>
                    </FormLabel>
                    <FormLabel text="Coding Contest Score / Rating">
                      <input
                        className={inputClassName}
                        type="number"
                        min={selectedContestRule?.min ?? 0}
                        max={selectedContestRule?.max}
                        step={1}
                        placeholder={
                          selectedContestRule?.placeholder ?? "Select platform first"
                        }
                        value={form.coding_contest_rating}
                        onChange={(e) =>
                          updateField("coding_contest_rating", e.target.value)
                        }
                        required
                        disabled={!form.coding_contest_platform}
                        aria-describedby="contest-score-hint"
                      />
                      <p
                        id="contest-score-hint"
                        className="mt-1 text-xs leading-5 text-zinc-500 dark:text-zinc-400"
                      >
                        {selectedContestRule
                          ? `Allowed range for ${form.coding_contest_platform}: ${selectedContestRule.min} to ${selectedContestRule.max}.`
                          : "Choose a coding contest platform to enter a valid score."}
                      </p>
                    </FormLabel>

                  </div>
                </section>
              )}

              {step === 2 && (
                <section aria-labelledby="step-experience">
                  <h3 id="step-experience" className="mb-3 text-lg font-semibold">
                    Experience &amp; projects
                  </h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormLabel text="Internships Count">
                      <input
                        className={inputClassName}
                        type="number"
                        min={0}
                        placeholder="e.g. 1"
                        value={form.internships_count}
                        onChange={(e) =>
                          updateField("internships_count", e.target.value)
                        }
                        required
                      />
                    </FormLabel>
                    <FormLabel text="Hackathons Participated">
                      <input
                        className={inputClassName}
                        type="number"
                        min={0}
                        placeholder="e.g. 0"
                        value={form.hackathons_participated}
                        onChange={(e) =>
                          updateField("hackathons_participated", e.target.value)
                        }
                        required
                      />
                    </FormLabel>
                    <FormLabel text="Freelance Experience">
                      <input
                        className={inputClassName}
                        type="number"
                        min={0}
                        placeholder="e.g. 0"
                        value={form.freelance_experience}
                        onChange={(e) =>
                          updateField("freelance_experience", e.target.value)
                        }
                        required
                      />
                    </FormLabel>
                    <FormLabel text="Certifications Count">
                      <input
                        className={inputClassName}
                        type="number"
                        min={0}
                        placeholder="e.g. 10"
                        value={form.certifications_count}
                        onChange={(e) =>
                          updateField("certifications_count", e.target.value)
                        }
                        required
                      />
                    </FormLabel>
                    <FormLabel text="Projects Count">
                      <input
                        className={inputClassName}
                        type="number"
                        min={0}
                        placeholder="e.g. 5"
                        value={form.projects_count}
                        onChange={(e) =>
                          updateField("projects_count", e.target.value)
                        }
                        required
                      />
                    </FormLabel>
                    <FormLabel text="Open Source GitHub Repos">
                      <input
                        className={inputClassName}
                        type="number"
                        min={0}
                        placeholder="e.g. 3"
                        value={form.github_repos}
                        onChange={(e) => updateField("github_repos", e.target.value)}
                        required
                        aria-describedby="github-repos-hint"
                      />
                      <p
                        id="github-repos-hint"
                        className="mt-1 text-xs leading-5 text-zinc-500 dark:text-zinc-400"
                      >
                        How many open-source repositories you have on GitHub (your
                        own projects or contributions).
                      </p>
                    </FormLabel>
                  </div>
                </section>
              )}

              {step === 3 && (
                <section aria-labelledby="step-assessment">
                  <h3 id="step-assessment" className="mb-3 text-lg font-semibold">
                    Soft skills &amp; assessment
                  </h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormLabel text="Communication Skill">
                      <SkillScoreSelect
                        value={form.communication_skill_score}
                        onChange={(value) =>
                          updateField("communication_skill_score", value)
                        }
                      />
                    </FormLabel>
                    <FormLabel text="Teamwork Skill">
                      <SkillScoreSelect
                        value={form.teamwork_score}
                        onChange={(value) => updateField("teamwork_score", value)}
                        thresholds={SOFT_SKILL_SCORE_LABEL_THRESHOLDS}
                      />
                    </FormLabel>
                    <FormLabel text="Leadership Skill">
                      <SkillScoreSelect
                        value={form.leadership_score}
                        onChange={(value) => updateField("leadership_score", value)}
                        thresholds={SOFT_SKILL_SCORE_LABEL_THRESHOLDS}
                      />
                    </FormLabel>
                    <FormLabel text="Extracurricular Skill">
                      <SkillScoreSelect
                        value={form.extracurricular_score}
                        onChange={(value) =>
                          updateField("extracurricular_score", value)
                        }
                        thresholds={SOFT_SKILL_SCORE_LABEL_THRESHOLDS}
                      />
                    </FormLabel>
                    <FormLabel text="Presentation Skill">
                      <SkillScoreSelect
                        value={form.presentation_skill_score}
                        onChange={(value) =>
                          updateField("presentation_skill_score", value)
                        }
                      />
                    </FormLabel>
                    <FormLabel text="Aptitude Test">
                      <SkillScoreSelect
                        value={form.aptitude_test_score}
                        onChange={(value) => updateField("aptitude_test_score", value)}
                      />
                    </FormLabel>
                    <FormLabel text="Mock Interview">
                      <SkillScoreSelect
                        value={form.mock_interview_score}
                        onChange={(value) => updateField("mock_interview_score", value)}
                      />
                    </FormLabel>
                    <FormLabel text="Resume Quality Score (0-100)">
                      <input
                        className={inputClassName}
                        type="number"
                        min={0}
                        max={100}
                        placeholder="e.g. 100"
                        value={form.resume_quality_score}
                        onChange={(e) =>
                          updateField("resume_quality_score", e.target.value)
                        }
                        required
                      />
                    </FormLabel>
                  </div>
                </section>
              )}
            </form>

            <div className="mt-6 flex flex-wrap gap-3 border-t border-zinc-200 pt-5 dark:border-zinc-800">
              {step > 0 && (
                <button
                  type="button"
                  onClick={goBack}
                  disabled={loading}
                  className="rounded-lg border border-zinc-300 px-5 py-2.5 text-sm font-semibold transition hover:bg-zinc-100 disabled:opacity-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
                >
                  Back
                </button>
              )}
              {step < LAST_STEP ? (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    goNext();
                  }}
                  disabled={loading}
                  className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  form="student-job-prediction-form"
                  className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={loading}
                >
                  Predict Job Outcome
                </button>
              )}
              <button
                type="button"
                onClick={resetForm}
                disabled={loading}
                className="rounded-lg border border-zinc-300 px-5 py-2.5 text-sm font-semibold transition hover:bg-zinc-100 disabled:opacity-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
              >
                Reset
              </button>
            </div>

            {error && (
              <div className="mt-6 flex justify-center">
                <p className="w-full max-w-md rounded-xl border border-red-200 bg-red-50 p-4 text-center text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-200">
                  {error}
                </p>
              </div>
            )}
          </div>
          )}
        </div>
      </div>
    </div>
  );
}
