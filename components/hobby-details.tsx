'use client';

import { useEffect, useRef, useState, type MouseEvent } from 'react';

type Stat = { value: number; suffix?: string; label: string; text?: string };

const hobbies: { id: string; name: string; period: string; title: string; text: string; image?: string; stats: Stat[]; visual?: 'tiktok' }[] = [
  {
    id: 'tennis',
    name: 'Tennis',
    period: 'Seit 1 Jahr',
    title: 'Vom ersten Training zum ersten Turniersieg.',
    text: 'Ich spiele seit einem Jahr Tennis. Im ersten Jahr habe ich eines von zwei gespielten Turnieren gewonnen und bin von R9 auf R8 aufgestiegen.',
    image: '/tennis-person.png',
    stats: [
      { value: 1, suffix: ' / 2', label: 'Turniere gewonnen' },
      { value: 0, label: 'Klassierung', text: 'R9 → R8' },
    ],
  },
  {
    id: 'speedcubing',
    name: 'Speedcubing',
    period: '11 – 17 Jahre',
    title: 'Ein Würfel, elf Sekunden.',
    text: 'Von 11 bis 17 habe ich regelmässig Speedcubing betrieben. Das hat mein räumliches Vorstellungsvermögen geschärft und mich zu meinem Rekord gebracht: ein gelöster Cube in 11 Sekunden an einem Turnier.',
    image: '/speedcube.png',
    stats: [
      { value: 11, suffix: ' s', label: 'Turnier-Rekord' },
      { value: 6, suffix: ' Jahre', label: 'Regelmässiges Training' },
    ],
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    period: '13 – 17 Jahre',
    title: 'Rubik’s-Cube-Tutorials für eine halbe Million Menschen.',
    text: 'Zwischen 13 und 17 habe ich regelmässig Rubik’s-Cube-Tutorials und Videos gepostet. Daraus ist ein Account mit über 500’000 Followern entstanden.',
    visual: 'tiktok',
    stats: [
      { value: 500, suffix: 'K+', label: 'Follower' },
      { value: 4, suffix: ' Jahre', label: 'Regelmässig Content' },
    ],
  },
  {
    id: 'gym',
    name: 'Gym',
    period: 'Regelmässig',
    title: 'Ausgleich zu langen Arbeitstagen.',
    text: 'Neben Ausbildung, Wendico und dem Restaurant gehe ich regelmässig ins Gym, um fit und fokussiert zu bleiben.',
    image: '/gym-person.png',
    stats: [
      { value: 0, label: 'Rhythmus', text: 'Regelmässig' },
      { value: 0, label: 'Ziel', text: 'Fit neben der Arbeit' },
    ],
  },
];

function CountUp({ stat }: { stat: Stat }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(0);

  useEffect(() => {
    const element = ref.current;
    if (!element || stat.text) return;
    let frame = 0;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      const start = performance.now();
      const tick = (time: number) => {
        const progress = Math.min(1, (time - start) / 1400);
        setValue(Math.round(stat.value * (1 - (1 - progress) ** 3)));
        if (progress < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    }, { threshold: 0.6 });
    observer.observe(element);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [stat]);

  return (
    <span ref={ref} className="hb-stat__value">
      {stat.text ?? `${value}${stat.suffix ?? ''}`}
    </span>
  );
}

const followPointer = (event: MouseEvent<HTMLDivElement>) => {
  const bounds = event.currentTarget.getBoundingClientRect();
  event.currentTarget.style.setProperty('--px', ((event.clientX - bounds.left) / bounds.width - 0.5).toFixed(3));
  event.currentTarget.style.setProperty('--py', ((event.clientY - bounds.top) / bounds.height - 0.5).toFixed(3));
};

const resetPointer = (event: MouseEvent<HTMLDivElement>) => {
  event.currentTarget.style.setProperty('--px', '0');
  event.currentTarget.style.setProperty('--py', '0');
};

function TikTokCard() {
  return (
  <div className="hb-tiktok">
    <div className="hb-tiktok__head">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <span className="hb-tiktok__logo"><img src="/logos/tiktok.png" alt="" /></span>
      <span>TikTok</span>
    </div>
    <strong>500K+</strong>
    <span className="hb-tiktok__label">Follower</span>
    <ul>
      <li>Rubik’s-Cube-Tutorials</li>
      <li>Speedcubing-Videos</li>
      <li>13 – 17 Jahre</li>
    </ul>
  </div>
  );
}

export default function HobbyDetails() {
  const jumpTo = (id: string) => {
    document.getElementById(`hobby-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <>
      <section className="hb-intro">
        <div className="fd-intro__meta">
          <p>Mehr als nur eine Sache</p>
          <p className="fd-tagline">Discipline · Growth · Creativity · Freedom</p>
        </div>
        <p className="hb-intro__note">Same person. Different interests.</p>
        <nav className="hb-index" aria-label="Hobbys">
          {hobbies.map((hobby, index) => (
            <button key={hobby.id} type="button" onClick={() => jumpTo(hobby.id)}>
              <span className="fd-roles__number">{String(index + 1).padStart(2, '0')}</span>
              {hobby.name}
              <span className="hb-index__arrow" aria-hidden="true">↓</span>
            </button>
          ))}
        </nav>
      </section>

      {hobbies.map((hobby, index) => (
        <section key={hobby.id} id={`hobby-${hobby.id}`} className="hb-row" data-flip={index % 2 === 1}>
          <div className="hb-row__visual" onMouseMove={followPointer} onMouseLeave={resetPointer} aria-hidden="true">
            <span className="sj-hero__glow" />
            {hobby.visual === 'tiktok' ? <TikTokCard /> : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={hobby.image} alt="" />
            )}
          </div>
          <div className="hb-row__text">
            <p className="hb-row__eyebrow">
              <span>{String(index + 1).padStart(2, '0')}</span> {hobby.name} <em>{hobby.period}</em>
            </p>
            <h3>{hobby.title}</h3>
            <p>{hobby.text}</p>
            <dl className="hb-stats">
              {hobby.stats.map((stat) => (
                <div key={stat.label} className="hb-stat">
                  <dt>{stat.label}</dt>
                  <dd><CountUp stat={stat} /></dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      ))}
    </>
  );
}
