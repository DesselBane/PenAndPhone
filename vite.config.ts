import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import svgLoader from 'vite-svg-loader'
import { vite } from './aliases.config.js'

export default defineConfig({
  plugins: [vue(), svgLoader()],
  server: {
    port: 8080,
  },
  resolve: {
    alias: vite,
  },
})
