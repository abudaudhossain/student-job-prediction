import { HowItWorksSection } from "./components/how-it-works-section";
import { LandingSections } from "./components/landing-sections";
import { ProfileToPredictionSection } from "./components/profile-to-prediction-section";
import { PredictionForm } from "./components/prediction-form";

export default function Home() {
  return (
    <div className="min-h-screen bg-linear-to-b from-zinc-100 to-zinc-200 px-4 py-10 text-zinc-900 dark:from-zinc-950 dark:to-zinc-900 dark:text-zinc-100">
      <main className="mx-auto w-full max-w-5xl rounded-2xl border border-zinc-200 bg-white p-6 shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
        <LandingSections />
        <HowItWorksSection />
        <ProfileToPredictionSection />
        <PredictionForm />
      </main>
    </div>
  );
}
