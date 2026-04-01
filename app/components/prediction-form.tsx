"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { incrementPredictionCount } from "../lib/prediction-stats";
import { PredictionFormLoader } from "./prediction-form-loader";
import { usePredictionModal } from "./prediction-modal-context";

type PredictionResponse = {
  status: "Got a Job" | "Did Not Get a Job";
  confidenceGotJob: number;
};

type FormState = {
  age: string;
  gender: string;
  department: string;
  cgpa: string;
  programmingLanguages: string[];
  solvedProblems: string;
  technicalSkill: string;
  communicationSkill: string;
  problemSolving: string;
  teamwork: string;
  activities: string[];
  numberOfActivities: string;
  completedProjects: string;
  githubOrDeployed: string;
  internshipExperience: string;
  networkingOrReferral: string;
  skillCourses: string;
  jobAlignsWithEducation: string;
};

const initialForm: FormState = {
  age: "",
  gender: "",
  department: "",
  cgpa: "",
  programmingLanguages: [],
  solvedProblems: "",
  technicalSkill: "",
  communicationSkill: "",
  problemSolving: "",
  teamwork: "",
  activities: [],
  numberOfActivities: "",
  completedProjects: "",
  githubOrDeployed: "",
  internshipExperience: "",
  networkingOrReferral: "",
  skillCourses: "",
  jobAlignsWithEducation: "",
};

const STEPS = [
  { id: 0, title: "Academic details", short: "Profile & CGPA" },
  { id: 1, title: "Skills & experience", short: "Languages & soft skills" },
  { id: 2, title: "Projects & placement", short: "Projects & context" },
] as const;

const inputClassName =
  "mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-zinc-700 dark:bg-zinc-800 dark:focus:ring-blue-900";

const labelClassName = "text-sm font-medium text-zinc-700 dark:text-zinc-200";

const languageOptions = [
  "Python",
  "Java",
  "JavaScript",
  "TypeScript",
  "C",
  "C++",
  "C#",
  "Go",
  "PHP",
  "R",
  "SQL",
  "Kotlin",
  "Swift",
];

const activityOptions = [
  "Coding competition",
  "Hackathon",
  "Open-source contribution",
  "Technical club",
  "Workshop or seminar",
  "Research project",
  "Robotics or IoT project",
  "Volunteer leadership",
  "Public speaking",
  "Sports or cultural events",
];

function validateAcademic(form: FormState): string | null {
  if (!form.age.trim() || !form.gender || !form.department || !form.cgpa.trim()) {
    return "Please complete all academic fields.";
  }
  return null;
}

function validateSkills(form: FormState): string | null {
  if (form.programmingLanguages.length === 0) {
    return "Please select at least one programming language.";
  }
  const keys: (keyof FormState)[] = [
    "solvedProblems",
    "technicalSkill",
    "communicationSkill",
    "problemSolving",
    "teamwork",
  ];
  for (const k of keys) {
    const v = form[k];
    if (typeof v === "string" && !v.trim()) {
      return "Please complete all skills & experience fields.";
    }
  }
  if (form.activities.length === 0) {
    return "Please select at least one activity.";
  }
  return null;
}

