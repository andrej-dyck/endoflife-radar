import { match, P } from 'ts-pattern'
import { z } from 'zod/mini'

export type Products = readonly Product[]
export type Product = z.infer<typeof product>

export type ProductDetails = Pick<Product, 'productId'> & { readonly cycles: Cycles, readonly href: string }

export type Cycles = z.infer<typeof cycles>
export type Cycle = z.infer<typeof cycle>

export const apiEndoflifeDate = (
  fetchJson: (url: string | URL) => Promise<unknown> = (url) => fetch(url, { keepalive: true }).then(res => res.json() as unknown)
) => {
  const eolApiUrl = 'https://endoflife.date/api/v1'
  const eolUrl = 'https://endoflife.date'

  return {
    allProducts: (): Promise<z.infer<typeof products>> =>
      fetchJson(`${eolApiUrl}/products`).then(parseWith(products)),

    productById: ({ productId }: Pick<Product, 'productId'>): Promise<ProductDetails> =>
      fetchJson(`https://endoflife.date/api/${productId}.json`)
        .then(response => ({ productId, cycles: parseWith(cycles)(response), href: `${eolUrl}/${productId}` })),
  }
}

const parseWith = <T extends z.ZodMiniType>(schema: T) => (data: unknown): z.output<T> => {
  const parsed = schema.safeParse(data)
  if (!parsed.success) {
    const message = z.prettifyError(parsed.error)
    console.error(message, data)
    throw new Error(message)
  }
  return parsed.data
}

const nonEmptyString = z.string().check(z.trim(), z.minLength(1))
const nonEmptyStringOrNull = z.pipe(
  z.string().check(z.trim()),
  z.transform(s => s ? s : undefined)
)

const product = z.pipe(
  z.object({
    name: nonEmptyString,
    label: nonEmptyString,
    category: nonEmptyString,
    tags: z.readonly(z.array(nonEmptyString)),
    uri: z.url(),
  }),
  z.transform(({ name, ...r }) => ({ productId: name, ...r }))
)

const products = z.pipe(
  z.object({
    total: z.int().check(z.minimum(0)),
    result: z.readonly(z.array(product)),
  }),
  z.transform(({ result, ...r }) => ({ products: result, ...r }))
)

const isoDate = z.pipe(
  z.string().check(
    z.regex(/\d{4}-\d{2}-\d{2}/),
    z.refine((s) => !Number.isNaN(Date.parse(s)), { error: 'expected yyyy-MM-dd string' })
  ),
  z.transform(s => new Date(Date.parse(s)))
)
const boolOrIsoDate = z.union([z.boolean(), isoDate])

const cycle = z.object({
  cycle: nonEmptyString, // release cycle name or version number
  codename: z.nullish(nonEmptyStringOrNull),
  releaseDate: z.nullish(isoDate), // release date for the first release in this cycle
  lts: z.nullish(boolOrIsoDate), // whether this release cycle has long-term-support; or a date if release enters LTS status on a given date
  eol: z.nullish(boolOrIsoDate), // end of life date for this release cycle or false
  latest: z.nullish(nonEmptyStringOrNull), // latest release in this cycle
  latestReleaseDate: z.nullish(isoDate), // date of the latest release in this cycle
  link: z.nullish(z.url()), // link to changelog for the latest release
  support: z.nullish(boolOrIsoDate), // whether this release cycle has active support (true); or a date when support has ended
  // TODO extendedSupport
  discontinued: z.nullish(boolOrIsoDate), // whether this cycle is now discontinued (true); or a date when product was discontinued
})
const cycles = z.readonly(z.array(cycle))

/** Derived Cycle State */
export type CycleState = { state: 'unknown' }
  | { state: 'active-support', endDate?: Date, securityEndDate?: Date, isLts?: boolean }
  | { state: 'extended-support', endDate?: Date, isLts?: boolean }
  | { state: 'discontinued', onDate?: Date, supportEndDate?: Date }
  | { state: 'unsupported', supportEndDate?: Date }

export const cycleState = (cycle: Cycle) => (now: Date): CycleState => {

  const isEol = (eol: Cycle['eol']) =>
    eol === true || (isDate(eol) && eol < now)

  const isNotEol = (eol: Cycle['eol']) => !isEol(eol)

  const eolDate = ({ eol }: Pick<Cycle, 'eol'>) =>
    isDate(eol) ? eol : undefined

  const supportEnded = (support: Cycle['support']) =>
    support === false || (isDate(support) && support < now)

  const supportEndDate = ({ support }: Pick<Cycle, 'support'>) =>
    isDate(support) ? support : undefined

  const isDiscontinued = (discontinued: Cycle['discontinued']) =>
    discontinued === true || (isDate(discontinued) && discontinued <= now)

  const discontinuedDate = ({ discontinued }: Pick<Cycle, 'discontinued'>) =>
    isDate(discontinued) ? discontinued : undefined

  const isLts = ({ lts }: Pick<Cycle, 'lts'>) =>
    lts != null ? isDate(lts) ? lts <= now : lts : undefined

  return match(cycle)
    .returnType<CycleState>()
    .with({ eol: P.when(isEol) }, (c) => (
      { state: 'unsupported', supportEndDate: eolDate(c) ?? supportEndDate(c) }
    ))
    .with({ eol: P.when(isNotEol), discontinued: P.when(isDiscontinued) }, (c) => (
      { state: 'discontinued', onDate: discontinuedDate(c), supportEndDate: eolDate(c) }
    ))
    .with({ eol: P.when(isNotEol), support: P.when(supportEnded) }, (c) => (
      { state: 'extended-support', endDate: eolDate(c) ?? supportEndDate(c), isLts: isLts(c) }
    ))
    .with({ eol: P.when(isNotEol) }, (c) => (
      { state: 'active-support', endDate: supportEndDate(c) ?? eolDate(c), securityEndDate: eolDate(c), isLts: isLts(c) }
    ))
    .otherwise(() => ({ state: 'unknown' }))
}

const isDate = (boolOrDate: boolean | Date | null | undefined): boolOrDate is Date =>
  boolOrDate != null && typeof boolOrDate !== 'boolean'
