import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Menu,
  Moon,
  Pause,
  Play,
  Sun,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react';
import { PORTFOLIO_CONFIG } from '../data/config';
import { GithubIcon } from './SocialIcons';

interface HeaderProps {
  theme: 'dark' | 'light';
  onThemeChange: (next: 'dark' | 'light') => void;
  soundOn: boolean;
  onToggleSound: () => void;
  reducedMotion: boolean;
  onToggleReducedMotion: () => void;
  activeSection: string;
}

const NAV_ITEMS = [
  { id: 'hero', label: 'HOME', href: '#hero' },
  { id: 'skills', label: 'SKILLS', href: '#skills' },
  { id: 'experience', label: 'EXPERIENCE', href: '#experience' },
  { id: 'certifications', label: 'CERTIFICATIONS', href: '#certifications' },
  { id: 'projects', label: 'PROJECTS', href: '#projects' },
  { id: 'contact', label: 'CONTACT', href: '#contact' },
];

export function Header({
  theme,
  onThemeChange,
  soundOn,
  onToggleSound,
  reducedMotion,
  onToggleReducedMotion,
  activeSection,
}: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [lightConfirmOpen, setLightConfirmOpen] = useState(false);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMenuOpen(false);
        setLightConfirmOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const handleThemeClick = () => {
    if (theme === 'dark') {
      setLightConfirmOpen((prev) => !prev);
    } else {
      setLightConfirmOpen(false);
      onThemeChange('dark');
    }
  };

  return (
    <>
      {/* Glass surface 1 of 2: fixed header lets scrolled 3D canvas pass smoothly underneath */}
      <header className="fixed inset-x-0 top-0 z-40 border-b border-slate-900/15 bg-[#eef2f7]/90 backdrop-blur-md transition-colors dark:border-white/12 dark:bg-[#05070e]/85">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-2 px-4 sm:px-8">
          <a
            href="#hero"
            onClick={() => setMenuOpen(false)}
            className="flex min-h-11 items-center gap-2.5 rounded-lg px-1 text-sm font-semibold tracking-tight text-slate-950 transition-opacity hover:opacity-80 dark:text-white"
          >
            <span
              aria-hidden="true"
              className="grid grid-cols-2 gap-[2px] rounded bg-slate-900/10 p-1 dark:bg-white/10"
            >
              <span className="h-1.5 w-1.5 rounded-[1px] bg-[#1d4ed8]" />
              <span className="h-1.5 w-1.5 rounded-[1px] bg-[#c2410c]" />
              <span className="h-1.5 w-1.5 rounded-[1px] bg-[#15803d]" />
              <span className="h-1.5 w-1.5 rounded-[1px] bg-[#eab308]" />
            </span>
            <span className="font-mono">{PORTFOLIO_CONFIG.brandMark}</span>
          </a>

          <div className="relative flex items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={onToggleReducedMotion}
              aria-pressed={reducedMotion}
              aria-label={reducedMotion ? 'Resume 3D and motion' : 'Pause 3D and motion'}
              title={reducedMotion ? 'Resume 3D and motion' : 'Pause 3D and motion'}
              className={`flex h-11 w-11 items-center justify-center rounded-lg border transition-colors ${
                reducedMotion
                  ? 'border-blue-600 bg-blue-600 text-white'
                  : 'border-slate-900/20 bg-white text-slate-800 hover:border-slate-900/45 dark:border-white/20 dark:bg-[#0a0f1c] dark:text-slate-200 dark:hover:border-white/40'
              }`}
            >
              {reducedMotion ? (
                <Play className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Pause className="h-4 w-4" aria-hidden="true" />
              )}
            </button>

            <button
              type="button"
              onClick={onToggleSound}
              aria-pressed={soundOn}
              aria-label={soundOn ? 'Mute cube click sounds' : 'Unmute cube click sounds'}
              title={soundOn ? 'Cube SFX: On' : 'Cube SFX: Muted'}
              className="flex h-11 w-11 items-center justify-center rounded-lg border border-slate-900/20 bg-white text-slate-800 transition-colors hover:border-slate-900/45 dark:border-white/20 dark:bg-[#0a0f1c] dark:text-slate-200 dark:hover:border-white/40"
            >
              {soundOn ? (
                <Volume2 className="h-4 w-4" aria-hidden="true" />
              ) : (
                <VolumeX className="h-4 w-4" aria-hidden="true" />
              )}
            </button>

            <div className="relative">
              <button
                type="button"
                onClick={handleThemeClick}
                aria-expanded={lightConfirmOpen}
                aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
                className="flex h-11 w-11 items-center justify-center rounded-lg border border-slate-900/20 bg-white text-slate-800 transition-colors hover:border-slate-900/45 dark:border-white/20 dark:bg-[#0a0f1c] dark:text-slate-200 dark:hover:border-white/40"
              >
                {theme === 'dark' ? (
                  <Moon className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <Sun className="h-4 w-4 text-amber-600" aria-hidden="true" />
                )}
              </button>

              <AnimatePresence>
                {lightConfirmOpen && theme === 'dark' && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    transition={{ duration: 0.14 }}
                    data-ui-block="true"
                    className="absolute right-0 top-14 z-50 w-64 rounded-xl border border-white/20 bg-[#0a0f1c] p-4 text-left shadow-xl"
                  >
                    <p className="text-xs leading-relaxed text-slate-200">
                      {PORTFOLIO_CONFIG.lightModeWarning}
                    </p>
                    <div className="mt-3 flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setLightConfirmOpen(false)}
                        className="min-h-11 rounded-lg px-3 text-xs font-medium text-slate-300 transition-colors hover:text-white"
                      >
                        Stay Dark
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setLightConfirmOpen(false);
                          onThemeChange('light');
                        }}
                        className="min-h-11 rounded-lg bg-white px-3.5 text-xs font-semibold text-slate-950 transition-colors hover:bg-slate-200"
                      >
                        Go Light
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <a
              href={PORTFOLIO_CONFIG.repoUrl}
              target="_blank"
              rel="noreferrer"
              className="hidden h-11 items-center gap-2 rounded-lg border border-slate-900/20 bg-white px-3.5 font-mono text-xs font-medium text-slate-900 transition-colors hover:border-slate-900/45 dark:border-white/20 dark:bg-[#0a0f1c] dark:text-slate-100 dark:hover:border-white/40 md:flex"
            >
              <GithubIcon className="h-4 w-4" />
              <span>{PORTFOLIO_CONFIG.githubHandle}</span>
            </a>

            <button
              type="button"
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-expanded={menuOpen}
              aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              className="flex h-11 items-center gap-2 rounded-lg border border-slate-900/20 bg-white px-3.5 text-xs font-semibold text-slate-950 transition-colors hover:border-slate-900/45 dark:border-white/20 dark:bg-[#0a0f1c] dark:text-white dark:hover:border-white/40"
            >
              <span>{menuOpen ? 'Close' : 'Menu'}</span>
              {menuOpen ? (
                <X className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Menu className="h-4 w-4" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              key="menu-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 z-30 bg-black/55"
            />
            <motion.nav
              key="menu-panel"
              aria-label="Primary navigation"
              initial={{ y: '-100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '-100%', opacity: 0 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              data-ui-block="true"
              className="fixed inset-x-0 top-16 z-30 border-b border-slate-900/15 bg-[#eef2f7] px-5 py-7 shadow-xl dark:border-white/15 dark:bg-[#070b15] sm:px-10 sm:py-10"
            >
              <div className="mx-auto flex max-w-6xl flex-col justify-between gap-8 md:flex-row md:items-end">
                <ul className="flex flex-col gap-1.5 sm:gap-2.5">
                  {NAV_ITEMS.map((item, idx) => {
                    const isActive = activeSection === item.id;
                    return (
                      <li key={item.id}>
                        <a
                          href={item.href}
                          onClick={() => setMenuOpen(false)}
                          className={`font-display inline-flex min-h-11 items-baseline gap-3 rounded-lg px-1 text-2xl font-extrabold tracking-tight transition-colors sm:text-5xl ${
                            isActive
                              ? 'text-blue-700 underline decoration-2 underline-offset-8 dark:text-white'
                              : 'text-slate-600 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white'
                          }`}
                        >
                          <span className="font-mono text-xs font-medium">
                            0{idx + 1}
                          </span>
                          <span>{item.label}</span>
                        </a>
                      </li>
                    );
                  })}
                </ul>

                <div className="flex flex-col items-start gap-3 md:items-end">
                  <p className="max-w-xs text-xs leading-relaxed text-slate-600 dark:text-slate-400 md:text-right">
                    Drag the Rubik&apos;s Cube to inspect faces, click stickers for skill details,
                    or press U, D, L, R, F, B in Tech Stack.
                  </p>
                  <button
                    type="button"
                    onClick={onToggleReducedMotion}
                    aria-pressed={reducedMotion}
                    className={`inline-flex min-h-11 items-center gap-2 rounded-lg border px-4 text-xs font-semibold transition-colors ${
                      reducedMotion
                        ? 'border-blue-600 bg-blue-600 text-white'
                        : 'border-slate-900/20 bg-white text-slate-800 hover:border-slate-900/45 dark:border-white/20 dark:bg-[#0a0f1c] dark:text-slate-200 dark:hover:border-white/40'
                    }`}
                  >
                    {reducedMotion ? (
                      <Play className="h-3.5 w-3.5" aria-hidden="true" />
                    ) : (
                      <Pause className="h-3.5 w-3.5" aria-hidden="true" />
                    )}
                    <span>
                      {reducedMotion
                        ? '3D and motion paused (resume)'
                        : 'Pause 3D and motion'}
                    </span>
                  </button>
                </div>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
