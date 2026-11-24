import { useState } from 'react';
import { motion } from 'framer-motion';
import { RotateCw } from 'lucide-react';
import { PORTFOLIO_CONFIG } from '../data/config';
import { GithubIcon, LinkedinIcon, XIcon } from './SocialIcons';

interface HeroSectionProps {
  onQuickTwist: () => void;
  reducedMotion: boolean;
}

export function HeroSection({ onQuickTwist, reducedMotion }: HeroSectionProps) {
  const [greetingTip, setGreetingTip] = useState(false);
  const [hireTip, setHireTip] = useState(false);

  return (
    <section
      id="hero"
      className="relative z-20 flex min-h-[100dvh] flex-col justify-center px-5 pb-16 pt-24 sm:px-8"
    >
      {!reducedMotion && (
        <div className="pointer-events-none absolute left-1/2 top-20 hidden -translate-x-1/2 lg:block">
          <button
            type="button"
            onClick={onQuickTwist}
            className="pointer-events-auto inline-flex min-h-11 items-center gap-2 rounded-lg border border-slate-900/20 bg-white px-4 text-xs font-medium text-slate-800 transition-colors hover:border-blue-600 hover:text-slate-950 dark:border-white/20 dark:bg-[#0a0f1c] dark:text-slate-200 dark:hover:border-blue-400 dark:hover:text-white"
          >
            <RotateCw className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" aria-hidden="true" />
            <span>Drag or twist the Rubik&apos;s Cube</span>
          </button>
        </div>
      )}

      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-10 lg:grid-cols-12">
        <motion.div
          initial={reducedMotion ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="lg:col-span-6"
        >
          <div className="relative inline-block">
            <button
              type="button"
              onClick={() => setGreetingTip((prev) => !prev)}
              onMouseEnter={() => setGreetingTip(true)}
              onMouseLeave={() => setGreetingTip(false)}
              onFocus={() => setGreetingTip(true)}
              onBlur={() => setGreetingTip(false)}
              aria-expanded={greetingTip}
              className="rounded-md py-1 text-base font-medium text-slate-600 transition-colors hover:text-slate-950 dark:text-slate-400 dark:hover:text-white sm:text-lg"
            >
              Hello, I&apos;m
            </button>
            {greetingTip && (
              <div
                role="tooltip"
                className="pointer-events-none absolute -top-11 left-0 z-30 whitespace-nowrap rounded-lg border border-slate-900/15 bg-slate-950 px-3 py-1.5 text-xs font-medium text-white dark:border-white/20 dark:bg-white dark:text-slate-950"
              >
                {PORTFOLIO_CONFIG.tooltips.greeting}
              </div>
            )}
          </div>

          <h1 className="font-display mt-1 text-4xl font-extrabold leading-[1.04] tracking-tight text-slate-950 dark:text-white sm:text-6xl xl:text-[4.6rem]">
            <span className="block">{PORTFOLIO_CONFIG.firstName}</span>
            <span className="block">{PORTFOLIO_CONFIG.lastName}</span>
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1">
            <p className="text-lg font-semibold text-slate-900 dark:text-slate-100 sm:text-xl">
              {PORTFOLIO_CONFIG.role}
            </p>
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 dark:text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden="true" />
              {PORTFOLIO_CONFIG.availability}
            </span>
          </div>

          <p className="mt-2.5 max-w-md text-sm leading-relaxed text-slate-600 dark:text-slate-400 sm:text-base">
            {PORTFOLIO_CONFIG.bio}
          </p>

          <div className="mt-7 flex max-w-xs flex-col gap-3">
            <a
              href={PORTFOLIO_CONFIG.resumeUrl}
              className="inline-flex h-12 w-full items-center justify-center rounded-lg bg-slate-950 px-6 text-sm font-semibold text-white transition-colors hover:bg-slate-800 active:bg-slate-900 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
            >
              {PORTFOLIO_CONFIG.resumeLabel}
            </a>

            <div className="flex items-center gap-2.5">
              <div className="relative flex-1">
                <a
                  href="#contact"
                  onMouseEnter={() => setHireTip(true)}
                  onMouseLeave={() => setHireTip(false)}
                  onFocus={() => setHireTip(true)}
                  onBlur={() => setHireTip(false)}
                  className="inline-flex h-11 w-full items-center justify-center rounded-lg border border-slate-900/20 bg-white px-4 text-sm font-semibold text-slate-950 transition-colors hover:border-slate-900/50 dark:border-white/20 dark:bg-[#0a0f1c] dark:text-white dark:hover:border-white/45"
                >
                  Contact Me
                </a>
                {hireTip && (
                  <div
                    role="tooltip"
                    className="pointer-events-none absolute -bottom-11 left-1/2 z-30 -translate-x-1/2 whitespace-nowrap rounded-lg border border-slate-900/15 bg-slate-950 px-3 py-1.5 text-xs font-medium text-white dark:border-white/20 dark:bg-[#0d1324]"
                  >
                    {PORTFOLIO_CONFIG.tooltips.hireMe}
                  </div>
                )}
              </div>

              {PORTFOLIO_CONFIG.socials.twitter && (
                <a
                  href={PORTFOLIO_CONFIG.socials.twitter}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="X / Twitter profile"
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-slate-900/20 bg-white text-slate-950 transition-colors hover:border-slate-900/50 dark:border-white/20 dark:bg-[#0a0f1c] dark:text-white dark:hover:border-white/45"
                >
                  <XIcon className="h-4 w-4" />
                </a>
              )}

              <a
                href={PORTFOLIO_CONFIG.socials.github}
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub profile"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-slate-900/20 bg-white text-slate-950 transition-colors hover:border-slate-900/50 dark:border-white/20 dark:bg-[#0a0f1c] dark:text-white dark:hover:border-white/45"
              >
                <GithubIcon className="h-4 w-4" />
              </a>

              <a
                href={PORTFOLIO_CONFIG.socials.linkedin}
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn profile"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-slate-900/20 bg-white text-slate-950 transition-colors hover:border-slate-900/50 dark:border-white/20 dark:bg-[#0a0f1c] dark:text-white dark:hover:border-white/45"
              >
                <LinkedinIcon className="h-4 w-4" />
              </a>
            </div>
          </div>
        </motion.div>

        <div className="h-56 lg:col-span-6 lg:h-[440px]" aria-hidden="true" />
      </div>

      <a
        href="#skills"
        className="absolute bottom-6 left-1/2 inline-flex min-h-11 -translate-x-1/2 items-center gap-2 rounded-lg px-3 font-mono text-xs text-slate-600 transition-colors hover:text-slate-950 dark:text-slate-400 dark:hover:text-white"
      >
        <span>Scroll to Tech Stack</span>
      </a>
    </section>
  );
}
