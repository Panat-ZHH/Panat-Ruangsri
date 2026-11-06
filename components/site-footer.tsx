import Link from 'next/link';
import { PrivacySettingsButton } from '@/components/privacy-preferences';
import PortfolioLink from '@/components/portfolio-link';

export default function SiteFooter() {
  return (
    <footer className="site-footer" lang="en">
      <div className="site-footer__top">
        <Link href="/panat" className="site-footer__name">Panat Ruangsri</Link>
        <a href="mailto:panat@ruangsri.ch">panat@ruangsri.ch</a>
      </div>
      <nav className="site-footer__pages" aria-label="Portfolio">
        <PortfolioLink href="/panat/software-developer" slug="software-developer">Software Developer</PortfolioLink>
        <PortfolioLink href="/panat/founder" slug="founder">Founder &amp; CEO</PortfolioLink>
        <PortfolioLink href="/panat/side-jobs" slug="side-jobs">Side Jobs</PortfolioLink>
        <PortfolioLink href="/panat/hobbys" slug="hobbys">Hobbies</PortfolioLink>
      </nav>
      <div className="site-footer__bottom">
        <span>© {new Date().getFullYear()} Panat Ruangsri</span>
        <nav aria-label="Legal information">
          <Link href="/panat/legal/impressum">Legal Notice</Link>
          <Link href="/panat/legal/privacy">Privacy</Link>
          <Link href="/panat/legal/cookies">Cookies</Link>
          <PrivacySettingsButton />
        </nav>
      </div>
    </footer>
  );
}