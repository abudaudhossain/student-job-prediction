import fs from "node:fs/promises";
import path from "node:path";
import { NextRequest, NextResponse } from "next/server";

type FormPayload = {
  age: string;
  gender: string;
  department: string;
  cgpa: string;
  programmingLanguages: string | string[];
  solvedProblems: string;
  technicalSkill: string;
  communicationSkill: string;
  problemSolving: string;
  teamwork: string;
  activities: string | string[];
  numberOfActivities: string;
  completedProjects: string;
  githubOrDeployed: string;
  internshipExperience: string;
  networkingOrReferral: string;
  skillCourses: string;
  jobAlignsWithEducation: string;
};

function mapPayloadToModelInput(payload: FormPayload): Record<string, string> {
  const languageValue = Array.isArray(payload.programmingLanguages)
    ? payload.programmingLanguages.join(", ")
    : payload.programmingLanguages;
  const activitiesValue = Array.isArray(payload.activities)
    ? payload.activities.join(", ")
    : payload.activities;

  return {
    Age: payload.age,
    Gender: payload.gender,
    Department: payload.department,
    CGPA: payload.cgpa,
    "Programming Languages You Know": languageValue,
    "Approximate Number of Problems Solved on Online Judge Platforms":
      payload.solvedProblems,
    "Self-Rated Technical Skill Level": payload.technicalSkill,
    "Communication Skill Level": payload.communicationSkill,
    "Real-World Problem Solving Ability": payload.problemSolving,
    "Teamwork Ability": payload.teamwork,
    "Which of the following extra-curricular or technical activities have you participated in during your university studies?":
      activitiesValue,
    "Number of Extra-Curricular Activities": payload.numberOfActivities,
    "Number of Completed Projects": payload.completedProjects,
    "Have you published projects on GitHub or deployed online?":
      payload.githubOrDeployed,
    "Internship Experience": payload.internshipExperience,
    "Was the job obtained through networking or referral?":
      payload.networkingOrReferral,
    "How many skill development courses have you completed outside your academic curriculum?":
      payload.skillCourses,
    "Does your current employment align with your educational background?":
      payload.jobAlignsWithEducation,
  };
}

const TARGET_COLUMN = "Job Status After Graduation";
const FEATURE_COLUMNS = [
  "Age",
  "Gender",
  "Department",
  "CGPA",
  "Programming Languages You Know",
  "Approximate Number of Problems Solved on Online Judge Platforms",
  "Self-Rated Technical Skill Level",
  "Communication Skill Level",
  "Real-World Problem Solving Ability",
  "Teamwork Ability",
  "Which of the following extra-curricular or technical activities have you participated in during your university studies?",
  "Number of Extra-Curricular Activities",
  "Number of Completed Projects",
  "Have you published projects on GitHub or deployed online?",
  "Internship Experience",
  "Was the job obtained through networking or referral?",
  "How many skill development courses have you completed outside your academic curriculum?",
  "Does your current employment align with your educational background?",
] as const;

type Row = Record<(typeof FEATURE_COLUMNS)[number], string> & {
  [TARGET_COLUMN]: string;
};

const NUMERIC_COLUMNS = new Set<string>([
  "Age",
  "CGPA",
  "Approximate Number of Problems Solved on Online Judge Platforms",
  "Self-Rated Technical Skill Level",
  "Communication Skill Level",
  "Real-World Problem Solving Ability",
  "Teamwork Ability",
  "Number of Extra-Curricular Activities",
  "Number of Completed Projects",
  "How many skill development courses have you completed outside your academic curriculum?",
]);

type PreparedData = {
  rows: Row[];
  mins: Record<string, number>;
  maxs: Record<string, number>;
};

let cachedDataPromise: Promise<PreparedData> | null = null;

function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === "," && !inQuotes) {
      result.push(current);
      current = "";
    } else {
      current += ch;
    }
  }
  result.push(current);
  return result.map((v) => v.trim());
}

async function loadData(): Promise<PreparedData> {
  if (!cachedDataPromise) {
    cachedDataPromise = (async () => {
      const csvPath = path.join(process.cwd(), "student_employability_60_40.csv");
      const content = await fs.readFile(csvPath, "utf8");
      const lines = content.split(/\r?\n/).filter((line) => line.trim().length > 0);
      if (lines.length < 2) {
        throw new Error("Dataset is empty or invalid.");
      }

      const headers = parseCsvLine(lines[0]);
      const neededColumns = [...FEATURE_COLUMNS, TARGET_COLUMN];
      const missing = neededColumns.filter((col) => !headers.includes(col));
      if (missing.length > 0) {
        throw new Error(`Dataset missing columns: ${missing.join(", ")}`);
      }

      const headerIndex = new Map(headers.map((h, idx) => [h, idx]));
      const rows: Row[] = [];
      const mins: Record<string, number> = {};
      const maxs: Record<string, number> = {};

      for (const col of FEATURE_COLUMNS) {
        if (NUMERIC_COLUMNS.has(col)) {
          mins[col] = Number.POSITIVE_INFINITY;
          maxs[col] = Number.NEGATIVE_INFINITY;
        }
      }

      for (let i = 1; i < lines.length; i += 1) {
        const cols = parseCsvLine(lines[i]);
        const row = {} as Row;

        for (const col of FEATURE_COLUMNS) {
          row[col] = cols[headerIndex.get(col) ?? -1] ?? "";
          if (NUMERIC_COLUMNS.has(col)) {
            const value = Number(row[col]);
            if (Number.isFinite(value)) {
              mins[col] = Math.min(mins[col], value);
              maxs[col] = Math.max(maxs[col], value);
            }
          }
        }

        row[TARGET_COLUMN] = cols[headerIndex.get(TARGET_COLUMN) ?? -1] ?? "";
        rows.push(row);
      }

      return { rows, mins, maxs };
    })();
  }

  return cachedDataPromise;
}

function featureDistance(
  a: Record<string, string>,
  b: Record<string, string>,
  mins: Record<string, number>,
  maxs: Record<string, number>,
): number {
  let total = 0;
  for (const col of FEATURE_COLUMNS) {
    if (NUMERIC_COLUMNS.has(col)) {
      const av = Number(a[col]);
      const bv = Number(b[col]);
      const min = mins[col];
      const max = maxs[col];
      const range = max - min || 1;
      const diff = Number.isFinite(av) && Number.isFinite(bv) ? Math.abs(av - bv) / range : 1;
      total += diff;
    } else {
      total += a[col].toLowerCase() === b[col].toLowerCase() ? 0 : 1;
    }
  }
  return total / FEATURE_COLUMNS.length;
}

async function runPrediction(input: Record<string, string>) {
  const data = await loadData();
  const neighbors = data.rows
    .map((row) => {
      const distance = featureDistance(input, row, data.mins, data.maxs);
      return { distance, label: row[TARGET_COLUMN] };
    })
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 25);

  const gotJobCount = neighbors.filter(
    (n) => n.label.trim().toLowerCase() === "got a job",
  ).length;
  const confidenceGotJob = gotJobCount / neighbors.length;

  return {
    status:
      confidenceGotJob >= 0.5 ? ("Got a Job" as const) : ("Did Not Get a Job" as const),
    confidenceGotJob,
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as FormPayload;
    const modelInput = mapPayloadToModelInput(body);
    const prediction = await runPrediction(modelInput);
    return NextResponse.json(prediction);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Prediction request failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
