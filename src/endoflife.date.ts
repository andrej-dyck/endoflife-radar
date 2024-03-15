import { undefined, z, ZodType, ZodTypeDef } from 'zod'
import { fromZodError } from 'zod-validation-error'

export type Products = z.infer<typeof products>
export type Product = z.infer<typeof product>
export type Cycles = z.infer<typeof cycles>

export const endOfLifeDate = (
  fetchJson: (url: string | URL) => Promise<unknown> = (url) => fetch(url).then(res => res.json() as unknown)
) => {
  const apiUrl = 'https://endoflife.date/api'
  const eolUrl = 'https://endoflife.date'
  return {
    allProducts: (): Promise<{ readonly products: Products }> =>
      fetchJson(`${apiUrl}/all.json`).then(r => ({ products: parse(products, r) })),
    product: ({ productId }: Product): Promise<{ readonly cycles: Cycles, readonly href: string }> =>
      fetchJson(`${apiUrl}/${productId}.json`).then(r => ({
        cycles: parse(cycles, r),
        href: `${eolUrl}/${productId}`,
      })),
  }
}

const parse = <TOut, TIn>(schema: ZodType<TOut, ZodTypeDef, TIn>, data: unknown): TOut => {
  const parsed = schema.safeParse(data)
  if (!parsed.success) {
    const message = fromZodError(parsed.error).toString()
    console.error(message, data)
    throw new Error(message)
  }
  return parsed.data
}

const nonEmptyString = z.string().trim().min(1)

const product = nonEmptyString.transform((productId) => ({ productId }))
const products = z.array(product)

const isoDate = z.string().regex(/\d{4}-\d{2}-\d{2}/).refine((s: string) => !Number.isNaN(Date.parse(s)), { message: 'expected yyyy-MM-dd string' })
const nullishNonEmptyString = z.string().trim().transform(s => s ? s : undefined).nullish()

const cycle = z.object({
  cycle: nonEmptyString, // release cycle name or version number
  codename: nullishNonEmptyString,
  releaseDate: isoDate.nullish(), // release date for the first release in this cycle
  lts: z.boolean().or(isoDate), // whether this release cycle has long-term-support; or a date if release enters LTS status on a given date
  eol: z.boolean().or(isoDate).nullish(), // end of life date for this release cycle or false
  latest: nullishNonEmptyString, // latest release in this cycle
  latestReleaseDate: isoDate.nullish(), // date of the latest release in this cycle
  link: z.string().url().nullish(), // link to changelog for the latest release
  support: z.boolean().or(isoDate).nullish(), // whether this release cycle has active support (true); or a date when support has ended
  discontinued: z.boolean().or(isoDate).nullish(), // whether this cycle is now discontinued (false); or a date when product was discontinued
})
const cycles = z.array(cycle)
