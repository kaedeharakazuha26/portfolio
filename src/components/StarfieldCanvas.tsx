import { useEffect, useRef } from 'react';

interface StarfieldCanvasProps {
  theme: 'dark' | 'light';
  reducedMotion: boolean;
}

interface Star {
  x: number;
  y: number;
  r: number;
  baseAlpha: number;
  speed: number;
  phase: number;
  vx: number;
  vy: number;
  tint: string;
}

export function StarfieldCanvas({ theme, reducedMotion }: StarfieldCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let rafId = 0;
    let width = window.innerWidth;
    let height = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();

    const starCount = Math.min(130, Math.max(65, Math.floor((width * height) / 14000)));
    const darkTints = ['#ffffff', '#dbeafe', '#bfdbfe', '#fed7aa'];
    const lightTints = ['#334155', '#2563eb', '#64748b'];

    const stars: Star[] = Array.from({ length: starCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.45 + 0.45,
      baseAlpha: Math.random() * 0.55 + 0.2,
      speed: Math.random() * 0.015 + 0.005,
      phase: Math.random() * Math.PI * 2,
      vx: (Math.random() - 0.5) * 0.08,
      vy: (Math.random() - 0.5) * 0.08,
      tint:
        theme === 'dark'
          ? darkTints[Math.floor(Math.random() * darkTints.length)]
          : lightTints[Math.floor(Math.random() * lightTints.length)],
    }));

    let frame = 0;
    const render = () => {
      frame += 1;
      ctx.clearRect(0, 0, width, height);

      for (const s of stars) {
        if (!reducedMotion) {
          s.x = (s.x + s.vx + width) % width;
          s.y = (s.y + s.vy + height) % height;
        }
        const twinkle = reducedMotion
          ? 1
          : 0.55 + 0.45 * Math.sin(frame * s.speed + s.phase);
        const alpha =
          theme === 'dark' ? s.baseAlpha * twinkle : s.baseAlpha * twinkle * 0.35;

        ctx.globalAlpha = alpha;
        ctx.fillStyle = s.tint;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      if (!reducedMotion) {
        rafId = requestAnimationFrame(render);
      }
    };

    render();
    window.addEventListener('resize', resize);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
    };
  }, [theme, reducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0"
    />
  );
}
