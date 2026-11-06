'use client';

import { useEffect, useRef, useState, type MouseEvent } from 'react';

type Stat = { value: number; suffix?: string; label: string; text?: string };

const hobbies: { id: string; name: string; period: string; title: string; text: string; image?: string; stats: Stat[]; visual?: 'tiktok' }[] = [
  {
    id: 'tennis',
    name: 'Tennis',
    period: '1 year',
    title: 'From first practice to first tournament win.',
    text: 'I have played tennis for one year. In my first year, I won one of the two tournaments I entered and improved my ranking from R9 to R8.',
    image: '/tennis-person.webp',
    stats: [
      { value: 1, suffix: ' / 2', label: 'Tournaments won' },
      { value: 0, label: 'Ranking', text: 'R9 → R8' },
    ],
  },
  {
    id: 'speedcubing',
    name: 'Speedcubing',
    period: 'Ages 11–17',
    title: 'One cube. Eleven seconds.',
    text: 'From 11 to 17, I practised speedcubing regularly. It sharpened my spatial reasoning and led to my competition record: solving a cube in 11 seconds.',
    image: '/speedcube.webp',
    stats: [
      { value: 11, suffix: ' sec', label: 'Competition record' },
      { value: 6, suffix: ' years', label: 'Regular practice' },
    ],
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    period: 'Ages 13–17',
    title: 'Rubik’s Cube tutorials for half a million people.',
    text: 'From 13 to 17, I regularly posted Rubik’s Cube tutorials and videos. The account grew to more than 500,000 followers.',
    visual: 'tiktok',
    stats: [
      { value: 500, suffix: 'K+', label: 'Follower' },
      { value: 4, suffix: ' years', label: 'Creating regularly' },
    ],
  },
  {
    id: 'gym',
    name: 'Gym',
    period: 'Regularly',
    title: 'A reset after long workdays.',
    text: 'Alongside my apprenticeship, Wendico and the restaurant, I work out regularly to stay fit and focused.',
    image: '/gym-person.webp',
    stats: [
      { value: 0, label: 'Routine', text: 'Regularly' },
      { value: 0, label: 'Goal', text: 'Fit alongside work' },
    ],
  },
];

function CountUp({ stat }: { stat: Stat }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(stat.value);

  useEffect(() => {
    const element = ref.current;
    if (!element || stat.text || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
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
      <li>Ages 13–17</li>
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
          <p>More than one thing</p>
          <p className="fd-tagline">Discipline · Growth · Creativity · Freedom</p>
        </div>
        <p className="hb-intro__note">Same person. Different interests.</p>
        <nav className="hb-index" aria-label="Hobbies">
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
              <img src={hobby.image} alt="" loading="lazy" decoding="async" />
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
