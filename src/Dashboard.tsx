import { useProductEolInfo } from './EndOfProductLife.tsx'
import { SpinnerBars } from './icons/SpinnerIcons.tsx'
import { LinkNewTab } from './ui-components/LinkNewTab.tsx'

export const Dashboard = ({ products }: { products: readonly { productId: string }[] }) => {
  return <>
    {products.map(p => <ProductCard key={p.productId} product={p} />)}
  </>
}

const ProductCard = ({ product }: { product: { productId: string } }) => {
  const { name, href, isLoading } = useProductEolInfo(product)

  return isLoading ? <SpinnerBars /> : <span className="inline-flex content-baseline gap-1">
    {name} {href && <>- <LinkNewTab href={href} /></>}
  </span>
}
