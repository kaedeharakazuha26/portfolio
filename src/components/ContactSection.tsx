import { useState, type FormEvent } from 'react';
import {
  AlertCircle,
  Check,
  CheckCircle2,
  Copy,
  Loader2,
  RotateCw,
} from 'lucide-react';
import { PORTFOLIO_CONFIG } from '../data/config';
import { GithubIcon, LinkedinIcon } from './SocialIcons';

interface ContactSectionProps {
  onSubmitted: () => void;
  onCelebrate: () => void;
  onNotify: (message: string) => void;
}

type SubmitState = 'idle' | 'loading' | 'success' | 'error';

export function ContactSection({
  onSubmitted,
  onCelebrate,
  onNotify,
}: ContactSectionProps) {
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
        await new Promise((resolve) => window.setTimeout(resolve, 400));
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
      className="relative z-20 px-5 py-16 sm:px-8 sm:py-24"
    >
      <div className="mx-auto max-w-6xl">
        {/* Split 2-column architectural Contact Card (distinct from single-column form clone) */}
        <div
          data-ui-block="true"
          className="grid grid-cols-1 overflow-hidden rounded-xl border border-zinc-900/18 bg-white dark:border-white/16 dark:bg-[#121318] lg:grid-cols-12"
        >
          {/* Left direct info & links rail */}
          <div className="flex flex-col justify-between border-b border-zinc-900/12 bg-zinc-50 p-6 dark:border-white/12 dark:bg-[#0e0f14] sm:p-8 lg:col-span-5 lg:border-b-0 lg:border-r">
            <div>
              <p className="font-mono text-xs font-medium text-amber-700 dark:text-amber-400">
                05 / GET IN TOUCH
              </p>
              <h2 className="font-display mt-2 text-3xl font-extrabold leading-tight tracking-tight text-zinc-950 dark:text-white sm:text-4xl">
                Start a conversation.
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                Open to junior full-stack developer roles, collaborative builds, and
                web/AI tooling work.
              </p>

              <div className="mt-6 space-y-3">
                {PORTFOLIO_CONFIG.email && (
                  <div className="flex items-center justify-between gap-2 rounded-lg border border-zinc-900/14 bg-white px-3.5 py-2.5 dark:border-white/14 dark:bg-[#161820]">
                    <a
                      href={`mailto:${PORTFOLIO_CONFIG.email}`}
                      className="truncate text-sm font-medium text-zinc-950 underline decoration-amber-600/60 underline-offset-4 dark:text-white"
                    >
                      {PORTFOLIO_CONFIG.displayEmail || PORTFOLIO_CONFIG.email}
                    </a>
                    <button
                      type="button"
                      onClick={handleCopyEmail}
                      aria-label="Copy email address"
                      className="inline-flex min-h-9 items-center gap-1 rounded-md border border-zinc-900/14 px-2.5 font-mono text-xs text-zinc-700 dark:border-white/14 dark:text-zinc-300"
                    >
                      {copied ? (
                        <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                      )}
                      <span>{copied ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                )}

                <div className="flex flex-wrap gap-2.5">
                  <a
                    href={PORTFOLIO_CONFIG.socials.github}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-zinc-900/18 bg-white px-4 text-xs font-semibold text-zinc-950 transition-colors hover:border-amber-600 dark:border-white/16 dark:bg-[#161820] dark:text-white dark:hover:border-amber-400"
                  >
                    <GithubIcon className="h-4 w-4" />
                    <span>GitHub</span>
                  </a>

                  <a
                    href={PORTFOLIO_CONFIG.socials.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-zinc-900/18 bg-white px-4 text-xs font-semibold text-zinc-950 transition-colors hover:border-amber-600 dark:border-white/16 dark:bg-[#161820] dark:text-white dark:hover:border-amber-400"
                  >
                    <LinkedinIcon className="h-4 w-4" />
                    <span>LinkedIn</span>
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-8 border-t border-zinc-900/12 pt-5 dark:border-white/12">
              <button
                type="button"
                onClick={onCelebrate}
                className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-zinc-900/18 bg-white px-3.5 font-mono text-xs font-medium text-zinc-800 transition-colors hover:border-amber-600 dark:border-white/16 dark:bg-[#161820] dark:text-zinc-200 dark:hover:border-amber-400"
              >
                <RotateCw className="h-3.5 w-3.5 text-amber-700 dark:text-amber-400" aria-hidden="true" />
                <span>Spin the Rubik&apos;s Cube</span>
              </button>
            </div>
          </div>

          {/* Right validated form panel */}
          <div className="p-6 sm:p-8 lg:col-span-7">
            {submitState === 'success' ? (
              <div
                role="status"
                aria-live="polite"
                className="rounded-lg border border-emerald-700/35 bg-emerald-50 p-5 dark:border-emerald-400/35 dark:bg-emerald-950/40"
              >
                <div className="flex items-start gap-3">
                  <CheckCircle2
                    className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700 dark:text-emerald-400"
                    aria-hidden="true"
                  />
                  <div>
                    <p className="text-sm font-semibold text-zinc-950 dark:text-white">
                      Message received
                    </p>
                    <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-300">
                      {feedbackText}
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setSubmitState('idle');
                        setFeedbackText('');
                      }}
                      className="mt-4 min-h-11 rounded-lg bg-amber-700 px-4 text-xs font-semibold text-white transition-colors hover:bg-amber-800 dark:bg-amber-500 dark:text-[#09090b] dark:hover:bg-amber-400"
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
                className="space-y-4"
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
                      className="mb-1.5 block text-xs font-semibold text-zinc-800 dark:text-zinc-200"
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
                        className="h-11 w-full scroll-mt-24 rounded-[7px] bg-[#f5f4f0] px-3.5 text-sm text-zinc-950 placeholder:text-zinc-600 dark:bg-[#181920] dark:text-white dark:placeholder:text-zinc-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="contact-email"
                      className="mb-1.5 block text-xs font-semibold text-zinc-800 dark:text-zinc-200"
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
                        className="h-11 w-full scroll-mt-24 rounded-[7px] bg-[#f5f4f0] px-3.5 text-sm text-zinc-950 placeholder:text-zinc-600 dark:bg-[#181920] dark:text-white dark:placeholder:text-zinc-400"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="contact-message"
                    className="mb-1.5 block text-xs font-semibold text-zinc-800 dark:text-zinc-200"
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
                      className="w-full scroll-mt-24 resize-none rounded-[7px] bg-[#f5f4f0] p-3.5 text-sm text-zinc-950 placeholder:text-zinc-600 dark:bg-[#181920] dark:text-white dark:placeholder:text-zinc-400"
                    />
                  </div>
                </div>

                <p className="text-xs text-zinc-600 dark:text-zinc-400">
                  Your details are only used to reply to your message.
                </p>

                <button
                  type="submit"
                  disabled={submitState === 'loading'}
                  className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-amber-700 px-5 text-sm font-semibold text-white transition-colors hover:bg-amber-800 disabled:opacity-60 dark:bg-amber-500 dark:text-[#09090b] dark:hover:bg-amber-400"
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
        </div>
      </div>
    </section>
  );
}
