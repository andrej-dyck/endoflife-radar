import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import useSWRImmutable from 'swr/immutable'
import { endOfLifeDate } from './endoflife.date.ts'
import { RadarIcon } from './icons/RadarIcon.tsx'
import { SpinnerBars } from './icons/SpinnerIcons.tsx'

export const App = () => {
  const { t } = useTranslation('ui')
  return (
    <main className="container p-4">
      <h1 className="inline-flex items-center gap-2"><RadarIcon /> {t('title')}</h1>
      <ProductList />
    </main>
  )
}

const ProductList = () => {
  const { products, isLoading } = useProductList()

  const { t } = useTranslation('ui')

  if (isLoading) return <SpinnerBars />
  return <>
    <h3>📃 {t('product-list', { total: products?.length })}</h3>
    <ul>
      {products?.map(p => <li key={p.productId}>
        <Link to={`eol/${p.productId}`}>{p.name}</Link>
      </li>)}
    </ul>
  </>
}

const useProductList = () => {
  const { data, isLoading } = useSWRImmutable('product-list', endOfLifeDate().allProducts)
  const { t } = useTranslation('products')

  const products = useMemo(
    () => data?.products.map(p => ({
      productId: p,
      name: t(p),
    })).toSorted(({ name: n1 }, { name: n2 }) => n1.localeCompare(n2)),
    [data, t]
  )

  return { products, isLoading }
}
