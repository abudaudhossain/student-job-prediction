# Student Job Prediction

This project predicts student job outcome from your employability dataset:

- `Got a Job`
- `Did Not Get a Job`

The web app prediction runs fully in Next.js (no Python required for web usage).

## Files added

- `student_job_predictor.py` - train + interactive prediction script
- `requirements.txt` - Python dependencies

## Dataset required

Place your CSV file in the project root with this exact name:

`student_employability_60_40.csv`

## Run locally (Windows PowerShell)

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python .\student_job_predictor.py
```

## Run web app (Next.js form, no Python)

Start the web UI:

```powershell
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000), fill the form, and click **Predict**.

The API route `app/api/predict/route.ts` loads `student_employability_60_40.csv`, uses nearest-neighbor matching, and returns prediction JSON.

Then enter these values when prompted:

- Age
- Gender
- Department
- CGPA
- Programming Languages You Know
- Approximate Number of Problems Solved on Online Judge Platforms
- Self-Rated Technical Skill Level (0-5)
- Communication Skill Level (0-5)
- Real-World Problem Solving Ability (0-5)
- Teamwork Ability (0-5)
- Extra-curricular or technical activities
- Number of Extra-Curricular Activities
- Number of Completed Projects
- Published projects on GitHub/deployed online (Yes/No)
- Internship Experience (Yes/No)
- Networking/referral (Yes/No)
- Skill-development courses outside curriculum
- Employment aligned with educational background (Yes/No)

## Output

The script prints:

- Predicted job outcome (`Got a Job` or `Did Not Get a Job`)
- Confidence score for `Got a Job`
