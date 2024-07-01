import { useEffect } from 'react'
import { createBrowserRouter, RouterProvider, useRouteError } from 'react-router-dom'
import { AllProductsDashboard, Dashboard } from './Dashboard.tsx'
import { EndOfProductLife } from './EndOfProductLife.tsx'

export const App = () =>
  <>
    <RouterProvider
      router={appRouter()}
      fallbackElement={<Loading />}
    />
  </>

const appRouter = () => createBrowserRouter(
  [
    { path: '/', element: <Dashboard /> },
    { path: '/all', element: <AllProductsDashboard /> },
    { path: '/eol/:productId', element: <EndOfProductLife /> },
  ].map(
    (r) => ({ ...r, errorElement: <ErrorBoundary /> })
  ),
  { basename: import.meta.env.BASE_URL }
)

const Loading = () =>
  <main className="container p-8">
    <h1>Loading...</h1>
  </main>

const ErrorBoundary = () => {
  const error = useRouteError()

  useEffect(() => console.error(error), [error])

  return <main className="container p-8">
    <h1>Oops... Something went wrong!</h1>
    <p>{
      error instanceof Error
        ? error.message
        : <pre>{JSON.stringify(error, null, 2)}</pre>
    }</p>
  </main>
}
