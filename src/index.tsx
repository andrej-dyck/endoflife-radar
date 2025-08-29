import React from 'react'
import ReactDOM from 'react-dom/client'

import './index.css'
import './locale/i18n.ts'

import { App } from './App.tsx'

ReactDOM.createRoot(
  document.getElementById('root') as unknown as HTMLElement
).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
