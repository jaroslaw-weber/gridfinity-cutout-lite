import { defineConfig } from 'astro/config'
import react from '@astrojs/react'

export default defineConfig({
  output: 'static',
  integrations: [react()],
  site: 'https://jaroslaw-weber.github.io',
  base: '/gridfinity-cutout-lite/'
})
