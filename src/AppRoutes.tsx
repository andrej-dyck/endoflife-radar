import { useEffect } from 'react'
import { createBrowserRouter, RouteObject, RouterProvider, useRouteError } from 'react-router-dom'
import { AllProductsDashboard, App } from './App.tsx'
import { EndOfProductLife } from './EndOfProductLife.tsx'

export const AppRoutes = () =>
  <RouterProvider
    router={router()}
    fallbackElement={<Loading />}
  />

const router = () => createBrowserRouter([
  { path: '/', element: <App /> },
  { path: '/all', element: <AllProductsDashboard /> },
  { path: '/eol/:productId', element: <EndOfProductLife /> },
].map(withErrorBoundary))

const withErrorBoundary = (route: RouteObject) =>
  ({ ...route, errorElement: <ErrorBoundary /> })

const Loading = () => (
  <main className="container p-8">
    <h1>Loading...</h1>
  </main>
)

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
