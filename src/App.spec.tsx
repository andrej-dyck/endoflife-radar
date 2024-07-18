/**
 * @vitest-environment jsdom
 */

import { cleanup, render, screen } from '@testing-library/react'
import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, expect, test } from 'vitest'
import '@testing-library/jest-dom/vitest'

import { App } from './App.tsx'

import './locale/i18n.ts'

afterEach(cleanup)

test('renders app with heading', async () => {
  render(<App />, { wrapper: inMemoryRouter() })

  const [h1] = await screen.findAllByRole('heading')

  expect(h1).toHaveTextContent('End-of-life Radar')
})

const inMemoryRouter = (location: `?${string}` | '' = ''): React.FC<{ children: React.ReactNode }> =>
  ({ children }) => <MemoryRouter initialEntries={[location]}>{children}</MemoryRouter>
