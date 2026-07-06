import Image from "next/image";

const aboutImage = {
  src: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=1200&q=80",
  alt: "Students discussing career planning and academic goals",
};

export function AboutUsSection() {
  return (
    <section
      id="about-us"
      className="mt-10 rounded-2xl border border-zinc-200 bg-zinc-50/80 p-6 dark:border-zinc-700 dark:bg-zinc-900/40 sm:p-8"
    >
      <div className="grid gap-8 lg:grid-cols-2 lg:items-center lg:gap-10">
        <div className="relative aspect-4/3 overflow-hidden rounded-xl border border-zinc-200 shadow-sm dark:border-zinc-600">
          <Image
            src={aboutImage.src}
            alt={aboutImage.alt}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>

        <div className="space-y-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-400">
              Project overview
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              About This System
            </h2>
            <p className="mt-3 text-sm leading-7 text-zinc-600 dark:text-zinc-300 sm:text-base">
              This AI-powered student job placement prediction system uses machine
              learning to estimate whether a student is likely to be placed based on
              academic performance, technical skills, soft skills, practical experience,
              and placement preparation activities.
            </p>
            <p className="mt-3 text-sm leading-7 text-zinc-600 dark:text-zinc-300 sm:text-base">
              The model is trained on a synthetic dataset of 50,000 student records with
              22 feature variables, designed to simulate real-world campus recruitment
              scenarios.
            </p>
          </div>

          <div className="border-t border-zinc-200 pt-8 dark:border-zinc-700">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              Project objectives
            </h3>
            <ul className="mt-3 space-y-2 text-sm leading-7 text-zinc-600 dark:text-zinc-300 sm:text-base">
              <li>• Analyze how academic, technical, and behavioral factors affect employability</li>
              <li>• Train and evaluate machine learning models for placement prediction</li>
              <li>• Identify the most important features influencing placement outcomes</li>
              <li>• Help students understand skill gaps and improve placement preparation</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
