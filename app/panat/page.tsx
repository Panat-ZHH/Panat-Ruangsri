import BrandScene from '@/components/brand-scene';
import { HeroCardActions } from '@/components/card-details';
import QuoteSection from '@/components/quote-section';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL('https://ruangsri.ch'),
  title: 'Panat Ruangsri | Software Developer & Co-Founder at Wendico',
  description: 'Panat Ruangsri is a software developer apprentice at Swisscom and Co-Founder and CEO of Wendico KLG. Explore his projects, experience and interests in Switzerland.',
  alternates: { canonical: '/panat' },
  openGraph: { url: '/panat' },
};

const profile = {
  '@context': 'https://schema.org', '@type': 'ProfilePage',
  '@id': 'https://ruangsri.ch/panat#profile', url: 'https://ruangsri.ch/panat',
  name: 'Panat Ruangsri - Portfolio', inLanguage: 'en',
  mainEntity: {
    '@type': 'Person', '@id': 'https://ruangsri.ch/panat#person', name: 'Panat Ruangsri',
    url: 'https://ruangsri.ch/panat', email: 'panat@ruangsri.ch',
    image: 'https://ruangsri.ch/founder-portrait.png',
    jobTitle: ['Software Developer Apprentice', 'Co-Founder & CEO'],
    worksFor: [
      { '@type': 'Organization', name: 'Swisscom' },
      { '@type': 'Organization', name: 'Wendico KLG', url: 'https://wendico.ch' },
    ],
    knowsAbout: ['Software development', 'Vue.js', 'Nuxt', 'JavaScript', 'Entrepreneurship', 'Web development'],
    description: 'Software developer apprentice at Swisscom and Co-Founder of Wendico KLG in Switzerland.',
  },
};

export default function PanatHomePage() {
  return (
    <main id="main-content" lang="en">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(profile).replace(/</g, '\\u003c') }} />
      <h1 className="visually-hidden">Panat Ruangsri - Software Developer and Co-Founder of Wendico</h1>
      <div className="home">
        <section className="hero" id="top" aria-label="Panat Ruangsri homepage" lang="en">
          <div className="hero__grid" aria-hidden="true" />
          <BrandScene />
          <HeroCardActions />
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
