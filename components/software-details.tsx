'use client';

import { useEffect, useRef, useState, type MouseEvent } from 'react';

type Focus = 'Frontend' | 'Full-Stack' | 'Leadership' | 'KI';

const TOTAL_MONTHS = 48;

const stations: { team: string; role: string; period: string; start: number; end: number; focus: Focus[]; points: string[] }[] = [
  { team: 'HIVE', role: 'Frontend Developer Apprentice', period: 'Aug 2023 – Feb 2024', start: 0, end: 6, focus: ['Frontend'], points: ['Frontend-Entwicklung', 'AngularJS und JavaScript'] },
  { team: 'Lernenden Hub', role: 'Full-Stack Developer Apprentice', period: 'Feb 2024 – Aug 2024', start: 6, end: 12, focus: ['Full-Stack', 'Frontend'], points: ['Entwicklung mit Vue.js', 'Mitarbeit an einer Full-Stack-Anwendung'] },
  { team: 'KeyCom', role: 'Full-Stack Developer Apprentice', period: 'Aug 2024 – Jun 2025', start: 12, end: 22, focus: ['Full-Stack'], points: ['Full-Stack-Entwicklung', 'Mitarbeit in einem professionellen Softwareentwicklungsteam'] },
  { team: 'LOOP Operativ B2B', role: 'Team Leader Apprentice', period: 'Jun 2025 – Feb 2026', start: 22, end: 30, focus: ['Leadership'], points: ['Führung eines Lernenden-Teams', 'Organisation und Koordination', 'Kommunikation und Begleitung anderer Lernender'] },
  { team: 'NewsRoom', role: 'Full-Stack Developer Apprentice', period: 'Feb 2026 – Aug 2026', start: 30, end: 36, focus: ['Full-Stack'], points: ['Full-Stack-Entwicklung', 'Arbeit mit AngularJS'] },
  { team: 'ATLAS', role: 'Frontend Developer Apprentice', period: 'Seit Aug 2026', start: 36, end: 48, focus: ['Frontend', 'Leadership', 'KI'], points: ['Bereich Data, Analytics & AI', 'Frontend einer unternehmensweiten Anwendung für interne Nutzer', 'Vue.js und Nuxt', 'Technische Leitung eines kleinen Lernenden-Teams', 'Vertiefung im Bereich KI'] },
];


