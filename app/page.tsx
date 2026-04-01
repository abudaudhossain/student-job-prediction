import { HowItWorksSection } from "./components/how-it-works-section";
import { LandingSections } from "./components/landing-sections";
import { ProfileToPredictionSection } from "./components/profile-to-prediction-section";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-linear-to-b from-zinc-100 to-zinc-200 px-4 py-8 text-zinc-900 dark:from-zinc-950 dark:to-zinc-900 dark:text-zinc-100 sm:py-10">
      <main className="mx-auto w-full max-w-6xl ">
        <LandingSections />
        <ProfileToPredictionSection />
        <HowItWorksSection />
      </main>
    </div>
  );
}
