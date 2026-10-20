'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { openPortfolioDetail } from '@/components/portfolio-navigation';

export default function SiteHeader() {
  const pathname = usePathname();
  const menuRef = useRef<HTMLDetailsElement>(null);
  useEffect(() => { menuRef.current?.removeAttribute('open'); }, [pathname]);
  return (
    <header className="site-header">
      <Link className="site-brand" href="/panat" aria-label="Panat Ruangsri, Startseite">PR</Link>
      <nav className="site-nav" aria-label="Hauptnavigation">
        <Link href="/panat/software-developer" onClick={(event) => { event.preventDefault(); openPortfolioDetail('software-developer'); }} aria-current={pathname === '/panat/software-developer' ? 'page' : undefined}>Software</Link>
        <Link href="/panat/founder" onClick={(event) => { event.preventDefault(); openPortfolioDetail('founder'); }} aria-current={pathname === '/panat/founder' ? 'page' : undefined}>Founder &amp; CEO</Link>
        <Link href="/panat/side-jobs" onClick={(event) => { event.preventDefault(); openPortfolioDetail('side-jobs'); }} aria-current={pathname === '/panat/side-jobs' ? 'page' : undefined}>Nebenjob</Link>
        <Link href="/panat/hobbys" onClick={(event) => { event.preventDefault(); openPortfolioDetail('hobbys'); }} aria-current={pathname === '/panat/hobbys' ? 'page' : undefined}>Hobbys</Link>
      </nav>
      <details ref={menuRef} className="site-menu">
        <summary>Menü</summary>
        <nav aria-label="Mobile Navigation">
          <Link href="/panat/software-developer" onClick={(event) => { event.preventDefault(); menuRef.current?.removeAttribute('open'); openPortfolioDetail('software-developer'); }}>Software Developer</Link>
          <Link href="/panat/founder" onClick={(event) => { event.preventDefault(); menuRef.current?.removeAttribute('open'); openPortfolioDetail('founder'); }}>Founder &amp; CEO</Link>
          <Link href="/panat/side-jobs" onClick={(event) => { event.preventDefault(); menuRef.current?.removeAttribute('open'); openPortfolioDetail('side-jobs'); }}>Nebenjob</Link>
          <Link href="/panat/hobbys" onClick={(event) => { event.preventDefault(); menuRef.current?.removeAttribute('open'); openPortfolioDetail('hobbys'); }}>Hobbys</Link>
        </nav>
      </details>
    </header>
  );
}