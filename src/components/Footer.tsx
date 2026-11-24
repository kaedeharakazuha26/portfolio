import { Mail } from 'lucide-react';
import { PORTFOLIO_CONFIG } from '../data/config';
import { GithubIcon, LinkedinIcon, XIcon } from './SocialIcons';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative z-20 border-t border-slate-900/15 bg-[#eef2f7] dark:border-white/12 dark:bg-[#05070e]">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-5 py-6 text-xs text-slate-600 dark:text-slate-400 sm:flex-row sm:px-8">
        <div>
          <p className="font-medium text-slate-900 dark:text-slate-100">
            © {year} {PORTFOLIO_CONFIG.fullName}. All rights reserved.
          </p>
          <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-400">
            {PORTFOLIO_CONFIG.footerTagline}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={PORTFOLIO_CONFIG.socials.github}
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub profile"
            className="flex h-11 w-11 items-center justify-center rounded-lg border border-slate-900/20 text-slate-800 transition-colors hover:border-slate-900/50 hover:text-slate-950 dark:border-white/20 dark:text-slate-200 dark:hover:border-white/45 dark:hover:text-white"
          >
            <GithubIcon className="h-4 w-4" />
          </a>
          <a
            href={PORTFOLIO_CONFIG.socials.linkedin}
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn profile"
            className="flex h-11 w-11 items-center justify-center rounded-lg border border-slate-900/20 text-slate-800 transition-colors hover:border-slate-900/50 hover:text-slate-950 dark:border-white/20 dark:text-slate-200 dark:hover:border-white/45 dark:hover:text-white"
          >
            <LinkedinIcon className="h-4 w-4" />
          </a>
          {PORTFOLIO_CONFIG.socials.twitter && (
            <a
              href={PORTFOLIO_CONFIG.socials.twitter}
              target="_blank"
              rel="noreferrer"
              aria-label="X / Twitter profile"
              className="flex h-11 w-11 items-center justify-center rounded-lg border border-slate-900/20 text-slate-800 transition-colors hover:border-slate-900/50 hover:text-slate-950 dark:border-white/20 dark:text-slate-200 dark:hover:border-white/45 dark:hover:text-white"
            >
              <XIcon className="h-4 w-4" />
            </a>
          )}
          {PORTFOLIO_CONFIG.email && (
            <a
              href={`mailto:${PORTFOLIO_CONFIG.email}`}
              aria-label="Send email"
              className="flex h-11 w-11 items-center justify-center rounded-lg border border-slate-900/20 text-slate-800 transition-colors hover:border-slate-900/50 hover:text-slate-950 dark:border-white/20 dark:text-slate-200 dark:hover:border-white/45 dark:hover:text-white"
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
            className="inline-flex min-h-11 items-center rounded-lg px-2 text-slate-700 transition-colors hover:text-slate-950 dark:text-slate-300 dark:hover:text-white"
          >
            Source
          </a>
          <a
            href="#hero"
            className="inline-flex min-h-11 items-center rounded-lg px-2 text-slate-700 transition-colors hover:text-slate-950 dark:text-slate-300 dark:hover:text-white"
          >
            Back to top
          </a>
        </div>
      </div>
    </footer>
  );
}
