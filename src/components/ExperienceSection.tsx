import { EXPERIENCE_ITEMS } from '../data/experience';

const STACK_DOT_COLORS: Record<string, string> = {
  HTML: '#c2410c',
  CSS: '#1d4ed8',
  JavaScript: '#eab308',
  PHP: '#6366f1',
  Laravel: '#b91c1c',
  MySQL: '#0284c7',
  Bootstrap: '#7e22ce',
  React: '#0ea5e9',
  Git: '#c2410c',
  ServiceNow: '#15803d',
  'Microsoft 365': '#1d4ed8',
  'Incident Management': '#d97706',
  'IT Support': '#0891b2',
  'Technical Support': '#15803d',
  Troubleshooting: '#eab308',
  Documentation: '#64748b',
  Escalation: '#be123c',
};

export function ExperienceSection() {
  return (
    <section
      id="experience"
      className="relative z-20 px-5 py-16 sm:px-8 sm:py-24"
    >
      <div className="mx-auto max-w-5xl">
        {/* Left-aligned split heading breaks monotony after Tech Stack's centered header */}
        <div className="mb-10 flex flex-col justify-between gap-3 border-b border-slate-900/12 pb-6 dark:border-white/12 sm:mb-14 sm:flex-row sm:items-end">
          <div>
            <h2 className="font-display text-3xl font-extrabold tracking-tight text-slate-950 dark:text-white sm:text-5xl">
              Experience
            </h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 sm:text-base">
              IT support background and full-stack training track.
            </p>
          </div>
          <p className="font-mono text-xs text-slate-600 dark:text-slate-400">
            {EXPERIENCE_ITEMS.length} roles &amp; milestones
          </p>
        </div>

        <div className="space-y-6">
          {EXPERIENCE_ITEMS.map((item) => (
            <article
              key={item.id}
              data-ui-block="true"
              className="grid grid-cols-1 gap-5 rounded-xl border border-slate-900/18 bg-white p-6 dark:border-white/18 dark:bg-[#0a0f1c] md:grid-cols-12 sm:p-8"
            >
              <div className="md:col-span-4">
                <div className="inline-flex items-center gap-2 font-mono text-xs font-medium text-slate-600 dark:text-slate-400">
                  <span
                    className={`h-2 w-2 rounded-full ${
                      item.current
                        ? 'bg-emerald-500'
                        : 'border border-slate-500 dark:border-slate-400'
                    }`}
                    aria-hidden="true"
                  />
                  <span>{item.period}</span>
                </div>

                <h3 className="font-display mt-2.5 text-xl font-bold tracking-tight text-slate-950 dark:text-white">
                  {item.role}
                </h3>
                <p className="mt-1 text-sm font-medium text-slate-700 dark:text-slate-300">
                  {item.company}
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  {item.location}
                </p>
              </div>

              <div className="md:col-span-8">
                <ul className="space-y-2.5 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                  {item.bullets.map((bullet, bIdx) => (
                    <li key={bIdx} className="flex items-start gap-3">
                      <span
                        className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-500 dark:bg-slate-400"
                        aria-hidden="true"
                      />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-5 flex flex-wrap gap-2">
                  {item.stack.map((tech) => (
                    <span
                      key={tech}
                      className="inline-flex items-center gap-1.5 rounded-md border border-slate-900/15 bg-slate-100 px-2.5 py-1 font-mono text-xs font-medium text-slate-800 dark:border-white/15 dark:bg-white/[0.05] dark:text-slate-200"
                    >
                      <span
                        className="h-2 w-2 rounded-[2px]"
                        style={{
                          backgroundColor: STACK_DOT_COLORS[tech] ?? '#2563eb',
                        }}
                        aria-hidden="true"
                      />
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
