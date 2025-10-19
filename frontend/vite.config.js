import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // backend origin
        changeOrigin: true,              // rewrite Host header
        secure: false,                   // allow self-signed certificates (not needed locally)
      },
    },
  },
})