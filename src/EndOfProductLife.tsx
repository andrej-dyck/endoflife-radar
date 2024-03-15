import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import useSWRImmutable from 'swr/immutable'
import { z } from 'zod'
import { ScreenTitle } from './App.tsx'
import { endOfLifeDate, Product } from './endoflife.date.ts'
import { LinkNewTab } from './ui-components/LinkNewTab.tsx'
import { SpinnerBars } from './ui-components/SpinnerIcons.tsx'

export const EndOfProductLife = () => {
  const product = z.object({ productId: z.string() }).parse(useParams())
  const { name, href, cycles, isLoading } = useProductEolInfo(product)

  return <>
    <header className="container p-2 pt-8">
      <ScreenTitle text={name} />
    </header>
    <main className="container px-2 pb-4">
      {isLoading ? <SpinnerBars /> : <>
        {href && <p className="mb-2"><LinkNewTab href={href} text={href} /></p>}
        <pre>{JSON.stringify({ cycles }, null, 2)}</pre>
      </>}
    </main>
  </>
}

// eslint-disable-next-line react-refresh/only-export-components
export const useProductEolInfo = ({ productId }: Product) => {
  const { data, isLoading } = useSWRImmutable({ key: 'product-eol', productId }, endOfLifeDate().product)

  const { t } = useTranslation(['products'])

  return { name: t(productId), cycles: data?.cycles, href: data?.href, isLoading }
}
