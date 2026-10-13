import BrandScene from '@/components/brand-scene';

export default function HomePage() {
  return (
    <main id="main-content" className="home">
      <section className="hero" id="top" aria-label="Panat Ruangsri homepage">
        <h1 className="visually-hidden">Panat Ruangsri</h1>
        <div className="hero__grid" aria-hidden="true" />
        <BrandScene />
        <div className="hero-card-actions">
          <a className="hero-card-action" href="/software-card.png" aria-label="Software Details" hidden>Details</a>
          <a className="hero-card-action" href="/founder-card.png" aria-label="Founder Details" hidden>Details</a>
          <a className="hero-card-action" href="/sideJobs-card.png" aria-label="Side Jobs Details" hidden>Details</a>
          <a className="hero-card-action" href="/more-card.png" aria-label="More Details" hidden>Details</a>
        </div>
        <div className="hero__index" aria-hidden="true">
          <span id="about">PERSONAL PORTFOLIO</span>
          <span>01 / 01</span>
        </div>
        <span id="experience" className="hero-anchor" aria-hidden="true" />
        <span id="news" className="hero-anchor" aria-hidden="true" />
        <span id="works" className="hero-anchor" aria-hidden="true" />
        <span id="contact" className="hero-anchor" aria-hidden="true" />
        <p className="hero__side-note" aria-hidden="true">DESIGN / ENGINEERING / EXPERIENCE</p>
      </section>
    </main>
  );
}
