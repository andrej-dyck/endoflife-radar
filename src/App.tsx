import { SVGProps, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Dashboard } from './Dashboard.tsx'
import { Product } from './endoflife.date.ts'
import { ProductSearch, useProductList } from './ProductSearch.tsx'
import { SpinnerBars } from './ui-components/SpinnerIcons.tsx'

export const App = () => {
  const [products, setProducts] = useState<Set<Product>>(new Set([]))

  const { t } = useTranslation('ui')
  return (<>
    <header className="container flex flex-row flex-wrap items-start justify-between gap-2 p-2 pt-8">
      <ScreenTitle text={t('title')} />
      <ProductSearch onSelect={(p) => setProducts(ps => new Set([...ps, p]))} />
    </header>
    <main className="container">
      <Dashboard products={[...products]} />
    </main>
  </>)
}

export const AllProductsDashboard = () => {
  const { products, isLoading } = useProductList()

  const { t } = useTranslation('ui')
  return (<>
    <header className="container p-2 pt-8">
      <ScreenTitle text={t('title')} />
    </header>
    <main className="container pb-4">
      {isLoading ? <SpinnerBars /> : products && <Dashboard products={[...products]} />}
    </main>
  </>)
}

export const ScreenTitle = ({ text }: { text: string }) =>
  <h1 className="inline-flex items-center gap-2"><RadarIcon /> {text}</h1>

const RadarIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" aria-hidden="true" viewBox="0 0 20 20" {...props}>
    <path fill="currentColor"
      d="m14.497 3.382l-.722.722A7 7 0 1 0 14.95 14.95a.5.5 0 0 1 .707.707a8 8 0 1 1-1.16-12.275m-2.935 2.935l.751-.751a5.002 5.002 0 0 0-5.849 7.97a5 5 0 0 0 7.072 0a.5.5 0 1 0-.708-.708a4 4 0 1 1-1.266-6.511m4.292-2.17a.5.5 0 0 1 0 .707L10.966 9.74a1.001 1.001 0 1 1-.707-.707l4.887-4.888a.5.5 0 0 1 .708 0M17 13.5a.5.5 0 1 1-1 0a.5.5 0 0 1 1 0M16.5 7a.5.5 0 1 0 0-1a.5.5 0 0 0 0 1m1.5 4.25a.5.5 0 1 1-1 0a.5.5 0 0 1 1 0m-.5-2a.5.5 0 1 0 0-1a.5.5 0 0 0 0 1m-2.5 2a.5.5 0 1 1-1 0a.5.5 0 0 1 1 0m-.5-2a.5.5 0 1 0 0-1a.5.5 0 0 0 0 1"></path>
  </svg>
)
