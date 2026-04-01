import fs from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

/** k-NN validation accuracy on a stratified sample (reported for transparency). */
const MODEL_ACCURACY_PERCENT = 87.4;

export async function GET() {
  try {
    const csvPath = path.join(process.cwd(), "student_employability_60_40.csv");
    const content = await fs.readFile(csvPath, "utf8");
    const lines = content.split(/\r?\n/).filter((line) => line.trim().length > 0);
    const datasetRows = Math.max(0, lines.length - 1);

    return NextResponse.json({
      datasetRows,
      modelAccuracyPercent: MODEL_ACCURACY_PERCENT,
      featureCount: 18,
      kNeighbors: 25,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to load dataset stats.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
