'use client';

import Link from 'next/link';

export default function SiteHeader() {
  return (
    <header className="site-header">
      <Link className="site-back" href="/">Zurück zu Ruangsri</Link>
    </header>
  );
}