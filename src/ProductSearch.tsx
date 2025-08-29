import * as fuzzy from 'fuzzy'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import { useTranslation } from 'react-i18next'
import useSWRImmutable from 'swr/immutable'
import { apiEndoflifeDate, type Product } from './apiEndoflifeDate.ts'
import { SearchBox } from './ui-components/SearchBox.tsx'
import { SpinnerBars } from './ui-components/SpinnerIcons.tsx'

export const ProductSearch = ({ onSelect }: {
  onSelect?: (product: Product) => void
}) => {
  const [searchInput, setSearchInput] = useState<string>('')
  const { products, isLoading } = useFilteredProductList(searchInput)

  const focus = useRef({ searchBox: false, resultList: false })
  const [refocused, setRefocused] = useState<boolean>(false)

  const showResults = useMemo(() => searchInput && (focus.current.searchBox || focus.current.resultList), [searchInput, focus, refocused])

  const { t } = useTranslation('ui')

  return <div role="search" className="w-1/3 min-w-60">
    <SearchBox
      label={t('product-search.label')}
      placeholder={t('product-search.placeholder')}
      onChange={setSearchInput}
      onFocusChange={(hasFocus) => {
        focus.current.searchBox = hasFocus
        setRefocused(f => !f)
      }}
      hotkey="ctrl+k"
    />
    {showResults && <SearchResults
      products={products}
      isLoading={isLoading}
      onSelect={(p) => {
        onSelect?.(p)
        focus.current.resultList = false
        setRefocused(f => !f)
      }}
      onFocusChange={(hasFocus) => {
        focus.current.resultList = hasFocus
        setRefocused(f => !f)
      }}
    />}
  </div>
}

const SearchResults = ({ products, isLoading, onSelect, onFocusChange }: {
  products?: readonly LocalizedProduct[]
  isLoading?: boolean
  onSelect?: (product: Product) => void
  onFocusChange?: (hasFocus: boolean) => void
}) => {
  const { focusedResult } = useSearchResultsHotkeys(products)

  useEffect(() => onFocusChange?.(focusedResult != null), [focusedResult])
  useHotkeys('esc', () => onFocusChange?.(false), { preventDefault: true })

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
            <FocusableButton
              className="my-1 w-full content-center rounded p-1 text-left hover:bg-highlight-bg hover:font-semibold focus:bg-highlight-bg focus:font-semibold"
              hasFocus={p.productId === focusedResult?.productId}
              onClick={() => onSelect?.(p)}
            >{p.name}</FocusableButton>
          </li>
        ))}
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

export const useProductList = (args?: { load?: boolean }) => {
  const { data, isLoading } = useSWRImmutable(
    args?.load == null || args.load ? 'product-list' : null,
    apiEndoflifeDate().allProducts
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

const useSearchResultsHotkeys = (products?: readonly Product[]) => {
  const [resultIndex, setResultIndex] = useState<number | undefined>()

  useEffect(() => {
    if (products != null) setResultIndex(undefined)
  }, [products])

  const hotkeyOptions = useMemo(() => ({
    enabled: (products?.length ?? 0) > 0,
    preventDefault: true,
    enableOnFormTags: ['input'] as const,
  }), [products?.length])

  useHotkeys('down', () => setResultIndex(nextSafeIndex(products?.length)), hotkeyOptions, [products?.length])
  useHotkeys('up', () => setResultIndex(previousSafeIndex(products?.length)), hotkeyOptions, [products?.length])

  const focusedResult = useMemo(() => resultIndex != null ? products?.[resultIndex] : undefined, [products, resultIndex])

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
