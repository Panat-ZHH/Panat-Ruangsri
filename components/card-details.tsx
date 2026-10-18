'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useSmoothScroll } from '@/components/smooth-scroll';

import { portfolioPages as details } from '@/components/portfolio-content';

export default function CardDetails() {
  const smoothScroll = useSmoothScroll();
  const [active, setActive] = useState<number | null>(null);
  const [shown, setShown] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const close = () => setShown(false);

  useEffect(() => {
    if (active === null) return;
    const root = document.documentElement;
    root.classList.add('details-open');
    const controller = smoothScroll?.current;
    controller?.stop();
    const frame = requestAnimationFrame(() => setShown(true));
    closeRef.current?.focus({ preventScroll: true });
    const background = Array.from(document.querySelectorAll<HTMLElement>('main, .site-header, .site-footer'));
    const inertStates = background.map((element) => element.inert);
    background.forEach((element) => { element.inert = true; });
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setShown(false);
      if (event.key === 'Tab') {
        const panel = closeRef.current?.closest('article');
        const focusable = Array.from(panel?.querySelectorAll<HTMLElement>('button:not(:disabled), a[href], input, iframe, [tabindex="0"]') ?? [])
          .filter((element) => element.getClientRects().length > 0 && element.tabIndex >= 0);
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('keydown', onKeyDown);
      root.classList.remove('details-open');
      background.forEach((element, index) => { element.inert = inertStates[index]; });
      controller?.start();
      triggerRef.current?.focus({ preventScroll: true });
    };
  }, [active, smoothScroll]);

  useEffect(() => {
    if (active === null || shown) return;
    const timer = window.setTimeout(() => setActive(null), 800);
    return () => window.clearTimeout(timer);
  }, [active, shown]);

  useEffect(() => {
    const scroller = scrollRef.current;
    if (active === null || !scroller) return;
    let isExpanded = false;
    let changedAt = 0;
    let touchY = 0;
    const setState = (next: boolean) => {
      isExpanded = next;
      changedAt = performance.now();
      setExpanded(next);
    };
    // The first downward gesture only grows the sheet to fullscreen; content scrolls afterwards.
    const handle = (delta: number, event: Event) => {
      if (performance.now() - changedAt < 550) {
        if (event.cancelable) event.preventDefault();
        return;
      }
      if (!isExpanded && delta > 0) {
        if (event.cancelable) event.preventDefault();
        setState(true);
      } else if (isExpanded && delta < 0 && scroller.scrollTop <= 0) {
        if (event.cancelable) event.preventDefault();
        setState(false);
      }
    };
    const onWheel = (event: WheelEvent) => handle(event.deltaY, event);
    const onTouchStart = (event: TouchEvent) => { touchY = event.touches[0].clientY; };
    const onTouchMove = (event: TouchEvent) => {
      const delta = touchY - event.touches[0].clientY;
      touchY = event.touches[0].clientY;
      if (Math.abs(delta) > 6) handle(delta, event);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.target instanceof Element && event.target.closest('button, a, input, select, textarea')) return;
      if (['ArrowDown', 'PageDown'].includes(event.key)) handle(1, event);
      if (['ArrowUp', 'PageUp'].includes(event.key)) handle(-1, event);
    };
    scroller.addEventListener('wheel', onWheel, { passive: false });
    scroller.addEventListener('touchstart', onTouchStart, { passive: true });
    scroller.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('keydown', onKeyDown);
    return () => {
      scroller.removeEventListener('wheel', onWheel);
      scroller.removeEventListener('touchstart', onTouchStart);
      scroller.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [active]);

  const item = active === null ? null : details[active];

  return (
    <>
      <div className="hero-card-actions">
        {details.map((entry, index) => (
          <button
            key={entry.title}
            type="button"
            className="hero-card-action"
            aria-label={`${entry.title} Details`}
            hidden
            onClick={(event) => {
              triggerRef.current = event.currentTarget;
              setExpanded(false);
              setActive(index);
            }}
          >
            <span className="hero-card-action__dot" aria-hidden="true" />
            Details
            <span className="hero-card-action__arrow" aria-hidden="true">↗</span>
          </button>
        ))}
      </div>
      {item && createPortal(
        <div className={`details-sheet${shown ? ' is-open' : ''}${expanded ? ' is-expanded' : ''}`} style={item.theme} onClick={close}>
          <article
            className="details-sheet__panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="details-sheet-title"
            onClick={(event) => event.stopPropagation()}
            onTransitionEnd={(event) => {
              if (!shown && event.target === event.currentTarget && event.propertyName === 'transform') setActive(null);
            }}
          >
            <button ref={closeRef} type="button" className="details-sheet__close" aria-label="Schliessen" onClick={close}>
              <span aria-hidden="true" />
            </button>
            <div ref={scrollRef} className="details-sheet__scroll" data-lenis-prevent>
              <header className="details-sheet__header">
                <span className="details-sheet__index">
                  {String((active ?? 0) + 1).padStart(2, '0')} / 04{item.eyebrow ? ` — ${item.eyebrow}` : ''}
                </span>
                <h2 id="details-sheet-title" className="details-sheet__title">
                  {item.title.split(' ').slice(0, -1).join(' ')}{item.title.includes(' ') ? ' ' : ''}
                  <span className="details-sheet__title-accent">{item.title.split(' ').at(-1)}</span>
                </h2>
              </header>
              {item.content}
            </div>
          </article>
        </div>,
        document.body,
      )}
    </>
  );
}
