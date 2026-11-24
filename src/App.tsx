import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { PORTFOLIO_CONFIG } from './data/config';
import { DEFAULT_SKILL, type CubeFaceId, type CubeSkill } from './data/skills';
import { setSoundEnabled } from './lib/sound';
import type { CubeMove } from './lib/cubeLogic';
import { StarfieldCanvas } from './components/StarfieldCanvas';
import {
  RubiksCubeCanvas,
  type RubiksCubeHandle,
} from './components/RubiksCubeCanvas';
import { Preloader } from './components/Preloader';
import { ElasticCursor } from './components/ElasticCursor';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { SkillsSection } from './components/SkillsSection';
import { ExperienceSection } from './components/ExperienceSection';
import { CertificationsSection } from './components/CertificationsSection';
import { ProjectsSection } from './components/ProjectsSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';

export function App() {
  const cubeRef = useRef<RubiksCubeHandle | null>(null);

  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    try {
      return localStorage.getItem('cubefolio-theme') === 'light' ? 'light' : 'dark';
    } catch {
      return 'dark';
    }
  });

  const [soundOn, setSoundOn] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  const [sceneReady, setSceneReady] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<CubeSkill>(DEFAULT_SKILL);
  const [hoveredSkill, setHoveredSkill] = useState<CubeSkill | null>(null);
  const [totalMoves, setTotalMoves] = useState(0);
  const [scrambledDepth, setScrambledDepth] = useState(0);
  const [activeSection, setActiveSection] = useState('hero');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimerRef = useRef<number | null>(null);

  const notify = useCallback((msg: string) => {
    setToastMessage(msg);
    if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
    toastTimerRef.current = window.setTimeout(() => setToastMessage(null), 3600);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
      localStorage.setItem('cubefolio-theme', theme);
    } catch {
      // Ignore storage errors in restricted browsing contexts.
    }
  }, [theme]);

  useEffect(() => {
    setSoundEnabled(soundOn);
  }, [soundOn]);

  useEffect(() => {
    const ids = ['hero', 'skills', 'experience', 'certifications', 'projects', 'contact'];
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) {
          setActiveSection(visible.target.id);
        }
      },
      { threshold: [0.2, 0.45, 0.7] },
    );

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    console.log(
      `%c  ■ ■ ■   ${PORTFOLIO_CONFIG.projectName} | 3D Rubik's Cube Portfolio\n  ■ ■ ■   Tip: Scroll to Tech Stack and press U D L R F B (or Shift+key).`,
      'color: #60a5fa; font-family: monospace; font-size: 12px; font-weight: bold;',
    );
  }, []);

  const handleMoveStats = useCallback((total: number, depth: number) => {
    setTotalMoves(total);
    setScrambledDepth(depth);
  }, []);

  const handleReady = useCallback(() => {
    setSceneReady(true);
  }, []);

  const handleFocusFace = useCallback((face: CubeFaceId) => {
    cubeRef.current?.focusFace(face);
  }, []);

  const handleTwistRandom = useCallback(() => {
    cubeRef.current?.twistRandom();
  }, []);

  const handleScramble = useCallback(() => {
    cubeRef.current?.scramble();
  }, []);

  const handleSolve = useCallback(() => {
    cubeRef.current?.solve();
  }, []);

  const handleKeyMove = useCallback((move: CubeMove) => {
    cubeRef.current?.enqueueMove(move);
  }, []);

  const handleContactSubmitted = useCallback(() => {
    cubeRef.current?.celebrate();
  }, []);

  const activeSkill = hoveredSkill ?? selectedSkill;

  return (
    <div className="relative min-h-[100dvh] overflow-x-clip bg-[#eef2f7] text-[#090d16] transition-colors duration-300 dark:bg-[#05070e] dark:text-white">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-blue-600 focus:px-4 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-white"
      >
        Skip to main content
      </a>

      <Preloader ready={sceneReady} />
      <ElasticCursor disabled={reducedMotion} />

      <StarfieldCanvas theme={theme} reducedMotion={reducedMotion} />

      <RubiksCubeCanvas
        ref={cubeRef}
        theme={theme}
        reducedMotion={reducedMotion}
        onHoverSkill={setHoveredSkill}
        onSelectSkill={setSelectedSkill}
        onMoveStats={handleMoveStats}
        onReady={handleReady}
      />

      <Header
        theme={theme}
        onThemeChange={setTheme}
        soundOn={soundOn}
        onToggleSound={() => setSoundOn((prev) => !prev)}
        reducedMotion={reducedMotion}
        onToggleReducedMotion={() => setReducedMotion((prev) => !prev)}
        activeSection={activeSection}
      />

      <main id="main-content">
        <HeroSection
          onQuickTwist={handleTwistRandom}
          reducedMotion={reducedMotion}
        />
        <SkillsSection
          activeSkill={activeSkill}
          totalMoves={totalMoves}
          scrambledDepth={scrambledDepth}
          reducedMotion={reducedMotion}
          onSelectSkill={setSelectedSkill}
          onFocusFace={handleFocusFace}
          onTwistRandom={handleTwistRandom}
          onScramble={handleScramble}
          onSolve={handleSolve}
          onKeyMove={handleKeyMove}
        />
        <ExperienceSection />
        <CertificationsSection />
        <ProjectsSection />
        <ContactSection
          onSubmitted={handleContactSubmitted}
          onNotify={notify}
        />
      </main>

      <Footer />

      <AnimatePresence>
        {toastMessage && (
          <motion.div
            role="status"
            aria-live="polite"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            className="fixed bottom-4 right-4 z-50 max-w-sm rounded-lg border border-blue-500/40 bg-slate-950 px-4 py-3 text-xs font-medium text-white shadow-xl"
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
export default App;
