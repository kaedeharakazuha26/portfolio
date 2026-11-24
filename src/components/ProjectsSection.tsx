import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, CheckCircle2, X } from 'lucide-react';
import {
  PROJECTS,
  type ProjectFilterGroup,
  type ProjectItem,
} from '../data/projects';
import { GithubIcon } from './SocialIcons';

const FILTER_GROUPS: ProjectFilterGroup[] = [
  'All',
  'Full-Stack',
  'Frontend & 3D',
];

function ProjectSchematic({ project }: { project: ProjectItem }) {
  const [imgFailed, setImgFailed] = useState(false);

  if (project.imageUrl && !imgFailed) {
    return (
      <img
        src={project.imageUrl}
        alt={`${project.title} screenshot`}
        width={640}
        height={426}
        loading="lazy"
        onError={() => setImgFailed(true)}
        className="h-full w-full object-cover"
      />
    );
  }

  return (
    <div className="flex h-full w-full flex-col justify-between bg-[#080d18] p-4 sm:p-5">
      <div className="flex items-center justify-between gap-2">
        <span
          className="inline-block h-2.5 w-2.5 rounded-[2px]"
          style={{ backgroundColor: project.accent }}
          aria-hidden="true"
        />
        <span className="rounded-md border border-white/15 bg-white/[0.06] px-2.5 py-0.5 font-mono text-[11px] font-medium text-slate-200">
          {project.previewBadge}
        </span>
      </div>

      {/* Bespoke schematic diagram tied to each project's real architecture */}
      <div className="my-auto py-3" aria-hidden="true">
        {project.previewKind === 'candles' && (
          <svg viewBox="0 0 220 76" className="h-20 w-full">
            <line x1="8" y1="68" x2="212" y2="68" stroke="rgba(148,163,184,0.25)" strokeWidth="1" />
            {[
              { x: 22, high: 28, low: 58, top: 36, h: 16, up: true },
              { x: 46, high: 22, low: 52, top: 28, h: 18, up: true },
              { x: 70, high: 30, low: 60, top: 34, h: 18, up: false },
              { x: 94, high: 24, low: 54, top: 30, h: 14, up: true },
              { x: 118, high: 16, low: 46, top: 22, h: 16, up: true },
            ].map((c, idx) => (
              <g key={idx}>
                <line x1={c.x} y1={c.high} x2={c.x} y2={c.low} stroke="#94a3b8" strokeWidth="1.5" />
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
            <line x1="138" y1="10" x2="138" y2="68" stroke="rgba(96,165,250,0.5)" strokeDasharray="3 3" />
            <polyline
              points="138,26 162,20 186,14 206,18"
              fill="none"
              stroke="#60a5fa"
              strokeWidth="2.5"
              strokeDasharray="4 3"
            />
          </svg>
        )}

        {project.previewKind === 'social' && (
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            <div className="rounded-lg border border-white/12 bg-white/[0.04] p-2.5 sm:col-span-2">
              <div className="flex items-center gap-2">
                <span className="h-5 w-5 rounded-md bg-[#2563eb]" />
                <span className="h-2 w-24 rounded bg-white/30" />
              </div>
              <div className="mt-2.5 space-y-1.5">
                <div className="h-2 w-full rounded bg-white/15" />
                <div className="h-2 w-3/4 rounded bg-white/12" />
              </div>
            </div>
            <div className="flex flex-col justify-between rounded-lg border border-blue-400/30 bg-blue-500/10 p-2.5 font-mono text-[11px] text-blue-200">
              <span>Socket.io</span>
              <span className="text-slate-300">Firestore + ImageKit</span>
            </div>
          </div>
        )}

        {project.previewKind === 'pos' && (
          <div className="rounded-lg border border-white/12 bg-white/[0.04] p-3 font-mono text-[11px] text-slate-300">
            <div className="flex justify-between border-b border-white/10 pb-1.5">
              <span>SQLite Local DB</span>
              <span className="text-amber-300">Offline</span>
            </div>
            <div className="mt-2 flex justify-between text-slate-400">
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
            <div className="space-y-1 font-mono text-[11px] text-slate-300">
              <div>27 cubies</div>
              <div>54 skill tiles</div>
              <div className="text-slate-400">6 faces</div>
            </div>
          </div>
        )}
      </div>

      <p className="text-xs leading-relaxed text-slate-300">
        {project.previewCaption}
      </p>
    </div>
  );
}

export function ProjectsSection() {
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
      if (e.key === 'Escape') {
        setSelected(null);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      triggerRef.current?.focus();
    };
  }, [selected]);

  return (
    <section
      id="projects"
      className="relative z-20 px-5 py-16 sm:px-8 sm:py-24"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex flex-col justify-between gap-5 sm:mb-12 lg:flex-row lg:items-end">
          <div>
            <h2 className="font-display text-3xl font-extrabold tracking-tight text-slate-950 dark:text-white sm:text-5xl">
              Projects
            </h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 sm:text-base">
              Selected builds. Open any card for stack details and repository links.
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
                      ? 'border-slate-950 bg-slate-950 text-white dark:border-white dark:bg-white dark:text-slate-950'
                      : 'border-slate-900/20 bg-white text-slate-800 hover:border-slate-900/50 dark:border-white/20 dark:bg-[#0a0f1c] dark:text-slate-200 dark:hover:border-white/45'
                  }`}
                >
                  {group}
                </button>
              );
            })}
          </div>
        </div>

        {visibleProjects.length === 0 ? (
          <div className="rounded-xl border border-slate-900/18 bg-white p-8 text-center dark:border-white/18 dark:bg-[#0a0f1c]">
            <p className="text-sm text-slate-700 dark:text-slate-300">
              No projects match this filter yet.
            </p>
            <button
              type="button"
              onClick={() => setActiveFilter('All')}
              className="mt-4 min-h-11 rounded-lg bg-slate-950 px-4 text-xs font-semibold text-white dark:bg-white dark:text-slate-950"
            >
              Show all projects
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {visibleProjects.map((project) => {
              const spanFeatured = activeFilter === 'All' && project.featured;
              const spanWideFooter =
                activeFilter === 'All' && project.id === 'personal-portfolio';
              return (
                <button
                  key={project.id}
                  type="button"
                  onClick={(e) => {
                    triggerRef.current = e.currentTarget;
                    setSelected(project);
                  }}
                  data-ui-block="true"
                  className={`group flex w-full overflow-hidden rounded-xl border border-slate-900/20 bg-white text-left transition-colors hover:border-blue-600 dark:border-white/18 dark:bg-[#0a0f1c] dark:hover:border-blue-400 ${
                    spanWideFooter
                      ? 'flex-col md:col-span-2 lg:flex-row'
                      : spanFeatured
                        ? 'flex-col md:col-span-2'
                        : 'flex-col'
                  }`}
                >
                  <div
                    className={`overflow-hidden ${
                      spanWideFooter
                        ? 'h-48 w-full border-b border-slate-900/12 dark:border-white/12 lg:h-auto lg:w-72 lg:shrink-0 lg:border-b-0 lg:border-r'
                        : spanFeatured
                          ? 'h-52 w-full border-b border-slate-900/12 dark:border-white/12 sm:h-56'
                          : 'h-48 w-full border-b border-slate-900/12 dark:border-white/12'
                    }`}
                  >
                    <ProjectSchematic project={project} />
                  </div>

                  <div className="flex flex-1 flex-col justify-between p-5">
                    <div>
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h3 className="font-display text-lg font-bold text-slate-950 dark:text-white">
                          {project.title}
                        </h3>
                        <span className="rounded-md border border-slate-900/15 bg-slate-100 px-2.5 py-0.5 font-mono text-[11px] font-medium text-slate-800 dark:border-white/15 dark:bg-white/[0.06] dark:text-slate-200">
                          {project.category}
                        </span>
                      </div>
                      <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                        {project.tagline}
                      </p>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {[...project.frontend.slice(0, 2), ...project.backend.slice(0, 2)].map(
                        (tech) => (
                          <span
                            key={tech}
                            className="rounded-md border border-slate-900/12 bg-slate-50 px-2 py-0.5 font-mono text-[11px] text-slate-700 dark:border-white/12 dark:bg-white/[0.04] dark:text-slate-300"
                          >
                            {tech}
                          </span>
                        ),
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Portal escapes section stacking context; glass surface 2 of 2 sits on backdrop */}
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
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 24, opacity: 0 }}
                  transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                  onClick={(e) => e.stopPropagation()}
                  data-ui-block="true"
                  className="max-h-[86dvh] w-full max-w-2xl overflow-y-auto rounded-xl border border-slate-900/20 bg-white shadow-2xl dark:border-white/20 dark:bg-[#080d19]"
                >
                  <div className="sticky top-0 z-10 border-b border-slate-900/12 bg-white px-5 py-4 dark:border-white/12 dark:bg-[#080d19] sm:px-6">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <h3
                          id="project-modal-title"
                          className="font-display text-xl font-extrabold text-slate-950 dark:text-white sm:text-2xl"
                        >
                          {selected.title}
                        </h3>
                        <span className="rounded-md border border-slate-900/15 bg-slate-100 px-2.5 py-0.5 font-mono text-[11px] font-semibold text-slate-800 dark:border-white/15 dark:bg-white/[0.06] dark:text-slate-200">
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
                            className="inline-flex h-11 items-center gap-1.5 rounded-lg bg-slate-950 px-4 text-xs font-semibold text-white transition-colors hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
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
                          className="flex h-11 w-11 items-center justify-center rounded-lg border border-slate-900/20 text-slate-700 transition-colors hover:border-slate-900/50 hover:text-slate-950 dark:border-white/20 dark:text-slate-300 dark:hover:border-white/45 dark:hover:text-white"
                        >
                          <X className="h-4 w-4" aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6 p-5 sm:p-7">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="rounded-lg border border-slate-900/12 bg-slate-50 p-4 dark:border-white/12 dark:bg-white/[0.03]">
                        <p className="font-mono text-xs font-semibold text-slate-600 dark:text-slate-400">
                          Frontend
                        </p>
                        <div className="mt-2.5 flex flex-wrap gap-1.5">
                          {selected.frontend.map((tech) => (
                            <span
                              key={tech}
                              className="rounded-md border border-slate-900/15 bg-white px-2.5 py-1 font-mono text-xs font-medium text-slate-900 dark:border-white/15 dark:bg-[#0e1526] dark:text-slate-100"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="rounded-lg border border-slate-900/12 bg-slate-50 p-4 dark:border-white/12 dark:bg-white/[0.03]">
                        <p className="font-mono text-xs font-semibold text-slate-600 dark:text-slate-400">
                          Backend &amp; Runtime
                        </p>
                        <div className="mt-2.5 flex flex-wrap gap-1.5">
                          {selected.backend.map((tech) => (
                            <span
                              key={tech}
                              className="rounded-md border border-slate-900/15 bg-white px-2.5 py-1 font-mono text-xs font-medium text-slate-900 dark:border-white/15 dark:bg-[#0e1526] dark:text-slate-100"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div>
                      <p className="font-display text-lg font-bold leading-snug text-slate-950 dark:text-white sm:text-xl">
                        {selected.tagline}
                      </p>
                      <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300 sm:text-base">
                        {selected.description}
                      </p>
                    </div>

                    <div className="space-y-2.5 rounded-lg border border-slate-900/12 bg-slate-50 p-5 dark:border-white/12 dark:bg-white/[0.03]">
                      <p className="font-mono text-xs font-semibold text-slate-600 dark:text-slate-400">
                        Key implementation details
                      </p>
                      {selected.highlights.map((item, i) => (
                        <div
                          key={i}
                          className="flex items-start gap-2.5 text-sm text-slate-800 dark:text-slate-200"
                        >
                          <CheckCircle2
                            className="mt-0.5 h-4 w-4 shrink-0 text-blue-600 dark:text-blue-400"
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
                          className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-lg bg-slate-950 px-5 text-sm font-semibold text-white transition-colors hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
                        >
                          <span>Open Live App</span>
                          <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                        </a>
                      )}
                      <a
                        href={selected.repoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-lg border border-slate-900/20 bg-white px-5 text-sm font-semibold text-slate-950 transition-colors hover:border-slate-900/50 dark:border-white/20 dark:bg-[#0e1526] dark:text-white dark:hover:border-white/45"
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
