import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import './index.css'
import App from './App.tsx'
import { StoreProvider } from '@/store/StoreProvider'
import { ToastProvider } from '@/store/ToastProvider'
import { ensureSeeded } from '@/lib/seed'

async function boot() {
  await ensureSeeded()
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <BrowserRouter>
        <ToastProvider>
          <StoreProvider>
            <App />
          </StoreProvider>
        </ToastProvider>
      </BrowserRouter>
    </StrictMode>,
  )
}

void boot()
