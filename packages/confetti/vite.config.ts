import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
const path = require('path')

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: '../../extension/js',
    lib: {
      entry: path.resolve(__dirname, 'src/main.tsx'),
      name: 'confetti',
      formats: ['cjs'], // File size is larger when it is `es`
    },
  },
})
