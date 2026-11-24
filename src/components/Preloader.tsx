import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { PORTFOLIO_CONFIG } from '../data/config';

interface PreloaderProps {
  ready: boolean;
}

export function Preloader({ ready }: PreloaderProps) {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setProgress((prev) => {
        if (ready) {
          const next = Math.min(100, prev + 16);
          if (next >= 100) {
            window.clearInterval(interval);
          }
          return next;
        }
        return Math.min(86, prev + Math.floor(Math.random() * 14) + 6);
      });
    }, 36);

    return () => window.clearInterval(interval);
  }, [ready]);

  useEffect(() => {
    if (progress >= 100) {
      const timer = window.setTimeout(() => setDone(true), 220);
      return () => window.clearTimeout(timer);
    }
  }, [progress]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -24 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#05070e] text-white"
        >
          <div className="flex flex-col items-center gap-4">
            <div className="grid grid-cols-3 gap-1.5">
              {['#1d4ed8', '#c2410c', '#eab308', '#15803d', '#b91c1c', '#e2e8f0', '#1d4ed8', '#eab308', '#15803d'].map(
                (color, idx) => (
                  <motion.span
                    key={idx}
                    animate={{ opacity: [0.35, 1, 0.35], scale: [0.9, 1.05, 0.9] }}
                    transition={{
                      duration: 1.1,
                      repeat: Infinity,
                      delay: idx * 0.08,
                    }}
                    className="h-3 w-3 rounded-[3px]"
                    style={{ backgroundColor: color }}
                  />
                ),
              )}
            </div>
            <p className="font-mono text-xs tracking-widest uppercase text-slate-400">
              {PORTFOLIO_CONFIG.projectName}
            </p>
            <div className="font-display text-5xl font-extrabold tabular-nums tracking-tight">
              {progress}%
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
