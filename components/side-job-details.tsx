'use client';

import type { MouseEvent, ReactNode } from 'react';

const tasks: { title: string; text: string; icon: ReactNode }[] = [
  {
    title: 'Take-away',
    text: 'Handle orders and support takeaway operations.',
    icon: <><path d="M5 8h14l-1.2 12H6.2L5 8Z" /><path d="M9 8V6.5a3 3 0 0 1 6 0V8" /></>,
  },
  {
    title: 'Buffet',
    text: 'Help run the buffet, especially on regular buffet evenings.',
    icon: <><path d="M3 18h18" /><path d="M5 18a7 7 0 0 1 14 0" /><path d="M12 11V8.5" /><path d="M10.5 8.5h3" /></>,
  },
  {
    title: 'Gastronomie',
    text: 'Support day-to-day restaurant service and operations.',
    icon: <><path d="M6 3v6a2 2 0 0 0 4 0V3" /><path d="M8 11v10" /><path d="M17 21V3c-2 1.5-3 4-3 7v3h3" /></>,
  },
  {
    title: 'Guest service',
    text: 'Work directly with guests and their orders.',
    icon: <><path d="M4 5h12a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-6l-4 3.5V15H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z" /><path d="M7 9.5h6" /><path d="M7 12h3.5" /></>,
  },
  {
    title: 'Flexibility',
    text: 'Balance this role with my apprenticeship and building a business.',
    icon: <><circle cx="12" cy="12" r="8" /><path d="M12 8v4l2.8 1.8" /></>,
  },
];

const skills = [
  { skill: 'Customer service', benefit: 'Recognise guests’ needs and respond thoughtfully' },
  { skill: 'Organisation', benefit: 'Coordinate several tasks at the same time' },
  { skill: 'Reliability under pressure', benefit: 'Stay dependable during busy periods' },
  { skill: 'Communication', benefit: 'Work effectively with guests and the team' },
  { skill: 'Ownership', benefit: 'Take responsibility and complete tasks independently' },
  { skill: 'Operational insight', benefit: 'Understand how a small business runs day to day' },
];

const followPointer = (event: MouseEvent<HTMLDivElement>) => {
  const bounds = event.currentTarget.getBoundingClientRect();
  event.currentTarget.style.setProperty('--px', ((event.clientX - bounds.left) / bounds.width - 0.5).toFixed(3));
  event.currentTarget.style.setProperty('--py', ((event.clientY - bounds.top) / bounds.height - 0.5).toFixed(3));
};

const resetPointer = (event: MouseEvent<HTMLDivElement>) => {
  event.currentTarget.style.setProperty('--px', '0');
  event.currentTarget.style.setProperty('--py', '0');
};

export default function SideJobDetails() {
  return (
    <>
      <section className="sj-hero" onMouseMove={followPointer} onMouseLeave={resetPointer}>
        <div className="sj-hero__text">
          <p className="fd-tagline">Work · Experience · Income</p>
          <h3 className="sj-hero__role">Working at the family restaurant</h3>
          <p className="sj-hero__lead">
            Alongside my apprenticeship at Swisscom and building Wendico, I help out at my parents’ restaurant with service, takeaway and buffet operations.
          </p>
          <dl className="fd-facts">
            <div><dt>Business</dt><dd>Reb-Thai</dd></div>
            <div><dt>Location</dt><dd>Andelfingen, Switzerland</dd></div>
            <div><dt>Areas</dt><dd>Restaurant · Takeaway · Buffet</dd></div>
          </dl>
        </div>
        <div className="sj-hero__visual" aria-hidden="true">
          <span className="sj-hero__glow" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/side-job-person.webp" alt="" width={800} height={1200} decoding="async" />
        </div>
      </section>

      <section className="details-section">
        <header className="details-section__header">
          <p className="details-label">Responsibilities</p>
        </header>
        <ul className="sj-tasks">
          {tasks.map((task) => (
            <li key={task.title}>
              <span className="fd-perspectives__icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">{task.icon}</svg>
              </span>
              <h4>{task.title}</h4>
              <p>{task.text}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="details-section">
        <header className="details-section__header">
          <p className="details-label">Skills I build</p>
        </header>
        <ol className="sj-skills">
          {skills.map((entry, index) => (
            <li key={entry.skill}>
              <span className="fd-roles__number">{String(index + 1).padStart(2, '0')}</span>
              <h4>{entry.skill}</h4>
              <p>{entry.benefit}</p>
              <span className="sj-skills__arrow" aria-hidden="true">→</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="fd-approach">
        <p className="details-label">Why it matters</p>
        <blockquote>
          More than technology: I understand the day-to-day of a small business from an <em>operational perspective</em>.
        </blockquote>
      </section>
    </>
  );
}
