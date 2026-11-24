import { Mail } from 'lucide-react';
import { PORTFOLIO_CONFIG } from '../data/config';
import { GithubIcon, LinkedinIcon } from './SocialIcons';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative z-20 border-t border-zinc-900/12 bg-[#f5f4f0] pb-24 dark:border-white/10 dark:bg-[#09090b] md:pb-28">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-5 py-7 text-xs text-zinc-600 dark:text-zinc-400 sm:flex-row sm:px-8">
        <div>
          <p className="font-medium text-zinc-900 dark:text-zinc-100">
            © {year} {PORTFOLIO_CONFIG.fullName}. All rights reserved.
          </p>
          <p className="mt-0.5 text-xs text-zinc-600 dark:text-zinc-400">
            {PORTFOLIO_CONFIG.footerTagline}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={PORTFOLIO_CONFIG.socials.github}
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub profile"
            className="flex h-11 w-11 items-center justify-center rounded-lg border border-zinc-900/18 text-zinc-800 transition-colors hover:border-amber-600 hover:text-zinc-950 dark:border-white/16 dark:text-zinc-200 dark:hover:border-amber-400 dark:hover:text-white"
          >
            <GithubIcon className="h-4 w-4" />
          </a>
          <a
            href={PORTFOLIO_CONFIG.socials.linkedin}
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn profile"
            className="flex h-11 w-11 items-center justify-center rounded-lg border border-zinc-900/18 text-zinc-800 transition-colors hover:border-amber-600 hover:text-zinc-950 dark:border-white/16 dark:text-zinc-200 dark:hover:border-amber-400 dark:hover:text-white"
          >
            <LinkedinIcon className="h-4 w-4" />
          </a>
          {PORTFOLIO_CONFIG.email && (
            <a
              href={`mailto:${PORTFOLIO_CONFIG.email}`}
              aria-label="Send email"
              className="flex h-11 w-11 items-center justify-center rounded-lg border border-zinc-900/18 text-zinc-800 transition-colors hover:border-amber-600 hover:text-zinc-950 dark:border-white/16 dark:text-zinc-200 dark:hover:border-amber-400 dark:hover:text-white"
            >
              <Mail className="h-4 w-4" aria-hidden="true" />
            </a>
          )}
        </div>

        <div className="flex items-center gap-3">
          <a
            href={PORTFOLIO_CONFIG.repoUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-11 items-center rounded-lg px-2 text-zinc-700 transition-colors hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-white"
          >
            Source
          </a>
          <a
            href="#hero"
            className="inline-flex min-h-11 items-center rounded-lg px-2 text-zinc-700 transition-colors hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-white"
          >
            Back to top
          </a>
        </div>
      </div>
    </footer>
  );
}
