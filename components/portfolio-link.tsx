'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { openPortfolioDetail } from '@/components/portfolio-navigation';

export default function PortfolioLink({ href, slug, children }: {
  href: string;
  slug: string;
  children: ReactNode;
}) {
  return (
    <Link href={href} onClick={(event) => { event.preventDefault(); openPortfolioDetail(slug); }}>
      {children}
    </Link>
  );
}