import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import useSWRImmutable from 'swr/immutable'
import { z } from 'zod/mini'
import { apiEndoflifeDate, type Cycles, cycleState, type Product } from './apiEndoflifeDate.ts'
import { useParsedParams } from './state/useParsedParams.ts'
import { LinkNewTab } from './ui-components/LinkNewTab.tsx'
import { ScreenTitle } from './ui-components/ScreenTitle.tsx'
import { SpinnerBars } from './ui-components/SpinnerIcons.tsx'

export const EndOfProductLife = () => {
  const product = useParsedParams(
    z.object({ productId: z.string().check(z.minLength(1)) })
  )
  const { name, href, cycles, isLoading } = useProductEolInfo(product, { refreshIntervalInMs: daysInMs(1) })
  const systemTime = useMemo(() => new Date(Date.now()), [cycles])

  return <>
    <header className="container p-2 pt-8">
      <ScreenTitle text={name} />
    </header>
    <main className="container px-2 pb-4">
      {isLoading ? <SpinnerBars /> : <>
        {href && <p className="mb-2"><LinkNewTab href={href} text={href} /></p>}
        {cycles && <ProductCycles cycles={cycles} systemTime={systemTime} />}
      </>}
    </main>
  </>
}

const ProductCycles = ({ cycles, systemTime }: { cycles: Cycles, systemTime: Date }) => {
  return <>
    {cycles.map((c) => <div key={c.cycle}
      className="grid grid-cols-2 rounded-xl border border-element-border bg-element-bg px-3 py-2 my-2"
    >
      <pre>{JSON.stringify(cycleState(c)(systemTime), null, 2)}</pre>
      <pre>{JSON.stringify(c, null, 2)}</pre>
    </div>)}
  </>
}

export const useProductEolInfo = ({ productId }: Product, options?: { refreshIntervalInMs?: number }) => {
  const { data, isLoading } = useSWRImmutable(
    { key: 'product-eol', productId },
    apiEndoflifeDate().product,
    { refreshInterval: options?.refreshIntervalInMs }
  )

  const { t } = useTranslation(['products'])

  return { name: t(productId), cycles: data?.cycles, href: data?.href, isLoading }
}

export const daysInMs = (days: number) => days * 24 * 60 * 60 * 1000
