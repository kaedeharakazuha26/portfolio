import { useEffect, useRef, useState, type MouseEvent } from 'react';
import { createPortal } from 'react-dom';
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from 'framer-motion';
import { ArrowUpRight, CheckCircle2, X } from 'lucide-react';
import {
  PROJECTS,
  type ProjectFilterGroup,
  type ProjectItem,
} from '../data/projects';
import { GithubIcon } from './SocialIcons';
import { FloatingDock, type DockItem } from './FloatingDock';

const FILTER_GROUPS: ProjectFilterGroup[] = [
  'All',
  'Full-Stack',
  'Frontend & 3D',
];

function shortBadge(tech: string): string {
  const map: Record<string, string> = {
    React: 'Rct',
    'React 19': 'R19',
    TypeScript: 'TS',
    'Tailwind CSS': 'TW',
    'Shadcn/ui': 'UI',
    Vite: 'Vite',
    'Node.js': 'Node',
    Express: 'Ex',
    Firestore: 'Fire',
    'Socket.io': 'WS',
    ImageKit: 'Img',
    'Charting UI': 'Chrt',
    'Binance API': 'BN',
    'Kronos-base': 'AI',
    jsPDF: 'PDF',
    SQLite: 'SQLt',
    Capacitor: 'Cap',
    Electron: 'Elec',
    'Three.js': '3D',
    'Framer Motion': 'FM',
    'GitHub Pages': 'GH',
    Vercel: 'VCL',
  };
  return map[tech] ?? tech.slice(0, 4);
}

/**
 * Elevated scrolling preview frame inspired by Naresh-Khatri/3d-portfolio.
 * Smoothly pans vertically through a tall two-stage product preview on hover or focus.
 */
