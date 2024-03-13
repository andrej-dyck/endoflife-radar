import * as fuzzy from 'fuzzy'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import useSWRImmutable from 'swr/immutable'
import { endOfLifeDate } from './endoflife.date.ts'
import { SpinnerBars } from './icons/SpinnerIcons.tsx'
import { SearchBox } from './ui-components/SearchBox.tsx'

export const ProductSearch = () => {
  const [search, setSearch] = useState({ input: '', focus: false })
  const { products, isLoading } = useFilteredProductList(search.input)

  const [resultsFocus, setResultsFocus] = useState(false)
  const showResults = useMemo(() => search.input && (search.focus || resultsFocus), [search, resultsFocus])

  const { t } = useTranslation('ui')

  return <div role="search" className="w-1/3 min-w-60 space-y-2">
    <SearchBox
      label={t('product-search.label')}
      placeholder={t('product-search.placeholder')}
      onChange={(input) => setSearch(s => ({ ...s, input }))}
      onFocusChange={(focus) => setSearch(s => ({ ...s, focus }))}
    />
    {showResults && <div className="relative">
      {isLoading ? <SpinnerBars /> : (
        <ul
          className="absolute z-50 block w-full space-y-2 divide-y divide-gray-500 rounded-lg border border-gray-500 bg-gray-700 p-2"
          onPointerEnter={() => setResultsFocus(true)}
          onPointerLeave={() => setResultsFocus(false)}
        >
          {products?.map(p => (
            <li key={p.productId} className="">
              <Link to={`eol/${p.productId}`}>{p.name}</Link>
            </li>
          ))}
        </ul>
      )}
    </div>}
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
