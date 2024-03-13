import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import useSWRImmutable from 'swr/immutable'
import { z } from 'zod'
import { endOfLifeDate } from './endoflife.date.ts'
import { OpenInNewIcon } from './icons/OpenInNewIcon.tsx'
import { RadarIcon } from './icons/RadarIcon.tsx'
import { SpinnerBars } from './icons/SpinnerIcons.tsx'

export const EndOfProductLife = () => {
  const { productId } = z.object({ productId: z.string() }).parse(useParams())
  const { data, isLoading } = useSWRImmutable({ key: 'product-eol', productId }, endOfLifeDate().product)

  const { t } = useTranslation(['products'])
  return <main className="container p-4">
    <h1 className="inline-flex items-center gap-2"><RadarIcon /> {t(productId)}</h1>
    {isLoading ? <SpinnerBars /> : <>
      {data && <p className="mb-2"><LinkNewTab href={data.href} /></p>}
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </>}
  </main>
}

const LinkNewTab = ({ href, text }: { href: string, text?: string }) =>
  <a href={href} target="_blank" rel="noopener noreferrer"
    className="inline-flex items-center gap-2"
  >{text ?? href}<OpenInNewIcon /></a>
