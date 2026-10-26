'use client';

import { useEffect, useRef } from 'react';

const QUOTE = 'You miss 100% of the shots you don’t take.';

function MovingStripes() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return;
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const randomShape = (index: number) => ({
      x: (Math.floor(index / 2) + Math.random() * 0.7) / 16,
      angle: (Math.random() - 0.5) * 0.42,
      length: 0.4 + Math.random() * 0.55,
      width: 0.012 + Math.random() * 0.018,
      bend: (Math.random() - 0.5) * 0.22,
      curl: (Math.random() - 0.5) * 0.18,
    });
    const stripes = Array.from({ length: 32 }, (_, index) => ({
      index,
      from: randomShape(index),
      to: randomShape(index),
      fork: index % 3 === 0,
      elapsed: 0,
      duration: 4 + Math.random() * 5,
    }));
    let width = 0;
    let height = 0;
    let frame = 0;
    let previousTime = 0;
    let visible = false;
    const draw = (time: number) => {
      frame = 0;
      const delta = previousTime ? Math.min((time - previousTime) / 1000, 0.05) : 0;
      previousTime = time;
      context.clearRect(0, 0, width, height);
      context.fillStyle = '#d6d6d2';
      for (const stripe of stripes) {
        if (!preference.matches) stripe.elapsed += delta;
        if (stripe.elapsed >= stripe.duration) {
          stripe.from = stripe.to;
          const target = randomShape(stripe.index);
          target.angle = stripe.from.angle + Math.atan2(
            Math.sin(target.angle - stripe.from.angle), Math.cos(target.angle - stripe.from.angle),
          );
          stripe.to = target;
          stripe.elapsed = 0;
          stripe.duration = 4 + Math.random() * 5;
        }
        const progress = stripe.elapsed / stripe.duration;
        const blend = progress * progress * (3 - 2 * progress);
        const sample = (key: keyof typeof stripe.from) => stripe.from[key] + (stripe.to[key] - stripe.from[key]) * blend;
        const length = sample('length') * height;
        const thickness = sample('width') * width;
        const bend = sample('bend') * length;
        const curl = sample('curl') * length;
        context.save();
        context.translate(sample('x') * width, stripe.index % 2 === 0 ? -height * 0.08 : height * 1.08);
        context.rotate(sample('angle') + (stripe.index % 2 === 0 ? 0 : Math.PI));
        context.beginPath();
        context.moveTo(-thickness, 0);
        context.bezierCurveTo(-thickness * 1.2, length * 0.12, bend - thickness * 0.6, length * 0.2, bend - thickness * 0.55, length * 0.34);
        context.bezierCurveTo(bend - thickness * 0.5, length * 0.5, curl - thickness * 0.2, length * 0.63, curl, length);
        context.bezierCurveTo(curl + thickness * 0.5, length * 0.74, bend + thickness * 0.65, length * 0.54, bend + thickness * 0.45, length * 0.38);
        context.bezierCurveTo(bend + thickness * 0.6, length * 0.21, thickness * 1.1, length * 0.15, thickness, 0);
        context.closePath();
        context.fill();
        if (stripe.fork) {
          context.beginPath();
          context.moveTo(bend - thickness * 0.4, length * 0.28);
          context.bezierCurveTo(bend + thickness * 1.8, length * 0.42, curl + thickness * 2.5, length * 0.51, curl + thickness * 2, length * 0.76);
          context.bezierCurveTo(curl + thickness * 1.2, length * 0.53, bend + thickness * 0.4, length * 0.52, bend, length * 0.42);
          context.closePath();
          context.fill();
        }
        context.restore();
      }
      if (visible && !document.hidden && !preference.matches) frame = requestAnimationFrame(draw);
    };
    const restart = () => {
      cancelAnimationFrame(frame);
      previousTime = 0;
      draw(performance.now());
    };
    const resize = new ResizeObserver(() => {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      const ratio = Math.min(window.devicePixelRatio, 1.5);
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      restart();
    });
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      restart();
    });
    resize.observe(canvas);
    observer.observe(canvas);
    preference.addEventListener('change', restart);
    document.addEventListener('visibilitychange', restart);
    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      observer.disconnect();
      preference.removeEventListener('change', restart);
      document.removeEventListener('visibilitychange', restart);
    };
  }, []);

  return <canvas ref={canvasRef} className="quote__stripes-canvas" />;
}

export default function QuoteSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const chars = Array.from(section.querySelectorAll<HTMLElement>('.quote__char'));
    chars[chars.length - 1].dataset.last = 'true';
    let frame = 0;
    let written = -1;
    // Measured in the sticky stage's height (100lvh), the same unit the section is laid out in.
    const stage = section.querySelector<HTMLElement>('.quote__stage');
    let viewport = stage?.clientHeight || window.innerHeight;
    const update = () => {
      frame = 0;
      const bounds = section.getBoundingClientRect();
      // The section starts one viewport before the hero releases; distance is measured in viewports from there.
      const scrolled = -bounds.top / viewport;
      const fade = Math.min(1, Math.max(0, (scrolled - 0.45) / 0.45));
      section.style.setProperty('--quote-fade', (fade * fade * (3 - 2 * fade)).toFixed(3));
      const next = Math.round(Math.min(1, Math.max(0, (scrolled - 0.95) / 1.1)) * chars.length);
      const state = scrolled > 0.9 ? next : -2;
      if (state === written) return;
      written = state;
      chars.forEach((char, index) => {
        char.dataset.written = String(index < next);
        char.dataset.current = String(index === next && state >= 0);
      });
      section.dataset.done = String(next >= chars.length);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    const onResize = () => {
      viewport = stage?.clientHeight || window.innerHeight;
      schedule();
    };
    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', onResize);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <section ref={sectionRef} id="next" className="quote" aria-label="Quote">
      <div className="quote__stage">
        <div className="quote__stripes-mask" aria-hidden="true">
          <MovingStripes />
        </div>
        <figure className="quote__figure">
          <blockquote aria-label={QUOTE}>
            <span aria-hidden="true">
              {QUOTE.split(' ').map((word, wordIndex, words) => (
                <span key={wordIndex} className="quote__word">
                  {Array.from(wordIndex < words.length - 1 ? `${word} ` : word).map((char, index) => (
                    <span key={index} className="quote__char" data-written="false">{char}</span>
                  ))}
                </span>
              ))}
            </span>
          </blockquote>
          <figcaption>— Wayne Gretzky</figcaption>
        </figure>
      </div>
    </section>
  );
}
