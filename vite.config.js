import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'


// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    // Ensure localStorage compatibility
    target: 'es2015',
    // Generate source maps for debugging
    sourcemap: true,
  },
  // Ensure proper handling of storage APIs
  define: {
    global: 'globalThis',
  }
})
