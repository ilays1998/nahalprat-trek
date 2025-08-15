import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  esbuild: {
    loader: 'jsx',
    include: /src\/.*\.[jt]sx?$/,
    exclude: []
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
      },
    },
  },
  server: {
    port: 3000,
    host: true, // Listen on all network interfaces
    open: true
  },
  preview: {
    // Allow Render (and optional custom domains) to access the preview server
    allowedHosts: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
}) 