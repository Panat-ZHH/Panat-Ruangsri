import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: 'https://ruangsri.ch/sitemap.xml', host: 'https://ruangsri.ch',
  };
}