import useSWRImmutable from 'swr/immutable'
import { z } from 'zod/mini'
import { apiEndoflifeDate, type Product, type ProductRelease, supportState } from './apiEndoflifeDate.ts'
import { useParsedParams } from './state/useParsedParams.ts'
import { BackButton } from './ui-components/BackButton.tsx'
import { ScreenTitle } from './ui-components/ScreenTitle.tsx'
import { SpinnerBars } from './ui-components/SpinnerIcons.tsx'
import { ExternalLinkIcon, TextLink } from './ui-components/TextLink.tsx'

export const EndOfProductLife = () => {
  const { productId } = useParsedParams(
    z.object({ productId: z.string().check(z.minLength(1)) })
  )
  const { product, isLoading } = useProductEolInfo({ productId }, { refreshIntervalInMs: daysInMs(1) })

  return <>
    <div className="container p-2 pt-8">
      <BackButton />
    </div>
    <header className="container p-2 pt-4 flex flex-row flex-wrap items-center justify-between gap-2">
      <ScreenTitle text={product?.label ?? productId} noAppLink />
      {product?.links.html &&
        <TextLink href={product.links.html} external className="flex items-center gap-1.5">
          {product.links.html} <ExternalLinkIcon />
        </TextLink>
      }
    </header>
    <main className="container px-2 pb-4 flex flex-col gap-2">
      {isLoading ? <SpinnerBars /> : <>
        {product?.releases && <ProductReleases releases={product.releases} />}
      </>}
    </main>
  </>
}

const ProductReleases = ({ releases }: { releases: readonly ProductRelease[] }) =>
  <>
    {releases.map((r) => <div key={r.name}
      className="grid grid-cols-2 rounded-xl border border-element-border bg-element-bg px-3 py-2 gap-2"
    >
      <h3 className="col-span-2">{r.label ?? r.name}</h3>
      <pre>{JSON.stringify(supportState(r), null, 2)}</pre>
      <pre>{JSON.stringify(r, null, 2)}</pre>
    </div>)}
  </>

export const useProductEolInfo = (
  { productId }: Pick<Product, 'productId'>,
  options?: { refreshIntervalInMs?: number, load?: boolean }
) => {
  const { data, isLoading } = useSWRImmutable(
    options?.load !== false ? { key: 'product-eol', productId } : null,
    apiEndoflifeDate().productById,
    { refreshInterval: options?.refreshIntervalInMs }
  )

  return { product: data, isLoading }
}

export const daysInMs = (days: number) => days * 24 * 60 * 60 * 1000
