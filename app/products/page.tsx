import type { Metadata } from 'next'
import ProductIndex from '@/components/products/ProductIndex'
import { pageMetadata } from '@/lib/metadata'
import { capitalize, numberWord, rankingSummary } from '@/lib/products-view'

const summary = rankingSummary()

const description = `${capitalize(numberWord(summary.ranked.length))} Sideband products, ordered by a score that blends GitHub popularity and scope. ${capitalize(numberWord(summary.live))} live, ${numberWord(summary.inDevelopment)} in active development.`

export const metadata: Metadata = pageMetadata({
  title: 'Products · Sideband',
  description,
  path: '/products',
})

export default function ProductsPage() {
  return <ProductIndex summary={summary} />
}
