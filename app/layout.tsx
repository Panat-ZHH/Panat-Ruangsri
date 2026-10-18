import './globals.css';
import 'lenis/dist/lenis.css';
import type { Metadata } from 'next';
import SiteHeader from '@/components/site-header';
import SmoothScroll from '@/components/smooth-scroll';
import PrivacyPreferences from '@/components/privacy-preferences';
import SiteFooter from '@/components/site-footer';

export const metadata: Metadata = {
  metadataBase: new URL('https://panat.ruangsri.ch'),
  title: { default: 'Panat Ruangsri | Software Developer & Co-Founder von Wendico', template: '%s | Panat Ruangsri' },
  description: 'Panat Ruangsri: Software Developer in Ausbildung bei Swisscom, Co-Founder und CEO von Wendico KLG. Projekte, Erfahrungen und Interessen aus der Schweiz.',
  applicationName: 'Panat Ruangsri Portfolio',
  authors: [{ name: 'Panat Ruangsri', url: 'https://panat.ruangsri.ch' }],
  creator: 'Panat Ruangsri',
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website', siteName: 'Panat Ruangsri', locale: 'de_CH',
    title: 'Panat Ruangsri | Software Developer & Founder',
    description: 'Softwareentwicklung bei Swisscom, Unternehmertum mit Wendico und die Interessen dahinter.',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'Panat Ruangsri, Software Developer und Founder' }],
  },
  twitter: { card: 'summary_large_image', images: ['/opengraph-image'] },
  formatDetection: { telephone: false },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de-CH">
      <body>
        <PrivacyPreferences>
          <SmoothScroll>
            <a className="skip-link" href="#main-content">Zum Inhalt</a>
            <SiteHeader />
            {children}
            <SiteFooter />
          </SmoothScroll>
        </PrivacyPreferences>
      </body>
    </html>
  );
}
