import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import useSWRImmutable from 'swr/immutable'
import { z } from 'zod'
import { endOfLifeDate } from './endoflife.date.ts'
import { RadarIcon } from './icons/RadarIcon.tsx'
import { SpinnerBars } from './icons/SpinnerIcons.tsx'
import { LinkNewTab } from './ui-components/LinkNewTab.tsx'

export const EndOfProductLife = () => {
  const product = z.object({ productId: z.string() }).parse(useParams())
  const { name, href, cycles, isLoading } = useProductEolInfo(product)

  return <main className="container p-4">
    <h1 className="inline-flex items-center gap-2"><RadarIcon /> {name}</h1>
    {isLoading ? <SpinnerBars /> : <>
      {href && <p className="mb-2"><LinkNewTab href={href} text={href} /></p>}
      <pre>{JSON.stringify({ cycles }, null, 2)}</pre>
    </>}
  </main>
}

// eslint-disable-next-line react-refresh/only-export-components
export const useProductEolInfo = ({ productId }: { productId: string }) => {
  const { data, isLoading } = useSWRImmutable({ key: 'product-eol', productId }, endOfLifeDate().product)

  const { t } = useTranslation(['products'])

  return { name: t(productId), cycles: data?.cycles, href: data?.href, isLoading }
}
