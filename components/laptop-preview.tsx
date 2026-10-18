'use client';

import { useEffect, useRef, useState, type MouseEvent } from 'react';
import { usePrivacy } from '@/components/privacy-preferences';
import Link from 'next/link';

const SITE_URL = 'https://wendico.ch';
const VIEWPORT_WIDTH = 1280;

export default function LaptopPreview() {
  const { external, allowExternal } = usePrivacy();
  const [open, setOpen] = useState(true);
  const [scale, setScale] = useState(0.5);
  const displayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const display = displayRef.current;
    if (!display) return;
    const observer = new ResizeObserver(() => setScale(display.clientWidth / VIEWPORT_WIDTH));
    observer.observe(display);
    return () => observer.disconnect();
  }, []);

  const tilt = (event: MouseEvent<HTMLDivElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    event.currentTarget.style.setProperty('--laptop-turn', `${(x * 10).toFixed(2)}deg`);
  };

  return (
    <div
      className="laptop"
      data-open={open}
      onMouseMove={tilt}
      onMouseLeave={(event) => event.currentTarget.style.setProperty('--laptop-turn', '0deg')}
    >
      <div className="laptop__scene">
        <div className="laptop__hint" data-hidden={!open} aria-hidden="true">
          <svg viewBox="0 0 240 170" fill="none">
            <path className="laptop__hint-line" d="M38 128 C26 86 62 46 104 64 C136 78 128 112 104 108 C80 104 86 66 122 52 C156 39 196 46 226 64" />
            <path className="laptop__hint-head" d="M208 46 L228 65 L203 72" />
          </svg>
          <span>scroll</span>
        </div>
        <div className="laptop__body">
          <div className="laptop__lid">
            <div className="laptop__screen">
              <div ref={displayRef} className="laptop__display">
                {external ? <iframe
                  src={SITE_URL}
                  title="Wendico website"
                  loading="lazy"
                  sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                  referrerPolicy="no-referrer"
                  tabIndex={open ? 0 : -1}
                  style={{ width: VIEWPORT_WIDTH, height: `${100 / scale}%`, transform: `scale(${scale})` }}
                /> : (
                  <div className="laptop__consent">
                    <strong>Wendico live</strong>
                    <p>Die Vorschau lädt die externe Website wendico.ch und übermittelt dabei Daten wie deine IP-Adresse.</p>
                    <button type="button" onClick={allowExternal}>Externe Vorschau laden</button>
                    <Link href="/legal/privacy">Datenschutzhinweise</Link>
                  </div>
                )}
              </div>
            </div>
            <button type="button" className="laptop__cover" aria-label="Open laptop" tabIndex={open ? -1 : 0} onClick={() => setOpen(true)}>
              <span>W</span>
            </button>
          </div>
          <div className="laptop__base">
            <span className="laptop__keys" aria-hidden="true" />
            <span className="laptop__pad" aria-hidden="true" />
          </div>
        </div>
      </div>
      <div className="laptop__controls">
        <a className="laptop__visit" href={SITE_URL} target="_blank" rel="noopener noreferrer">
          Visit wendico.ch
          <span aria-hidden="true">↗</span>
        </a>
        <button type="button" className="sd-chip" aria-pressed={!open} onClick={() => setOpen(!open)}>
          {open ? 'Close laptop' : 'Open laptop'}
        </button>
      </div>
    </div>
  );
}
