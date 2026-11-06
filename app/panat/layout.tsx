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
  title: { default: 'Panat Ruangsri | Software Developer & Co-Founder at Wendico', template: '%s | Panat Ruangsri' },
  description: 'Panat Ruangsri is a software developer apprentice at Swisscom and Co-Founder and CEO of Wendico KLG. Explore his projects, experience and interests in Switzerland.',
  applicationName: 'Panat Ruangsri Portfolio',
  authors: [{ name: 'Panat Ruangsri', url: 'https://ruangsri.ch/panat' }],
  creator: 'Panat Ruangsri',
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website', siteName: 'Panat Ruangsri', locale: 'en_US',
    title: 'Panat Ruangsri | Software Developer & Founder',
    description: 'Software development at Swisscom, entrepreneurship with Wendico and the interests behind it.',
    images: [{ url: '/panat/opengraph-image', width: 1200, height: 630, alt: 'Panat Ruangsri, software developer and founder' }],
  },
  twitter: { card: 'summary_large_image', images: ['/panat/opengraph-image'] },
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
