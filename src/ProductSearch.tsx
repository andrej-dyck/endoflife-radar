import * as fuzzy from 'fuzzy'
import React, { useDeferredValue, useEffect, useRef, useState } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import { useTranslation } from 'react-i18next'
import useSWRImmutable from 'swr/immutable'
import { apiEndoflifeDate, type Product, type Products } from './apiEndoflifeDate.ts'
import { SearchBox } from './ui-components/SearchBox.tsx'
import { SpinnerBars } from './ui-components/SpinnerIcons.tsx'

export const ProductSearch = ({ onSelect }: {
  onSelect?: (product: Product) => void
}) => {
  const [query, setQuery] = useState<string>('')
  const { products, isLoading } = useFilteredProductList(query)

  const [focus, setFocus] = useState({ searchBox: false, resultList: false })
  const deferredFocus = useDeferredValue(focus)

  const showResults = query && (deferredFocus.searchBox || deferredFocus.resultList)

  const { t } = useTranslation('ui')

  return <div role="search" className="w-1/3 min-w-60">
    <SearchBox
      value={query}
      label={t('product-search.label')}
      placeholder={t('product-search.placeholder')}
      onChange={setQuery}
      onFocusChange={(hasFocus) => setFocus(f => ({ ...f, searchBox: hasFocus }))}
      hotkey="ctrl+k"
    />
    {showResults && <SearchResults
      query={query}
      products={products}
      isLoading={isLoading}
      onSelect={(p) => {
        onSelect?.(p)
        setFocus(f => ({ ...f, resultList: false }))
        setQuery('')
      }}
      onFocusChange={(hasFocus) => setFocus(f => ({ ...f, resultList: hasFocus }))}
    />}
  </div>
}

const SearchResults = ({ query, products, isLoading, onSelect, onFocusChange }: {
  query: string,
  products?: Products
  isLoading?: boolean
  onSelect?: (product: Product) => void
  onFocusChange?: (hasFocus: boolean) => void
}) => {
  const { focusedResult } = useSearchResultsHotkeys(products)

  useHotkeys('esc', () => onFocusChange?.(false), { preventDefault: true })

  return <div className="relative"
    onFocus={() => onFocusChange?.(true)}
    onBlur={() => onFocusChange?.(false)}
  >
    <ul
      className="absolute top-2 z-50 block max-h-[66dvh] w-full divide-y divide-element-border overflow-y-auto rounded-lg border border-element-border bg-element-bg p-2 transition-all first:mt-0 last:mb-0"
    >
      {isLoading
        ? <li><SpinnerBars /></li>
        : products?.length === 0
          ? <span>No results for <strong>"{query}"</strong></span>
          : products?.map(p => <li key={p.productId}>
            <FocusableButton
              className="my-1 w-full content-center rounded p-1 text-left hover:bg-highlight-bg hover:font-semibold focus:bg-highlight-bg focus:font-semibold"
              hasFocus={p.productId === focusedResult?.productId}
              onClick={() => onSelect?.(p)}
            >
              {p.label}
            </FocusableButton>
          </li>)
      }
    </ul>
  </div>
}

const FocusableButton = ({ children, hasFocus, onClick, className }: {
  children: React.ReactNode,
  hasFocus?: boolean,
  onClick?: () => void,
  className?: string
}) => {
  const ref = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (hasFocus) ref.current?.focus()
  }, [hasFocus])

  return <button ref={ref} className={className} onClick={onClick}>{children}</button>
}

const useFilteredProductList = (searchInput: string) => {
  const { products, isLoading } = useProductList({ load: !!searchInput })

  const filteredProducts = products == null ? undefined : !searchInput ? [] :
    fuzzy
      .filter(searchInput, Array.from(products), { extract: p => p.label })
      .map(r => r.original)

  return { products: filteredProducts, isLoading }
}

export const useProductList = (args?: { load?: boolean }) => {
  const { data, isLoading } = useSWRImmutable(
    args?.load !== false ? 'product-list' : null,
    apiEndoflifeDate().allProducts
  )

  return { products: data?.products, total: data?.total, isLoading }
}

const useSearchResultsHotkeys = (products?: readonly Product[]) => {
  const [resultIndex, setResultIndex] = useState<number | undefined>()

  useEffect(() => {
    if (products != null) setResultIndex(undefined)
  }, [products])

  const hotkeyOptions = ({
    enabled: (products?.length ?? 0) > 0,
    preventDefault: true,
    enableOnFormTags: ['input'] as const,
  })

  useHotkeys('down', () => setResultIndex(nextSafeIndex(products?.length)), hotkeyOptions, [products?.length])
  useHotkeys('up', () => setResultIndex(previousSafeIndex(products?.length)), hotkeyOptions, [products?.length])

  const focusedResult = resultIndex != null ? products?.[resultIndex] : undefined

  return { focusedResult }
}

const nextSafeIndex = (arrayLength: number | undefined) => (index: number | undefined) =>
  (arrayLength && arrayLength > 0)
    ? (index != null ? Math.min(index + 1, arrayLength - 1) : 0)
    : undefined

const previousSafeIndex = (arrayLength: number | undefined) => (index: number | undefined) =>
  (arrayLength && arrayLength > 0)
    ? (index != null ? Math.max(index - 1, 0) : 0)
    : undefined