const techProfile: { area: string; items: { name: string; text: string; where: string[]; logo?: string }[] }[] = [
  { area: 'Frontend', items: [
    { name: 'Vue.js', logo: '/logos/vue.png', text: 'Im Lernenden Hub gelernt und heute bei ATLAS für das Frontend einer unternehmensweiten Anwendung genutzt.', where: ['Lernenden Hub', 'ATLAS'] },
    { name: 'Nuxt', logo: '/logos/nuxt.png', text: 'Bei ATLAS im Bereich Data, Analytics & AI als Framework für das Vue-Frontend im Einsatz.', where: ['ATLAS'] },
    { name: 'AngularJS', logo: '/logos/angularjs.png', text: 'Im ersten Team HIVE gelernt und später bei NewsRoom in der Full-Stack-Entwicklung vertieft.', where: ['HIVE', 'NewsRoom'] },
    { name: 'JavaScript', logo: '/logos/javascript.png', text: 'Die Basis seit dem Start bei HIVE und in allen Teams bei Swisscom täglich genutzt.', where: ['HIVE', 'Alle Teams'] },
  ] },
  { area: 'Backend / Full-Stack', items: [
    { name: 'Node.js', logo: '/logos/nodejs.png', text: 'Für die Backend-Seite in den Full-Stack-Stationen bei Swisscom eingesetzt.', where: ['Full-Stack-Teams'] },
    { name: 'SQL', logo: '/logos/sql.png', text: 'Datenbank-Grundlagen aus der Ausbildung an der BBW, angewendet in Full-Stack-Projekten.', where: ['BBW', 'Full-Stack-Teams'] },
    { name: 'MariaDB', logo: '/logos/mariadb.png', text: 'Relationale Datenbank für Webanwendungen in Projekten aufgesetzt und genutzt.', where: ['Projekte'] },
    { name: 'MongoDB', logo: '/logos/mongodb.png', text: 'Dokumentenbasierte NoSQL-Datenbank für flexible Datenmodelle in Projekten eingesetzt.', where: ['Projekte'] },
  ] },
  { area: 'Eigene Projekte', items: [
    { name: 'React', logo: '/logos/react.png', text: 'In eigenen Projekten gelernt, um moderne Web-Oberflächen umzusetzen.', where: ['Eigene Projekte'] },
    { name: 'Next.js', logo: '/logos/nextjs.png', text: 'Für eigene Webanwendungen genutzt, unter anderem für dieses Portfolio.', where: ['Eigene Projekte', 'Portfolio'] },
    { name: 'Web-Apps', text: 'Konzeption und Umsetzung moderner Webanwendungen ausserhalb der Ausbildung.', where: ['Eigene Projekte'] },
  ] },
  { area: 'Cloud & KI', items: [
    { name: 'AWS', logo: '/logos/aws.png', text: 'Cloud-Services von Amazon Web Services für Hosting und Deployment kennengelernt und eingesetzt.', where: ['Ausbildung', 'Projekte'] },
    { name: 'Docker', logo: '/logos/docker.png', text: 'Container für reproduzierbare Entwicklungs- und Deployment-Umgebungen genutzt.', where: ['Projekte'] },
    { name: 'KI-Entwicklung', text: 'KI-gestützte Entwicklung im Alltag und Vertiefung im KI-Bereich bei ATLAS.', where: ['ATLAS'] },
    { name: 'Data & Analytics', text: 'Bei ATLAS im Bereich Data, Analytics & AI für interne Nutzer tätig.', where: ['ATLAS'] },
  ] },
  { area: 'Projektarbeit', items: [
    { name: 'Teamführung', text: 'Bei LOOP Operativ B2B ein Lernenden-Team geführt, organisiert und begleitet.', where: ['LOOP Operativ B2B'] },
    { name: 'Tech Lead', text: 'Bei ATLAS die technische Leitung eines kleinen Lernenden-Teams übernommen.', where: ['ATLAS'] },
    { name: 'Stakeholder', text: 'Abstimmung mit internen Nutzern und Stakeholdern einer unternehmensweiten Anwendung.', where: ['ATLAS'] },
  ] },
];

const polar = (angle: number, radiusX: number, radiusY: number) => ({
  x: 50 + Math.cos(angle * Math.PI / 180) * radiusX,
  y: 50 + Math.sin(angle * Math.PI / 180) * radiusY,
});

const leafCount = techProfile.reduce((sum, group) => sum + group.items.length, 0);
const leafStep = 360 / leafCount;
let leafSlot = 0;

// Leaves are spread evenly around the whole circle so neighbouring branches never overlap.
const mindMap = techProfile.map((group) => {
  const firstSlot = leafSlot;
  leafSlot += group.items.length;
  const angle = 150 + (firstSlot + (group.items.length - 1) / 2) * leafStep;
  return {
    ...group,
    angle,
    point: polar(angle, 17, 22),
    control: polar(angle, 29, 34),
    items: group.items.map((item, itemIndex) => {
      const slot = firstSlot + itemIndex;
      const outer = slot % 2 === 0;
      return { ...item, point: polar(150 + slot * leafStep, outer ? 43 : 37, outer ? 44 : 38) };
    }),
  };
});

const now = new Date();
const elapsedMonths = Math.min(TOTAL_MONTHS, Math.max(0, (now.getFullYear() - 2023) * 12 + now.getMonth() - 7));
const currentIndex = stations.findIndex((station) => elapsedMonths >= station.start && elapsedMonths < station.end);

