import Link from 'next/link';
import { PrivacySettingsButton } from '@/components/privacy-preferences';

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__top">
        <Link href="/" className="site-footer__name">Panat Ruangsri</Link>
        <a href="mailto:panat@ruangsri.ch">panat@ruangsri.ch</a>
      </div>
      <nav className="site-footer__pages" aria-label="Portfolio">
        <Link href="/software-developer">Software Developer</Link>
        <Link href="/founder">Founder &amp; CEO</Link>
        <Link href="/side-jobs">Nebenjob</Link>
        <Link href="/hobbys">Hobbys</Link>
      </nav>
      <div className="site-footer__bottom">
        <span>© {new Date().getFullYear()} Panat Ruangsri</span>
        <nav aria-label="Rechtliche Informationen">
          <Link href="/legal/impressum">Impressum</Link>
          <Link href="/legal/privacy">Datenschutz</Link>
          <Link href="/legal/cookies">Cookies</Link>
          <PrivacySettingsButton />
        </nav>
      </div>
    </footer>
  );
}