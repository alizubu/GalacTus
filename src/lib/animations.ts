/**
 * Shared animation utilities.
 * Mobile-aware — reduces motion values on small screens.
 * Desktop values are never changed.
 */

export function isMobile(): boolean {
  if (typeof window === "undefined") return false;
  return window.innerWidth < 768;
}

/** Fade-up whileInView config */
export function fadeUp(delay = 0) {
  const mobile = isMobile();
  return {
    initial:   { opacity: 0, y: mobile ? 16 : 32 },
    whileInView: { opacity: 1, y: 0 },
    viewport:  { once: true, amount: 0.15 as const },
    transition: {
      duration: mobile ? 0.4 : 0.6,
      delay,
      ease: "easeOut" as const,
    },
  };
}

/** Stagger container variants */
export function staggerContainer(baseDelay = 0) {
  const mobile = isMobile();
  return {
    initial: "hidden" as const,
    whileInView: "visible" as const,
    viewport: { once: true, amount: 0.15 as const },
    variants: {
      hidden: {},
      visible: {
        transition: {
          staggerChildren: mobile ? 0.08 : 0.15,
          delayChildren: baseDelay,
        },
      },
    },
  };
}

/** Stagger child item variants */
export function staggerItem() {
  const mobile = isMobile();
  return {
    variants: {
      hidden:   { opacity: 0, y: mobile ? 14 : 28 },
      visible:  {
        opacity: 1,
        y: 0,
        transition: {
          duration: mobile ? 0.35 : 0.55,
          ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
        },
      },
    },
  };
}
