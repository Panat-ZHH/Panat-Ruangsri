import BrandScene from '@/components/brand-scene';
import CardDetails from '@/components/card-details';
import QuoteSection from '@/components/quote-section';
import type { Metadata } from 'next';

export const metadata: Metadata = { alternates: { canonical: '/' }, openGraph: { url: '/' } };

const profile = {
  '@context': 'https://schema.org', '@type': 'ProfilePage',
  '@id': 'https://panat.ruangsri.ch/#profile', url: 'https://panat.ruangsri.ch',
  name: 'Panat Ruangsri - Portfolio', inLanguage: 'de-CH',
  mainEntity: {
    '@type': 'Person', '@id': 'https://panat.ruangsri.ch/#person', name: 'Panat Ruangsri',
    url: 'https://panat.ruangsri.ch', email: 'panat@ruangsri.ch',
    image: 'https://panat.ruangsri.ch/founder-portrait.png',
    jobTitle: ['Software Developer Apprentice', 'Co-Founder & CEO'],
    worksFor: [
      { '@type': 'Organization', name: 'Swisscom' },
      { '@type': 'Organization', name: 'Wendico KLG', url: 'https://wendico.ch' },
    ],
    knowsAbout: ['Softwareentwicklung', 'Vue.js', 'Nuxt', 'JavaScript', 'Unternehmertum', 'Webentwicklung'],
    description: 'Software Developer in Ausbildung bei Swisscom und Co-Founder von Wendico KLG in der Schweiz.',
  },
};

export default function HomePage() {
  return (
    <main id="main-content">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(profile).replace(/</g, '\\u003c') }} />
      <h1 className="visually-hidden">Panat Ruangsri - Software Developer und Co-Founder von Wendico</h1>
      <div className="home">
        <section className="hero" id="top" aria-label="Panat Ruangsri homepage">
          <div className="hero__grid" aria-hidden="true" />
          <BrandScene />
          <CardDetails />
          <span id="about" className="hero-anchor" aria-hidden="true" />
          <span id="experience" className="hero-anchor" aria-hidden="true" />
          <span id="news" className="hero-anchor" aria-hidden="true" />
          <span id="works" className="hero-anchor" aria-hidden="true" />
          <span id="contact" className="hero-anchor" aria-hidden="true" />
        </section>
      </div>
      <QuoteSection />
    </main>
  );
}
