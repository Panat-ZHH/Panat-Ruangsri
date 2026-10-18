'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

export default function SiteHeader() {
  const pathname = usePathname();
  const menuRef = useRef<HTMLDetailsElement>(null);
  useEffect(() => { menuRef.current?.removeAttribute('open'); }, [pathname]);
  return (
    <header className="site-header">
      <Link className="site-brand" href="/panat" aria-label="Panat Ruangsri, Startseite">PR</Link>
      <nav className="site-nav" aria-label="Hauptnavigation">
        <Link href="/panat/software-developer" aria-current={pathname === '/panat/software-developer' ? 'page' : undefined}>Software</Link>
        <Link href="/panat/founder" aria-current={pathname === '/panat/founder' ? 'page' : undefined}>Founder &amp; CEO</Link>
        <Link href="/panat/side-jobs" aria-current={pathname === '/panat/side-jobs' ? 'page' : undefined}>Nebenjob</Link>
        <Link href="/panat/hobbys" aria-current={pathname === '/panat/hobbys' ? 'page' : undefined}>Hobbys</Link>
      </nav>
      <details ref={menuRef} className="site-menu">
        <summary>Menü</summary>
        <nav aria-label="Mobile Navigation">
          <Link href="/panat/software-developer">Software Developer</Link>
          <Link href="/panat/founder">Founder &amp; CEO</Link>
          <Link href="/panat/side-jobs">Nebenjob</Link>
          <Link href="/panat/hobbys">Hobbys</Link>
        </nav>
      </details>
    </header>
  );
}