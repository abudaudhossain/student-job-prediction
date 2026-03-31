 "use client";

import { FormEvent, useState } from "react";

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
  activities: string;
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
  activities: "",
  numberOfActivities: "",
  completedProjects: "",
  githubOrDeployed: "",
  internshipExperience: "",
  networkingOrReferral: "",
  skillCourses: "",
  jobAlignsWithEducation: "",
};

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

export default function Home() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [result, setResult] = useState<PredictionResponse | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (form.programmingLanguages.length === 0) {
      setError("Please select at least one programming language.");
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

      const data = (await response.json()) as
        | PredictionResponse
        | { error: string };

      if (!response.ok || "error" in data) {
        throw new Error("error" in data ? data.error : "Prediction failed.");
      }

      setResult(data);
    } catch (submitError) {
      const message =
        submitError instanceof Error ? submitError.message : "Prediction failed.";
      setError(message);
    } finally {
      setLoading(false);
    }
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

  return (
    <div className="min-h-screen bg-linear-to-b from-zinc-100 to-zinc-200 px-4 py-10 text-zinc-900 dark:from-zinc-950 dark:to-zinc-900 dark:text-zinc-100">
      <main className="mx-auto w-full max-w-5xl rounded-2xl border border-zinc-200 bg-white p-6 shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mb-6 border-b border-zinc-200 pb-4 dark:border-zinc-800">
          <h1 className="text-3xl font-bold tracking-tight">Student Job Prediction</h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
            Enter complete student profile details to predict placement outcome.
          </p>
        </div>

        <form className="space-y-6" onSubmit={onSubmit}>
          <section>
            <h2 className="mb-3 text-lg font-semibold">Academic Details</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className={labelClassName}>
                Age
                <input className={inputClassName} type="number" min={16} max={60} value={form.age} onChange={(e) => updateField("age", e.target.value)} required />
              </label>
              <label className={labelClassName}>
                Gender
                <select className={inputClassName} value={form.gender} onChange={(e) => updateField("gender", e.target.value)} required>
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </label>
              <label className={labelClassName}>
                Department
                <select className={inputClassName} value={form.department} onChange={(e) => updateField("department", e.target.value)} required>
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
                <input className={inputClassName} type="number" step="0.01" min={0} max={4} value={form.cgpa} onChange={(e) => updateField("cgpa", e.target.value)} required />
              </label>
            </div>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold">Skills & Experience</h2>
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
                <input className={inputClassName} type="number" min={0} value={form.solvedProblems} onChange={(e) => updateField("solvedProblems", e.target.value)} required />
              </label>
              <label className={labelClassName}>
                Technical Skill (0-5)
                <input className={inputClassName} type="number" min={0} max={5} value={form.technicalSkill} onChange={(e) => updateField("technicalSkill", e.target.value)} required />
              </label>
              <label className={labelClassName}>
                Communication Skill (0-5)
                <input className={inputClassName} type="number" min={0} max={5} value={form.communicationSkill} onChange={(e) => updateField("communicationSkill", e.target.value)} required />
              </label>
              <label className={labelClassName}>
                Problem Solving Ability (0-5)
                <input className={inputClassName} type="number" min={0} max={5} value={form.problemSolving} onChange={(e) => updateField("problemSolving", e.target.value)} required />
              </label>
              <label className={labelClassName}>
                Teamwork Ability (0-5)
                <input className={inputClassName} type="number" min={0} max={5} value={form.teamwork} onChange={(e) => updateField("teamwork", e.target.value)} required />
              </label>
              <label className={`${labelClassName} sm:col-span-2`}>
                Extra-curricular or technical activities
                <input className={inputClassName} value={form.activities} onChange={(e) => updateField("activities", e.target.value)} required />
              </label>
            </div>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold">Projects & Placement Context</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className={labelClassName}>
                Number of Extra-Curricular Activities
                <input className={inputClassName} type="number" min={0} value={form.numberOfActivities} onChange={(e) => updateField("numberOfActivities", e.target.value)} required />
              </label>
              <label className={labelClassName}>
                Number of Completed Projects
                <input className={inputClassName} type="number" min={0} value={form.completedProjects} onChange={(e) => updateField("completedProjects", e.target.value)} required />
              </label>
              <label className={labelClassName}>
                Published on GitHub / deployed online
                <select className={inputClassName} value={form.githubOrDeployed} onChange={(e) => updateField("githubOrDeployed", e.target.value)} required>
                  <option value="">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </label>
              <label className={labelClassName}>
                Internship Experience
                <select className={inputClassName} value={form.internshipExperience} onChange={(e) => updateField("internshipExperience", e.target.value)} required>
                  <option value="">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </label>
              <label className={labelClassName}>
                Job through networking or referral
                <select className={inputClassName} value={form.networkingOrReferral} onChange={(e) => updateField("networkingOrReferral", e.target.value)} required>
                  <option value="">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </label>
              <label className={labelClassName}>
                Skill development courses completed
                <input className={inputClassName} type="number" min={0} value={form.skillCourses} onChange={(e) => updateField("skillCourses", e.target.value)} required />
              </label>
              <label className={`${labelClassName} sm:col-span-2`}>
                Employment aligns with educational background
                <select className={inputClassName} value={form.jobAlignsWithEducation} onChange={(e) => updateField("jobAlignsWithEducation", e.target.value)} required>
                  <option value="">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </label>
            </div>
          </section>

          <div className="flex flex-wrap gap-3 border-t border-zinc-200 pt-5 dark:border-zinc-800">
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={loading}
            >
              {loading ? "Predicting..." : "Predict Job Outcome"}
            </button>
            <button
              type="button"
              onClick={() => {
                setForm(initialForm);
                setResult(null);
                setError("");
              }}
              className="rounded-lg border border-zinc-300 px-5 py-2.5 text-sm font-semibold transition hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
            >
              Reset
            </button>
          </div>
        </form>

        {error && (
          <p className="mt-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-200">
            {error}
          </p>
        )}

        {result && (
          <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 p-5 dark:border-emerald-900 dark:bg-emerald-950">
            <p className="text-xl font-bold">
              Prediction: {result.status}
            </p>
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
      </main>
    </div>
  );
}
