import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { FamilyGlobe } from '@/components/family-globe';

export const metadata: Metadata = {
  title: 'Familie Ruangsri | Pawat, Panat & Phanuphon Ruangsri',
  description: 'Offizielle Familienwebsite von Pawat, Panat und Phanuphon Ruangsri. Profile und persönliche Websites der Familie Ruangsri.',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website', url: '/', title: 'Familie Ruangsri',
    description: 'Profile und persönliche Websites von Pawat, Panat und Phanuphon Ruangsri.',
  },
};

const profiles = [
  { name: 'Pawat Ruangsri', href: 'https://pawat.ruangsri.ch', photo: '/pawat.png', width: 714, height: 1025, external: true },
  { name: 'Panat Ruangsri', href: '/panat', photo: '/panat.webp', width: 1023, height: 956, external: false },
  { name: 'Phanuphon Ruangsri', href: 'https://www.linkedin.com/in/phanuphon-ruangsri-09158a41b/?isSelfProfile=false', photo: '/phanuphon.jpeg', width: 1024, height: 1057, external: true },
];

const profileList = {
  '@context': 'https://schema.org', '@graph': [
    {
      '@type': 'WebSite', '@id': 'https://ruangsri.ch/#website', url: 'https://ruangsri.ch/',
      name: 'Familie Ruangsri', inLanguage: 'de-CH',
      description: 'Familienwebsite mit den Profilen und persönlichen Websites von Pawat, Panat und Phanuphon Ruangsri.',
      mainEntity: { '@id': 'https://ruangsri.ch/#profiles' },
    },
    {
      '@type': 'ItemList', '@id': 'https://ruangsri.ch/#profiles', name: 'Profile der Familie Ruangsri', numberOfItems: profiles.length,
  itemListElement: profiles.map((profile, index) => ({
        '@type': 'ListItem', position: index + 1,
        item: {
          '@type': 'Person', name: profile.name,
          image: `https://ruangsri.ch${profile.photo}`,
          url: profile.external ? profile.href : `https://ruangsri.ch${profile.href}`,
        },
  })),
    },
  ],
};

export default function RuangsriHomePage() {
  return (
    <main id="main-content" className="ruangsri-home">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(profileList).replace(/</g, '\\u003c') }} />
      <section className="ruangsri-directory" aria-labelledby="directory-title">
        <header className="ruangsri-intro">
          <p className="ruangsri-intro__eyebrow">Eine Familie. Drei Persönlichkeiten.</p>
          <h1 id="directory-title">RUANGSRI</h1>
          <p className="ruangsri-intro__origin">In der Schweiz zu Hause. Mit Thailand verbunden.</p>
        </header>
        <div className="ruangsri-cards">
          {profiles.map((profile) => (
            <article key={profile.name} className="ruangsri-card">
              <Link href={profile.href} className="ruangsri-card__link" target={profile.external ? '_blank' : undefined} rel={profile.external ? 'noopener noreferrer' : undefined} aria-label={`${profile.name} ${profile.name.startsWith('Phanuphon') ? 'LinkedIn' : 'Zur Website'}${profile.external ? ' (öffnet in neuem Tab)' : ''}`}>
                <span className="ruangsri-card__portrait">
                  <Image src={profile.photo} alt={`Porträt von ${profile.name}`} width={profile.width} height={profile.height} sizes="(max-width: 760px) 90vw, 30vw" priority />
                </span>
                <span className="ruangsri-card__content">
                  <span className="ruangsri-card__name">{profile.name.split(' ')[0]}<span>Ruangsri</span></span>
                  <span className="ruangsri-card__destination">{profile.name.startsWith('Phanuphon') ? 'LinkedIn' : 'Zur Website'}<ArrowUpRight size={20} strokeWidth={1.5} aria-hidden="true" /></span>
                </span>
              </Link>
            </article>
          ))}
        </div>
      </section>
      <FamilyGlobe />
      <footer className="ruangsri-footer"><span>Familie Ruangsri</span><span>Schweiz & Thailand</span></footer>
    </main>
  );
}
