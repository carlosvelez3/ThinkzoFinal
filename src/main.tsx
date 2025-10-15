import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { validateEnvironment } from './lib/supabase'

const validation = validateEnvironment();
if (!validation.valid) {
  console.error('Environment validation failed:', validation.errors);
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)