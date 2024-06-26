import { useTranslation } from 'react-i18next'
import { Product } from './endoflife.date.ts'
import { ProductCards } from './ProductCards.tsx'
import { ProductSearch, useProductList } from './ProductSearch.tsx'
import { pStrings, useUrlState } from './state/useUrlState.ts'
import { ScreenTitle } from './ui-components/ScreenTitle.tsx'
import { SpinnerBars } from './ui-components/SpinnerIcons.tsx'

export const Dashboard = () => {
  const [productIds, setProductIds] = useUrlState('products', pStrings())

  const withProduct = (p: Product) =>
    setProductIds((ps) => ps.some(productId => productId === p.productId) ? ps : [...ps, p.productId])

  const withoutProduct = (p: Product) =>
    setProductIds((ps) => ps.filter(productId => productId !== p.productId))

  const { t } = useTranslation('ui')
  return <>
    <header className="container flex flex-row flex-wrap items-start justify-between gap-2 p-2 pt-8">
      <ScreenTitle text={t('title')} />
      <ProductSearch onSelect={withProduct} />
    </header>
    <main className="container pb-4">
      <ProductCards products={productIds.map(productId => ({ productId }))} onRemove={withoutProduct} />
    </main>
  </>
}

export const AllProductsDashboard = () => {
  const { products, isLoading } = useProductList()

  const { t } = useTranslation('ui')
  return <>
    <header className="container p-2 pt-8">
      <ScreenTitle text={t('title')} />
    </header>
    <main className="container pb-4">
      {isLoading ? <SpinnerBars /> : products && <ProductCards products={[...products]} />}
    </main>
  </>
}
