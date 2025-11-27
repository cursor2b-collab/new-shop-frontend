import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  base: '/',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  publicDir: 'public',
  server: {
    proxy: {
      '/payment-config': {
        target: 'https://vps.boltcode.vip',
        changeOrigin: true,
        secure: false
      },
      '/api': {
        target: 'https://vps.boltcode.vip',
        changeOrigin: true,
        secure: false
      },
      '/custom-payment': {
        target: 'https://vps.boltcode.vip',
        changeOrigin: true,
        secure: false
      }
    }
  }
})



