import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, Award, CalendarClock, Eye, FileText, X } from 'lucide-react';
import {
  CERTIFICATIONS,
  type CertificationItem,
} from '../data/certifications';

export function CertificationsSection() {
  const [previewCert, setPreviewCert] = useState<CertificationItem | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);

  const earnedCount = CERTIFICATIONS.filter((c) => c.status === 'earned').length;
  const upcomingCount = CERTIFICATIONS.filter((c) => c.status === 'upcoming').length;

  useEffect(() => {
    if (!previewCert) return;
    closeBtnRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setPreviewCert(null);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      triggerRef.current?.focus();
    };
  }, [previewCert]);

  return (
    <section
      id="certifications"
      className="relative z-20 px-5 py-16 sm:px-8 sm:py-24"
    >
      <div className="mx-auto max-w-5xl">
        <div className="mb-10 flex flex-col justify-between gap-3 border-b border-slate-900/12 pb-6 dark:border-white/12 sm:mb-12 sm:flex-row sm:items-end">
          <div>
            <h2 className="font-display text-3xl font-extrabold tracking-tight text-slate-950 dark:text-white sm:text-5xl">
              Certifications
            </h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 sm:text-base">
              Completed credentials and upcoming certifications scheduled for January.
            </p>
          </div>
          <p className="font-mono text-xs text-slate-600 dark:text-slate-400">
            {earnedCount} earned · {upcomingCount} planned for January
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {CERTIFICATIONS.map((cert) => {
            const isEarned = cert.status === 'earned';

            return (
              <article
                key={cert.id}
                data-ui-block="true"
                className={`flex flex-col justify-between rounded-xl p-5 sm:p-6 ${
                  isEarned
                    ? 'border border-slate-900/20 bg-white dark:border-white/20 dark:bg-[#0a0f1c]'
                    : 'border border-dashed border-slate-900/25 bg-white/85 dark:border-white/20 dark:bg-[#080d18]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs font-medium text-slate-600 dark:text-slate-400">
                      {cert.slotLabel}
                    </span>

                    <span
                      className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-0.5 font-mono text-[11px] font-semibold ${
                        isEarned
                          ? 'border-emerald-700/25 bg-emerald-50 text-emerald-800 dark:border-emerald-400/30 dark:bg-emerald-950/50 dark:text-emerald-300'
                          : 'border-slate-900/15 bg-slate-100 text-slate-700 dark:border-white/15 dark:bg-white/[0.05] dark:text-slate-300'
                      }`}
                    >
                      {isEarned ? (
                        <Award className="h-3.5 w-3.5" aria-hidden="true" />
                      ) : (
                        <CalendarClock className="h-3.5 w-3.5" aria-hidden="true" />
                      )}
                      <span>{cert.date}</span>
                    </span>
                  </div>

                  {cert.imageUrl && (
                    <button
                      type="button"
                      onClick={(e) => {
                        triggerRef.current = e.currentTarget;
                        setPreviewCert(cert);
                      }}
                      aria-label={`Preview ${cert.title} certificate`}
                      className="mt-4 block w-full overflow-hidden rounded-lg border border-slate-900/15 bg-slate-950 transition-colors hover:border-blue-600 dark:border-white/15 dark:hover:border-blue-400"
                    >
                      <img
                        src={cert.imageUrl}
                        alt={`${cert.title} certificate issued by ${cert.issuer}`}
                        width={2000}
                        height={1415}
                        loading="lazy"
                        className="aspect-[2000/1415] h-auto w-full object-cover"
                      />
                    </button>
                  )}

                  <h3 className="font-display mt-4 text-lg font-bold leading-snug text-slate-950 dark:text-white">
                    {cert.title}
                  </h3>

                  <p className="mt-1 text-sm font-medium text-slate-700 dark:text-slate-300">
                    {cert.issuer}
                  </p>

                  {cert.credentialId && (
                    <p className="mt-1 font-mono text-xs text-slate-600 dark:text-slate-400">
                      {cert.credentialId}
                    </p>
                  )}

                  <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                    {cert.summary}
                  </p>
                </div>

                <div className="mt-5 space-y-3">
                  {cert.topics && cert.topics.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {cert.topics.map((topic) => (
                        <span
                          key={topic}
                          className="rounded-md border border-slate-900/12 bg-slate-100 px-2.5 py-0.5 font-mono text-[11px] text-slate-700 dark:border-white/12 dark:bg-white/[0.05] dark:text-slate-300"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  )}

                  {(cert.imageUrl || cert.pdfUrl || cert.credentialUrl) && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {cert.imageUrl && (
                        <button
                          type="button"
                          onClick={(e) => {
                            triggerRef.current = e.currentTarget;
                            setPreviewCert(cert);
                          }}
                          className="inline-flex min-h-11 flex-1 items-center justify-center gap-1.5 rounded-lg bg-slate-950 px-3 text-xs font-semibold text-white transition-colors hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
                        >
                          <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                          <span>Preview</span>
                        </button>
                      )}

                      {cert.pdfUrl && (
                        <a
                          href={cert.pdfUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-lg border border-slate-900/20 bg-white px-3 text-xs font-semibold text-slate-950 transition-colors hover:border-slate-900/50 dark:border-white/20 dark:bg-[#0e1526] dark:text-white dark:hover:border-white/45"
                        >
                          <FileText className="h-3.5 w-3.5" aria-hidden="true" />
                          <span>PDF</span>
                        </a>
                      )}

                      {cert.credentialUrl && (
                        <a
                          href={cert.credentialUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-lg border border-slate-900/20 bg-white px-3 text-xs font-semibold text-slate-950 transition-colors hover:border-slate-900/50 dark:border-white/20 dark:bg-[#0e1526] dark:text-white dark:hover:border-white/45"
                        >
                          <span>Verify</span>
                          <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {typeof document !== 'undefined' &&
        createPortal(
          <AnimatePresence>
            {previewCert && previewCert.imageUrl && (
              <motion.div
                key="cert-backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setPreviewCert(null)}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
              >
                <motion.div
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="cert-modal-title"
                  initial={{ y: 24, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 16, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  onClick={(e) => e.stopPropagation()}
                  data-ui-block="true"
                  className="max-h-[90dvh] w-full max-w-4xl overflow-y-auto rounded-xl border border-slate-900/20 bg-white p-5 shadow-2xl dark:border-white/20 dark:bg-[#080d19]"
                >
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h3
                        id="cert-modal-title"
                        className="font-display text-lg font-bold text-slate-950 dark:text-white"
                      >
                        {previewCert.title}
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        {previewCert.issuer} · {previewCert.date}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {previewCert.pdfUrl && (
                        <a
                          href={previewCert.pdfUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex h-11 items-center gap-1.5 rounded-lg bg-slate-950 px-3.5 text-xs font-semibold text-white transition-colors hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
                        >
                          <FileText className="h-3.5 w-3.5" aria-hidden="true" />
                          <span>Open PDF</span>
                        </a>
                      )}
                      <button
                        ref={closeBtnRef}
                        type="button"
                        onClick={() => setPreviewCert(null)}
                        aria-label="Close certificate preview"
                        className="flex h-11 w-11 items-center justify-center rounded-lg border border-slate-900/20 text-slate-700 transition-colors hover:border-slate-900/50 dark:border-white/20 dark:text-slate-300 dark:hover:border-white/45"
                      >
                        <X className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                  <img
                    src={previewCert.imageUrl}
                    alt={`${previewCert.title} certificate issued by ${previewCert.issuer}`}
                    width={2000}
                    height={1415}
                    className="h-auto w-full rounded-lg border border-slate-900/12 dark:border-white/12"
                  />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </section>
  );
}
