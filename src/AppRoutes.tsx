import { useEffect } from 'react'
import { createBrowserRouter, RouteObject, RouterProvider, useRouteError } from 'react-router-dom'
import { App } from './App.tsx'
import { EndOfProductLife } from './EndOfProductLife.tsx'

export const AppRoutes = () =>
  <RouterProvider
    router={router()}
    fallbackElement={<Loading />}
  />

const router = () => createBrowserRouter([
  { path: '/', element: <App /> },
  { path: '/eol/:productId', element: <EndOfProductLife /> },
].map(withErrorBoundary))

const withErrorBoundary = (route: RouteObject) =>
  ({ ...route, errorElement: <ErrorBoundary /> })

const Loading = () => (
  <h1>Loading...</h1>
)

const ErrorBoundary = () => {
  const error = useRouteError()

  useEffect(() => console.error(error), [error])

  return <>
    <h1>Oops... Something went wrong!</h1>
    <p>{error instanceof Error ? error.message : <pre>{JSON.stringify(error, null, 2)}</pre>}</p>
  </>
}
