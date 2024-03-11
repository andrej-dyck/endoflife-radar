import { Link } from 'react-router-dom'
import useSWRImmutable from 'swr/immutable'
import { endOfLifeDate } from './endoflife.date.ts'
import { RadarIcon } from './icons/RadarIcon.tsx'
import { SpinnerBars } from './icons/SpinnerIcons.tsx'

export const App = () => (
  <main className="container p-4">
    <h1 className="inline-flex items-center gap-2"><RadarIcon /> End-of-life and Support Lifecycles</h1>
    <ProductList />
  </main>
)

const ProductList = () => {
  const { data, isLoading } = useSWRImmutable('all-products', endOfLifeDate().allProducts)

  if (isLoading) return <SpinnerBars />
  return <>
    <h3>📃 Products ({data?.products.length})</h3>
    <ul>
      {data?.products.map(p => <li key={p}>
        <Link to={`eol/${p}`}>{p}</Link>
      </li>)}
    </ul>
  </>
}
