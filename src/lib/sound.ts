// Lightweight synthesized Web Audio acoustics for tactile speedcube feedback.
// Zero external audio assets required; fails silently if browser blocks autoplay.

let audioCtx: AudioContext | null = null;
let soundEnabled = true;

export function setSoundEnabled(enabled: boolean): void {
  soundEnabled = enabled;
}

export function isSoundEnabled(): boolean {
  return soundEnabled;
}

function getContext(): AudioContext | null {
  if (!soundEnabled || typeof window === 'undefined') return null;
  const Ctx =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;
  if (!Ctx) return null;
  if (!audioCtx) {
    audioCtx = new Ctx();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

/** Tactile speedcube magnetic click when a layer snaps into place. */
export function playTwistSound(): void {
  const ctx = getContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  // Short filtered noise burst for plastic friction
  const bufferSize = Math.floor(ctx.sampleRate * 0.045);
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.25));
  }

  const noise = ctx.createBufferSource();
  noise.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(1450 + Math.random() * 350, now);
  filter.Q.setValueAtTime(2.4, now);

  const noiseGain = ctx.createGain();
  noiseGain.gain.setValueAtTime(0.11, now);
  noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);

  noise.connect(filter);
  filter.connect(noiseGain);
  noiseGain.connect(ctx.destination);
  noise.start(now);

  // Subtle magnetic snap body tone
  const osc = ctx.createOscillator();
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(340 + Math.random() * 55, now);
  osc.frequency.exponentialRampToValueAtTime(135, now + 0.038);

  const oscGain = ctx.createGain();
  oscGain.gain.setValueAtTime(0.07, now);
  oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

  osc.connect(oscGain);
  oscGain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.042);
}

/** Soft micro-tick when hovering across a skill sticker. */
export function playHoverTick(): void {
  const ctx = getContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(920, now);
  osc.frequency.exponentialRampToValueAtTime(520, now + 0.018);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.025, now);
  gain.gain.exponentialRampToValueAtTime(0.0008, now + 0.02);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.022);
}

/** Subtle ascending chime when cube completes a full solve or message sends. */
export function playSolveChime(): void {
  const ctx = getContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const notes = [523.25, 659.25, 783.99];
  notes.forEach((freq, i) => {
    const start = now + i * 0.065;
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, start);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.linearRampToValueAtTime(0.045, start + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0008, start + 0.26);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(start);
    osc.stop(start + 0.28);
  });
}
