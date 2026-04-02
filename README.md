# Student Job Prediction

This project predicts student job outcome from your employability dataset:

- `Got a Job`
- `Did Not Get a Job`

The web app calls your hosted prediction API from the browser (see `NEXT_PUBLIC_PREDICT_API_URL` in `prediction-form.tsx`).

## Run web app (Next.js form, no Python)

Start the web UI:

```powershell
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000), fill the form, and click **Predict**.

The form POSTs JSON to the external `/predict` endpoint with the field names your server expects.



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