function validateProjects(form: FormState): string | null {
  const keys: (keyof FormState)[] = [
    "numberOfActivities",
    "completedProjects",
    "githubOrDeployed",
    "internshipExperience",
    "networkingOrReferral",
    "skillCourses",
    "jobAlignsWithEducation",
  ];
  for (const k of keys) {
    const v = form[k];
    if (typeof v === "string" && !String(v).trim()) {
      return "Please complete all projects & placement fields.";
    }
  }
  return null;
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
    // Ref avoids stale step if Enter triggers submit in the same tick as navigation.
    if (stepRef.current !== 2) return;
    const langErr = validateSkills(form);
    if (langErr) {
      setError(langErr);
      return;
    }
    if (form.programmingLanguages.length === 0) {
      setError("Please select at least one programming language.");
      return;
    }
    const projectErr = validateProjects(form);
    if (projectErr) {
      setError(projectErr);
      return;
    }
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch("/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = (await response.json()) as PredictionResponse | { error: string };

      if (!response.ok || "error" in data) {
        throw new Error("error" in data ? data.error : "Prediction failed.");
      }

      setResult(data);
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
    if (step === 0) {
      const err = validateAcademic(form);
      if (err) {
        setError(err);
        return;
      }
      setStep(1);
      return;
    }
    if (step === 1) {
      const err = validateSkills(form);
      if (err) {
        setError(err);
        return;
      }
      setStep(2);
    }
  }

  function goBack() {
    setError("");
    setStep((s) => Math.max(0, s - 1));
  }

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function toggleLanguage(language: string) {
    setForm((prev) => {
      const exists = prev.programmingLanguages.includes(language);
      return {
        ...prev,
        programmingLanguages: exists
          ? prev.programmingLanguages.filter((item) => item !== language)
          : [...prev.programmingLanguages, language],
      };
    });
  }

  function toggleActivity(activity: string) {
    setForm((prev) => {
      const exists = prev.activities.includes(activity);
      return {
        ...prev,
        activities: exists
          ? prev.activities.filter((item) => item !== activity)
          : [...prev.activities, activity],
      };
    });
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
                if (stepRef.current >= 2) return;
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
                    <label className={labelClassName}>
                      Age
                      <input
                        className={inputClassName}
                        type="number"
                        min={16}
                        max={60}
                        value={form.age}
                        onChange={(e) => updateField("age", e.target.value)}
                        required
                      />
                    </label>
                    <label className={labelClassName}>
                      Gender
                      <select
                        className={inputClassName}
                        value={form.gender}
                        onChange={(e) => updateField("gender", e.target.value)}
                        required
                      >
                        <option value="">Select gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                    </label>
                    <label className={labelClassName}>
                      Department
                      <select
                        className={inputClassName}
                        value={form.department}
                        onChange={(e) => updateField("department", e.target.value)}
                        required
                      >
                        <option value="">Select department</option>
                        <option value="CSE">CSE</option>
                        <option value="IT">IT</option>
                        <option value="SWE">SWE</option>
                        <option value="EEE">EEE</option>
                        <option value="Management">Management</option>
                        <option value="BBA">BBA</option>
                      </select>
                    </label>
                    <label className={labelClassName}>
                      CGPA
                      <input
                        className={inputClassName}
                        type="number"
                        step="0.01"
                        min={0}
                        max={4}
                        value={form.cgpa}
                        onChange={(e) => updateField("cgpa", e.target.value)}
                        required
                      />
                    </label>
                  </div>
                </section>
              )}

              {step === 1 && (
                <section aria-labelledby="step-skills">
                  <h3 id="step-skills" className="mb-3 text-lg font-semibold">
                    Skills &amp; experience
                  </h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className={`${labelClassName} sm:col-span-2`}>
                      Programming Languages You Know
                      <div className="mt-2 flex flex-wrap gap-2 rounded-lg border border-zinc-300 bg-zinc-50 p-3 dark:border-zinc-700 dark:bg-zinc-800/50">
                        {languageOptions.map((lang) => {
                          const active = form.programmingLanguages.includes(lang);
                          return (
                            <button
                              key={lang}
                              type="button"
                              onClick={() => toggleLanguage(lang)}
                              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                                active
                                  ? "border-blue-600 bg-blue-600 text-white"
                                  : "border-zinc-300 bg-white text-zinc-700 hover:border-blue-400 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-200"
                              }`}
                              aria-pressed={active}
                            >
                              {lang}
                            </button>
                          );
                        })}
                      </div>
                      <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                        Click to select one or multiple languages.
                      </p>
                    </label>
                    <label className={`${labelClassName} sm:col-span-2`}>
                      Approximate Number of Problems Solved on Online Judge Platforms
                      <input
                        className={inputClassName}
                        type="number"
                        min={0}
                        value={form.solvedProblems}
                        onChange={(e) => updateField("solvedProblems", e.target.value)}
                        required
                      />
                    </label>
                    <label className={labelClassName}>
                      Technical Skill (0-5)
                      <input
                        className={inputClassName}
                        type="number"
                        min={0}
                        max={5}
                        value={form.technicalSkill}
                        onChange={(e) => updateField("technicalSkill", e.target.value)}
                        required
                      />
                    </label>
                    <label className={labelClassName}>
                      Communication Skill (0-5)
                      <input
                        className={inputClassName}
                        type="number"
                        min={0}
                        max={5}
                        value={form.communicationSkill}
                        onChange={(e) =>
                          updateField("communicationSkill", e.target.value)
                        }
                        required
                      />
                    </label>
                    <label className={labelClassName}>
                      Problem Solving Ability (0-5)
                      <input
                        className={inputClassName}
                        type="number"
                        min={0}
                        max={5}
                        value={form.problemSolving}
                        onChange={(e) => updateField("problemSolving", e.target.value)}
                        required
                      />
                    </label>
                    <label className={labelClassName}>
                      Teamwork Ability (0-5)
                      <input
                        className={inputClassName}
                        type="number"
                        min={0}
                        max={5}
                        value={form.teamwork}
                        onChange={(e) => updateField("teamwork", e.target.value)}
                        required
                      />
                    </label>
                    <label className={`${labelClassName} sm:col-span-2`}>
                      Extra-curricular or technical activities
                      <div className="mt-2 flex flex-wrap gap-2 rounded-lg border border-zinc-300 bg-zinc-50 p-3 dark:border-zinc-700 dark:bg-zinc-800/50">
                        {activityOptions.map((activity) => {
                          const active = form.activities.includes(activity);
                          return (
                            <button
                              key={activity}
                              type="button"
                              onClick={() => toggleActivity(activity)}
                              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                                active
                                  ? "border-indigo-600 bg-indigo-600 text-white"
                                  : "border-zinc-300 bg-white text-zinc-700 hover:border-indigo-400 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-200"
                              }`}
                              aria-pressed={active}
                            >
                              {activity}
                            </button>
                          );
                        })}
                      </div>
                      <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                        Select one or multiple activities.
                      </p>
                    </label>
                  </div>
                </section>
              )}

              {step === 2 && (
                <section aria-labelledby="step-projects">
                  <h3 id="step-projects" className="mb-3 text-lg font-semibold">
                    Projects &amp; placement context
                  </h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className={labelClassName}>
                      Number of Extra-Curricular Activities
                      <input
                        className={inputClassName}
                        type="number"
                        min={0}
                        value={form.numberOfActivities}
                        onChange={(e) =>
                          updateField("numberOfActivities", e.target.value)
                        }
                        required
                      />
                    </label>
                    <label className={labelClassName}>
                      Number of Completed Projects
                      <input
                        className={inputClassName}
                        type="number"
                        min={0}
                        value={form.completedProjects}
                        onChange={(e) => updateField("completedProjects", e.target.value)}
                        required
                      />
                    </label>
                    <label className={labelClassName}>
                      Published on GitHub / deployed online
                      <select
                        className={inputClassName}
                        value={form.githubOrDeployed}
                        onChange={(e) => updateField("githubOrDeployed", e.target.value)}
                        required
                      >
                        <option value="">Select</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    </label>
                    <label className={labelClassName}>
                      Internship Experience
                      <select
                        className={inputClassName}
                        value={form.internshipExperience}
                        onChange={(e) =>
                          updateField("internshipExperience", e.target.value)
                        }
                        required
                      >
                        <option value="">Select</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    </label>
                    <label className={labelClassName}>
                      Job through networking or referral
                      <select
                        className={inputClassName}
                        value={form.networkingOrReferral}
                        onChange={(e) =>
                          updateField("networkingOrReferral", e.target.value)
                        }
                        required
                      >
                        <option value="">Select</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    </label>
                    <label className={labelClassName}>
                      Skill development courses completed
                      <input
                        className={inputClassName}
                        type="number"
                        min={0}
                        value={form.skillCourses}
                        onChange={(e) => updateField("skillCourses", e.target.value)}
                        required
                      />
                    </label>
                    <label className={`${labelClassName} sm:col-span-2`}>
                      Employment aligns with educational background
                      <select
                        className={inputClassName}
                        value={form.jobAlignsWithEducation}
                        onChange={(e) =>
                          updateField("jobAlignsWithEducation", e.target.value)
                        }
                        required
                      >
                        <option value="">Select</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    </label>
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
                {step < 2 ? (
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
