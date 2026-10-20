import type { ReactNode } from 'react';
import 'lenis/dist/lenis.css';
import type { Metadata } from 'next';
import SiteHeader from '@/components/site-header';
import SmoothScroll from '@/components/smooth-scroll';
import PrivacyPreferences from '@/components/privacy-preferences';
import SiteFooter from '@/components/site-footer';
import CardDetails from '@/components/card-details';

export const metadata: Metadata = {
  metadataBase: new URL('https://ruangsri.ch'),
  title: { default: 'Panat Ruangsri | Software Developer & Co-Founder von Wendico', template: '%s | Panat Ruangsri' },
  description: 'Panat Ruangsri: Software Developer in Ausbildung bei Swisscom, Co-Founder und CEO von Wendico KLG. Projekte, Erfahrungen und Interessen aus der Schweiz.',
  applicationName: 'Panat Ruangsri Portfolio',
  authors: [{ name: 'Panat Ruangsri', url: 'https://ruangsri.ch/panat' }],
  creator: 'Panat Ruangsri',
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website', siteName: 'Panat Ruangsri', locale: 'de_CH',
    title: 'Panat Ruangsri | Software Developer & Founder',
    description: 'Softwareentwicklung bei Swisscom, Unternehmertum mit Wendico und die Interessen dahinter.',
    images: [{ url: '/panat/opengraph-image', width: 1200, height: 630, alt: 'Panat Ruangsri, Software Developer und Founder' }],
  },
  twitter: { card: 'summary_large_image', images: ['/opengraph-image'] },
  formatDetection: { telephone: false },
};

export default function PanatLayout({ children }: { children: ReactNode }) {
  return (
    <PrivacyPreferences>
      <SmoothScroll>
        <SiteHeader />
        <CardDetails />
        {children}
        <SiteFooter />
      </SmoothScroll>
    </PrivacyPreferences>
  );
}
