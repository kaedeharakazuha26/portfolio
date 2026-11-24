import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { RotateCcw, RotateCw, Shuffle } from 'lucide-react';
import {
  CUBE_FACES,
  CUBE_SKILLS,
  FACE_ORDER,
  type CubeFaceId,
  type CubeSkill,
} from '../data/skills';
import { moveFromKey, type CubeMove } from '../lib/cubeLogic';

interface SkillsSectionProps {
  activeSkill: CubeSkill;
  totalMoves: number;
  scrambledDepth: number;
  reducedMotion: boolean;
  onSelectSkill: (skill: CubeSkill) => void;
  onFocusFace: (face: CubeFaceId) => void;
  onTwistRandom: () => void;
  onScramble: () => void;
  onSolve: () => void;
  onKeyMove: (move: CubeMove) => void;
}

export function SkillsSection({
  activeSkill,
  totalMoves,
  scrambledDepth,
  reducedMotion,
  onSelectSkill,
  onFocusFace,
  onTwistRandom,
  onScramble,
  onSolve,
  onKeyMove,
}: SkillsSectionProps) {
  useEffect(() => {
    if (reducedMotion) return;

    const onKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || e.metaKey || e.ctrlKey || e.altKey) {
        return;
      }

      const section = document.getElementById('skills');
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const inView = rect.top < window.innerHeight * 0.7 && rect.bottom > window.innerHeight * 0.25;
      if (!inView) return;

      if (e.code === 'Space') {
        e.preventDefault();
        onTwistRandom();
        return;
      }

      const move = moveFromKey(e.key, e.shiftKey);
      if (move) onKeyMove(move);
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [reducedMotion, onKeyMove, onTwistRandom]);

  const odometerDigits = String(totalMoves).padStart(6, '0').split('');

  return (
    <section
      id="skills"
      className="relative z-20 flex min-h-[100dvh] flex-col justify-center px-5 pb-28 pt-24 sm:px-8 sm:pt-28"
    >
      <div className="pointer-events-none mx-auto flex w-full max-w-7xl flex-col justify-between gap-6">
        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
          <div>
            <p className="font-mono text-xs font-medium text-amber-700 dark:text-amber-400">
              02 / INTERACTIVE SKILL CUBE
            </p>
            <h2 className="font-display mt-1 text-3xl font-extrabold tracking-tight text-zinc-950 dark:text-white sm:text-5xl">
              54-Tile Tech Stack
            </h2>
          </div>
          <p className="font-mono text-xs text-zinc-600 dark:text-zinc-400">
            {reducedMotion
              ? '3D paused: pick any tile below'
              : 'Hover tiles, drag to orbit, or press U D L R F B'}
          </p>
        </div>

        {reducedMotion ? (
          <div className="pointer-events-auto my-8 space-y-5">
            <div className="mx-auto max-w-xl rounded-xl border border-zinc-900/18 bg-white p-5 dark:border-white/16 dark:bg-[#121318]">
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-2 rounded-md border border-zinc-900/15 bg-zinc-100 px-2.5 py-1 font-mono text-xs font-semibold text-zinc-800 dark:border-white/14 dark:bg-white/[0.06] dark:text-zinc-200">
                  <span
                    className="h-2.5 w-2.5 rounded-[2px]"
                    style={{ backgroundColor: activeSkill.color }}
                    aria-hidden="true"
                  />
                  {activeSkill.domain}
                </span>
                <span className="font-mono text-xs text-zinc-600 dark:text-zinc-400">
                  Face {activeSkill.face} · Tile {activeSkill.slot + 1}
                </span>
              </div>
              <h3 className="font-display mt-3 text-2xl font-extrabold text-zinc-950 dark:text-white">
                {activeSkill.name}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
                {activeSkill.tagline}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {FACE_ORDER.map((faceId) => {
                const face = CUBE_FACES[faceId];
                const tiles = CUBE_SKILLS.filter((s) => s.face === faceId);
                return (
                  <div
                    key={faceId}
                    className="rounded-xl border border-zinc-900/16 bg-white p-5 dark:border-white/14 dark:bg-[#121318]"
                  >
                    <div className="mb-3 flex items-center gap-2">
                      <span
                        className="h-3 w-3 rounded-[3px]"
                        style={{ backgroundColor: face.color }}
                        aria-hidden="true"
                      />
                      <h3 className="font-display text-sm font-bold text-zinc-950 dark:text-white">
                        {face.domain}
                      </h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {tiles.map((tile) => (
                        <button
                          key={tile.id}
                          type="button"
                          onClick={() => onSelectSkill(tile)}
                          aria-pressed={activeSkill.id === tile.id}
                          className={`min-h-11 rounded-md border px-3 text-xs font-medium transition-colors ${
                            activeSkill.id === tile.id
                              ? 'border-amber-500 bg-amber-700 text-white dark:bg-amber-500 dark:text-[#09090b]'
                              : 'border-zinc-900/16 bg-zinc-50 text-zinc-800 hover:border-zinc-900/45 dark:border-white/14 dark:bg-white/[0.04] dark:text-zinc-200 dark:hover:border-white/40'
                          }`}
                        >
                          {tile.name}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="my-auto grid grid-cols-1 items-center gap-6 py-6 lg:grid-cols-12">
            {/* Left area open for the large interactive 3D Rubik's Cube */}
            <div className="h-64 lg:col-span-7 lg:h-[400px]" aria-hidden="true" />

            {/* Right-aligned Skill Inspector Panel */}
            <div className="pointer-events-auto lg:col-span-5">
              <div
                data-ui-block="true"
                className="rounded-xl border border-zinc-900/18 bg-white p-6 dark:border-white/16 dark:bg-[#121318]"
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeSkill.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.14 }}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="inline-flex items-center gap-2 rounded-md border border-zinc-900/14 bg-zinc-100 px-2.5 py-1 font-mono text-[11px] font-semibold text-zinc-800 dark:border-white/14 dark:bg-white/[0.06] dark:text-zinc-200">
                        <span
                          className="h-2.5 w-2.5 rounded-[2px]"
                          style={{ backgroundColor: activeSkill.color }}
                          aria-hidden="true"
                        />
                        {activeSkill.domain}
                      </span>
                      <span className="font-mono text-xs text-zinc-600 dark:text-zinc-400">
                        Face {activeSkill.face} · #{activeSkill.slot + 1}
                      </span>
                    </div>

                    <h3 className="font-display mt-4 text-2xl font-extrabold tracking-tight text-zinc-950 dark:text-white sm:text-3xl">
                      {activeSkill.name}
                    </h3>

                    <p className="mt-2.5 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300 sm:text-base">
                      {activeSkill.tagline}
                    </p>
                  </motion.div>
                </AnimatePresence>

                <div className="mt-5 border-t border-zinc-900/12 pt-4 dark:border-white/12">
                  <p className="mb-2.5 font-mono text-xs font-medium text-zinc-600 dark:text-zinc-400">
                    Rotate to face
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {FACE_ORDER.map((faceId) => {
                      const face = CUBE_FACES[faceId];
                      const isCurrentFace = activeSkill.face === faceId;
                      return (
                        <button
                          key={faceId}
                          type="button"
                          aria-pressed={isCurrentFace}
                          onClick={() => {
                            onFocusFace(faceId);
                            const center = CUBE_SKILLS.find(
                              (s) => s.face === faceId && s.slot === 4,
                            );
                            if (center) onSelectSkill(center);
                          }}
                          className={`inline-flex min-h-11 items-center gap-2 rounded-md border px-3 text-xs font-medium transition-colors ${
                            isCurrentFace
                              ? 'border-amber-500 bg-amber-700 text-white dark:bg-amber-500 dark:text-[#09090b]'
                              : 'border-zinc-900/18 bg-zinc-50 text-zinc-800 hover:border-zinc-900/45 dark:border-white/16 dark:bg-white/[0.05] dark:text-zinc-200 dark:hover:border-white/40'
                          }`}
                        >
                          <span
                            className="h-2.5 w-2.5 rounded-[2px] border border-black/20"
                            style={{ backgroundColor: face.color }}
                            aria-hidden="true"
                          />
                          <span>{face.domain}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-zinc-900/12 pt-4 dark:border-white/12">
                  <button
                    type="button"
                    onClick={onTwistRandom}
                    className="inline-flex h-11 items-center gap-1.5 rounded-lg border border-zinc-900/18 bg-white px-3.5 text-xs font-semibold text-zinc-950 transition-colors hover:border-amber-600 dark:border-white/16 dark:bg-[#161820] dark:text-white dark:hover:border-amber-400"
                  >
                    <RotateCw className="h-3.5 w-3.5 text-amber-700 dark:text-amber-400" aria-hidden="true" />
                    <span>Twist</span>
                  </button>

                  <button
                    type="button"
                    onClick={onScramble}
                    className="inline-flex h-11 items-center gap-1.5 rounded-lg border border-zinc-900/18 bg-white px-3.5 text-xs font-semibold text-zinc-950 transition-colors hover:border-amber-600 dark:border-white/16 dark:bg-[#161820] dark:text-white dark:hover:border-amber-400"
                  >
                    <Shuffle className="h-3.5 w-3.5 text-cyan-700 dark:text-cyan-400" aria-hidden="true" />
                    <span>Scramble</span>
                  </button>

                  <button
                    type="button"
                    onClick={onSolve}
                    className={`inline-flex h-11 items-center gap-1.5 rounded-lg px-3.5 text-xs font-semibold transition-colors ${
                      scrambledDepth > 0
                        ? 'bg-amber-700 text-white hover:bg-amber-800 dark:bg-amber-500 dark:text-[#09090b] dark:hover:bg-amber-400'
                        : 'border border-zinc-900/18 bg-white text-zinc-950 hover:border-amber-600 dark:border-white/16 dark:bg-[#161820] dark:text-white dark:hover:border-amber-400'
                    }`}
                  >
                    <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>{scrambledDepth > 0 ? `Solve (${scrambledDepth})` : 'Flourish'}</span>
                  </button>

                  <div
                    aria-label={`Total cube twists: ${totalMoves}`}
                    className="ml-auto flex h-11 items-center gap-1 rounded-lg border border-zinc-900/18 bg-zinc-950 px-2.5 font-mono text-xs text-zinc-200 dark:border-white/16"
                  >
                    {odometerDigits.map((digit, i) => (
                      <span
                        key={i}
                        className="inline-flex h-5 w-3.5 items-center justify-center rounded-[2px] bg-white/12 font-bold tabular-nums text-amber-300"
                      >
                        {digit}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