function ScrollingProjectViewport({
  project,
  isHovered,
  reducedMotion,
}: {
  project: ProjectItem;
  isHovered: boolean;
  reducedMotion: boolean;
}) {
  const [imgFailed, setImgFailed] = useState(false);

  return (
    <div
      className="relative h-full w-full overflow-hidden p-4 pb-0 sm:p-5 sm:pb-0"
      style={{
        background: `linear-gradient(145deg, ${project.accent}30, #09090b 70%)`,
      }}
    >
      {/* Floating elevated preview viewport (.sp-shot style) */}
      <div className="relative h-full w-full overflow-hidden rounded-t-lg border border-b-0 border-white/15 bg-[#0c0d12]">
        {project.imageUrl && !imgFailed ? (
          <motion.img
            src={project.imageUrl}
            alt={`${project.title} screenshot`}
            width={640}
            height={800}
            loading="lazy"
            onError={() => setImgFailed(true)}
            animate={reducedMotion ? undefined : { y: isHovered ? '-28%' : '0%' }}
            transition={{
              duration: isHovered ? 2.8 : 0.6,
              ease: isHovered ? 'linear' : [0.22, 1, 0.36, 1],
            }}
            className="w-full object-cover object-top"
          />
        ) : (
          <motion.div
            animate={reducedMotion ? undefined : { y: isHovered ? '-44%' : '0%' }}
            transition={{
              duration: isHovered ? 2.6 : 0.55,
              ease: isHovered ? 'linear' : [0.22, 1, 0.36, 1],
            }}
            aria-hidden="true"
            className="flex h-[185%] w-full flex-col justify-between p-4"
          >
            {/* Stage 1 (visible at rest) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-2 font-mono text-[11px] font-semibold text-zinc-200">
                  <span
                    className="h-2.5 w-2.5 rounded-[2px]"
                    style={{ backgroundColor: project.accent }}
                  />
                  {project.title}
                </span>
                <span className="rounded-md border border-white/15 bg-white/[0.06] px-2 py-0.5 font-mono text-[10px] text-zinc-200">
                  {project.previewBadge}
                </span>
              </div>

              {project.previewKind === 'social' && (
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                  <div className="rounded-lg border border-white/12 bg-white/[0.04] p-3 sm:col-span-2">
                    <div className="flex items-center gap-2">
                      <span className="h-5 w-5 rounded-md bg-blue-600" />
                      <span className="h-2 w-24 rounded bg-white/30" />
                    </div>
                    <div className="mt-2.5 space-y-1.5">
                      <div className="h-2 w-full rounded bg-white/16" />
                      <div className="h-2 w-3/4 rounded bg-white/12" />
                    </div>
                  </div>
                  <div className="flex flex-col justify-between rounded-lg border border-amber-400/30 bg-amber-500/10 p-2.5 font-mono text-[10px] text-amber-300">
                    <span>Socket.io</span>
                    <span className="text-zinc-300">Live sync</span>
                  </div>
                </div>
              )}

              {project.previewKind === 'candles' && (
                <svg viewBox="0 0 220 76" className="h-20 w-full">
                  <line x1="8" y1="68" x2="212" y2="68" stroke="rgba(161,161,170,0.25)" strokeWidth="1" />
                  {[
                    { x: 22, high: 28, low: 58, top: 36, h: 16, up: true },
                    { x: 46, high: 22, low: 52, top: 28, h: 18, up: true },
                    { x: 70, high: 30, low: 60, top: 34, h: 18, up: false },
                    { x: 94, high: 24, low: 54, top: 30, h: 14, up: true },
                    { x: 118, high: 16, low: 46, top: 22, h: 16, up: true },
                  ].map((c, idx) => (
                    <g key={idx}>
                      <line x1={c.x} y1={c.high} x2={c.x} y2={c.low} stroke="#a1a1aa" strokeWidth="1.5" />
                      <rect
                        x={c.x - 5}
                        y={c.top}
                        width="10"
                        height={c.h}
                        rx="2"
                        fill={c.up ? '#22c55e' : '#ef4444'}
                      />
                    </g>
                  ))}
                  <line x1="138" y1="10" x2="138" y2="68" stroke="rgba(245,158,11,0.55)" strokeDasharray="3 3" />
                  <polyline
                    points="138,26 162,20 186,14 206,18"
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="2.5"
                    strokeDasharray="4 3"
                  />
                </svg>
              )}

              {project.previewKind === 'pos' && (
                <div className="rounded-lg border border-white/12 bg-white/[0.04] p-3 font-mono text-[11px] text-zinc-300">
                  <div className="flex justify-between border-b border-white/10 pb-1.5">
                    <span>SQLite Local DB</span>
                    <span className="text-amber-300">Offline</span>
                  </div>
                  <div className="mt-2 flex justify-between text-zinc-400">
                    <span>Receipt Export</span>
                    <span>jsPDF</span>
                  </div>
                </div>
              )}

              {project.previewKind === 'cube' && (
                <div className="flex items-center gap-4">
                  <div className="grid grid-cols-3 gap-1 rounded-lg border border-white/15 bg-black/50 p-2">
                    {['#1d4ed8', '#c2410c', '#eab308', '#15803d', '#b91c1c', '#e2e8f0', '#1d4ed8', '#eab308', '#15803d'].map(
                      (color, idx) => (
                        <span
                          key={idx}
                          className="h-3.5 w-3.5 rounded-[2px]"
                          style={{ backgroundColor: color }}
                        />
                      ),
                    )}
                  </div>
                  <div className="space-y-1 font-mono text-[11px] text-zinc-300">
                    <div>27 cubies · 54 skills</div>
                    <div className="text-amber-300">WebGL Fluid + Links</div>
                  </div>
                </div>
              )}
            </div>

            {/* Stage 2 (revealed smoothly when hovering/panning the card) */}
            <div className="space-y-2 border-t border-white/10 pt-3">
              <p className="font-mono text-[10px] uppercase tracking-wider text-amber-400">
                Architecture highlights
              </p>
              {project.highlights.slice(0, 2).map((h, i) => (
                <p key={i} className="text-xs leading-relaxed text-zinc-300">
                  {h}
                </p>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

/** Project card with motion spring 3D tilt + hover scrolling viewport */
function ProjectCard({
  project,
  spanFeatured,
  spanWideFooter,
  reducedMotion,
  onOpen,
}: {
  project: ProjectItem;
  spanFeatured: boolean;
  spanWideFooter: boolean;
  reducedMotion: boolean;
  onOpen: (btn: HTMLButtonElement) => void;
}) {
  const [hovered, setHovered] = useState(false);

  const normX = useMotionValue(0);
  const normY = useMotionValue(0);
  const rotateX = useSpring(useTransform(normY, [-0.5, 0.5], [4.5, -4.5]), {
    stiffness: 220,
    damping: 22,
  });
  const rotateY = useSpring(useTransform(normX, [-0.5, 0.5], [-4.5, 4.5]), {
    stiffness: 220,
    damping: 22,
  });

  const handleMove = (e: MouseEvent<HTMLButtonElement>) => {
    if (reducedMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    normX.set((e.clientX - rect.left) / rect.width - 0.5);
    normY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleLeave = () => {
    setHovered(false);
    normX.set(0);
    normY.set(0);
  };

  return (
    <motion.div
      style={
        reducedMotion
          ? undefined
          : {
              perspective: 1000,
              rotateX,
              rotateY,
              transformStyle: 'preserve-3d',
            }
      }
      className={
        spanWideFooter
          ? 'md:col-span-2'
          : spanFeatured
            ? 'md:col-span-2'
            : ''
      }
    >
      <button
        type="button"
        onClick={(e) => onOpen(e.currentTarget)}
        onMouseEnter={() => setHovered(true)}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        onFocus={() => setHovered(true)}
        onBlur={() => setHovered(false)}
        data-ui-block="true"
        className={`group flex h-full w-full overflow-hidden rounded-xl border border-zinc-900/18 bg-white text-left transition-colors hover:border-amber-600 dark:border-white/14 dark:bg-[#121318] dark:hover:border-amber-400 ${
          spanWideFooter ? 'flex-col lg:flex-row' : 'flex-col'
        }`}
      >
        <div
          className={`overflow-hidden ${
            spanWideFooter
              ? 'h-52 w-full border-b border-zinc-900/12 dark:border-white/10 lg:h-auto lg:w-72 lg:shrink-0 lg:border-b-0 lg:border-r'
              : spanFeatured
                ? 'h-56 w-full border-b border-zinc-900/12 dark:border-white/10 sm:h-60'
                : 'h-52 w-full border-b border-zinc-900/12 dark:border-white/10'
          }`}
        >
          <ScrollingProjectViewport
            project={project}
            isHovered={hovered}
            reducedMotion={reducedMotion}
          />
        </div>

        <div className="flex flex-1 flex-col justify-between p-5">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="font-display text-lg font-bold text-zinc-950 dark:text-white">
                {project.title}
              </h3>
              <span className="rounded-md border border-zinc-900/14 bg-zinc-100 px-2.5 py-0.5 font-mono text-[11px] font-medium text-zinc-800 dark:border-white/14 dark:bg-white/[0.06] dark:text-zinc-200">
                {project.category}
              </span>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              {project.tagline}
            </p>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap gap-1.5">
              {[...project.frontend.slice(0, 2), ...project.backend.slice(0, 2)].map(
                (tech) => (
                  <span
                    key={tech}
                    className="rounded-md border border-zinc-900/12 bg-zinc-50 px-2 py-0.5 font-mono text-[11px] text-zinc-700 dark:border-white/12 dark:bg-white/[0.04] dark:text-zinc-300"
                  >
                    {tech}
                  </span>
                ),
              )}
            </div>
            <span className="font-mono text-[11px] font-semibold text-amber-700 transition-transform group-hover:translate-x-0.5 dark:text-amber-400">
              Inspect
            </span>
          </div>
        </div>
      </button>
    </motion.div>
  );
}

interface ProjectsSectionProps {
  reducedMotion: boolean;
}

export function ProjectsSection({ reducedMotion }: ProjectsSectionProps) {
  const [activeFilter, setActiveFilter] = useState<ProjectFilterGroup>('All');
  const [selected, setSelected] = useState<ProjectItem | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  const visibleProjects =
    activeFilter === 'All'
      ? PROJECTS
      : PROJECTS.filter((p) => p.filterGroup === activeFilter);

  useEffect(() => {
    if (!selected) return;
    closeButtonRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelected(null);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      triggerRef.current?.focus();
    };
  }, [selected]);

  const frontendDockItems: DockItem[] = selected
    ? selected.frontend.map((tech) => ({
        id: `fe-${tech}`,
        label: tech,
        short: shortBadge(tech),
      }))
    : [];

  const backendDockItems: DockItem[] = selected
    ? selected.backend.map((tech) => ({
        id: `be-${tech}`,
        label: tech,
        short: shortBadge(tech),
      }))
    : [];

  return (
    <section
      id="projects"
      className="relative z-20 px-5 py-16 sm:px-8 sm:py-24"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex flex-col justify-between gap-5 sm:mb-12 lg:flex-row lg:items-end">
          <div>
            <p className="font-mono text-xs font-medium text-amber-700 dark:text-amber-400">
              01 / SELECTED WORK
            </p>
            <h2 className="font-display mt-1 text-3xl font-extrabold tracking-tight text-zinc-950 dark:text-white sm:text-5xl">
              Shipped Projects
            </h2>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 sm:text-base">
              Hover a card to pan its preview. Open any project for the interactive stack dock.
            </p>
          </div>

          <div
            role="tablist"
            aria-label="Filter projects by category"
            className="flex flex-wrap gap-2"
          >
            {FILTER_GROUPS.map((group) => {
              const isSelected = activeFilter === group;
              return (
                <button
                  key={group}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => setActiveFilter(group)}
                  className={`min-h-11 rounded-lg border px-3.5 text-xs font-semibold transition-colors ${
                    isSelected
                      ? 'border-amber-500 bg-amber-700 text-white dark:bg-amber-500 dark:text-[#09090b]'
                      : 'border-zinc-900/18 bg-white text-zinc-800 hover:border-zinc-900/45 dark:border-white/16 dark:bg-[#121318] dark:text-zinc-200 dark:hover:border-white/40'
                  }`}
                >
                  {group}
                </button>
              );
            })}
          </div>
        </div>

        {visibleProjects.length === 0 ? (
          <div className="rounded-xl border border-zinc-900/16 bg-white p-8 text-center dark:border-white/14 dark:bg-[#121318]">
            <p className="text-sm text-zinc-700 dark:text-zinc-300">
              No projects match this filter yet.
            </p>
            <button
              type="button"
              onClick={() => setActiveFilter('All')}
              className="mt-4 min-h-11 rounded-lg bg-amber-700 px-4 text-xs font-semibold text-white dark:bg-amber-500 dark:text-[#09090b]"
            >
              Show all projects
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {visibleProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                spanFeatured={activeFilter === 'All' && Boolean(project.featured)}
                spanWideFooter={
                  activeFilter === 'All' && project.id === 'personal-portfolio'
                }
                reducedMotion={reducedMotion}
                onOpen={(btn) => {
                  triggerRef.current = btn;
                  setSelected(project);
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Glass surface 2 of 2: modal backdrop with spring FloatingDock tech stacks */}
      {typeof document !== 'undefined' &&
        createPortal(
          <AnimatePresence>
            {selected && (
              <motion.div
                key="modal-backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelected(null)}
                className="fixed inset-0 z-50 flex items-end justify-center bg-black/75 p-2 backdrop-blur-sm sm:items-center sm:p-6"
              >
                <motion.div
                  key={selected.id}
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="project-modal-title"
                  initial={{ y: 36, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 20, opacity: 0 }}
                  transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                  onClick={(e) => e.stopPropagation()}
                  data-ui-block="true"
                  className="max-h-[86dvh] w-full max-w-2xl overflow-y-auto rounded-xl border border-zinc-900/20 bg-white shadow-2xl dark:border-white/18 dark:bg-[#111217]"
                >
                  <div className="sticky top-0 z-10 border-b border-zinc-900/12 bg-white px-5 py-4 dark:border-white/12 dark:bg-[#111217] sm:px-6">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <h3
                          id="project-modal-title"
                          className="font-display text-xl font-extrabold text-zinc-950 dark:text-white sm:text-2xl"
                        >
                          {selected.title}
                        </h3>
                        <span className="rounded-md border border-zinc-900/15 bg-zinc-100 px-2.5 py-0.5 font-mono text-[11px] font-semibold text-zinc-800 dark:border-white/15 dark:bg-white/[0.06] dark:text-zinc-200">
                          {selected.category}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {selected.hasLiveDeploy && (
                          <a
                            href={selected.liveUrl}
                            target={selected.liveUrl.startsWith('#') ? undefined : '_blank'}
                            rel={selected.liveUrl.startsWith('#') ? undefined : 'noreferrer'}
                            onClick={() => {
                              if (selected.liveUrl.startsWith('#')) setSelected(null);
                            }}
                            className="inline-flex h-11 items-center gap-1.5 rounded-lg bg-amber-700 px-4 text-xs font-semibold text-white transition-colors hover:bg-amber-800 dark:bg-amber-500 dark:text-[#09090b] dark:hover:bg-amber-400"
                          >
                            <span>Visit Live</span>
                            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                          </a>
                        )}

                        <button
                          ref={closeButtonRef}
                          type="button"
                          onClick={() => setSelected(null)}
                          aria-label="Close project details"
                          className="flex h-11 w-11 items-center justify-center rounded-lg border border-zinc-900/18 text-zinc-700 transition-colors hover:border-zinc-900/50 hover:text-zinc-950 dark:border-white/18 dark:text-zinc-300 dark:hover:border-white/45 dark:hover:text-white"
                        >
                          <X className="h-4 w-4" aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6 p-5 sm:p-7">
                    {/* Spring Magnification Tech Docks */}
                    <div className="flex flex-col items-center gap-5 sm:flex-row sm:justify-around">
                      <div className="flex flex-col items-center gap-2">
                        <p className="font-mono text-xs font-semibold text-zinc-600 dark:text-zinc-400">
                          Frontend stack
                        </p>
                        <FloatingDock
                          items={frontendDockItems}
                          reducedMotion={reducedMotion}
                          compact
                        />
                      </div>

                      <div className="flex flex-col items-center gap-2">
                        <p className="font-mono text-xs font-semibold text-zinc-600 dark:text-zinc-400">
                          Backend &amp; runtime
                        </p>
                        <FloatingDock
                          items={backendDockItems}
                          reducedMotion={reducedMotion}
                          compact
                        />
                      </div>
                    </div>

                    <div className="border-t border-zinc-900/12 pt-5 dark:border-white/12">
                      <p className="font-display text-lg font-bold leading-snug text-zinc-950 dark:text-white sm:text-xl">
                        {selected.tagline}
                      </p>
                      <p className="mt-3 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300 sm:text-base">
                        {selected.description}
                      </p>
                    </div>

                    <div className="space-y-2.5 rounded-lg border border-zinc-900/12 bg-zinc-50 p-5 dark:border-white/12 dark:bg-white/[0.03]">
                      <p className="font-mono text-xs font-semibold text-zinc-600 dark:text-zinc-400">
                        Key implementation details
                      </p>
                      {selected.highlights.map((item, i) => (
                        <div
                          key={i}
                          className="flex items-start gap-2.5 text-sm text-zinc-800 dark:text-zinc-200"
                        >
                          <CheckCircle2
                            className="mt-0.5 h-4 w-4 shrink-0 text-amber-700 dark:text-amber-400"
                            aria-hidden="true"
                          />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-wrap items-center gap-3 pt-1">
                      {selected.hasLiveDeploy && (
                        <a
                          href={selected.liveUrl}
                          target={selected.liveUrl.startsWith('#') ? undefined : '_blank'}
                          rel={selected.liveUrl.startsWith('#') ? undefined : 'noreferrer'}
                          onClick={() => {
                            if (selected.liveUrl.startsWith('#')) setSelected(null);
                          }}
                          className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-lg bg-amber-700 px-5 text-sm font-semibold text-white transition-colors hover:bg-amber-800 dark:bg-amber-500 dark:text-[#09090b] dark:hover:bg-amber-400"
                        >
                          <span>Open Live App</span>
                          <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                        </a>
                      )}
                      <a
                        href={selected.repoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-lg border border-zinc-900/18 bg-white px-5 text-sm font-semibold text-zinc-950 transition-colors hover:border-zinc-900/45 dark:border-white/18 dark:bg-[#161820] dark:text-white dark:hover:border-white/45"
                      >
                        <GithubIcon className="h-4 w-4" />
                        <span>View Source Code</span>
                      </a>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </section>
  );
}
