import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
const { resolve } = require('path')

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: './release/dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'main.html'),
        option: resolve(__dirname, 'options.html'),
      },
      output: {
        entryFileNames: '[name].js',
      },
    },
  },
})
