import Link from "next/link";

const footerLinks = [
  { href: "/#how-it-works", label: "How it works" },
  { href: "/#about-us", label: "About" },
  { href: "/#prediction-form", label: "Start prediction" },
] as const;

export function Footer() {
  return (
    <footer className="mt-auto border-t border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950/80">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-md">
            <Link
              href="/"
              className="text-sm font-semibold text-zinc-900 dark:text-zinc-100"
            >
              Student Job Prediction
            </Link>
            <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
              Employability insights from your profile—compare against historical
              outcomes and plan your next steps with clarity.
            </p>
          </div>
          <nav aria-label="Footer">
            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-500">
              Quick links
            </p>
            <ul className="mt-3 flex flex-col gap-2 sm:items-end">
              {footerLinks.map(({ href, label }) => (
                <li key={href}>
                  <a
                    href={href}
                    className="text-sm text-zinc-600 transition hover:text-blue-600 dark:text-zinc-400 dark:hover:text-blue-400"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <p className="mt-8 border-t border-zinc-200 pt-6 text-center text-xs text-zinc-500 dark:border-zinc-800 dark:text-zinc-500">
          © {new Date().getFullYear()} Student Job Prediction. Built for learning and
          career planning.
        </p>
      </div>
    </footer>
  );
}