function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const accent = getComputedStyle(canvas).getPropertyValue('--acid').trim() || '#ffffff';
    const stars = Array.from({ length: 220 }, () => ({
      x: Math.random(),
      y: Math.random(),
      depth: Math.random() ** 2,
      phase: Math.random() * Math.PI * 2,
    }));
    let width = 0;
    let height = 0;
    let frame = 0;
    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };
    const draw = (time: number) => {
      context.clearRect(0, 0, width, height);
      for (const star of stars) {
        const speed = 0.000004 + star.depth * 0.000018;
        const x = ((star.x - time * speed) % 1 + 1) % 1 * width;
        const y = ((star.y - time * speed * 0.35) % 1 + 1) % 1 * height;
        const twinkle = 0.55 + 0.45 * Math.sin(time * 0.0016 + star.phase);
        context.globalAlpha = (0.25 + star.depth * 0.75) * twinkle;
        context.fillStyle = star.depth > 0.85 ? accent : '#ffffff';
        context.beginPath();
        context.arc(x, y, 0.4 + star.depth * 1.3, 0, Math.PI * 2);
        context.fill();
      }
      if (!reduceMotion) frame = requestAnimationFrame(draw);
    };
    const observer = new ResizeObserver(() => {
      resize();
      if (reduceMotion) draw(0);
    });
    observer.observe(canvas);
    resize();
    frame = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} className="sd-map__stars" aria-hidden="true" />;
}

const tiltMap = (event: MouseEvent<HTMLDivElement>) => {
  const bounds = event.currentTarget.getBoundingClientRect();
  const x = (event.clientX - bounds.left) / bounds.width - 0.5;
  const y = (event.clientY - bounds.top) / bounds.height - 0.5;
  event.currentTarget.style.setProperty('--tilt-x', `${(-y * 14).toFixed(2)}deg`);
  event.currentTarget.style.setProperty('--tilt-y', `${(x * 18).toFixed(2)}deg`);
};

const resetTilt = (event: MouseEvent<HTMLDivElement>) => {
  event.currentTarget.style.setProperty('--tilt-x', '10deg');
  event.currentTarget.style.setProperty('--tilt-y', '0deg');
};

const lineX = (y: number) => 50 + Math.sin(y * 0.11) * 0.9 + Math.sin(y * 0.037 + 1) * 0.6;
const linePath = Array.from({ length: 101 }, (_, y) => `${y === 0 ? 'M' : 'L'} ${lineX(y).toFixed(3)} ${y}`).join(' ');

