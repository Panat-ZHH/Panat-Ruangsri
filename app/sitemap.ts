import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return ['', '/panat', '/panat/software-developer', '/panat/founder', '/panat/side-jobs', '/panat/hobbys'].map((path) => ({
    url: `https://ruangsri.ch${path}`, changeFrequency: 'monthly', priority: path ? 0.8 : 1,
  }));
}