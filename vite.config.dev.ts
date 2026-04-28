import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  root: path.resolve(__dirname, "dev"),
  server: {
    host: true,
    port: 5174,
    allowedHosts: true
  },
  build: {
    outDir: path.resolve(__dirname, "dist-dev"),
    emptyOutDir: true,
  },
})