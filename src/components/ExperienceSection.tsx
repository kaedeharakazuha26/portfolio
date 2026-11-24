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
  Documentation: '#71717a',
  Escalation: '#be123c',
};

export function ExperienceSection() {
  return (
    <section
      id="experience"
      className="relative z-20 px-5 py-16 sm:px-8 sm:py-24"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex flex-col justify-between gap-3 border-b border-zinc-900/12 pb-6 dark:border-white/12 sm:mb-12 sm:flex-row sm:items-end">
          <div>
            <p className="font-mono text-xs font-medium text-amber-700 dark:text-amber-400">
              04 / CAREER &amp; TRAINING
            </p>
            <h2 className="font-display mt-1 text-3xl font-extrabold tracking-tight text-zinc-950 dark:text-white sm:text-5xl">
              Experience
            </h2>
          </div>
          <p className="font-mono text-xs text-zinc-600 dark:text-zinc-400">
            {EXPERIENCE_ITEMS.length} roles &amp; milestones
          </p>
        </div>

        <div className="space-y-5">
          {EXPERIENCE_ITEMS.map((item) => (
            <article
              key={item.id}
              data-ui-block="true"
              className="grid grid-cols-1 gap-5 rounded-xl border border-zinc-900/16 bg-white p-6 dark:border-white/14 dark:bg-[#121318] md:grid-cols-12 sm:p-7"
            >
              <div className="md:col-span-4">
                <div className="inline-flex items-center gap-2 font-mono text-xs font-medium text-zinc-600 dark:text-zinc-400">
                  <span
                    className={`h-2 w-2 rounded-full ${
                      item.current
                        ? 'bg-amber-500'
                        : 'border border-zinc-500 dark:border-zinc-400'
                    }`}
                    aria-hidden="true"
                  />
                  <span>{item.period}</span>
                </div>

                <h3 className="font-display mt-2.5 text-xl font-bold tracking-tight text-zinc-950 dark:text-white">
                  {item.role}
                </h3>
                <p className="mt-1 text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                  {item.company}
                </p>
                <p className="text-xs text-zinc-600 dark:text-zinc-400">
                  {item.location}
                </p>
              </div>

              <div className="md:col-span-8">
                <ul className="space-y-2 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
                  {item.bullets.map((bullet, bIdx) => (
                    <li key={bIdx} className="flex items-start gap-3">
                      <span
                        className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-600 dark:bg-amber-400"
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
                      className="inline-flex items-center gap-1.5 rounded-md border border-zinc-900/12 bg-zinc-100 px-2.5 py-1 font-mono text-xs font-medium text-zinc-800 dark:border-white/12 dark:bg-white/[0.05] dark:text-zinc-200"
                    >
                      <span
                        className="h-2 w-2 rounded-[2px]"
                        style={{
                          backgroundColor: STACK_DOT_COLORS[tech] ?? '#f59e0b',
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
