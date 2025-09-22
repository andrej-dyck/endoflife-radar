import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import useSWRImmutable from 'swr/immutable'
import { z } from 'zod/mini'
import { apiEndoflifeDate, type Cycles, cycleState, type Product } from './apiEndoflifeDate.ts'
import { useParsedParams } from './state/useParsedParams.ts'
import { BackButton } from './ui-components/BackButton.tsx'
import { ExternalLink, ExternalLinkIcon } from './ui-components/ExternalLink.tsx'
import { ScreenTitle } from './ui-components/ScreenTitle.tsx'
import { SpinnerBars } from './ui-components/SpinnerIcons.tsx'

export const EndOfProductLife = () => {
  const product = useParsedParams(
    z.object({ productId: z.string().check(z.minLength(1)) })
  )
  const { name, href, cycles, isLoading } = useProductEolInfo(product, { refreshIntervalInMs: daysInMs(1) })
  const systemTime = useMemo(() => new Date(Date.now()), [cycles])

  return <>
    <div className="container p-2 pt-8">
      <BackButton />
    </div>
    <header className="container p-2 pt-4 flex flex-row flex-wrap items-center justify-between gap-2">
      <ScreenTitle text={name} noAppLink />
      {href &&
        <ExternalLink href={href} className="flex items-center gap-1.5">{href} <ExternalLinkIcon /></ExternalLink>}
    </header>
    <main className="container px-2 pb-4 flex flex-col gap-2">
      {isLoading ? <SpinnerBars /> : <>
        {cycles && <ProductCycles cycles={cycles} systemTime={systemTime} />}
      </>}
    </main>
  </>
}

const ProductCycles = ({ cycles, systemTime }: { cycles: Cycles, systemTime: Date }) => {
  return <>
    {cycles.map((c) => <div key={c.cycle}
      className="grid grid-cols-2 rounded-xl border border-element-border bg-element-bg px-3 py-2"
    >
      <pre>{JSON.stringify(cycleState(c)(systemTime), null, 2)}</pre>
      <pre>{JSON.stringify(c, null, 2)}</pre>
    </div>)}
  </>
}

export const useProductEolInfo = (
  { productId }: Pick<Product, 'productId'>,
  options?: { refreshIntervalInMs?: number }
) => {
  const { data, isLoading } = useSWRImmutable(
    { key: 'product-eol', productId },
    apiEndoflifeDate().productById,
    { refreshInterval: options?.refreshIntervalInMs }
  )

  const { t } = useTranslation(['products'])

  return { name: t(productId), cycles: data?.cycles, href: data?.href, isLoading }
}

export const daysInMs = (days: number) => days * 24 * 60 * 60 * 1000
