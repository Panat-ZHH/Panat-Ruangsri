import BrandScene from '@/components/brand-scene';
import CardDetails from '@/components/card-details';
import QuoteSection from '@/components/quote-section';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL('https://ruangsri.ch'),
  title: 'Panat Ruangsri | Software Developer & Co-Founder von Wendico',
  description: 'Panat Ruangsri: Software Developer in Ausbildung bei Swisscom, Co-Founder und CEO von Wendico KLG. Projekte, Erfahrungen und Interessen aus der Schweiz.',
  alternates: { canonical: '/panat' },
  openGraph: { url: '/panat' },
};

const profile = {
  '@context': 'https://schema.org', '@type': 'ProfilePage',
  '@id': 'https://ruangsri.ch/panat#profile', url: 'https://ruangsri.ch/panat',
  name: 'Panat Ruangsri - Portfolio', inLanguage: 'de-CH',
  mainEntity: {
    '@type': 'Person', '@id': 'https://ruangsri.ch/panat#person', name: 'Panat Ruangsri',
    url: 'https://ruangsri.ch/panat', email: 'panat@ruangsri.ch',
    image: 'https://ruangsri.ch/founder-portrait.png',
    jobTitle: ['Software Developer Apprentice', 'Co-Founder & CEO'],
    worksFor: [
      { '@type': 'Organization', name: 'Swisscom' },
      { '@type': 'Organization', name: 'Wendico KLG', url: 'https://wendico.ch' },
    ],
    knowsAbout: ['Softwareentwicklung', 'Vue.js', 'Nuxt', 'JavaScript', 'Unternehmertum', 'Webentwicklung'],
    description: 'Software Developer in Ausbildung bei Swisscom und Co-Founder von Wendico KLG in der Schweiz.',
  },
};

export default function PanatHomePage() {
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
