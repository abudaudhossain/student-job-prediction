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
  "None",
];

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
  "https://student-job-predition-server.onrender.com/predict";

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

function stepValidators(step: number, form: FormState): string | null {
  switch (step) {
    case 0:
      return validateRequiredFields(
        form,
        academicFields,
        "Please complete all academic fields.",
      );
    case 1:
      return validateRequiredFields(
        form,
        technicalFields,
        "Please complete all technical skill fields.",
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

  const progressPct = ((step + 1) / STEPS.length) * 100;

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
              Student Job Prediction
            </h2>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
              Step {step + 1} of {STEPS.length}: {STEPS[step].title}
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

        <div className="shrink-0 border-b border-zinc-100 px-5 py-3 dark:border-zinc-800 sm:px-6">
          <ol className="flex flex-wrap gap-2 sm:gap-4" aria-label="Form steps">
            {STEPS.map((s, i) => (
              <li
                key={s.id}
                className={`flex items-center gap-2 text-xs sm:text-sm ${
                  i === step
                    ? "font-semibold text-blue-700 dark:text-blue-300"
                    : i < step
                      ? "text-zinc-500 dark:text-zinc-400"
                      : "text-zinc-400 dark:text-zinc-500"
                }`}
              >
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                    i === step
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

        <div className="relative min-h-0 flex-1">
          {loading && <PredictionFormLoader />}

          <div className="min-h-0 max-h-[min(60vh,560px)] overflow-y-auto px-5 py-5 sm:max-h-[min(65vh,600px)] sm:px-6">
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
                    <FormLabel text="Programming Skill Score (0–100)">
                      <input
                        className={inputClassName}
                        type="number"
                        min={0}
                        max={100}
                        placeholder="e.g. 44"
                        value={form.programming_skill_score}
                        onChange={(e) =>
                          updateField("programming_skill_score", e.target.value)
                        }
                        required
                      />
                    </FormLabel>
                    <FormLabel text="Problem Solving Score (0–100)">
                      <input
                        className={inputClassName}
                        type="number"
                        min={0}
                        max={100}
                        placeholder="e.g. 39"
                        value={form.problem_solving_score}
                        onChange={(e) =>
                          updateField("problem_solving_score", e.target.value)
                        }
                        required
                      />
                    </FormLabel>
                    <FormLabel text="Database Skill Score (0–100)">
                      <input
                        className={inputClassName}
                        type="number"
                        min={0}
                        max={100}
                        placeholder="e.g. 91"
                        value={form.database_skill_score}
                        onChange={(e) =>
                          updateField("database_skill_score", e.target.value)
                        }
                        required
                      />
                    </FormLabel>
                    <FormLabel text="Learning Consistency Score (0–100)">
                      <input
                        className={inputClassName}
                        type="number"
                        min={0}
                        max={100}
                        placeholder="e.g. 61"
                        value={form.learning_consistency_score}
                        onChange={(e) =>
                          updateField("learning_consistency_score", e.target.value)
                        }
                        required
                      />
                    </FormLabel>
                    <FormLabel text="Coding Contest Rating">
                      <input
                        className={inputClassName}
                        type="number"
                        min={0}
                        placeholder="e.g. 868"
                        value={form.coding_contest_rating}
                        onChange={(e) =>
                          updateField("coding_contest_rating", e.target.value)
                        }
                        required
                      />
                    </FormLabel>
                    <FormLabel text="Coding Contest Platform">
                      <select
                        className={inputClassName}
                        value={form.coding_contest_platform}
                        onChange={(e) =>
                          updateField("coding_contest_platform", e.target.value)
                        }
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
                    <FormLabel text="GitHub Repos">
                      <input
                        className={inputClassName}
                        type="number"
                        min={0}
                        placeholder="e.g. 15"
                        value={form.github_repos}
                        onChange={(e) => updateField("github_repos", e.target.value)}
                        required
                      />
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
                    <FormLabel text="Communication Skill Score (0–100)">
                      <input
                        className={inputClassName}
                        type="number"
                        min={0}
                        max={100}
                        placeholder="e.g. 53"
                        value={form.communication_skill_score}
                        onChange={(e) =>
                          updateField("communication_skill_score", e.target.value)
                        }
                        required
                      />
                    </FormLabel>
                    <FormLabel text="Teamwork Score (0–100)">
                      <input
                        className={inputClassName}
                        type="number"
                        min={0}
                        max={100}
                        placeholder="e.g. 45"
                        value={form.teamwork_score}
                        onChange={(e) => updateField("teamwork_score", e.target.value)}
                        required
                      />
                    </FormLabel>
                    <FormLabel text="Leadership Score (0–100)">
                      <input
                        className={inputClassName}
                        type="number"
                        min={0}
                        max={100}
                        placeholder="e.g. 72"
                        value={form.leadership_score}
                        onChange={(e) =>
                          updateField("leadership_score", e.target.value)
                        }
                        required
                      />
                    </FormLabel>
                    <FormLabel text="Extracurricular Score (0–100)">
                      <input
                        className={inputClassName}
                        type="number"
                        min={0}
                        max={100}
                        placeholder="e.g. 1"
                        value={form.extracurricular_score}
                        onChange={(e) =>
                          updateField("extracurricular_score", e.target.value)
                        }
                        required
                      />
                    </FormLabel>
                    <FormLabel text="Presentation Skill Score (0–100)">
                      <input
                        className={inputClassName}
                        type="number"
                        min={0}
                        max={100}
                        placeholder="e.g. 54"
                        value={form.presentation_skill_score}
                        onChange={(e) =>
                          updateField("presentation_skill_score", e.target.value)
                        }
                        required
                      />
                    </FormLabel>
                    <FormLabel text="Aptitude Test Score (0–100)">
                      <input
                        className={inputClassName}
                        type="number"
                        min={0}
                        max={100}
                        placeholder="e.g. 53"
                        value={form.aptitude_test_score}
                        onChange={(e) =>
                          updateField("aptitude_test_score", e.target.value)
                        }
                        required
                      />
                    </FormLabel>
                    <FormLabel text="Mock Interview Score (0–100)">
                      <input
                        className={inputClassName}
                        type="number"
                        min={0}
                        max={100}
                        placeholder="e.g. 47"
                        value={form.mock_interview_score}
                        onChange={(e) =>
                          updateField("mock_interview_score", e.target.value)
                        }
                        required
                      />
                    </FormLabel>
                    <FormLabel text="Resume Quality Score (0–100)">
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
                onClick={() => {
                  setForm(initialForm);
                  setStep(0);
                  setResult(null);
                  setError("");
                }}
                disabled={loading}
                className="rounded-lg border border-zinc-300 px-5 py-2.5 text-sm font-semibold transition hover:bg-zinc-100 disabled:opacity-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
              >
                Reset
              </button>
            </div>

            {error && (
              <p className="mt-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-200">
                {error}
              </p>
            )}

            {result && (
              <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 p-5 dark:border-emerald-900 dark:bg-emerald-950">
                <p className="text-xl font-bold">Prediction: {result.status}</p>
                <p className="mt-2 text-sm text-zinc-700 dark:text-zinc-200">
                  Confidence (Got a Job):{" "}
                  <span className="font-semibold">
                    {(result.confidenceGotJob * 100).toFixed(2)}%
                  </span>
                </p>
                <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
                  <div
                    className="h-full rounded-full bg-emerald-500 transition-all"
                    style={{ width: `${Math.round(result.confidenceGotJob * 100)}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
