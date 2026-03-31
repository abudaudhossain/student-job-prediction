from __future__ import annotations

import json
import sys
from pathlib import Path
from typing import Any

import pandas as pd

from student_job_predictor import (
    FEATURE_COLUMNS,
    TARGET_COLUMN,
    build_pipeline,
    normalize_target,
)


NUMERIC_COLUMNS = {
    "Age": int,
    "CGPA": float,
    "Approximate Number of Problems Solved on Online Judge Platforms": int,
    "Self-Rated Technical Skill Level": int,
    "Communication Skill Level": int,
    "Real-World Problem Solving Ability": int,
    "Teamwork Ability": int,
    "Number of Extra-Curricular Activities": int,
    "Number of Completed Projects": int,
    "How many skill development courses have you completed outside your academic curriculum?": int,
}


def parse_payload(raw: dict[str, Any]) -> dict[str, Any]:
    parsed: dict[str, Any] = {}
    for col in FEATURE_COLUMNS:
        if col not in raw:
            raise ValueError(f"Missing field: {col}")

        value = raw[col]
        if col in NUMERIC_COLUMNS:
            converter = NUMERIC_COLUMNS[col]
            parsed[col] = converter(value)
        else:
            parsed[col] = str(value).strip()
    return parsed


def main() -> None:
    payload = json.loads(sys.stdin.read())
    feature_row = parse_payload(payload)

    csv_path = Path("student_employability_60_40.csv")
    if not csv_path.exists():
        raise FileNotFoundError(
            f"Dataset not found: {csv_path.resolve()}. "
            "Put 'student_employability_60_40.csv' in the project root."
        )

    df = pd.read_csv(csv_path)
    missing = [c for c in FEATURE_COLUMNS + [TARGET_COLUMN] if c not in df.columns]
    if missing:
        raise ValueError("Dataset missing required columns: " + ", ".join(missing))

    model_df = df[FEATURE_COLUMNS + [TARGET_COLUMN]].copy()
    model_df[TARGET_COLUMN] = model_df[TARGET_COLUMN].apply(normalize_target)

    pipeline = build_pipeline(model_df)
    pipeline.fit(model_df[FEATURE_COLUMNS], model_df[TARGET_COLUMN])

    sample = pd.DataFrame([feature_row])
    prediction = int(pipeline.predict(sample)[0])
    probability = float(pipeline.predict_proba(sample)[0][1])

    response = {
        "status": "Got a Job" if prediction == 1 else "Did Not Get a Job",
        "confidenceGotJob": probability,
    }
    print(json.dumps(response))


if __name__ == "__main__":
    main()
