'use client';

import Lenis from 'lenis';
import { createContext, useContext, useEffect, useRef, type ReactNode, type RefObject } from 'react';

const SmoothScrollContext = createContext<RefObject<Lenis | null> | null>(null);

export function useSmoothScroll() {
  return useContext(SmoothScrollContext);
}

export default function SmoothScroll({ children }: { children: ReactNode }) {
  const controller = useRef<Lenis | null>(null);

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const configure = () => {
      controller.current?.destroy();
      controller.current = preference.matches ? null : new Lenis({
        autoRaf: true,
        anchors: true,
        smoothWheel: true,
        syncTouch: true,
        syncTouchLerp: 0.06,
        touchMultiplier: 0.65,
        wheelMultiplier: 0.4,
        lerp: 0.045,
      });
    };
    const onKeyDown = (event: KeyboardEvent) => {
      const lenis = controller.current;
      if (!lenis || event.altKey || event.ctrlKey || event.metaKey || event.defaultPrevented) return;
      if (event.target instanceof Element && event.target.closest('input, textarea, select, button, [contenteditable="true"]')) return;
      const distance = window.innerHeight * 0.6;
      const offsets: Record<string, number> = {
        ArrowDown: 70,
        ArrowUp: -70,
        PageDown: distance,
        PageUp: -distance,
        ' ': event.shiftKey ? -distance : distance,
      };
      if (event.key === 'Home' || event.key === 'End' || event.key in offsets) {
        event.preventDefault();
        const target = event.key === 'Home' ? 0 : event.key === 'End' ? lenis.limit : lenis.targetScroll + offsets[event.key];
        lenis.scrollTo(target, { duration: 1.1 });
      }
    };
    configure();
    preference.addEventListener('change', configure);
    window.addEventListener('keydown', onKeyDown);
    return () => {
      preference.removeEventListener('change', configure);
      window.removeEventListener('keydown', onKeyDown);
      controller.current?.destroy();
      controller.current = null;
    };
  }, []);

  return <SmoothScrollContext.Provider value={controller}>{children}</SmoothScrollContext.Provider>;
}