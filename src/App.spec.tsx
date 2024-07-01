/**
 * @vitest-environment jsdom
 */

import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, expect, test } from 'vitest'
import '@testing-library/jest-dom/vitest'

import { App } from './App.tsx'

import './locale/i18n.ts'

afterEach(cleanup)

test('renders app with heading', async () => {
  render(<App />)

  const [h1] = await screen.findAllByRole('heading')

  expect(h1).toHaveTextContent('End-of-life Radar')
})
