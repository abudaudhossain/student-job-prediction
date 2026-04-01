import { AboutUsSection } from "./about-us-section";
import { HeroSection } from "./hero-section";
import { OpenPredictionModalButton } from "./open-prediction-modal-button";

export function LandingSections() {
  return (
    <>
      <HeroSection />

      <AboutUsSection />

      <section className="mt-8 rounded-xl border border-emerald-200 bg-emerald-50 p-5 dark:border-emerald-900 dark:bg-emerald-950/40">
        <h2 className="text-lg font-semibold text-emerald-800 dark:text-emerald-300">
          Related Insights
        </h2>
        <p className="mt-2 text-sm leading-6 text-emerald-900/90 dark:text-emerald-200">
          Placement outcomes are influenced by a combination of academics, consistent
          skills practice, project depth, and professional exposure. Use this tool as a
          benchmark, then focus on improving the areas that matter most.
        </p>
        <OpenPredictionModalButton className="mt-4 rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-600 dark:bg-emerald-800 dark:hover:bg-emerald-700">
          Open prediction form
        </OpenPredictionModalButton>
      </section>
    </>
  );
}
