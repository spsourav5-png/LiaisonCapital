import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), nodePolyfills()],
  define: {
    global: 'globalThis',
  },
  optimizeDeps: {
    entries: ['src/**/*.{ts,tsx}'],
    esbuildOptions: {
      target: 'es2022',
    },
  },
  build: {
    target: 'es2022',
  },
  resolve: {
    alias: {
      buffer: 'buffer',
    },
  },
  server: {
    watch: {
      ignored: ['**/interface/**', '**/interface-test/**']
    },
    proxy: {
      '/api/uniswap': {
        target: 'https://trade-api.gateway.uniswap.org/v1',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/uniswap/, ''),
        headers: {
          'Origin': 'https://app.uniswap.org',
          'x-api-key': 'sxjnaeCtdtKdSCWEf-z4CeLsAGBbzMiVZQUP2hDyTcA'
        }
      },
      '/api/routing': {
        target: 'https://api.uniswap.org/v1',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/routing/, ''),
        headers: {
          'Origin': 'https://app.uniswap.org',
          'Referer': 'https://app.uniswap.org/'
        }
      },
    },
  },
})
