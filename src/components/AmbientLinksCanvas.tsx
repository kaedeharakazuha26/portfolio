import { useEffect, useRef } from 'react';

// Pointer-aware node-links network adapted from Muhammad-waqar-uit/ambient-effects (MIT).

interface AmbientLinksCanvasProps {
  theme: 'dark' | 'light';
  enabled: boolean;
  reducedMotion: boolean;
}

interface LinkNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
  hue: number;
  z: number;
}

interface BurstParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  hue: number;
}

const TAU = Math.PI * 2;
const OFF = -9999;

export function AmbientLinksCanvas({
  theme,
  enabled,
  reducedMotion,
}: AmbientLinksCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const darkRef = useRef(theme === 'dark');
  darkRef.current = theme === 'dark';

  useEffect(() => {
    if (!enabled) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let rafId = 0;
    let width = window.innerWidth;
    let height = window.innerHeight;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const nodes: LinkNode[] = [];
    const bursts: BurstParticle[] = [];

    const pointer = { mx: OFF, my: OFF, pmx: OFF, pmy: OFF, mvx: 0, mvy: 0 };
    const scrollState = { sv: 0, lastY: window.scrollY };

    const initNodes = () => {
      nodes.length = 0;
      const areaScale = Math.min(1.35, Math.max(0.5, (width * height) / 900000));
      const count = Math.round(48 * areaScale * (reducedMotion ? 0.5 : 1));
      for (let i = 0; i < count; i++) {
        // Blend cyan (192) and warm amber-gold (38) nodes to match portfolio palette.
        const isWarm = i % 4 === 0;
        nodes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.65,
          vy: (Math.random() - 0.5) * 0.65,
          hue: isWarm ? 38 + Math.random() * 10 : 192 + Math.random() * 24,
          z: 0.65 + Math.random() * 0.75,
        });
      }
    };

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      initNodes();
    };

    resize();

    const onPointerMove = (e: PointerEvent) => {
      pointer.mx = e.clientX;
      pointer.my = e.clientY;
    };

    const onPointerLeave = () => {
      pointer.mx = OFF;
      pointer.my = OFF;
    };

    const onPointerDown = (e: PointerEvent) => {
      if (reducedMotion) return;
      const x = e.clientX;
      const y = e.clientY;
      // Push nearby nodes and spawn a subtle radial click burst.
      for (const p of nodes) {
        const dx = p.x - x;
        const dy = p.y - y;
        const d = Math.hypot(dx, dy) || 1;
        if (d < 280) {
          const f = 1 - d / 280;
          p.vx += (dx / d) * 5.2 * f;
          p.vy += (dy / d) * 5.2 * f;
        }
      }
      for (let i = 0; i < 12; i++) {
        const angle = Math.random() * TAU;
        const speed = 1.2 + Math.random() * 4.2;
        bursts.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1,
          hue: i % 2 === 0 ? 40 : 194,
        });
      }
    };

    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    document.addEventListener('pointerleave', onPointerLeave);
    window.addEventListener('pointerdown', onPointerDown, { passive: true });

    const draw = () => {
      const dark = darkRef.current;

      if (pointer.pmx < -900) {
        pointer.pmx = pointer.mx;
        pointer.pmy = pointer.my;
      }
      pointer.mvx += (pointer.mx - pointer.pmx - pointer.mvx) * 0.28;
      pointer.mvy += (pointer.my - pointer.pmy - pointer.mvy) * 0.28;
      pointer.pmx = pointer.mx;
      pointer.pmy = pointer.my;

      const curY = window.scrollY;
      scrollState.sv += (curY - scrollState.lastY - scrollState.sv) * 0.2;
      scrollState.lastY = curY;

      ctx.clearRect(0, 0, width, height);

      if (!reducedMotion) {
        for (const p of nodes) {
          p.x += p.vx;
          p.y += p.vy - scrollState.sv * 0.035;
          p.vx *= 0.992;
          p.vy *= 0.992;

          // Keep a gentle baseline drift so nodes never stall.
          const spd = Math.hypot(p.vx, p.vy);
          if (spd < 0.22) {
            p.vx += (Math.random() - 0.5) * 0.06;
            p.vy += (Math.random() - 0.5) * 0.06;
          }

          if (pointer.mx > -500) {
            const dx = p.x - pointer.mx;
            const dy = p.y - pointer.my;
            const d = Math.hypot(dx, dy) || 1;
            if (d < 175) {
              const f = 1 - d / 175;
              p.vx += (dx / d) * f * 0.08 + pointer.mvx * f * 0.035;
              p.vy += (dy / d) * f * 0.08 + pointer.mvy * f * 0.035;
            }
          }

          if (p.x < -20) p.x = width + 20;
          if (p.x > width + 20) p.x = -20;
          if (p.y < -20) p.y = height + 20;
          if (p.y > height + 20) p.y = -20;
        }
      }

      const maxD = 155;
      ctx.globalCompositeOperation = dark ? 'lighter' : 'source-over';

      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i]!;
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j]!;
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < maxD) {
            const alpha = (1 - d / maxD) * (dark ? 0.36 : 0.24);
            ctx.strokeStyle = dark
              ? `hsla(198, 72%, 68%, ${alpha})`
              : `hsla(200, 62%, 34%, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }

        if (pointer.mx > -500) {
          const dm = Math.hypot(a.x - pointer.mx, a.y - pointer.my);
          if (dm < 230) {
            const alpha = (1 - dm / 230) * (dark ? 0.52 : 0.34);
            ctx.strokeStyle = dark
              ? `hsla(40, 92%, 64%, ${alpha})`
              : `hsla(32, 85%, 38%, ${alpha})`;
            ctx.lineWidth = 1.15;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(pointer.mx, pointer.my);
            ctx.stroke();
          }
        }

        ctx.fillStyle = dark
          ? `hsla(${a.hue}, 88%, 74%, 0.78)`
          : `hsla(${a.hue}, 70%, 38%, 0.62)`;
        ctx.beginPath();
        ctx.arc(a.x, a.y, 1.4 + a.z * 1.15, 0, TAU);
        ctx.fill();
      }

      for (let i = bursts.length - 1; i >= 0; i--) {
        const b = bursts[i]!;
        b.x += b.vx;
        b.y += b.vy;
        b.vx *= 0.95;
        b.vy = b.vy * 0.95 + 0.04;
        b.life -= 0.024;
        if (b.life <= 0) {
          bursts.splice(i, 1);
          continue;
        }
        ctx.fillStyle = dark
          ? `hsla(${b.hue}, 92%, 68%, ${b.life * 0.85})`
          : `hsla(${b.hue}, 80%, 38%, ${b.life * 0.65})`;
        ctx.beginPath();
        ctx.arc(b.x, b.y, 1.8 * b.life + 0.6, 0, TAU);
        ctx.fill();
      }

      ctx.globalCompositeOperation = 'source-over';

      if (!reducedMotion) {
        rafId = requestAnimationFrame(draw);
      }
    };

    draw();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('pointerleave', onPointerLeave);
      window.removeEventListener('pointerdown', onPointerDown);
    };
  }, [enabled, reducedMotion]);

  if (!enabled) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[2]"
    />
  );
}
