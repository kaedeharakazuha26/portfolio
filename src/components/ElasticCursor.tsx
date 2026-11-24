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
    let hoveringInteractive = false;
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
      hoveringInteractive = Boolean(
        target?.closest('a, button, input, textarea, [role="button"]'),
      );
    };

    const onLeave = () => {
      visible = false;
      setActive(false);
    };

    const tick = () => {
      rafId = requestAnimationFrame(tick);
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouseX - 3}px, ${mouseY - 3}px, 0)`;
      }
      if (ringRef.current) {
        const scale = hoveringInteractive ? 1.55 : 1;
        ringRef.current.style.transform = `translate3d(${ringX - 18}px, ${ringY - 18}px, 0) scale(${scale})`;
      }
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseleave', onLeave);
    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', onLeave);
    };
  }, [disabled]);

  if (disabled || !active) return null;

  return (
    <>
      <div
        ref={ringRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-50 hidden h-9 w-9 rounded-full border border-slate-900/35 bg-white/10 backdrop-invert-[0.06] transition-opacity duration-200 dark:border-white/45 lg:block"
      />
      <div
        ref={dotRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-50 hidden h-1.5 w-1.5 rounded-full bg-slate-900 dark:bg-white lg:block"
      />
    </>
  );
}
