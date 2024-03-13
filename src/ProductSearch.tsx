import * as fuzzy from 'fuzzy'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import useSWRImmutable from 'swr/immutable'
import { endOfLifeDate } from './endoflife.date.ts'
import { SpinnerBars } from './icons/SpinnerIcons.tsx'
import { SearchBox } from './ui-components/SearchBox.tsx'

export const ProductSearch = ({ onSelect }: {
  onSelect?: (p: { productId: string }) => void
}) => {
  const [search, setSearch] = useState({ input: '', searchFocus: false, resultsFocus: false })
  const { products, isLoading } = useFilteredProductList(search.input)

  const showResults = useMemo(() => search.input && (search.searchFocus || search.resultsFocus), [search])

  const { t } = useTranslation('ui')

  return <div role="search" className="w-1/3 min-w-60">
    <SearchBox
      label={t('product-search.label')}
      placeholder={t('product-search.placeholder')}
      onChange={(input) => setSearch(s => ({ ...s, input }))}
      onFocusChange={(searchFocus) => setSearch(s => ({ ...s, searchFocus }))}
    />
    {showResults && <SearchResults
      products={products}
      isLoading={isLoading}
      onSelect={(p) => {
        onSelect?.(p)
        setSearch(s => ({ ...s, resultsFocus: false }))
      }}
      onFocusChange={(resultsFocus) => setSearch(s => ({ ...s, resultsFocus }))}
    />}
  </div>
}

const SearchResults = ({ products, isLoading, onSelect, onFocusChange }: {
  products?: { productId: string, name: string }[]
  isLoading?: boolean
  onSelect?: (p: { productId: string }) => void
  onFocusChange?: (hasFocus: boolean) => void
}) => {
  return <div className="relative">
    {isLoading ? <SpinnerBars /> : (
      <ul
        className="absolute top-2 z-50 block max-h-[66dvh] w-full divide-y divide-element-border overflow-y-scroll rounded-lg border border-element-border bg-element-bg p-2 first:mt-0 last:mb-0"
        onPointerEnter={() => onFocusChange?.(true)}
        onPointerLeave={() => onFocusChange?.(false)}
      >
        {products?.map(p => (
          <li key={p.productId}>
            <button
              className="my-1 w-full content-center rounded p-1 text-left hover:bg-highlight-bg hover:font-semibold focus:bg-highlight-bg focus:font-semibold"
              onClick={() => onSelect?.(p)}
            >{p.name}</button>
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