export default function SoftwareDetails() {
  const [branch, setBranch] = useState<number | null>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const timeline = timelineRef.current;
    const path = pathRef.current;
    const scroller = timeline?.closest('.details-sheet__scroll');
    if (!timeline || !path) return;
    const scrollSource = scroller ?? window;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    timeline.dataset.animated = String(!reduceMotion);
    const items = Array.from(timeline.querySelectorAll<HTMLElement>('.sd-timeline__item'));
    const placeDots = () => items.forEach((item) => {
      const y = (item.getBoundingClientRect().top - timeline.getBoundingClientRect().top + item.offsetHeight / 2) / timeline.offsetHeight * 100;
      item.style.setProperty('--dot-x', `${lineX(y)}%`);
      item.dataset.position = String(y / 100);
    });
    const update = () => {
      const bounds = timeline.getBoundingClientRect();
      const reach = scroller ? scroller.getBoundingClientRect().top + scroller.clientHeight * 0.72 : window.innerHeight * 0.72;
      const progress = reduceMotion ? 1 : Math.min(1, Math.max(0, (reach - bounds.top) / bounds.height));
      path.style.clipPath = `inset(0 0 ${((1 - progress) * 100).toFixed(2)}% 0)`;
      items.forEach((item) => { item.dataset.visible = String(Number(item.dataset.position) <= progress + 0.02); });
    };
    const resize = new ResizeObserver(() => { placeDots(); update(); });
    resize.observe(timeline);
    scrollSource.addEventListener('scroll', update, { passive: true });
    return () => {
      resize.disconnect();
      scrollSource.removeEventListener('scroll', update);
    };
  }, []);

  return (
    <>
      <section className="sd-overview" aria-label="Überblick">
        <div className="sd-tile">
          <span className="details-label">Rolle</span>
          <strong>Software Developer Apprentice</strong>
        </div>
        <div className="sd-tile">
          <span className="details-label">Unternehmen</span>
          <strong>Swisscom</strong>
          <span>Zürich, Schweiz</span>
        </div>
        <div className="sd-tile">
          <span className="details-label">Ausbildung</span>
          <strong>Informatiker EFZ</strong>
          <span>Applikationsentwicklung · BBW</span>
        </div>
        <div className="sd-tile sd-tile--progress">
          <span className="details-label">Fortschritt</span>
          <strong>{Math.round(elapsedMonths / TOTAL_MONTHS * 100)}%</strong>
          <span className="sd-progress" aria-hidden="true"><span style={{ width: `${elapsedMonths / TOTAL_MONTHS * 100}%` }} /></span>
          <span>Aug 2023 – Sommer 2027</span>
        </div>
      </section>

      <section className="details-section">
        <header className="details-section__header">
          <p className="details-label">Stationen bei Swisscom</p>
          <p className="sd-hint">2023 → heute</p>
        </header>

        <div ref={timelineRef} className="sd-timeline">
          <svg className="sd-timeline__line" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            <path className="sd-timeline__track" d={linePath} />
          </svg>
          <svg ref={pathRef} className="sd-timeline__line sd-timeline__line--draw" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            <path className="sd-timeline__draw" d={linePath} />
          </svg>
          <ol>
            {stations.map((entry, index) => (
              <li key={entry.team} className="sd-timeline__item" data-side={index % 2 === 0 ? 'left' : 'right'} data-current={index === currentIndex}>
                <span className="sd-timeline__dot" aria-hidden="true" />
                <div className="sd-timeline__card">
                  <div className="sd-station__head">
                    <span className="sd-station__period">{entry.period}</span>
                    {index === currentIndex && <span className="sd-badge">Aktuell</span>}
                  </div>
                  <h4 className="sd-timeline__team">{entry.team}</h4>
                  <p className="sd-station__role">{entry.role}</p>
                  <ul className="sd-timeline__points">
                    {entry.points.map((point) => <li key={point}>{point}</li>)}
                  </ul>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="details-section">
        <header className="details-section__header">
          <p className="details-label">Technisches Profil</p>
          <p className="sd-hint">Über einen Begriff fahren für Details</p>
        </header>
        <div className="sd-map" onMouseMove={tiltMap} onMouseLeave={resetTilt}>
          <StarField />
          <div className="sd-map__stage">
          <svg className="sd-map__lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            {mindMap.map((group, groupIndex) => (
              <g key={group.area} data-active={branch === groupIndex}>
                <line x1="50" y1="50" x2={group.point.x} y2={group.point.y} />
                {group.items.map((item) => (
                  <path key={item.name} d={`M ${group.point.x} ${group.point.y} Q ${group.control.x} ${group.control.y} ${item.point.x} ${item.point.y}`} />
                ))}
              </g>
            ))}
          </svg>
          <span className="sd-map__core">Tech<br />Stack</span>
          {mindMap.map((group, groupIndex) => (
            <div
              key={group.area}
              className="sd-map__branch"
              data-active={branch === groupIndex}
              onMouseEnter={() => setBranch(groupIndex)}
              onMouseLeave={() => setBranch(null)}
            >
              <h4 className="sd-map__category" style={{ left: `${group.point.x}%`, top: `${group.point.y}%` }}>{group.area}</h4>
              <ul>
                {group.items.map((item) => (
                  <li
                    key={item.name}
                    className="sd-map__node"
                    data-below={item.point.y < 30}
                    data-align={item.point.x < 22 ? 'start' : item.point.x > 78 ? 'end' : 'center'}
                    style={{ left: `${item.point.x}%`, top: `${item.point.y}%` }}
                  >
                    <span className="sd-map__lift">
                    <button type="button" className="sd-map__leaf" onFocus={() => setBranch(groupIndex)}>
                      {item.logo && (
                        <span className="sd-map__logo">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={item.logo} alt="" />
                        </span>
                      )}
                      {item.name}
                    </button>
                    <span className="sd-map__popup" role="tooltip">
                      <strong>{item.name}</strong>
                      {item.text}
                      <span className="sd-map__where">{item.where.map((place) => <em key={place}>{place}</em>)}</span>
                    </span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          </div>
        </div>
      </section>
    </>
  );
}
