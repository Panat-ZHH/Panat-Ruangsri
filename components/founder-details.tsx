'use client';

import { useEffect, useRef, useState } from 'react';
import LaptopPreview from '@/components/laptop-preview';

type Cluster = 'Leadership' | 'Clients' | 'Growth';

const responsibilities: { title: string; cluster: Cluster; text: string }[] = [
  { title: 'Company Leadership', cluster: 'Leadership', text: 'Driving the strategic direction, positioning and continued development of Wendico.' },
  { title: 'Team Leadership', cluster: 'Leadership', text: 'Leading and coordinating a five-person team, aligning responsibilities, priorities and project execution.' },
  { title: 'Project Management', cluster: 'Clients', text: 'Managing client projects from initial requirements and planning to implementation, delivery and ongoing support.' },
  { title: 'Business Development', cluster: 'Growth', text: 'Identifying opportunities, developing service offerings and building new business relationships.' },
  { title: 'Client Acquisition', cluster: 'Clients', text: 'Generating leads, conducting client conversations, presenting solutions and converting prospects into customers.' },
  { title: 'Client Relationship Management', cluster: 'Clients', text: 'Serving as a key point of contact, understanding business requirements and maintaining long-term client relationships.' },
  { title: 'Digital Strategy', cluster: 'Growth', text: 'Translating business objectives into clear digital strategies, website concepts and conversion-focused customer journeys.' },
  { title: 'Web Development', cluster: 'Growth', text: 'Contributing technical expertise to the development of custom websites, digital experiences and integrated business systems.' },
  { title: 'Brand Positioning & Marketing', cluster: 'Growth', text: "Developing Wendico's positioning and supporting its marketing, outreach and customer acquisition strategies." },
  { title: 'Business Operations', cluster: 'Leadership', text: 'Coordinating workflows, managing priorities and connecting technical execution with commercial objectives.' },
];

const clusterOrder: Cluster[] = ['Leadership', 'Clients', 'Growth'];
const roleMap = clusterOrder.flatMap((cluster) => responsibilities.filter((entry) => entry.cluster === cluster));
const ORIGIN = { x: 22, y: 50 };
const NODE_X = 46;
const nodeY = (index: number) => 5 + index * (90 / (roleMap.length - 1));

const perspectives = [
  {
    label: 'Technical',
    text: 'Understanding how products are built.',
    icon: <><rect x="3" y="4" width="18" height="13" rx="2" /><path d="M9.5 8.5 7 11l2.5 2.5M14.5 8.5 17 11l-2.5 2.5M8 20h8" /></>,
  },
  {
    label: 'Commercial',
    text: 'Understanding how businesses acquire customers.',
    icon: <><path d="M3 20h18" /><path d="m4 15 5-5 4 3 7-7" /><path d="M15 6h5v5" /></>,
  },
  {
    label: 'Team',
    text: 'Understanding how teams turn ideas into practical solutions.',
    icon: <><circle cx="9" cy="8" r="3" /><path d="M3.5 19c.6-3 2.8-5 5.5-5s4.9 2 5.5 5" /><circle cx="17" cy="9" r="2.4" /><path d="M15.5 14.2c2.4-.4 4.4 1.2 5 4.3" /></>,
  },
];

const coreFocus = ['Entrepreneurship', 'Leadership', 'Software Development', 'Project Management', 'Business Development', 'Sales', 'Client Relations', 'Digital Strategy', 'Web Design', 'Conversion Optimization'];

