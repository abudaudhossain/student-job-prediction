"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { OpenPredictionModalButton } from "./open-prediction-modal-button";

const subtitle = "Data-driven career intelligence";
const title = "Student Job Prediction";
const shortDescription =
  "Connect your academic profile, technical skills, and real-world readiness to a clear placement outlook—grounded in historical outcomes, not guesswork.";

const slides = [
  {
    src: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1920&q=80",
    alt: "Students collaborating on campus and planning careers",
  },
  {
    src: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1920&q=80",
    alt: "Developer working on a laptop with code and analytics",
  },
  {
    src: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=1920&q=80",
    alt: "Professional interview and career conversation",
  },
] as const;

export function HeroSection() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setActive((i) => (i + 1) % slides.length);
    }, 6000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <section
      className="relative overflow-hidden rounded-2xl border border-zinc-200/80 shadow-lg dark:border-zinc-700/80"
      aria-label="Hero"
    >
      <div className="absolute inset-0">
        {slides.map((slide, index) => (
          <div
            key={slide.src}
            className={`absolute inset-0 transition-opacity duration-1000 ease-out ${
              index === active ? "opacity-100" : "opacity-0"
            }`}
            aria-hidden={index !== active}
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              priority={index === 0}
              sizes="100vw"
              className="object-cover"
            />
          </div>
        ))}
        <div
          className="absolute inset-0 bg-linear-to-br from-zinc-950/92 via-blue-950/75 to-indigo-950/65"
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(59,130,246,0.15),transparent_50%)]"
          aria-hidden
        />
      </div>

      <div className="relative z-10 px-6 py-14 sm:px-10 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-2xl">
          <p className="inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-100 backdrop-blur-sm">
            {subtitle}
          </p>
          <h1 className="mt-5 text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
            {title}
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-7 text-zinc-200 sm:text-base">
            {shortDescription}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <OpenPredictionModalButton className="rounded-lg bg-blue-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-900/30 transition hover:bg-blue-400">
              Start Prediction
            </OpenPredictionModalButton>
            <a
              href="#about-us"
              className="rounded-lg border border-white/25 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
            >
              Learn More
            </a>
          </div>
        </div>
      </div>

      <div className="relative z-10 flex items-center justify-center gap-2 pb-6">
        {slides.map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => setActive(index)}
            className={`h-2 rounded-full transition-all ${
              index === active
                ? "w-8 bg-white"
                : "w-2 bg-white/40 hover:bg-white/60"
            }`}
            aria-label={`Show slide ${index + 1}`}
            aria-current={index === active}
          />
        ))}
      </div>
    </section>
  );
}
