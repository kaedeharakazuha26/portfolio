import { motion } from 'framer-motion';
import { RotateCw, Shuffle } from 'lucide-react';
import { PORTFOLIO_CONFIG } from '../data/config';
import { GithubIcon, LinkedinIcon } from './SocialIcons';

interface HeroSectionProps {
  onQuickTwist: () => void;
  onQuickScramble: () => void;
  reducedMotion: boolean;
}

export function HeroSection({
  onQuickTwist,
  onQuickScramble,
  reducedMotion,
}: HeroSectionProps) {
  return (
    <section
      id="hero"
      className="relative z-20 flex min-h-[100dvh] flex-col justify-start px-5 pb-16 pt-20 sm:justify-center sm:px-8 sm:pb-24 sm:pt-24"
    >
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-6 lg:grid-cols-12 lg:gap-10">
        {/* Left stage reserved cleanly for the 3D Rubik's Cube centerpiece on desktop */}
        <div
          className="order-2 h-64 lg:order-1 lg:col-span-6 lg:h-[460px]"
          aria-hidden="true"
        />

        {/* Right sculptural editorial identity (reversed silhouette from reference site) */}
        <motion.div
          initial={reducedMotion ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="order-1 lg:order-2 lg:col-span-6"
        >
          <p className="font-mono text-xs font-medium tracking-wider text-amber-700 dark:text-amber-400">
            {PORTFOLIO_CONFIG.role}
          </p>

          <h1 className="font-display mt-3 text-4xl font-extrabold leading-[1.02] tracking-tight text-zinc-950 dark:text-white sm:text-6xl xl:text-[4.5rem]">
            <span className="block">{PORTFOLIO_CONFIG.firstName}</span>
            <span className="block text-amber-700 dark:text-amber-400">
              {PORTFOLIO_CONFIG.lastName}
            </span>
          </h1>

          <p className="mt-5 max-w-lg text-base leading-relaxed text-zinc-600 dark:text-zinc-400 sm:text-lg">
            {PORTFOLIO_CONFIG.bio}
          </p>

          {/* Interactive cube & backdrop control strip right in Hero */}
          {!reducedMotion && (
            <div className="mt-6 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={onQuickTwist}
                className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-zinc-900/18 bg-white px-3.5 font-mono text-xs font-semibold text-zinc-900 transition-colors hover:border-amber-600 dark:border-white/16 dark:bg-[#121318] dark:text-zinc-100 dark:hover:border-amber-400"
              >
                <RotateCw className="h-3.5 w-3.5 text-amber-700 dark:text-amber-400" aria-hidden="true" />
                <span>Twist Cube</span>
              </button>

              <button
                type="button"
                onClick={onQuickScramble}
                className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-zinc-900/18 bg-white px-3.5 font-mono text-xs font-semibold text-zinc-900 transition-colors hover:border-amber-600 dark:border-white/16 dark:bg-[#121318] dark:text-zinc-100 dark:hover:border-amber-400"
              >
                <Shuffle className="h-3.5 w-3.5 text-cyan-700 dark:text-cyan-400" aria-hidden="true" />
                <span>Scramble</span>
              </button>
            </div>
          )}

          {/* Primary CTAs and Socials */}
          <div className="mt-6 flex flex-wrap items-center gap-2 sm:mt-7 sm:gap-3">
            <a
              href="#projects"
              className="inline-flex h-11 items-center justify-center rounded-lg bg-amber-700 px-3.5 text-sm font-semibold text-white transition-colors hover:bg-amber-800 dark:bg-amber-500 dark:text-[#09090b] dark:hover:bg-amber-400 sm:h-12 sm:px-6"
            >
              View Projects
            </a>

            <a
              href="#contact"
              className="inline-flex h-11 items-center justify-center rounded-lg border border-zinc-900/20 bg-white px-3 text-sm font-semibold text-zinc-950 transition-colors hover:border-zinc-900/50 dark:border-white/18 dark:bg-[#121318] dark:text-white dark:hover:border-white/45 sm:h-12 sm:px-5"
            >
              Contact Me
            </a>

            <a
              href={PORTFOLIO_CONFIG.socials.github}
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub profile"
              className="flex h-11 w-11 items-center justify-center rounded-lg border border-zinc-900/20 bg-white text-zinc-950 transition-colors hover:border-zinc-900/50 dark:border-white/18 dark:bg-[#121318] dark:text-white dark:hover:border-white/45 sm:h-12 sm:w-12"
            >
              <GithubIcon className="h-4 w-4" />
            </a>

            <a
              href={PORTFOLIO_CONFIG.socials.linkedin}
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn profile"
              className="flex h-11 w-11 items-center justify-center rounded-lg border border-zinc-900/20 bg-white text-zinc-950 transition-colors hover:border-zinc-900/50 dark:border-white/18 dark:bg-[#121318] dark:text-white dark:hover:border-white/45 sm:h-12 sm:w-12"
            >
              <LinkedinIcon className="h-4 w-4" />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
