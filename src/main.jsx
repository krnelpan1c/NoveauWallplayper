import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { registerSW } from 'virtual:pwa-register'

// Register service worker for PWA
const updateSW = registerSW({
  onNeedRefresh() {
    console.log('[PWA] New content available, please refresh.');
  },
  onOfflineReady() {
    console.log('[PWA] App is ready to work offline.');
  },
})

// Listen for the install prompt
window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent the mini-infobar from appearing on mobile
  // e.preventDefault();
  console.log('[PWA] Install prompt deferred or ready');
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
