'use client';

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { useSmoothScroll } from '@/components/smooth-scroll';

import SoftwareDetails from '@/components/software-details';
import FounderDetails from '@/components/founder-details';
import SideJobDetails from '@/components/side-job-details';
import HobbyDetails from '@/components/hobby-details';

const softwareTheme = {
  '--theme-accent': '#3d9bff',
  '--theme-accent-rgb': '61,155,255',
  '--theme-on-accent': '#ffffff',
  '--theme-top': '#0b1528',
  '--theme-bottom': '#03060d',
  '--theme-surface': '9,16,30',
  '--theme-dot': '120,170,255',
  '--theme-title': 'linear-gradient(180deg, #6fd0ff 0%, #2f86ff 55%, #1f55f0 100%)',
} as CSSProperties;

const founderTheme = {
  '--theme-accent': '#9db495',
  '--theme-accent-rgb': '157,180,149',
  '--theme-on-accent': '#0c0e0b',
  '--theme-top': '#171612',
  '--theme-bottom': '#080807',
  '--theme-surface': '22,22,18',
  '--theme-dot': '210,200,180',
  '--theme-title': 'linear-gradient(180deg, #b3c6ad 0%, #8aa283 50%, #667f60 100%)',
} as CSSProperties;

const sideJobTheme = {
  '--theme-accent': '#e39d5c',
  '--theme-accent-rgb': '227,157,92',
  '--theme-on-accent': '#1a0f08',
  '--theme-top': '#26160d',
  '--theme-bottom': '#0c0705',
  '--theme-surface': '32,20,13',
  '--theme-dot': '230,190,150',
  '--theme-title': 'linear-gradient(180deg, #b9ccb3 0%, #91aa8b 55%, #6f8a69 100%)',
} as CSSProperties;

const hobbyTheme = {
  '--theme-accent': '#a8c293',
  '--theme-accent-rgb': '168,194,147',
  '--theme-on-accent': '#0b0d0a',
  '--theme-top': '#151613',
  '--theme-bottom': '#060606',
  '--theme-surface': '21,22,19',
  '--theme-dot': '200,205,190',
  '--theme-title': 'linear-gradient(180deg, #f2efe6 0%, #c9d8bd 45%, #8faa7f 100%)',
} as CSSProperties;

const details: { title: string; eyebrow?: string; content?: ReactNode; theme?: CSSProperties }[] = [
  { title: 'Software Developer', eyebrow: 'Swisscom', content: <SoftwareDetails />, theme: softwareTheme },
  { title: 'Founder & CEO', eyebrow: 'Wendico KLG', content: <FounderDetails />, theme: founderTheme },
  { title: 'Side Jobs', eyebrow: 'Reb-Thai', content: <SideJobDetails />, theme: sideJobTheme },
  { title: 'Hobbys', eyebrow: 'Beyond work', content: <HobbyDetails />, theme: hobbyTheme },
];

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
    smoothScroll?.current?.stop();
    const frame = requestAnimationFrame(() => setShown(true));
    closeRef.current?.focus({ preventScroll: true });
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setShown(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('keydown', onKeyDown);
      root.classList.remove('details-open');
      smoothScroll?.current?.start();
      triggerRef.current?.focus({ preventScroll: true });
    };
  }, [active, smoothScroll]);

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
      if (Math.abs(delta) > 6) handle(delta, event);
    };
    const onKeyDown = (event: KeyboardEvent) => {
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
