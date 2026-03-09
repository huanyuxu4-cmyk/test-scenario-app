import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

const isPages = process.env.BUILD_PAGES === '1'
const base = isPages ? '/test-scenario-app/' : './'

export default defineConfig({
  base,
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: '测试场景管理',
        short_name: '场景管理',
        start_url: base,
        scope: base,
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#2563eb',
        icons: [
          { src: `${base}icon.svg`, sizes: '192x192', type: 'image/svg+xml' },
          { src: `${base}icon.svg`, sizes: '512x512', type: 'image/svg+xml' }
        ]
      }
    })
  ],
  server: { host: true, port: 5175 }
})
