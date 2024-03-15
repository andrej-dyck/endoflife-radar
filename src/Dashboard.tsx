import { SVGProps } from 'react'
import { Link } from 'react-router-dom'
import { Cycle, Cycles, Product, Products } from './endoflife.date.ts'
import { useProductEolInfo } from './EndOfProductLife.tsx'
import { LinkNewTab } from './ui-components/LinkNewTab.tsx'
import { SpinnerBars } from './ui-components/SpinnerIcons.tsx'

export const Dashboard = ({ products }: { products: Products }) => {
  return <div
    className="grid grid-cols-1 place-content-center justify-items-stretch gap-4 p-2 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
    {products.map(p => <ProductCard key={p.productId} product={p} />)}
  </div>
}

const ProductCard = ({ product }: { product: Product }) => {
  const { name, cycles, href, isLoading } = useProductEolInfo(product)

  const iconClass = 'size-6 rounded-full transition-all p-1 hover:ring hover:ring-focus focus:ring focus:ring-focus'

  return <div
    className="flex h-52 flex-col overflow-hidden rounded-xl border border-element-border bg-element-bg px-3 py-2"
  >
    {isLoading ? <SpinnerBars /> : (<>
      <h2>{name}</h2>
      <div className="grow">
        {cycles && <ProductCycles cycles={cycles} />}
      </div>
      <div className="flex justify-end gap-1">
        <Link to={`/eol/${product.productId}`}><MagnifyIcon className={iconClass} /></Link>
        {href && <LinkNewTab href={href} iconClass={iconClass} />}
      </div>
    </>)}
  </div>
}

const ProductCycles = ({ cycles }: { cycles: Cycles }) => {
  return <div className="flex h-full flex-col gap-2 p-2">
    {cycles.length === 0 ? 'N/A' : cycles.slice(0, 3).map(c => <ProductCycle key={c.cycle} cycle={c} />)}
  </div>
}

const ProductCycle = ({ cycle }: { cycle: Cycle }) => {
  return <>
    <h3>{cycle.latest ?? cycle.cycle} {cycle.codename}</h3>
  </>
}

/** material-symbols:feature-search-outline */
const MagnifyIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>
    <path fill="currentColor"
      d="m18 13.25l2 2V20q0 .825-.587 1.413T18 22H4q-.825 0-1.412-.587T2 20V6q0-.825.588-1.412T4 4h5.5q-.2.45-.3.963T9.05 6H4v14h14zm1.3-4.35l3.2 3.2l-1.4 1.4l-3.2-3.2q-.525.3-1.125.5T15.5 11q-1.875 0-3.187-1.313T11 6.5q0-1.875 1.313-3.187T15.5 2q1.875 0 3.188 1.313T20 6.5q0 .675-.2 1.275T19.3 8.9m-3.8.1q1.05 0 1.775-.725T18 6.5q0-1.05-.725-1.775T15.5 4q-1.05 0-1.775.725T13 6.5q0 1.05.725 1.775T15.5 9M4 13.25V20V6v7v-.3z"></path>
  </svg>
)
