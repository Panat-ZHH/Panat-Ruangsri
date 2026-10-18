import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { portfolioPages } from '@/components/portfolio-content';

export const dynamicParams = false;

export function generateStaticParams() {
  return portfolioPages.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug: requestedSlug } = await params;
  const entry = portfolioPages.find(({ slug }) => slug === requestedSlug);
  if (!entry) return {};
  return {
    title: entry.title,
    description: entry.description,
    alternates: { canonical: `/${entry.slug}` },
    openGraph: { title: `${entry.title} | Panat Ruangsri`, description: entry.description, url: `/${entry.slug}` },
  };
}

export default async function PortfolioPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug: requestedSlug } = await params;
  const entry = portfolioPages.find(({ slug }) => slug === requestedSlug);
  if (!entry) notFound();
  const schema = {
    '@context': 'https://schema.org', '@type': 'ProfilePage',
    url: `https://panat.ruangsri.ch/${entry.slug}`, name: `${entry.title} | Panat Ruangsri`,
    description: entry.description, inLanguage: entry.slug === 'founder' ? 'en' : 'de-CH',
    mainEntity: { '@id': 'https://panat.ruangsri.ch/#person' },
  };
  return (
    <main id="main-content" className="details-sheet portfolio-page" style={entry.theme} lang={entry.slug === 'founder' ? 'en' : 'de-CH'}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }} />
      <div className="portfolio-page__inner">
        <Link href="/" className="portfolio-back">Zur Startseite</Link>
        <header className="details-sheet__header">
          <p className="details-sheet__index">{entry.eyebrow}</p>
          <h1 className="details-sheet__title">{entry.title}</h1>
        </header>
        <p className="portfolio-summary">{entry.description}</p>
        {entry.content}
      </div>
    </main>
  );
}