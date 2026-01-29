import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  base: '/NoveauWallplayper/',
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      strategies: 'injectManifest',
      srcDir: 'src',
      filename: 'sw.js',
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: {
        name: 'Wallplayper',
        short_name: 'Wallplayper',
        description: 'Live wallpapers for any device',
        theme_color: '#000000',
        icons: [
          {
            src: 'x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      devOptions: {
        enabled: true,
        type: 'module',
      }
    })
  ],
})
