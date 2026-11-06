'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function SiteHeader() {
  useEffect(() => {
    const previousLanguage = document.documentElement.lang;
    const skipLink = document.querySelector<HTMLAnchorElement>('.skip-link');
    const previousSkipText = skipLink?.textContent;
    document.documentElement.lang = 'en';
    if (skipLink) skipLink.textContent = 'Skip to content';
    return () => {
      document.documentElement.lang = previousLanguage;
      if (skipLink && previousSkipText !== undefined) skipLink.textContent = previousSkipText;
    };
  }, []);

  return (
    <header className="site-header" lang="en">
      <Link className="site-back" href="/">Back to Ruangsri</Link>
    </header>
  );
}