import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import { ThemeProvider } from './theme/ThemeContext.tsx'
import { LoadingOverlayProvider } from './context/LoadingOverlayContext.tsx'
import { ToastProvider } from './context/ToastContext.tsx'
import './index.css'

createRoot(document.getElementById('app')!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <LoadingOverlayProvider>
          <ToastProvider>
            <App />
          </ToastProvider>
        </LoadingOverlayProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
)
