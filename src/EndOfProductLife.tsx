import { useParams } from 'react-router-dom'
import useSWRImmutable from 'swr/immutable'
import { object, parse } from 'valibot'
import { endOfLifeDate, nonEmptyString } from './endoflife.date.ts'
import { OpenInNewIcon } from './icons/OpenInNewIcon.tsx'
import { RadarIcon } from './icons/RadarIcon.tsx'
import { SpinnerBars } from './icons/SpinnerIcons.tsx'

export const EndOfProductLife = () => {
  const { productId } = parse(object({ productId: nonEmptyString }), useParams())
  const { data, isLoading } = useSWRImmutable({ key: 'product-eol', productId }, endOfLifeDate().product)

  return <main className="container p-4">
    <h1 className="inline-flex items-center gap-2"><RadarIcon /> {productId}</h1>
    {isLoading ? <SpinnerBars /> : <>
      <p className="mb-2">{data && <LinkNewTab href={data.href} />}</p>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </>}
  </main>
}

const LinkNewTab = ({ href, text }: { href: string, text?: string }) =>
  <a href={href} target="_blank" rel="noopener noreferrer"
    className="inline-flex items-center gap-2"
  >{text ?? href}<OpenInNewIcon /></a>
