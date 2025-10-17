import { match } from 'ts-pattern'
import { z } from 'zod/mini'
import { isEveryValueNullish, omitNullishValues } from './ts-extensions/record-extensions'

export type Products = readonly Product[]
export type Product = z.infer<typeof product>

export type ProductDetails = z.infer<typeof detailedProduct>

export type ProductRelease = z.infer<typeof productRelease>

export const apiEndoflifeDate = (
  fetchJson: (url: string | URL) => Promise<unknown> = (url) => fetch(url, { keepalive: true }).then(res => res.json() as unknown)
) => {
  const eolApiUrl = 'https://endoflife.date/api/v1'

  return {
    allProducts: (): Promise<z.infer<typeof products>> => withRetry(
      () => fetchJson(`${eolApiUrl}/products`)
        .then(parseWith(products))
    ),

    productById: ({ productId }: Pick<Product, 'productId'>): Promise<ProductDetails> => withRetry(
      () => fetchJson(`${eolApiUrl}/products/${productId}`)
        .catch(logErrorAndRethrow({ productId }))
        .then(parseWith(detailedProduct))
    ),
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

const logErrorAndRethrow = (params: unknown) => (e: Error) => {
  console.error(e, params)
  throw e
}

const withRetry = async <T>(fn: () => Promise<T>, retries = 3, delay = 250) => {
  try {
    return await fn()
  } catch (e) {
    if (retries <= 0) throw e
    await new Promise(resolve => setTimeout(resolve, delay))
    return withRetry(fn, retries - 1, delay)
  }
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

const productRelease = z.pipe(
  z.object({
    name: nonEmptyString, // release name or version number
    codename: z.nullish(nonEmptyStringOrNull),
    label: z.nullish(nonEmptyStringOrNull), // release name or version w/ codename

    releaseDate: z.nullish(isoDate), // release date for the first release in this cycle
    latest: z.nullish(z.pipe(
      z.object({ // latest release in this cycle
        name: nonEmptyStringOrNull,
        date: z.nullish(isoDate),
        link: z.nullish(z.url()), // link to the changelog for the latest release
      }),
      z.transform(o => isEveryValueNullish(o) ? undefined : omitNullishValues(o))
    )),

    isEol: z.boolean(), // whether this release has a planned end-of-life
    eolFrom: z.nullish(isoDate), // end-of-life date

    isLts: z.nullish(z.boolean()), // whether this release has long-term-support
    ltsFrom: z.nullish(isoDate), // date when release enters LTS status
    isEoas: z.nullish(z.boolean()), // whether this release has a planned end-of-active-support
    eoasFrom: z.nullish(isoDate), // end-of-active-support date
    isEoes: z.nullish(z.boolean()), // whether this release has a planned end-of-security-support
    eoesFrom: z.nullish(isoDate), // end-of-security-support date

    isMaintained: z.boolean(), // whether this release is maintained
    isDiscontinued: z.nullish(z.boolean()), // whether this release is discontinued
  }),
  z.transform(r => omitNullishValues(r))
)

const detailedProduct = z.pipe(
  z.object({
    result: z.intersection(
      product,
      z.object({
        links: z.object({
          html: z.url(),
          icon: z.nullish(z.url()),
        }),
        releases: z.readonly(z.array(productRelease)),
      })
    ),
  }),
  z.transform(({ result }) => result)
)

/** Derived product release support state */
export type SupportState = { state: 'unknown' }
  | { state: 'active-support', supportEndDate?: Date, securityEndDate?: Date, isLts?: boolean }
  | { state: 'extended-support', supportEndDate?: Date, securityEndDate?: Date, isLts?: boolean }
  | { state: 'discontinued', supportEndDate?: Date, securityEndDate?: Date }
  | { state: 'unsupported', supportEndDate?: Date }

export const supportState = (release: ProductRelease): SupportState =>
  match(release)
    .returnType<SupportState>()
    .with({ isDiscontinued: true }, (c) => ({
      state: 'discontinued',
      supportEndDate: c.eoasFrom ?? c.eolFrom ?? undefined,
      securityEndDate: c.eoesFrom ?? undefined,
    }))
    .with({ isMaintained: false }, (c) => ({
      state: 'unsupported',
      supportEndDate: c.eoasFrom ?? c.eolFrom ?? undefined,
    }))
    .with({ isEol: true, isEoes: false }, (c) => ({
      state: 'extended-support',
      supportEndDate: c.eoasFrom ?? c.eolFrom ?? undefined,
      securityEndDate: c.eoesFrom ?? undefined,
      isLts: c.isLts ?? undefined,
    }))
    .with({ isEol: false }, { isEol: true, isEoas: false }, (c) => ({
      state: 'active-support',
      supportEndDate: c.eoasFrom ?? c.eolFrom ?? undefined,
      securityEndDate: c.eoesFrom ?? undefined,
      isLts: c.isLts ?? undefined,
    }))
    .otherwise(() => ({ state: 'unknown' }))
