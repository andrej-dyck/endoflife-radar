import { SVGProps } from 'react'
import { Link } from 'react-router-dom'
import { useProductEolInfo } from './EndOfProductLife.tsx'
import { SpinnerBars } from './icons/SpinnerIcons.tsx'
import { LinkNewTab } from './ui-components/LinkNewTab.tsx'

export const Dashboard = ({ products }: { products: readonly { productId: string }[] }) => {
  return <div className="grid grid-cols-1 place-content-center justify-items-stretch gap-4 p-2 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
    {products.map(p => <ProductCard key={p.productId} product={p} />)}
  </div>
}

const ProductCard = ({ product }: { product: { productId: string } }) => {
  const { name, href, isLoading } = useProductEolInfo(product)

  const iconClass = 'size-6 rounded-full transition-all p-1 hover:ring hover:ring-focus focus:ring focus:ring-focus'

  return <div
    className="flex h-52 flex-col overflow-hidden rounded-xl border border-element-border bg-element-bg px-3 py-2"
  >
    {isLoading ? <SpinnerBars /> : (<>
      <h2>{name}</h2>
      <div className="grow"></div>
      <div className="flex justify-end gap-2">
        <Link to={`eol/${product.productId}`}><MagnifyIcon className={iconClass} /></Link>
        {href && <LinkNewTab href={href} iconClass={iconClass} />}
      </div>
    </>)}
  </div>
}

const MagnifyIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 32 32" {...props}>
    <defs></defs>
    <path d="M12 21H4V4h18v8h2V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v17a2 2 0 0 0 2 2h8z" fill="currentColor"></path>
    <path d="M30 28.58l-3.11-3.11a6 6 0 1 0-1.42 1.42L28.58 30zM22 26a4 4 0 1 1 4-4a4 4 0 0 1-4 4z"
      fill="currentColor"></path>
  </svg>
)
