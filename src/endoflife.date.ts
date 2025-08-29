import { match, P } from 'ts-pattern'
import { z, ZodType } from 'zod'

export type Products = z.infer<typeof products>
export type Product = z.infer<typeof product>
export type Cycles = z.infer<typeof cycles>
export type Cycle = z.infer<typeof cycle>

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

const parse = <TOut, TIn>(schema: ZodType<TOut, TIn>, data: unknown): TOut => {
  const parsed = schema.safeParse(data)
  if (!parsed.success) {
    const message = z.prettifyError(parsed.error)
    console.error(message, data)
    throw new Error(message)
  }
  return parsed.data
}

const nonEmptyString = z.string().trim().min(1)

const product = nonEmptyString.transform((productId) => ({ productId }))
const products = z.array(product)

const isoDate = z.string()
  .regex(/\d{4}-\d{2}-\d{2}/)
  .refine((s) => !Number.isNaN(Date.parse(s)), { error: 'expected yyyy-MM-dd string' })
  .transform<Date>(s => new Date(Date.parse(s)))
const nullishNonEmptyString = z.string().trim().transform<string | undefined>(s => s ? s : undefined).nullish()

const cycle = z.object({
  cycle: nonEmptyString, // release cycle name or version number
  codename: nullishNonEmptyString,
  releaseDate: isoDate.nullish(), // release date for the first release in this cycle
  lts: z.boolean().or(isoDate).nullish(), // whether this release cycle has long-term-support; or a date if release enters LTS status on a given date
  eol: z.boolean().or(isoDate).nullish(), // end of life date for this release cycle or false
  latest: nullishNonEmptyString, // latest release in this cycle
  latestReleaseDate: isoDate.nullish(), // date of the latest release in this cycle
  link: z.url().nullish(), // link to changelog for the latest release
  support: z.boolean().or(isoDate).nullish(), // whether this release cycle has active support (true); or a date when support has ended
  // TODO extendedSupport
  discontinued: z.boolean().or(isoDate).nullish(), // whether this cycle is now discontinued (true); or a date when product was discontinued
})
const cycles = z.array(cycle)

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
