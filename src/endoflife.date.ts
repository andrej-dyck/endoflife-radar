import {
  array,
  boolean,
  isoDate as vIsoDate,
  minLength,
  object,
  optional,
  Output,
  parse,
  string,
  transform,
  union,
  url as vUrl
} from 'valibot'

export const endOfLifeDate = (
  fetchJson: (url: string | URL) => Promise<unknown> = (url) => fetch(url).then(res => res.json() as unknown)
) => {
  const apiUrl = 'https://endoflife.date/api'
  const eolUrl = 'https://endoflife.date'
  return {
    allProducts: (): Promise<{ readonly products: Products }> =>
      fetchJson(`${apiUrl}/all.json`).then(r => ({ products: parse(products, r) })),
    product: ({ productId }: { productId: string }): Promise<{ readonly cycles: Cycles, readonly href: string }> =>
      fetchJson(`${apiUrl}/${productId}.json`).then(r => ({
        cycles: parse(cycles, r),
        href: `${eolUrl}/${productId}`,
      })),
  }
}

export const nonEmptyString = string([minLength(1)])

export type Products = Output<typeof products>
const products = array(nonEmptyString)

const isoDate = transform(string([vIsoDate()]), d => new Date(d))

export type Cycles = Output<typeof cycles>
const cycle = object({
  cycle: nonEmptyString, // release cycle name or version number
  codename: optional(nonEmptyString),
  releaseDate: isoDate, // release date for the first release in this cycle
  lts: union([boolean(), isoDate]), // whether this release cycle has long-term-support; or a date if release enters LTS status on a given date
  eol: union([boolean(), isoDate]), // end of life date for this release cycle or false
  latest: optional(nonEmptyString), // latest release in this cycle
  latestReleaseDate: optional(isoDate), // date of the latest release in this cycle
  link: optional(string([vUrl()])), // link to changelog for the latest release
  support: optional(union([boolean(), isoDate])), // whether this release cycle has active support (true); or a date when support has ended
  discontinued: optional(union([boolean(), isoDate])), // whether this cycle is now discontinued (false); or a date when product was discontinued
})
const cycles = array(cycle)
