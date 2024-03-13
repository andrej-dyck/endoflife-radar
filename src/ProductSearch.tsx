import * as fuzzy from 'fuzzy'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import useSWRImmutable from 'swr/immutable'
import { endOfLifeDate } from './endoflife.date.ts'
import { SpinnerBars } from './icons/SpinnerIcons.tsx'
import { SearchBox } from './ui-components/SearchBox.tsx'

export const ProductSearch = () => {
  const [search, setSearch] = useState({ input: '', searchFocus: false, resultsFocus: false })
  const { products, isLoading } = useFilteredProductList(search.input)

  const showResults = useMemo(() => search.input && (search.searchFocus || search.resultsFocus), [search])

  const { t } = useTranslation('ui')

  return <div role="search" className="w-1/3 min-w-60 space-y-2">
    <SearchBox
      label={t('product-search.label')}
      placeholder={t('product-search.placeholder')}
      onChange={(input) => setSearch(s => ({ ...s, input }))}
      onFocusChange={(searchFocus) => setSearch(s => ({ ...s, searchFocus }))}
    />
    {showResults && <SearchResults
      products={products}
      isLoading={isLoading}
      onFocusChange={(resultsFocus) => setSearch(s => ({ ...s, resultsFocus }))}
    />}
  </div>
}

const SearchResults = ({ products, isLoading, onFocusChange }: {
  products?: { productId: string, name: string }[],
  isLoading?: boolean,
  onFocusChange?: (hasFocus: boolean) => void
}) => {
  return <div className="relative">
    {isLoading ? <SpinnerBars /> : (
      <ul
        className="absolute z-50 block w-full space-y-2 divide-y divide-element-border rounded-lg border border-element-border bg-element-bg p-2"
        onPointerEnter={() => onFocusChange?.(true)}
        onPointerLeave={() => onFocusChange?.(false)}
      >
        {products?.map(p => (
          <li key={p.productId}>
            <Link to={`eol/${p.productId}`}>{p.name}</Link>
          </li>
        ))}
      </ul>
    )}
  </div>
}

const useFilteredProductList = (searchInput: string) => {
  const { products, isLoading } = useProductList({ load: !!searchInput })

  const filteredProducts = useMemo(
    () => products == null ? undefined :
      searchInput
        ? fuzzy
          .filter(searchInput, products, { extract: p => p.name })
          .map(r => r.original)
        : [],
    [products, searchInput]
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
