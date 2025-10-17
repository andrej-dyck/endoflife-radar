/* eslint-disable @typescript-eslint/no-unnecessary-boolean-literal-compare */

import { match, P } from 'ts-pattern'
import { describe, expect, test } from 'vitest'
import { apiEndoflifeDate, type ProductRelease, type SupportState, supportState } from './apiEndoflifeDate.ts'

describe('api client endoflife.date', async () => {
  const fullProductsSnapshot: { total: number, result: Record<string, unknown>[] } =
    // snapshot from: https://endoflife.date/api/v1/products/full
    await import('./test-data/eol-full-products.snapshot.json', { assert: { type: 'json' } })

  test('all products can be parsed (snapshot)', async () => {
    const eolClient = eolApiStub({
      allProducts: () => Promise.resolve(fullProductsSnapshot),
      productById: (productId) => {
        const product = fullProductsSnapshot.result.find(r => r.name === productId)
        return product ? Promise.resolve({ result: product }) : Promise.reject(new Error(`Product '${productId}' not found`))
      },
    })

    const { products, total } = await eolClient.allProducts()
    expect(products.length).toEqual(total)

    const details = products.map(p => eolClient.productById(p))
    expect.assertions(fullProductsSnapshot.total * 4 + 1)

    for (const productDetails of await Promise.all(details)) {
      expect.soft(productDetails).toMatchObject({
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        productId: expect.stringMatching(/.+/),
      })

      // assume that if releases are not maintained, that isEol is also false
      expect.soft(
        productDetails.releases.find(r => r.isMaintained === false && r.isEol === false)
      ).toBeUndefined()

      // assume that if releases are not maintained, that isEoas is also false
      expect.soft(
        productDetails.releases.find(r => r.isMaintained === false && r.isEoas === false)
      ).toBeUndefined()

      // assume that if releases are not maintained, that isEoes is also false
      expect.soft(
        productDetails.releases.find(r => r.isMaintained === false && r.isEoes === false)
      ).toBeUndefined()
    }
  })

  test.skipIf(import.meta.env.MODE === 'CI')('all products can be parsed', async () => {
    const eolClient = apiEndoflifeDate()

    const { products, total } = await eolClient.allProducts()
    expect(products.length, 'number of products in response').toEqual(total)
    expect(fullProductsSnapshot.total, 'number of products in snapshot').toEqual(total)

    expect.assertions(2 + total)

    for (const product of products) {
      const productDetails = await eolClient.productById(product)
      expect.soft(productDetails).toMatchObject({
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        productId: expect.stringMatching(/.+/),
      })
    }
  }, 60_000)
})

describe('api support state', () => {
  const futureDate = new Date('2024-10-01')
  const furtherFutureDate = new Date('2025-01-01')
  const earlierDate = new Date('2024-01-01')
  const evenEarlierDate = new Date('2023-09-18')

  test.each(typed<{ release: ProductRelease, expectedState: SupportState }>(
    {
      release: { name: '1', isMaintained: true, isEol: false },
      expectedState: { state: 'active-support' },
    },
    {
      release: { name: '2', isMaintained: true, isEol: false, isEoas: false },
      expectedState: { state: 'active-support' },
    },
    {
      release: { name: '3', isMaintained: true, isEol: false, eolFrom: futureDate },
      expectedState: { state: 'active-support', supportEndDate: futureDate },
    },
    {
      release: { name: '4', isMaintained: true, isEol: false, eoasFrom: futureDate },
      expectedState: { state: 'active-support', supportEndDate: futureDate },
    },
    {
      release: { name: '5', isMaintained: true, isEol: false, eoesFrom: furtherFutureDate },
      expectedState: { state: 'active-support', securityEndDate: furtherFutureDate },
    }
  ))('active-support; %j', ({ release, expectedState }) => {
    expect(supportState(release)).toMatchObject(expectedState)
  })

  test.each(typed<{ release: ProductRelease, expectedState: SupportState }>(
    {
      release: { name: '1', isMaintained: true, isEol: true, isEoes: false },
      expectedState: { state: 'extended-support' },
    },
    {
      release: { name: '2', isMaintained: true, isEol: true, eolFrom: earlierDate, isEoes: false },
      expectedState: { state: 'extended-support', supportEndDate: earlierDate },
    },
    {
      release: { name: '3', isMaintained: true, isEol: true, isEoes: false, eoesFrom: furtherFutureDate },
      expectedState: { state: 'extended-support', securityEndDate: furtherFutureDate },
    }
  ))('extended-support; %j', ({ release, expectedState }) => {
    expect(supportState(release)).toMatchObject(expectedState)
  })

  test.each(typed<{ release: ProductRelease, expectedState: SupportState }>(
    {
      release: { name: '1', isMaintained: true, isEol: false, isLts: true },
      expectedState: { state: 'active-support', isLts: true },
    },
    {
      release: { name: '1', isMaintained: true, isEol: true, isEoes: false, isLts: true },
      expectedState: { state: 'extended-support', isLts: true },
    }
  ))('is LTS; %j', ({ release, expectedState }) => {
    expect(supportState(release)).toMatchObject(expectedState)
  })

  test.each(typed<{ release: ProductRelease, expectedState: SupportState }>(
    {
      release: { name: '1', isMaintained: false, isEol: true, isDiscontinued: true },
      expectedState: { state: 'discontinued' },
    },
    {
      release: { name: '2', isMaintained: true, isEol: false, isDiscontinued: true },
      expectedState: { state: 'discontinued' },
    },
    {
      release: { name: '3', isMaintained: true, isEol: true, eolFrom: futureDate, isDiscontinued: true },
      expectedState: { state: 'discontinued', supportEndDate: futureDate },
    },
    {
      release: { name: '4', isMaintained: true, isEol: true, eoesFrom: furtherFutureDate, isDiscontinued: true },
      expectedState: { state: 'discontinued', securityEndDate: furtherFutureDate },
    }
  ))('discontinued; %j', ({ release, expectedState }) => {
    expect(supportState(release)).toEqual(expectedState)
  })

  test.each(typed<{ release: ProductRelease, expectedState: SupportState }>(
    {
      release: { name: '1', isMaintained: false, isEol: true },
      expectedState: { state: 'unsupported' },
    },
    {
      release: { name: '2', isMaintained: false, isEol: true, eolFrom: earlierDate },
      expectedState: { state: 'unsupported', supportEndDate: earlierDate },
    },
    {
      release: { name: '3', isMaintained: false, isEol: true, eolFrom: evenEarlierDate, eoasFrom: earlierDate },
      expectedState: { state: 'unsupported', supportEndDate: earlierDate },
    }
  ))('unsupported; %j', ({ release, expectedState }) => {
    expect(supportState(release)).toEqual(expectedState)
  })
})

const eolApiStub = ({ allProducts, productById }: {
  allProducts: () => Promise<unknown>,
  productById: (productId: string) => Promise<unknown>
}) =>
  apiEndoflifeDate(
    (url: string | URL) => match(url.toString())
      .returnType<Promise<unknown>>()
      .with('https://endoflife.date/api/v1/products', () => allProducts())
      .with(P.string.regex(/^https:\/\/endoflife\.date\/api\/v1\/products\/(.+)$/), (url) => productById(extractProductIdFromUrl(url) ?? ''))
      .otherwise(() => Promise.reject(new Error(`Unexpected URL: ${url}`)))
  )

const extractProductIdFromUrl = (url: string) =>
  new URL(url).pathname.split('/').pop()

const typed = <T>(...args: readonly T[]) =>
  args
