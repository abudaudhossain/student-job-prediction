import Link from "next/link";
import { NavbarPredictButton } from "./navbar-predict-button";

const navLinks = [
  { href: "/#how-it-works", label: "How it works" },
  { href: "/#about-us", label: "About" },
  { href: "/#profile-to-prediction", label: "Model & stats" },
] as const;

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200/80 bg-white/85 backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-950/85">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:h-16 sm:px-6">
        <Link
          href="/"
          className="shrink-0 text-sm font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-base"
        >
          Student Job Prediction
        </Link>
        <nav
          className="flex max-w-[min(100%,28rem)] flex-1 items-center justify-end gap-1 overflow-x-auto sm:gap-2"
          aria-label="Primary"
        >
          {navLinks.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className="whitespace-nowrap rounded-lg px-2.5 py-1.5 text-xs font-medium text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100 sm:px-3 sm:text-sm"
            >
              {label}
            </a>
          ))}
          <NavbarPredictButton />
        </nav>
      </div>
    </header>
  );
}
