import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';

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
        <h1 id="directory-title" className="visually-hidden">Ruangsri</h1>
        <div className="ruangsri-cards">
          {profiles.map((profile) => (
            <article key={profile.name} className={`ruangsri-card${profile.href ? ' ruangsri-card--active' : ''}`}>
              <div className="ruangsri-card__content">
                <span className="ruangsri-card__portrait">
                  <Image src={profile.photo} alt={`Porträt von ${profile.name}`} width={profile.width} height={profile.height} sizes="(max-width: 760px) 100px, 18vw" priority />
                </span>
                <span className="ruangsri-card__name">{profile.name}</span>
                {profile.external ? (
                  <a href={profile.href} className="ruangsri-card__button" target="_blank" rel="noopener noreferrer">Zur Website</a>
                ) : (
                  <Link href={profile.href} className="ruangsri-card__button">Zur Website</Link>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
