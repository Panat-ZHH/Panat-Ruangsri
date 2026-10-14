'use client';

import type { MouseEvent, ReactNode } from 'react';

const tasks: { title: string; text: string; icon: ReactNode }[] = [
  {
    title: 'Take-away',
    text: 'Bestellungen betreuen und die Abläufe im Take-away unterstützen.',
    icon: <><path d="M5 8h14l-1.2 12H6.2L5 8Z" /><path d="M9 8V6.5a3 3 0 0 1 6 0V8" /></>,
  },
  {
    title: 'Buffet',
    text: 'Mithilfe im Buffetbetrieb, besonders an den regelmässigen Buffetabenden.',
    icon: <><path d="M3 18h18" /><path d="M5 18a7 7 0 0 1 14 0" /><path d="M12 11V8.5" /><path d="M10.5 8.5h3" /></>,
  },
  {
    title: 'Gastronomie',
    text: 'Den laufenden Restaurantbetrieb und die praktischen Abläufe unterstützen.',
    icon: <><path d="M6 3v6a2 2 0 0 0 4 0V3" /><path d="M8 11v10" /><path d="M17 21V3c-2 1.5-3 4-3 7v3h3" /></>,
  },
  {
    title: 'Kundenkontakt',
    text: 'Direkte Arbeit mit Gästen und ihren Bestellungen.',
    icon: <><path d="M4 5h12a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-6l-4 3.5V15H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z" /><path d="M7 9.5h6" /><path d="M7 12h3.5" /></>,
  },
  {
    title: 'Flexibilität',
    text: 'Zusätzlich zur Ausbildung und zum Aufbau des eigenen Unternehmens.',
    icon: <><circle cx="12" cy="12" r="8" /><path d="M12 8v4l2.8 1.8" /></>,
  },
];

const skills = [
  { skill: 'Kundenorientierung', benefit: 'Bedürfnisse erkennen und auf Gäste eingehen' },
  { skill: 'Organisation', benefit: 'Mehrere Aufgaben parallel koordinieren' },
  { skill: 'Belastbarkeit', benefit: 'Auch in geschäftigen Phasen zuverlässig arbeiten' },
  { skill: 'Kommunikation', benefit: 'Mit Gästen und im Team zusammenarbeiten' },
  { skill: 'Eigenverantwortung', benefit: 'Aufgaben selbstständig übernehmen' },
  { skill: 'Operatives Verständnis', benefit: 'Verstehen, wie ein kleiner Betrieb im Alltag funktioniert' },
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
          <h3 className="sj-hero__role">Mitarbeit im Familienrestaurant</h3>
          <p className="sj-hero__lead">
            Neben der Ausbildung bei Swisscom und dem Aufbau von Wendico unterstütze ich das Familienrestaurant meiner Eltern: in der Gastronomie, im Take-away und am Buffet.
          </p>
          <dl className="fd-facts">
            <div><dt>Betrieb</dt><dd>Reb-Thai</dd></div>
            <div><dt>Ort</dt><dd>Andelfingen, Schweiz</dd></div>
            <div><dt>Bereiche</dt><dd>Gastronomie · Take-away · Buffet</dd></div>
          </dl>
        </div>
        <div className="sj-hero__visual" aria-hidden="true">
          <span className="sj-hero__glow" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/side-job-person.png" alt="" />
        </div>
      </section>

      <section className="details-section">
        <header className="details-section__header">
          <p className="details-label">Aufgaben</p>
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
          <p className="details-label">Was ich dabei entwickle</p>
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
        <p className="details-label">Warum es zählt</p>
        <blockquote>
          Nicht nur IT: Ich kenne den Alltag eines kleinen Unternehmens aus der <em>operativen Perspektive</em>.
        </blockquote>
      </section>
    </>
  );
}
