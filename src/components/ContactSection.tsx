import { useState, type FormEvent } from 'react';
import { AlertCircle, Check, CheckCircle2, Copy, Loader2 } from 'lucide-react';
import { PORTFOLIO_CONFIG } from '../data/config';

interface ContactSectionProps {
  onSubmitted: () => void;
  onNotify: (message: string) => void;
}

type SubmitState = 'idle' | 'loading' | 'success' | 'error';

export function ContactSection({ onSubmitted, onNotify }: ContactSectionProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitState, setSubmitState] = useState<SubmitState>('idle');
  const [feedbackText, setFeedbackText] = useState('');
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = async () => {
    if (!PORTFOLIO_CONFIG.email) return;
    try {
      await navigator.clipboard.writeText(PORTFOLIO_CONFIG.email);
      setCopied(true);
      onNotify(`Copied ${PORTFOLIO_CONFIG.email} to clipboard.`);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      onNotify(`Email: ${PORTFOLIO_CONFIG.email}`);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedMessage = message.trim();

    if (!trimmedName || !trimmedEmail || !trimmedMessage) {
      setSubmitState('error');
      setFeedbackText('Please enter your name, email address, and message before sending.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setSubmitState('error');
      setFeedbackText('Please enter a valid email address (for example, name@example.com).');
      return;
    }

    setSubmitState('loading');
    setFeedbackText('Sending message...');

    try {
      if (PORTFOLIO_CONFIG.contactEndpoint) {
        const res = await fetch(PORTFOLIO_CONFIG.contactEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({
            name: trimmedName,
            email: trimmedEmail,
            message: trimmedMessage,
          }),
        });
        if (!res.ok) throw new Error('Delivery failed');
      } else {
        await new Promise((resolve) => window.setTimeout(resolve, 420));
      }

      setName('');
      setEmail('');
      setMessage('');
      setSubmitState('success');
      const okMsg = PORTFOLIO_CONFIG.contactEndpoint
        ? 'Message sent. Thanks for reaching out.'
        : 'Preview submission recorded locally. Add contactEndpoint in src/data/config.ts to deliver real emails.';
      setFeedbackText(okMsg);
      onSubmitted();
      onNotify(okMsg);
    } catch {
      setSubmitState('error');
      setFeedbackText('Message delivery failed. Please try again or reach out via GitHub.');
    }
  };

  return (
    <section
      id="contact"
      className="relative z-20 flex min-h-[calc(100dvh-4.5rem)] flex-col justify-center px-5 pb-20 pt-16 sm:px-8 sm:pt-20"
    >
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-10 text-center">
          <h2 className="font-display text-3xl font-extrabold uppercase leading-[1.06] tracking-tight text-slate-950 dark:text-white sm:text-5xl lg:text-6xl">
            LET&apos;S WORK
            <br />
            TOGETHER
          </h2>
        </div>

        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
          <div
            data-ui-block="true"
            className="rounded-xl border border-slate-900/18 bg-white p-6 dark:border-white/18 dark:bg-[#0a0f1c] sm:p-8 lg:col-span-6"
          >
            <h3 className="font-display text-2xl font-extrabold text-slate-950 dark:text-white sm:text-3xl">
              Contact Form
            </h3>

            <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              {PORTFOLIO_CONFIG.email ? (
                <>
                  Email me directly at{' '}
                  <a
                    href={`mailto:${PORTFOLIO_CONFIG.email}`}
                    className="font-semibold text-slate-950 underline decoration-blue-600/70 underline-offset-4 hover:text-blue-700 dark:text-white dark:hover:text-blue-400"
                  >
                    {PORTFOLIO_CONFIG.displayEmail || PORTFOLIO_CONFIG.email}
                  </a>{' '}
                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    aria-label="Copy email address"
                    className="ml-1 inline-flex min-h-8 items-center gap-1 rounded-md border border-slate-900/15 bg-slate-100 px-2 py-0.5 align-middle font-mono text-xs text-slate-800 transition-colors hover:border-slate-900/40 dark:border-white/15 dark:bg-white/[0.06] dark:text-slate-200"
                  >
                    {copied ? (
                      <Check className="h-3 w-3 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                    ) : (
                      <Copy className="h-3 w-3" aria-hidden="true" />
                    )}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>{' '}
                  or send a note below.
                </>
              ) : (
                <>
                  Have a project, role, or question? Send a note below or reach me on{' '}
                  <a
                    href={PORTFOLIO_CONFIG.socials.github}
                    target="_blank"
                    rel="noreferrer"
                    className="font-semibold text-slate-950 underline decoration-blue-600/70 underline-offset-4 hover:text-blue-700 dark:text-white dark:hover:text-blue-400"
                  >
                    GitHub
                  </a>
                  .
                </>
              )}
            </p>

            {submitState === 'success' ? (
              <div
                role="status"
                aria-live="polite"
                className="mt-6 rounded-lg border border-emerald-600/40 bg-emerald-50 p-5 dark:border-emerald-400/35 dark:bg-emerald-950/40"
              >
                <div className="flex items-start gap-3">
                  <CheckCircle2
                    className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700 dark:text-emerald-400"
                    aria-hidden="true"
                  />
                  <div>
                    <p className="text-sm font-semibold text-slate-950 dark:text-white">
                      Message received
                    </p>
                    <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
                      {feedbackText}
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setSubmitState('idle');
                        setFeedbackText('');
                      }}
                      className="mt-4 min-h-11 rounded-lg bg-slate-950 px-4 text-xs font-semibold text-white transition-colors hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
                    >
                      Send another message
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                noValidate
                aria-busy={submitState === 'loading'}
                className="mt-6 space-y-4"
              >
                {submitState === 'error' && (
                  <div
                    role="alert"
                    className="flex items-start gap-2.5 rounded-lg border border-red-600/40 bg-red-50 p-3.5 text-sm text-red-900 dark:border-red-400/40 dark:bg-red-950/40 dark:text-red-200"
                  >
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                    <span>{feedbackText}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="contact-name"
                      className="mb-1.5 block text-xs font-semibold text-slate-800 dark:text-slate-200"
                    >
                      Full name
                    </label>
                    <div className="contact-field-wrap">
                      <input
                        id="contact-name"
                        type="text"
                        required
                        disabled={submitState === 'loading'}
                        value={name}
                        onChange={(e) => {
                          setName(e.target.value);
                          if (submitState === 'error') setSubmitState('idle');
                        }}
                        placeholder="Your Name"
                        className="h-11 w-full scroll-mt-24 rounded-[7px] bg-[#f1f5f9] px-3.5 text-sm text-slate-950 placeholder:text-slate-600 dark:bg-[#161a24] dark:text-white dark:placeholder:text-slate-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="contact-email"
                      className="mb-1.5 block text-xs font-semibold text-slate-800 dark:text-slate-200"
                    >
                      Email address
                    </label>
                    <div className="contact-field-wrap">
                      <input
                        id="contact-email"
                        type="email"
                        required
                        disabled={submitState === 'loading'}
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (submitState === 'error') setSubmitState('idle');
                        }}
                        placeholder="email@example.com"
                        className="h-11 w-full scroll-mt-24 rounded-[7px] bg-[#f1f5f9] px-3.5 text-sm text-slate-950 placeholder:text-slate-600 dark:bg-[#161a24] dark:text-white dark:placeholder:text-slate-400"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="contact-message"
                    className="mb-1.5 block text-xs font-semibold text-slate-800 dark:text-slate-200"
                  >
                    Your message
                  </label>
                  <div className="contact-field-wrap">
                    <textarea
                      id="contact-message"
                      rows={4}
                      required
                      disabled={submitState === 'loading'}
                      value={message}
                      onChange={(e) => {
                        setMessage(e.target.value);
                        if (submitState === 'error') setSubmitState('idle');
                      }}
                      placeholder="Drop your message here..."
                      className="w-full scroll-mt-24 resize-none rounded-[7px] bg-[#f1f5f9] p-3.5 text-sm text-slate-950 placeholder:text-slate-600 dark:bg-[#161a24] dark:text-white dark:placeholder:text-slate-400"
                    />
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Your details are only used to reply to your message.
                </p>

                <button
                  type="submit"
                  disabled={submitState === 'loading'}
                  className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-slate-950 px-5 text-sm font-semibold text-white transition-colors hover:bg-slate-800 disabled:opacity-60 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
                >
                  {submitState === 'loading' ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                      <span>Sending message...</span>
                    </>
                  ) : (
                    <span>Send Message</span>
                  )}
                </button>
              </form>
            )}
          </div>

          <div className="h-56 lg:col-span-6 lg:h-[420px]" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}
