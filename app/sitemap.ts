import type { MetadataRoute } from 'next'
import { engineers } from '@/lib/engineers'
import { products } from '@/lib/products'

const BASE = 'https://sideband.studio'

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    { path: '', priority: 1 },
    { path: '/products', priority: 0.9 },
    { path: '/engineers', priority: 0.8 },
    { path: '/about', priority: 0.7 },
    { path: '/inquire', priority: 0.7 },
    { path: '/contact', priority: 0.5 },
  ].map(({ path, priority }) => ({
    url: `${BASE}${path}`,
    changeFrequency: 'monthly' as const,
    priority,
  }))

  return [
    ...staticRoutes,
    ...products.map((p) => ({
      url: `${BASE}/products/${p.id}`,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
    ...engineers.map((e) => ({
      url: `${BASE}/engineers/${e.id}`,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
  ]
}
