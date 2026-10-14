import BrandScene from '@/components/brand-scene';
import CardDetails from '@/components/card-details';

export default function HomePage() {
  return (
    <main id="main-content">
      <div className="home">
        <section className="hero" id="top" aria-label="Panat Ruangsri homepage">
          <div className="hero__grid" aria-hidden="true" />
          <BrandScene />
          <CardDetails />
          <div className="hero__outro" aria-hidden="true" />
          <span id="about" className="hero-anchor" aria-hidden="true" />
          <span id="experience" className="hero-anchor" aria-hidden="true" />
          <span id="news" className="hero-anchor" aria-hidden="true" />
          <span id="works" className="hero-anchor" aria-hidden="true" />
          <span id="contact" className="hero-anchor" aria-hidden="true" />
        </section>
      </div>
      <section id="next" className="next-page" aria-label="Next" />
    </main>
  );
}
