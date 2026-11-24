import { useRef, useState, type ReactNode } from 'react';
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from 'framer-motion';

// Spring-magnification dock powered by motion (useMotionValue + useTransform + useSpring).

export interface DockItem {
  id: string;
  label: string;
  short?: string;
  href?: string;
  active?: boolean;
  icon?: ReactNode;
  onClick?: () => void;
}

interface FloatingDockProps {
  items: DockItem[];
  reducedMotion?: boolean;
  ariaLabel?: string;
  className?: string;
  compact?: boolean;
}

function DockTile({
  item,
  mouseX,
  reducedMotion,
  compact,
}: {
  item: DockItem;
  mouseX: MotionValue<number>;
  reducedMotion: boolean;
  compact: boolean;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [hovered, setHovered] = useState(false);

  const baseSize = compact ? 44 : 46;
  const maxSize = compact ? 64 : 68;

  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const sizeTransform = useTransform(
    distance,
    [-130, 0, 130],
    [baseSize, maxSize, baseSize],
  );
  const size = useSpring(sizeTransform, {
    mass: 0.12,
    stiffness: 180,
    damping: 14,
  });

  const content = (
    <>
      {item.icon ? (
        <span className="flex items-center justify-center" aria-hidden="true">
          {item.icon}
        </span>
      ) : (
        <span className="font-mono text-[11px] font-bold tracking-tight">
          {item.short ?? item.label.slice(0, 4)}
        </span>
      )}
    </>
  );

  const sharedClasses = `relative flex h-full w-full items-center justify-center rounded-lg border transition-colors ${
    item.active
      ? 'border-amber-500 bg-amber-500 text-[#09090b] dark:border-amber-400 dark:bg-amber-400 dark:text-[#09090b]'
      : 'border-zinc-900/18 bg-white text-zinc-900 hover:border-amber-600 dark:border-white/16 dark:bg-[#161820] dark:text-zinc-100 dark:hover:border-amber-400'
  }`;

  return (
    <motion.div
      ref={ref}
      style={{
        width: reducedMotion ? baseSize : size,
        height: reducedMotion ? baseSize : size,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative flex shrink-0 items-center justify-center"
    >
      <AnimatePresence>
        {hovered && (
          <motion.span
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.12 }}
            className="pointer-events-none absolute -top-9 left-1/2 z-30 -translate-x-1/2 whitespace-nowrap rounded-md border border-zinc-900/15 bg-zinc-950 px-2.5 py-1 font-mono text-[11px] font-medium text-white shadow-md dark:border-white/20 dark:bg-white dark:text-zinc-950"
          >
            {item.label}
          </motion.span>
        )}
      </AnimatePresence>

      {item.href ? (
        <a
          href={item.href}
          aria-label={item.label}
          aria-current={item.active ? 'location' : undefined}
          onFocus={() => setHovered(true)}
          onBlur={() => setHovered(false)}
          className={sharedClasses}
        >
          {content}
        </a>
      ) : item.onClick ? (
        <button
          type="button"
          onClick={item.onClick}
          aria-label={item.label}
          onFocus={() => setHovered(true)}
          onBlur={() => setHovered(false)}
          className={sharedClasses}
        >
          {content}
        </button>
      ) : (
        <div
          tabIndex={0}
          aria-label={item.label}
          onFocus={() => setHovered(true)}
          onBlur={() => setHovered(false)}
          className={sharedClasses}
        >
          {content}
        </div>
      )}
    </motion.div>
  );
}

export function FloatingDock({
  items,
  reducedMotion = false,
  ariaLabel,
  className = '',
  compact = false,
}: FloatingDockProps) {
  const mouseX = useMotionValue(Infinity);

  return (
    <div
      role={ariaLabel ? 'navigation' : undefined}
      aria-label={ariaLabel}
      onMouseMove={(e) => {
        if (!reducedMotion) mouseX.set(e.clientX);
      }}
      onMouseLeave={() => mouseX.set(Infinity)}
      className={`inline-flex h-16 items-end gap-2 rounded-xl border border-zinc-900/18 bg-[#f5f4f0] px-3 pb-2 shadow-lg dark:border-white/16 dark:bg-[#111217] ${className}`}
    >
      {items.map((item) => (
        <DockTile
          key={item.id}
          item={item}
          mouseX={mouseX}
          reducedMotion={reducedMotion}
          compact={compact}
        />
      ))}
    </div>
  );
}
