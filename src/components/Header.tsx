import { useEffect, useState } from 'react';
import {
  AnimatePresence,
  motion,
  useScroll,
  useSpring,
} from 'framer-motion';
import {
  Award,
  Box,
  Briefcase,
  FolderKanban,
  Home,
  Mail,
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
import { FloatingDock, type DockItem } from './FloatingDock';

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
  { id: 'hero', label: 'Home', href: '#hero', icon: <Home className="h-4 w-4" /> },
  { id: 'projects', label: 'Projects', href: '#projects', icon: <FolderKanban className="h-4 w-4" /> },
  { id: 'skills', label: '3D Cube', href: '#skills', icon: <Box className="h-4 w-4" /> },
  { id: 'certifications', label: 'Certs', href: '#certifications', icon: <Award className="h-4 w-4" /> },
  { id: 'experience', label: 'Journey', href: '#experience', icon: <Briefcase className="h-4 w-4" /> },
  { id: 'contact', label: 'Contact', href: '#contact', icon: <Mail className="h-4 w-4" /> },
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 28,
    restDelta: 0.001,
  });

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const dockItems: DockItem[] = NAV_ITEMS.map((item) => ({
    id: item.id,
    label: item.label,
    href: item.href,
    active: activeSection === item.id,
    icon: item.icon,
  }));

  return (
    <>
      {/* Glass surface 1 of 2: slim top control rail with live scroll progress hairline */}
      <header className="fixed inset-x-0 top-0 z-40 border-b border-zinc-900/12 bg-[#f5f4f0]/90 backdrop-blur-md transition-colors dark:border-white/10 dark:bg-[#09090b]/85">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-2 px-4 sm:px-8">
          <div className="flex items-center gap-3">
            <a
              href="#hero"
              onClick={() => setMobileMenuOpen(false)}
              className="flex min-h-11 items-center gap-2.5 rounded-lg px-1 text-sm font-semibold tracking-tight text-zinc-950 transition-opacity hover:opacity-80 dark:text-white"
            >
              <span
                aria-hidden="true"
                className="grid grid-cols-2 gap-[2px] rounded bg-zinc-900/10 p-1 dark:bg-white/10"
              >
                <span className="h-1.5 w-1.5 rounded-[1px] bg-[#f59e0b]" />
                <span className="h-1.5 w-1.5 rounded-[1px] bg-[#1d4ed8]" />
                <span className="h-1.5 w-1.5 rounded-[1px] bg-[#15803d]" />
                <span className="h-1.5 w-1.5 rounded-[1px] bg-[#c2410c]" />
              </span>
              <span className="font-mono">{PORTFOLIO_CONFIG.brandMark}</span>
            </a>

            <span className="hidden items-center gap-1.5 font-mono text-xs text-emerald-700 dark:text-emerald-400 xl:inline-flex">
              <span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden="true" />
              {PORTFOLIO_CONFIG.availability}
            </span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={onToggleReducedMotion}
              aria-pressed={reducedMotion}
              aria-label={reducedMotion ? 'Resume 3D and motion' : 'Pause 3D and motion'}
              title={reducedMotion ? 'Resume 3D and motion' : 'Pause 3D and motion'}
              className={`flex h-11 w-11 items-center justify-center rounded-lg border transition-colors ${
                reducedMotion
                  ? 'border-amber-500 bg-amber-500 text-[#09090b]'
                  : 'border-zinc-900/18 bg-white text-zinc-800 hover:border-zinc-900/45 dark:border-white/16 dark:bg-[#121318] dark:text-zinc-200 dark:hover:border-white/40'
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
              className="flex h-11 w-11 items-center justify-center rounded-lg border border-zinc-900/18 bg-white text-zinc-800 transition-colors hover:border-zinc-900/45 dark:border-white/16 dark:bg-[#121318] dark:text-zinc-200 dark:hover:border-white/40"
            >
              {soundOn ? (
                <Volume2 className="h-4 w-4" aria-hidden="true" />
              ) : (
                <VolumeX className="h-4 w-4" aria-hidden="true" />
              )}
            </button>

            <button
              type="button"
              onClick={() => onThemeChange(theme === 'dark' ? 'light' : 'dark')}
              aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
              title={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
              className="flex h-11 w-11 items-center justify-center rounded-lg border border-zinc-900/18 bg-white text-zinc-800 transition-colors hover:border-zinc-900/45 dark:border-white/16 dark:bg-[#121318] dark:text-zinc-200 dark:hover:border-white/40"
            >
              {theme === 'dark' ? (
                <Sun className="h-4 w-4 text-amber-400" aria-hidden="true" />
              ) : (
                <Moon className="h-4 w-4" aria-hidden="true" />
              )}
            </button>

            {/* Mobile menu trigger (desktop uses the bottom spring FloatingDock) */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-expanded={mobileMenuOpen}
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              className="flex h-11 items-center gap-2 rounded-lg border border-zinc-900/18 bg-white px-3.5 text-xs font-semibold text-zinc-950 transition-colors hover:border-zinc-900/45 dark:border-white/16 dark:bg-[#121318] dark:text-white dark:hover:border-white/40 md:hidden"
            >
              <span>{mobileMenuOpen ? 'Close' : 'Menu'}</span>
              {mobileMenuOpen ? (
                <X className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Menu className="h-4 w-4" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Scroll-linked progress hairline */}
        <motion.div
          aria-hidden="true"
          style={{ scaleX: reducedMotion ? scrollYProgress : smoothProgress }}
          className="h-[2px] origin-left bg-amber-600 dark:bg-amber-400"
        />
      </header>

      {/* Desktop bottom-center spring Floating Navigation Dock */}
      <div
        data-ui-block="true"
        className="pointer-events-none fixed inset-x-0 bottom-5 z-40 hidden justify-center md:flex"
      >
        <div className="pointer-events-auto">
          <FloatingDock
            items={dockItems}
            reducedMotion={reducedMotion}
            ariaLabel="Primary navigation"
          />
        </div>
      </div>

      {/* Mobile slide-down drawer menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              key="mobile-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 z-30 bg-black/55 md:hidden"
            />
            <motion.nav
              key="mobile-panel"
              aria-label="Mobile navigation"
              initial={{ y: '-100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '-100%', opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              data-ui-block="true"
              className="fixed inset-x-0 top-16 z-30 border-b border-zinc-900/15 bg-[#f5f4f0] px-5 py-6 shadow-xl dark:border-white/14 dark:bg-[#111217] md:hidden"
            >
              <ul className="space-y-1.5">
                {NAV_ITEMS.map((item) => {
                  const active = activeSection === item.id;
                  return (
                    <li key={item.id}>
                      <a
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex min-h-11 items-center gap-3 rounded-lg px-3 font-display text-xl font-bold transition-colors ${
                          active
                            ? 'bg-amber-500 text-[#09090b]'
                            : 'text-zinc-800 hover:bg-zinc-900/5 dark:text-zinc-200 dark:hover:bg-white/5'
                        }`}
                      >
                        <span aria-hidden="true">{item.icon}</span>
                        <span>{item.label}</span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
