'use client';

import { useEffect, useRef, useState, type MouseEvent } from 'react';

type Focus = 'Frontend' | 'Full-Stack' | 'Leadership' | 'AI';

const TOTAL_MONTHS = 48;

const stations: { team: string; role: string; period: string; start: number; end: number; focus: Focus[]; points: string[] }[] = [
  { team: 'HIVE', role: 'Frontend Developer Apprentice', period: 'Aug 2023 – Feb 2024', start: 0, end: 6, focus: ['Frontend'], points: ['Frontend development', 'AngularJS and JavaScript'] },
  { team: 'Lernenden Hub', role: 'Full-Stack Developer Apprentice', period: 'Feb 2024 – Aug 2024', start: 6, end: 12, focus: ['Full-Stack', 'Frontend'], points: ['Development with Vue.js', 'Contributed to a full-stack application'] },
  { team: 'KeyCom', role: 'Full-Stack Developer Apprentice', period: 'Aug 2024 – Jun 2025', start: 12, end: 22, focus: ['Full-Stack'], points: ['Full-stack development', 'Contributed to a professional software development team'] },
  { team: 'LOOP Operativ B2B', role: 'Team Leader Apprentice', period: 'Jun 2025 – Feb 2026', start: 22, end: 30, focus: ['Leadership'], points: ['Led a team of apprentices', 'Organised and coordinated work', 'Communicated with and supported fellow apprentices'] },
  { team: 'NewsRoom', role: 'Full-Stack Developer Apprentice', period: 'Feb 2026 – Aug 2026', start: 30, end: 36, focus: ['Full-Stack'], points: ['Full-stack development', 'Worked with AngularJS'] },
  { team: 'ATLAS', role: 'Frontend Developer Apprentice', period: 'Since Aug 2026', start: 36, end: 48, focus: ['Frontend', 'Leadership', 'AI'], points: ['Data, Analytics & AI division', 'Frontend development for an enterprise-wide internal application', 'Vue.js and Nuxt', 'Technical lead for a small apprentice team', 'Further specialising in AI'] },
];


const techProfile: { area: string; items: { name: string; text: string; where: string[]; logo?: string }[] }[] = [
  { area: 'Frontend', items: [
    { name: 'Vue.js', logo: '/logos/vue.png', text: 'Learned at Lernenden Hub and now used at ATLAS for the frontend of an enterprise-wide application.', where: ['Lernenden Hub', 'ATLAS'] },
    { name: 'Nuxt', logo: '/logos/nuxt.png', text: 'Used at ATLAS as the framework for a Vue frontend in the Data, Analytics & AI division.', where: ['ATLAS'] },
    { name: 'AngularJS', logo: '/logos/angularjs.png', text: 'Learned in my first team, HIVE, and later deepened through full-stack work at NewsRoom.', where: ['HIVE', 'NewsRoom'] },
    { name: 'JavaScript', logo: '/logos/javascript.png', text: 'A core skill since joining HIVE and used daily across my Swisscom teams.', where: ['HIVE', 'All teams'] },
  ] },
  { area: 'Backend / Full-Stack', items: [
    { name: 'Node.js', logo: '/logos/nodejs.png', text: 'Used for backend development across my full-stack placements at Swisscom.', where: ['Full-stack teams'] },
    { name: 'SQL', logo: '/logos/sql.png', text: 'Database fundamentals from my BBW studies, applied in full-stack projects.', where: ['BBW', 'Full-stack teams'] },
    { name: 'MariaDB', logo: '/logos/mariadb.png', text: 'Set up and used a relational database for web applications and projects.', where: ['Projects'] },
    { name: 'MongoDB', logo: '/logos/mongodb.png', text: 'Applied a document-oriented NoSQL database for flexible data models.', where: ['Projects'] },
  ] },
  { area: 'Eigene Projekte', items: [
    { name: 'React', logo: '/logos/react.png', text: 'Learned through personal projects to build modern web interfaces.', where: ['Personal projects'] },
    { name: 'Next.js', logo: '/logos/nextjs.png', text: 'Used to build personal web applications, including this portfolio.', where: ['Personal projects', 'Portfolio'] },
    { name: 'Web apps', text: 'Planning and building modern web applications outside my apprenticeship.', where: ['Personal projects'] },
  ] },
  { area: 'Cloud & AI', items: [
    { name: 'AWS', logo: '/logos/aws.png', text: 'Explored and used Amazon Web Services for cloud hosting and deployment.', where: ['Apprenticeship', 'Projects'] },
    { name: 'Docker', logo: '/logos/docker.png', text: 'Used containers to create reproducible development and deployment environments.', where: ['Projects'] },
    { name: 'AI development', text: 'Using AI-assisted development day to day and deepening my AI expertise at ATLAS.', where: ['ATLAS'] },
    { name: 'Data & Analytics', text: 'Working on internal-user products in ATLAS’s Data, Analytics & AI division.', where: ['ATLAS'] },
  ] },
  { area: 'Projektarbeit', items: [
    { name: 'Team leadership', text: 'Led, organised and supported an apprentice team at LOOP Operativ B2B.', where: ['LOOP Operativ B2B'] },
    { name: 'Technical leadership', text: 'Took on technical leadership for a small apprentice team at ATLAS.', where: ['ATLAS'] },
    { name: 'Stakeholder collaboration', text: 'Aligned with internal users and stakeholders of an enterprise-wide application.', where: ['ATLAS'] },
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
    let visible = false;
    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio, 1.5);
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
      frame = !reduceMotion && visible ? requestAnimationFrame(draw) : 0;
    };
    const observer = new ResizeObserver(() => {
      resize();
      if (reduceMotion) draw(0);
    });
    observer.observe(canvas);
    // Only animate while the map is on screen inside the scrolling sheet.
    const visibility = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      cancelAnimationFrame(frame);
      frame = visible ? requestAnimationFrame(draw) : 0;
    });
    visibility.observe(canvas);
    resize();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      visibility.disconnect();
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
      <section className="sd-overview" aria-label="Overview">
        <div className="sd-tile">
          <span className="details-label">Role</span>
          <strong>Software Developer Apprentice</strong>
        </div>
        <div className="sd-tile">
          <span className="details-label">Company</span>
          <strong>Swisscom</strong>
          <span>Zurich, Switzerland</span>
        </div>
        <div className="sd-tile">
          <span className="details-label">Education</span>
          <strong>IT Specialist, Application Development</strong>
          <span>Swiss Federal VET Diploma · BBW</span>
        </div>
        <div className="sd-tile sd-tile--progress">
          <span className="details-label">Progress</span>
          <strong>{Math.round(elapsedMonths / TOTAL_MONTHS * 100)}%</strong>
          <span className="sd-progress" aria-hidden="true"><span style={{ width: `${elapsedMonths / TOTAL_MONTHS * 100}%` }} /></span>
          <span>Aug 2023 – Summer 2027</span>
        </div>
      </section>

      <section className="details-section">
        <header className="details-section__header">
          <p className="details-label">Swisscom experience</p>
          <p className="sd-hint">2023 → present</p>
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
                    {index === currentIndex && <span className="sd-badge">Current</span>}
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
          <p className="details-label">Technical profile</p>
          <p className="sd-hint">Hover over a skill for details</p>
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
