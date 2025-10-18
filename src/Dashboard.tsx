import { useTranslation } from 'react-i18next'
import { type Product } from './apiEndoflifeDate.ts'
import { ProductCards } from './ProductCards.tsx'
import { ProductSearch, useProductList } from './ProductSearch.tsx'
import { pStrings, useUrlState } from './state/useUrlState.ts'
import { ScreenTitle } from './ui-components/ScreenTitle.tsx'
import { SpinnerBars } from './ui-components/SpinnerIcons.tsx'
import { TextLink } from './ui-components/TextLink.tsx'

export const Dashboard = () => {
  const [productIds, setProductIds] = useUrlState('products', pStrings())

  const withProduct = (p: Pick<Product, 'productId'>) =>
    setProductIds((ps) => ps.some(productId => productId === p.productId) ? ps : [...ps, p.productId])

  const withoutProduct = (p: Pick<Product, 'productId'>) =>
    setProductIds((ps) => ps.filter(productId => productId !== p.productId))

  const { t } = useTranslation('ui')
  return <>
    <header className="container flex flex-row flex-wrap items-start gap-2 p-2 pt-8">
      <ScreenTitle text={t('title')} />
      <span className="flex flex-row flex-wrap grow items-baseline justify-end gap-4">
        <TextLink to="/all">show all</TextLink>
        <ProductSearch onSelect={withProduct} />
      </span>
    </header>
    <main className="container pb-4">
      <ProductCards products={productIds.map(productId => ({ productId }))} onRemove={withoutProduct} />
    </main>
  </>
}

export const AllProductsDashboard = () => {
  const { products, isLoading } = useProductList()

  const { t } = useTranslation('ui')

  const sortedProducts = products?.toSorted((a, b) => a.label.localeCompare(b.label))

  return <>
    <header className="container p-2 pt-8">
      <ScreenTitle text={t('title')} />
    </header>
    <main className="container pb-4">
      {isLoading ? <SpinnerBars /> : sortedProducts && <ProductCards products={sortedProducts} />}
    </main>
  </>
}
