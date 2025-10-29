import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { validateEnvironment } from './lib/supabase'

console.log('🚀 Application initializing...');
console.log('Environment:', import.meta.env.MODE);
console.log('Supabase URL configured:', !!import.meta.env.VITE_SUPABASE_URL);
console.log('reCAPTCHA configured:', !!import.meta.env.VITE_RECAPTCHA_SITE_KEY);

try {
  const validation = validateEnvironment();
  if (!validation.valid) {
    console.warn('⚠️ Environment validation warnings:', validation.errors);
    console.warn('App will continue with limited functionality');
  } else {
    console.log('✅ Environment validation passed');
  }

  const rootElement = document.getElementById('root');
  if (!rootElement) {
    throw new Error('Root element not found');
  }

  console.log('📦 Rendering React app...');
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
  console.log('✅ React app rendered successfully');
} catch (error) {
  console.error('❌ Fatal error during app initialization:', error);
  document.body.innerHTML = `
    <div style="display: flex; align-items: center; justify-content: center; min-height: 100vh; background: #1f2937; color: white; font-family: system-ui, -apple-system, sans-serif; padding: 20px;">
      <div style="max-width: 600px; text-align: center;">
        <h1 style="font-size: 2rem; margin-bottom: 1rem;">⚠️ Application Error</h1>
        <p style="color: #9ca3af; margin-bottom: 2rem;">The application failed to start. Please check the console for details.</p>
        <pre style="background: #374151; padding: 1rem; border-radius: 8px; text-align: left; overflow-x: auto; font-size: 0.875rem;">${error instanceof Error ? error.message : String(error)}</pre>
        <button onclick="window.location.reload()" style="margin-top: 2rem; background: #3b82f6; color: white; padding: 0.75rem 1.5rem; border: none; border-radius: 8px; cursor: pointer; font-size: 1rem;">
          Reload Page
        </button>
      </div>
    </div>
  `;
}