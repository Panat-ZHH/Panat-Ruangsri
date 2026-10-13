import './globals.css';
import 'lenis/dist/lenis.css';
import type { Metadata } from 'next';
import SiteHeader from '@/components/site-header';
import SmoothScroll from '@/components/smooth-scroll';

export const metadata: Metadata = {
  title: 'Panat Ruangsri — Software Developer',
  description: 'Thoughtful software, made to move people forward.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SmoothScroll>
          <a className="skip-link" href="#main-content">Skip to content</a>
          <SiteHeader />
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
