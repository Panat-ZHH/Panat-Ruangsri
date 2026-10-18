import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL('https://ruangsri.ch'),
  title: { default: 'Ruangsri', template: '%s | Ruangsri' },
  description: 'Profile der Familie Ruangsri.',
  applicationName: 'Ruangsri',
  authors: [{ name: 'Ruangsri', url: 'https://ruangsri.ch' }],
  creator: 'Ruangsri',
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website', siteName: 'Ruangsri', locale: 'de_CH',
    title: 'Ruangsri', description: 'Profile der Familie Ruangsri.',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'Ruangsri profiles' }],
  },
  twitter: { card: 'summary_large_image', images: ['/opengraph-image'] },
  formatDetection: { telephone: false },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de-CH">
      <body>
        <a className="skip-link" href="#main-content">Zum Inhalt</a>
        {children}
      </body>
    </html>
  );
}
