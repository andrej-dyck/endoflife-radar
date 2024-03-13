import * as fuzzy from 'fuzzy'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import useSWRImmutable from 'swr/immutable'
import { endOfLifeDate } from './endoflife.date.ts'
import { SpinnerBars } from './icons/SpinnerIcons.tsx'
import { SearchBox } from './ui-components/SearchBox.tsx'

export const ProductSearch = () => {
  const [searchString, setSearchString] = useState('')
  const { products, isLoading } = useFilteredProductList(searchString)

  const { t } = useTranslation('ui')

  return <div className="w-1/3 min-w-60 space-y-2">
    <SearchBox
      label={t('product-search.label')}
      placeholder={t('product-search.placeholder')}
      onChange={(s) => setSearchString(s)}
    />
    <div className="relative">
      {isLoading ? <SpinnerBars /> : (
        <ul className="absolute z-50 p-2 pt-0">
          {products?.map(p => <li key={p.productId}>
            <Link to={`eol/${p.productId}`}>{p.name}</Link>
          </li>)}
        </ul>
      )}
    </div>
  </div>
}

const useFilteredProductList = (searchString: string) => {
  const { products, isLoading } = useProductList({ load: !!searchString })

  const filteredProducts = useMemo(
    () => products == null ? undefined :
      searchString
        ? fuzzy
          .filter(searchString, products, { extract: p => p.name })
          .map(r => r.original)
        : [],
    [products, searchString]
  )

  return { products: filteredProducts, isLoading }
}

const useProductList = (args?: { load?: boolean }) => {
  const { data, isLoading } = useSWRImmutable(
    args?.load == null || args.load ? 'product-list' : null,
    endOfLifeDate().allProducts
  )

  const { t } = useTranslation('products')

  const products = useMemo(
    () => data?.products
      .map(p => ({ productId: p, name: t(p) }))
      .toSorted(({ name: n1 }, { name: n2 }) => n1.localeCompare(n2)),
    [data, t]
  )

  return { products, isLoading }
}
