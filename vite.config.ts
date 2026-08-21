import { defineConfig } from 'vite'
import solid from 'vite-plugin-solid'

export default defineConfig({
  plugins: [solid()],
  // GitHub Pages serves project sites below /<repository>/.
  base: process.env.VITE_BASE ?? '/',
})