export default function FounderDetails() {
  const [active, setActive] = useState<number | null>(null);
  const [portraitFailed, setPortraitFailed] = useState(false);
  const [drawn, setDrawn] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setDrawn(true);
        observer.disconnect();
      }
    }, { threshold: 0.3 });
    observer.observe(map);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <section className="fd-intro">
        <div className="fd-intro__meta">
          <p>Co-Founder · Entrepreneur · Business Development</p>
          <p className="fd-tagline">Ideas into Impact</p>
        </div>
        <p className="fd-lead">
          As Co-Founder and CEO of Wendico, I lead the strategic direction, business development and day-to-day execution of a digital studio focused on building high-quality websites and digital systems that help businesses strengthen their brands, attract customers and grow.
        </p>
        <dl className="fd-facts">
          <div><dt>Company</dt><dd>Wendico KLG</dd></div>
          <div><dt>Role</dt><dd>Co-Founder &amp; CEO</dd></div>
          <div><dt>Team</dt><dd>5 people</dd></div>
          <div><dt>Focus</dt><dd>Websites &amp; digital systems</dd></div>
        </dl>
        <div className="fd-columns">
          <p>
            My role combines entrepreneurship, technology, leadership and client-facing business operations. I oversee projects from the initial client conversation and strategic planning through design, development and final delivery, ensuring that each solution aligns with the client&apos;s objectives.
          </p>
          <p>
            Beyond building digital products, I take an active role in growing the business, acquiring new clients, managing client relationships and coordinating a five-person team across projects, sales and digital services.
          </p>
        </div>
      </section>

      <section className="details-section">
        <header className="details-section__header">
          <p className="details-label">Leadership &amp; Responsibilities</p>
          <p className="sd-hint">Hover a responsibility for details</p>
        </header>
        <div ref={mapRef} className="fd-map" data-drawn={drawn} data-active={active !== null}>
          <svg className="fd-map__lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            {roleMap.map((entry, index) => {
              const y = nodeY(index);
              const bend = (NODE_X - ORIGIN.x) * 0.55;
              return (
                <path
                  key={entry.title}
                  data-active={active === index}
                  d={`M ${ORIGIN.x} ${ORIGIN.y} C ${ORIGIN.x + bend} ${ORIGIN.y} ${NODE_X - bend} ${y} ${NODE_X} ${y}`}
                />
              );
            })}
          </svg>
          <div className="fd-map__founder">
            <div className="fd-map__portrait">
              {portraitFailed ? (
                <span>PR</span>
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src="/founder-portrait.png" alt="Panat Ruangsri" onError={() => setPortraitFailed(true)} />
              )}
            </div>
            <strong>Founder &amp; CEO</strong>
            <span>Wendico KLG</span>
          </div>
          <ol className="fd-map__nodes">
            {roleMap.map((entry, index) => (
              <li
                key={entry.title}
                className="fd-map__node"
                data-active={active === index}
                data-cluster-start={index === 0 || roleMap[index - 1].cluster !== entry.cluster}
                style={{ top: `${nodeY(index)}%`, left: `${NODE_X}%`, animationDelay: `${300 + index * 70}ms` }}
                onMouseEnter={() => setActive(index)}
                onMouseLeave={() => setActive(null)}
              >
                <button type="button" onFocus={() => setActive(index)} onBlur={() => setActive(null)}>
                  <span className="fd-map__dot" aria-hidden="true" />
                  {entry.title}
                  <em>{entry.cluster}</em>
                </button>
                <p className="fd-map__text" role="tooltip">{entry.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="details-section">
        <header className="details-section__header">
          <p className="details-label">Wendico — Live</p>
          <p className="sd-hint">Scroll inside the screen to explore</p>
        </header>
        <LaptopPreview />
      </section>

      <section className="details-section">
        <header className="details-section__header">
          <p className="details-label">Business &amp; Entrepreneurial Experience</p>
        </header>
        <div className="fd-experience">
          <p className="fd-experience__text">
            Alongside my role at Wendico, I hold ownership interests in multiple startups and pursue entrepreneurial projects focused on technology, digital products and business development.
          </p>
          <p className="fd-experience__sub">
            These experiences allow me to approach problems from both a technical and commercial perspective.
          </p>
          <ol className="fd-perspectives">
            {perspectives.map((entry) => (
              <li key={entry.label}>
                <span className="fd-perspectives__icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">{entry.icon}</svg>
                </span>
                <h4>{entry.label}</h4>
                <p>{entry.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="details-section">
        <header className="details-section__header">
          <p className="details-label">Core Focus</p>
        </header>
        <ul className="fd-focus">
          {coreFocus.map((entry) => <li key={entry}>{entry}</li>)}
        </ul>
      </section>

      <section className="fd-approach">
        <p className="details-label">My approach</p>
        <blockquote>
          Combining technology, strategic thinking and hands-on leadership to build digital solutions that create <em>measurable value</em> for businesses.
        </blockquote>
      </section>
    </>
  );
}
