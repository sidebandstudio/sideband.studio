import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/metadata'
import { engineers } from '@/lib/engineers'
import { products } from '@/lib/products'

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    { path: '', priority: 1 },
    { path: '/products', priority: 0.9 },
    { path: '/engineers', priority: 0.8 },
    { path: '/about', priority: 0.7 },
    { path: '/contact', priority: 0.5 },
  ].map(({ path, priority }) => ({
    url: `${SITE_URL}${path}`,
    changeFrequency: 'monthly' as const,
    priority,
  }))

  return [
    ...staticRoutes,
    ...products.map((p) => ({
      url: `${SITE_URL}/products/${p.id}`,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
    ...engineers.map((e) => ({
      url: `${SITE_URL}/engineers/${e.id}`,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
  ]
}
