import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return ['', '/software-developer', '/founder', '/side-jobs', '/hobbys'].map((path) => ({
    url: `https://panat.ruangsri.ch${path}`, changeFrequency: 'monthly', priority: path ? 0.8 : 1,
  }));
}