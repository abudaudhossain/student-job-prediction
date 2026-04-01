import { HeroSection } from "./hero-section";

export function LandingSections() {
  return (
    <>
      <HeroSection />

      <section id="about-us" className="mt-8 grid gap-4 sm:grid-cols-2">
        <article className="rounded-xl border border-zinc-200 bg-zinc-50 p-5 dark:border-zinc-700 dark:bg-zinc-800/50">
          <h2 className="text-lg font-semibold">About Us</h2>
          <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
            We are focused on helping students and educators make informed career
            decisions through practical data analysis and transparent outcomes.
          </p>
        </article>
        <article className="rounded-xl border border-zinc-200 bg-zinc-50 p-5 dark:border-zinc-700 dark:bg-zinc-800/50">
          <h2 className="text-lg font-semibold">Our Goal</h2>
          <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
            Our goal is to identify strengths and gaps early so students can improve
            interview readiness, build strong portfolios, and increase job success.
          </p>
        </article>
      </section>

      <section className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-5 dark:border-emerald-900 dark:bg-emerald-950/40">
        <h2 className="text-lg font-semibold text-emerald-800 dark:text-emerald-300">
          Related Insights
        </h2>
        <p className="mt-2 text-sm leading-6 text-emerald-900/90 dark:text-emerald-200">
          Placement outcomes are influenced by a combination of academics, consistent
          skills practice, project depth, and professional exposure. Use this tool as a
          benchmark, then focus on improving the areas that matter most.
        </p>
      </section>
    </>
  );
}
