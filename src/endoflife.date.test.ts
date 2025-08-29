import { describe, expect, test } from 'vitest'
import { type CycleState, cycleState, endOfLifeDate } from './endoflife.date.ts'

import en from './locale/en.json' assert { type: 'json ' }

describe('endoflife.data', () => {
  const eol = endOfLifeDate()

  test('all product cycles can be parsed', async () => {
    const { products } = await eol.allProducts()

    const details = products.map(p => eol.product(p))
    expect.assertions(details.length)

    // fs.writeFile('./dist/all-products.json', JSON.stringify(await Promise.all(details)), { encoding: 'utf8' }, console.error)

    for (const detailPromise of details) {
      await expect.soft(detailPromise).resolves.toMatchObject({
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        cycles: expect.arrayContaining([expect.objectContaining({
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          cycle: expect.stringMatching(/.+/),
        })]),
      })
    }
  }, 10_000)

  test('all products have a translation', async () => {
    const { products } = await eol.allProducts()
    const productIds = products.map(p => p.productId)

    expect(
      Object.keys(en.products).sort()
    ).toEqual(
      productIds.sort()
    )
  }, 10_000)

  test('product cycles have an href to endoflife.date', async () => {
    await expect(eol.product({ productId: 'alpine' })).resolves.toMatchObject({
      href: 'https://endoflife.date/alpine',
    })
  })
})

describe('cycle-state', () => {
  const now = new Date('2024-03-15T13:08:32Z')
  const futureDate = new Date('2024-10-01')
  const furtherFutureDate = new Date('2025-01-01')
  const earlierDate = new Date('2024-01-01')
  const evenEarlierDate = new Date('2023-09-18')

  test.each([
    {
      cycle: { cycle: '1', eol: false },
      expectedState: { state: 'active-support' } satisfies CycleState,
    },
    {
      cycle: { cycle: '2', eol: false, support: true },
      expectedState: { state: 'active-support' } satisfies CycleState,
    },
    {
      cycle: { cycle: '3', eol: futureDate },
      expectedState: { state: 'active-support', endDate: futureDate } satisfies CycleState,
    },
    {
      cycle: { cycle: '4', eol: futureDate, support: true },
      expectedState: { state: 'active-support', endDate: futureDate } satisfies CycleState,
    },
    {
      cycle: { cycle: '5', eol: furtherFutureDate, support: futureDate },
      expectedState: {
        state: 'active-support',
        endDate: futureDate,
        securityEndDate: furtherFutureDate,
      } satisfies CycleState,
    },
  ])('active-support; %j', ({ cycle, expectedState }) => {
    expect(cycleState(cycle)(now)).toMatchObject(expectedState)
  })

  test.each([
    {
      cycle: { cycle: '1', eol: false, support: false },
      expectedState: { state: 'extended-support' } satisfies CycleState,
    },
    {
      cycle: { cycle: '2', eol: false, support: earlierDate },
      expectedState: { state: 'extended-support', endDate: earlierDate } satisfies CycleState,
    },
    {
      cycle: { cycle: '3', eol: futureDate, support: false },
      expectedState: { state: 'extended-support', endDate: futureDate } satisfies CycleState,
    },
    {
      cycle: { cycle: '4', eol: futureDate, support: earlierDate },
      expectedState: { state: 'extended-support', endDate: futureDate } satisfies CycleState,
    },
  ])('extended-support; %j', ({ cycle, expectedState }) => {
    expect(cycleState(cycle)(now)).toMatchObject(expectedState)
  })

  test.each([
    {
      cycle: { cycle: '1', eol: false, lts: true },
      expectedState: { state: 'active-support', isLts: true } satisfies CycleState,
    },
    {
      cycle: { cycle: '2', eol: false, lts: false },
      expectedState: { state: 'active-support', isLts: false } satisfies CycleState,
    },
    {
      cycle: { cycle: '3', eol: false },
      expectedState: { state: 'active-support', isLts: undefined } satisfies CycleState,
    },
    {
      cycle: { cycle: '4', eol: furtherFutureDate, lts: futureDate },
      expectedState: { state: 'active-support', isLts: false } satisfies CycleState,
    },
    {
      cycle: { cycle: '5', eol: futureDate, lts: earlierDate },
      expectedState: { state: 'active-support', isLts: true } satisfies CycleState,
    },
    {
      cycle: { cycle: '6', eol: false, support: false, lts: true },
      expectedState: { state: 'extended-support', isLts: true } satisfies CycleState,
    },
    {
      cycle: { cycle: '7', eol: false, support: false, lts: false },
      expectedState: { state: 'extended-support', isLts: false } satisfies CycleState,
    },
    {
      cycle: { cycle: '8', eol: false, support: false },
      expectedState: { state: 'extended-support', isLts: undefined } satisfies CycleState,
    },
  ])('is LTS; %j', ({ cycle, expectedState }) => {
    expect(cycleState(cycle)(now)).toMatchObject(expectedState)
  })

  test.each([
    {
      cycle: { cycle: '1', eol: false, discontinued: true },
      expectedState: { state: 'discontinued' } satisfies CycleState,
    },
    {
      cycle: { cycle: '2', eol: false, discontinued: earlierDate },
      expectedState: { state: 'discontinued', onDate: earlierDate } satisfies CycleState,
    },
    {
      cycle: { cycle: '3', eol: futureDate, discontinued: true },
      expectedState: { state: 'discontinued', supportEndDate: futureDate } satisfies CycleState,
    },
    {
      cycle: { cycle: '4', eol: futureDate, discontinued: earlierDate },
      expectedState: { state: 'discontinued', onDate: earlierDate, supportEndDate: futureDate } satisfies CycleState,
    },
    {
      cycle: { cycle: '4', eol: futureDate, discontinued: now },
      expectedState: { state: 'discontinued', onDate: now, supportEndDate: futureDate } satisfies CycleState,
    },
  ])('discontinued; %j', ({ cycle, expectedState }) => {
    expect(cycleState(cycle)(now)).toEqual(expectedState)
  })

  test.each([
    {
      cycle: { cycle: '1', eol: true },
      expectedState: { state: 'unsupported' } satisfies CycleState,
    },
    {
      cycle: { cycle: '2', eol: true, support: false },
      expectedState: { state: 'unsupported' } satisfies CycleState,
    },
    {
      cycle: { cycle: '3', eol: true, support: earlierDate },
      expectedState: { state: 'unsupported', supportEndDate: earlierDate } satisfies CycleState,
    },
    {
      cycle: { cycle: '4', eol: true, discontinued: true },
      expectedState: { state: 'unsupported' } satisfies CycleState,
    },
    {
      cycle: { cycle: '5', eol: true, discontinued: earlierDate },
      expectedState: { state: 'unsupported' } satisfies CycleState,
    },
    {
      cycle: { cycle: '6', eol: new Date('2024-01-01') },
      expectedState: { state: 'unsupported', supportEndDate: earlierDate } satisfies CycleState,
    },
    {
      cycle: { cycle: '6', eol: earlierDate, support: evenEarlierDate },
      expectedState: { state: 'unsupported', supportEndDate: earlierDate } satisfies CycleState,
    },
  ])('unsupported; %j', ({ cycle, expectedState }) => {
    expect(cycleState(cycle)(now)).toEqual(expectedState)
  })
})
