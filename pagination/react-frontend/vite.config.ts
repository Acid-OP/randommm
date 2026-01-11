import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 4050,
    proxy: {
      // Frontend calls `/api/...` and Vite proxies to the Express backend.
      // This avoids CORS issues and keeps API calls environment-agnostic.
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
})
