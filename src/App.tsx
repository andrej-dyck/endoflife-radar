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
  const { data, isLoading } = useSWRImmutable('all-products', endOfLifeDate().allProducts)

  const { t } = useTranslation(['ui', 'products'])

  if (isLoading) return <SpinnerBars />
  return <>
    <h3>📃 {t('product-list', { total: data?.products.length })}</h3>
    <ul>
      {data?.products.map(p => <li key={p}>
        <Link to={`eol/${p}`}>{t(p, { ns: 'products' })}</Link>
      </li>)}
    </ul>
  </>
}
