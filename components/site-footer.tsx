import Link from 'next/link';
import { PrivacySettingsButton } from '@/components/privacy-preferences';

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__top">
        <Link href="/panat" className="site-footer__name">Panat Ruangsri</Link>
        <a href="mailto:panat@ruangsri.ch">panat@ruangsri.ch</a>
      </div>
      <nav className="site-footer__pages" aria-label="Portfolio">
        <Link href="/panat/software-developer">Software Developer</Link>
        <Link href="/panat/founder">Founder &amp; CEO</Link>
        <Link href="/panat/side-jobs">Nebenjob</Link>
        <Link href="/panat/hobbys">Hobbys</Link>
      </nav>
      <div className="site-footer__bottom">
        <span>© {new Date().getFullYear()} Panat Ruangsri</span>
        <nav aria-label="Rechtliche Informationen">
          <Link href="/panat/legal/impressum">Impressum</Link>
          <Link href="/panat/legal/privacy">Datenschutz</Link>
          <Link href="/panat/legal/cookies">Cookies</Link>
          <PrivacySettingsButton />
        </nav>
      </div>
    </footer>
  );
}