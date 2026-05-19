import { Buffer } from 'buffer'
globalThis.Buffer = Buffer
// eslint-disable-next-line @typescript-eslint/no-explicit-any
;(globalThis as any).Browser = { T: () => {} };

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
