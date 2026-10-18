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
      <Link className="site-brand" href="/" aria-label="Panat Ruangsri, Startseite">PR</Link>
      <nav className="site-nav" aria-label="Hauptnavigation">
        <Link href="/software-developer" aria-current={pathname === '/software-developer' ? 'page' : undefined}>Software</Link>
        <Link href="/founder" aria-current={pathname === '/founder' ? 'page' : undefined}>Founder &amp; CEO</Link>
        <Link href="/side-jobs" aria-current={pathname === '/side-jobs' ? 'page' : undefined}>Nebenjob</Link>
        <Link href="/hobbys" aria-current={pathname === '/hobbys' ? 'page' : undefined}>Hobbys</Link>
      </nav>
      <details ref={menuRef} className="site-menu">
        <summary>Menü</summary>
        <nav aria-label="Mobile Navigation">
          <Link href="/software-developer">Software Developer</Link>
          <Link href="/founder">Founder &amp; CEO</Link>
          <Link href="/side-jobs">Nebenjob</Link>
          <Link href="/hobbys">Hobbys</Link>
        </nav>
      </details>
    </header>
  );
}