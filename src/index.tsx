import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { AppRoutes } from './AppRoutes.tsx'

ReactDOM.createRoot(
  document.getElementById('root') as unknown as HTMLElement
).render(
  <React.StrictMode>
    <AppRoutes />
  </React.StrictMode>
)
