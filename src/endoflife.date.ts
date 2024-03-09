import * as v from 'valibot'

export const endOfLifeDate = (
  fetchJson: (url: string | URL) => Promise<unknown> = (url) => fetch(url).then(res => res.json() as unknown)
) => {
  const apiUrl = 'https://endoflife.date/api'
  return {
    allProducts: (): Promise<{ readonly products: Products }> =>
      fetchJson(`${apiUrl}/all.json`).then(r => ({ products: v.parse(products, r) })),
  }
}

const nonEmptyString = v.string([v.minLength(1)])

type Products = v.Output<typeof products>
const products = v.array(nonEmptyString)
