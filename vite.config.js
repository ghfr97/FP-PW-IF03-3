import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5005',
        changeOrigin: true,
      }
    },
    host: true, // Listen on all network interfaces
    allowedHosts: true, // Izinkan semua host (ngrok, localtunnel, dll)
  }
})
