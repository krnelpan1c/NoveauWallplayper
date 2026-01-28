import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Manual registration for injectManifest SW to ensure it works in dev
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // Ensure base URL ends with a slash for swUrl construction
    const base = import.meta.env.BASE_URL.endsWith('/') ? import.meta.env.BASE_URL : `${import.meta.env.BASE_URL}/`;
    const swUrl = `${base}sw.js`;
    navigator.serviceWorker.register(swUrl, { type: 'module' })
      .then(reg => {
        console.log('SW registered:', reg);
      })
      .catch(err => {
        console.error('SW registration failed:', err);
      });
  });
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
