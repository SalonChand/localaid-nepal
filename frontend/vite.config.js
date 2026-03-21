import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins:[
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets:['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'LocalAid Nepal',
        short_name: 'LocalAid',
        description: 'Coordinated Social Support Services for Communities in Nepal',
        theme_color: '#4f46e5', // The indigo-600 color we used in our UI
        background_color: '#f8fafc', // slate-50 background
        display: 'standalone', // This hides the browser URL bar so it feels like a native app
        orientation: 'portrait',
        icons:[
          {
            src: '/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
});