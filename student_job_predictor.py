from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
from typing import Any

import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import OneHotEncoder


TARGET_COLUMN = "Job Status After Graduation"

FEATURE_COLUMNS = [
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
]


@dataclass
class UserInput:
    age: int
    gender: str
    department: str
    cgpa: float
    programming_languages: str
    solved_problems: int
    technical_skill: int
    communication_skill: int
    problem_solving: int
    teamwork: int
    activities: str
    number_of_activities: int
    completed_projects: int
    github_or_deployed: str
    internship_experience: str
    networking_or_referral: str
    skill_courses: int
    job_aligns_with_education: str

    def to_feature_row(self) -> dict[str, Any]:
        return {
            "Age": self.age,
            "Gender": self.gender,
            "Department": self.department,
            "CGPA": self.cgpa,
            "Programming Languages You Know": self.programming_languages,
            "Approximate Number of Problems Solved on Online Judge Platforms": self.solved_problems,
            "Self-Rated Technical Skill Level": self.technical_skill,
            "Communication Skill Level": self.communication_skill,
            "Real-World Problem Solving Ability": self.problem_solving,
            "Teamwork Ability": self.teamwork,
            "Which of the following extra-curricular or technical activities have you participated in during your university studies?": self.activities,
            "Number of Extra-Curricular Activities": self.number_of_activities,
            "Number of Completed Projects": self.completed_projects,
            "Have you published projects on GitHub or deployed online?": self.github_or_deployed,
            "Internship Experience": self.internship_experience,
            "Was the job obtained through networking or referral?": self.networking_or_referral,
            "How many skill development courses have you completed outside your academic curriculum?": self.skill_courses,
            "Does your current employment align with your educational background?": self.job_aligns_with_education,
        }


def build_pipeline(df: pd.DataFrame) -> Pipeline:
    numeric_columns = df[FEATURE_COLUMNS].select_dtypes(include=["number"]).columns.tolist()
    categorical_columns = [col for col in FEATURE_COLUMNS if col not in numeric_columns]

    numeric_transformer = Pipeline(
        steps=[
            ("imputer", SimpleImputer(strategy="median")),
        ]
    )
    categorical_transformer = Pipeline(
        steps=[
            ("imputer", SimpleImputer(strategy="most_frequent")),
            ("encoder", OneHotEncoder(handle_unknown="ignore")),
        ]
    )

    preprocessor = ColumnTransformer(
        transformers=[
            ("num", numeric_transformer, numeric_columns),
            ("cat", categorical_transformer, categorical_columns),
        ]
    )

    model = RandomForestClassifier(
        n_estimators=300,
        random_state=42,
        class_weight="balanced",
    )

    return Pipeline(
        steps=[
            ("preprocessor", preprocessor),
            ("model", model),
        ]
    )


def normalize_target(value: str) -> int:
    if str(value).strip().lower() == "got a job":
        return 1
    return 0


def ask_int(prompt: str) -> int:
    while True:
        try:
            return int(input(prompt).strip())
        except ValueError:
            print("Please enter a valid integer.")


def ask_float(prompt: str) -> float:
    while True:
        try:
            return float(input(prompt).strip())
        except ValueError:
            print("Please enter a valid number.")


def ask_text(prompt: str) -> str:
    while True:
        value = input(prompt).strip()
        if value:
            return value
        print("Please enter a non-empty value.")


def collect_user_input() -> UserInput:
    print("\nEnter student details for prediction:\n")
    return UserInput(
        age=ask_int("Age: "),
        gender=ask_text("Gender: "),
        department=ask_text("Department: "),
        cgpa=ask_float("CGPA: "),
        programming_languages=ask_text("Programming Languages You Know: "),
        solved_problems=ask_int("Approx. Number of Problems Solved on Online Judges: "),
        technical_skill=ask_int("Self-Rated Technical Skill Level (0-5): "),
        communication_skill=ask_int("Communication Skill Level (0-5): "),
        problem_solving=ask_int("Real-World Problem Solving Ability (0-5): "),
        teamwork=ask_int("Teamwork Ability (0-5): "),
        activities=ask_text(
            "Extra-curricular/technical activities participated in university: "
        ),
        number_of_activities=ask_int("Number of Extra-Curricular Activities: "),
        completed_projects=ask_int("Number of Completed Projects: "),
        github_or_deployed=ask_text(
            "Published projects on GitHub or deployed online? (Yes/No): "
        ),
        internship_experience=ask_text("Internship Experience (Yes/No): "),
        networking_or_referral=ask_text(
            "Was the job obtained through networking or referral? (Yes/No): "
        ),
        skill_courses=ask_int(
            "How many skill development courses outside curriculum: "
        ),
        job_aligns_with_education=ask_text(
            "Does your employment align with educational background? (Yes/No): "
        ),
    )


def main() -> None:
    csv_path = Path("student_employability_60_40.csv")
    if not csv_path.exists():
        raise FileNotFoundError(
            f"Dataset not found: {csv_path.resolve()}.\n"
            "Put 'student_employability_60_40.csv' in the project root."
        )

    df = pd.read_csv(csv_path)

    missing = [c for c in FEATURE_COLUMNS + [TARGET_COLUMN] if c not in df.columns]
    if missing:
        raise ValueError(
            "Dataset is missing required columns:\n- " + "\n- ".join(missing)
        )

    model_df = df[FEATURE_COLUMNS + [TARGET_COLUMN]].copy()
    model_df[TARGET_COLUMN] = model_df[TARGET_COLUMN].apply(normalize_target)

    pipeline = build_pipeline(model_df)
    pipeline.fit(model_df[FEATURE_COLUMNS], model_df[TARGET_COLUMN])

    user = collect_user_input()
    sample = pd.DataFrame([user.to_feature_row()])

    prediction = int(pipeline.predict(sample)[0])
    probability = float(pipeline.predict_proba(sample)[0][1])

    status = "Got a Job" if prediction == 1 else "Did Not Get a Job"
    print("\nPrediction Result")
    print("-" * 40)
    print(f"Predicted Job Outcome: {status}")
    print(f"Confidence (Got a Job): {probability:.2%}")


if __name__ == "__main__":
    main()
