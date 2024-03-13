import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Dashboard } from './Dashboard.tsx'
import { RadarIcon } from './icons/RadarIcon.tsx'
import { ProductSearch } from './ProductSearch.tsx'

export const App = () => {
  const [products, setProducts] = useState<Set<{ productId: string }>>(new Set([]))

  const { t } = useTranslation('ui')
  return (<>
    <header className="container flex flex-row flex-wrap items-start justify-between gap-2 p-2 pt-8">
      <h1 className="inline-flex items-center gap-2"><RadarIcon /> {t('title')}</h1>
      <ProductSearch onSelect={(p) => setProducts(ps => new Set([...ps, p]))} />
    </header>
    <main className="container flex flex-col gap-2 p-2">
      <Dashboard products={[...products]} />
    </main>
  </>)
}
