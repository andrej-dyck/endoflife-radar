import { useParams } from 'react-router-dom'
import useSWRImmutable from 'swr/immutable'
import { object, parse } from 'valibot'
import { endOfLifeDate, nonEmptyString } from './endoflife.date.ts'
import { RadarIcon } from './icons/RadarIcon.tsx'

export const EndOfProductLife = () => {
  const { productId } = parse(object({ productId: nonEmptyString }), useParams())
  const { data } = useSWRImmutable({ key: 'product-eol', productId }, endOfLifeDate().product)

  return <main className="container p-4">
    <h1 className="inline-flex items-center gap-2"><RadarIcon /> {productId}</h1>
    <pre>{JSON.stringify(data, null, 2)}</pre>
  </main>
}
