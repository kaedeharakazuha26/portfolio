import { useEffect, useRef, useState } from 'react';

interface ElasticCursorProps {
  disabled: boolean;
}

export function ElasticCursor({ disabled }: ElasticCursorProps) {
  const [active, setActive] = useState(false);
  const ringRef = useRef<HTMLDivElement | null>(null);
  const dotRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (disabled) return;
    if (typeof window === 'undefined') return;
    const finePointer = window.matchMedia('(pointer: fine)').matches;
    if (!finePointer) return;

    let visible = false;
    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;
    let hoveredRect: DOMRect | null = null;
    let curW = 36;
    let curH = 36;
    let curRadius = 18;
    let rafId = 0;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!visible) {
        visible = true;
        ringX = mouseX;
        ringY = mouseY;
        setActive(true);
      }
      const target = e.target as Element | null;
      const interactive = target?.closest('a, button, [role="button"], [role="tab"]');
      if (interactive) {
        const rect = interactive.getBoundingClientRect();
        // Snap around compact interactive controls; keep circular halo over very wide blocks
        hoveredRect = rect.width <= 320 && rect.height <= 96 ? rect : null;
      } else {
        hoveredRect = null;
      }
    };

    const onLeave = () => {
      visible = false;
      hoveredRect = null;
      setActive(false);
    };

    const tick = () => {
      rafId = requestAnimationFrame(tick);

      const targetX = hoveredRect
        ? hoveredRect.left + hoveredRect.width / 2
        : mouseX;
      const targetY = hoveredRect
        ? hoveredRect.top + hoveredRect.height / 2
        : mouseY;

      const vx = targetX - ringX;
      const vy = targetY - ringY;
      ringX += vx * 0.2;
      ringY += vy * 0.2;

      const targetW = hoveredRect ? hoveredRect.width + 10 : 34;
      const targetH = hoveredRect ? hoveredRect.height + 10 : 34;
      const targetR = hoveredRect ? 11 : 17;

      curW += (targetW - curW) * 0.22;
      curH += (targetH - curH) * 0.22;
      curRadius += (targetR - curRadius) * 0.22;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouseX - 3}px, ${mouseY - 3}px, 0)`;
        dotRef.current.style.opacity = hoveredRect ? '0.45' : '1';
      }

      if (ringRef.current) {
        if (hoveredRect) {
          ringRef.current.style.width = `${curW}px`;
          ringRef.current.style.height = `${curH}px`;
          ringRef.current.style.borderRadius = `${curRadius}px`;
          ringRef.current.style.transform = `translate3d(${ringX - curW / 2}px, ${ringY - curH / 2}px, 0)`;
          ringRef.current.style.borderColor = 'rgba(245, 158, 11, 0.85)';
        } else {
          // Velocity-driven elastic stretch along travel angle
          const speed = Math.min(Math.hypot(vx, vy), 65);
          const stretch = 1 + speed * 0.0085;
          const squeeze = 1 / Math.sqrt(stretch);
          const angle = speed > 1.5 ? Math.atan2(vy, vx) : 0;

          ringRef.current.style.width = `${curW}px`;
          ringRef.current.style.height = `${curH}px`;
          ringRef.current.style.borderRadius = `${curRadius}px`;
          ringRef.current.style.transform = `translate3d(${ringX - curW / 2}px, ${ringY - curH / 2}px, 0) rotate(${angle}rad) scale(${stretch}, ${squeeze})`;
          ringRef.current.style.borderColor = '';
        }
      }
    };

    const onScroll = () => {
      hoveredRect = null;
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('mouseleave', onLeave);
    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('mouseleave', onLeave);
    };
  }, [disabled]);

  if (disabled || !active) return null;

  return (
    <>
      <div
        ref={ringRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-50 hidden border border-amber-700/55 bg-amber-500/[0.06] transition-colors duration-150 dark:border-amber-400/65 lg:block"
      />
      <div
        ref={dotRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-50 hidden h-1.5 w-1.5 rounded-full bg-amber-700 dark:bg-amber-400 lg:block"
      />
    </>
  );
}
