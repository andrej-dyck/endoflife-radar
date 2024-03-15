import * as fuzzy from 'fuzzy'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import useSWRImmutable from 'swr/immutable'
import { endOfLifeDate, Product } from './endoflife.date.ts'
import { SearchBox } from './ui-components/SearchBox.tsx'
import { SpinnerBars } from './ui-components/SpinnerIcons.tsx'

export const ProductSearch = ({ onSelect }: {
  onSelect?: (product: Product) => void
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
  products?: readonly LocalizedProduct[]
  isLoading?: boolean
  onSelect?: (product: Product) => void
  onFocusChange?: (hasFocus: boolean) => void
}) => {
  return <div className="relative">
    <ul
      className="absolute top-2 z-50 block max-h-[66dvh] w-full divide-y divide-element-border overflow-y-auto rounded-lg border border-element-border bg-element-bg p-2 transition-all first:mt-0 last:mb-0"
      onPointerEnter={() => onFocusChange?.(true)}
      onPointerLeave={() => onFocusChange?.(false)}
    >
      {isLoading
        ? <li><SpinnerBars /></li>
        : products?.map(p => (
          <li key={p.productId}>
            <button
              className="my-1 w-full content-center rounded p-1 text-left hover:bg-highlight-bg hover:font-semibold focus:bg-highlight-bg focus:font-semibold"
              onClick={() => onSelect?.(p)}
            >{p.name}</button>
          </li>
        ))}
    </ul>
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

type LocalizedProduct = Product & { readonly name: string }

const useProductList = (args?: { load?: boolean }) => {
  const { data, isLoading } = useSWRImmutable(
    args?.load == null || args.load ? 'product-list' : null,
    endOfLifeDate().allProducts
  )

  const { t } = useTranslation('products')

  const products = useMemo(
    () => data?.products
      .map(p => ({ ...p, name: t(p.productId) } satisfies LocalizedProduct))
      .toSorted(({ name: n1 }, { name: n2 }) => n1.localeCompare(n2)),
    [data, t]
  )

  return { products, isLoading }
}
