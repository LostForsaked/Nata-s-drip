
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { configDefaults, defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
  ],
  server: {
    // En desarrollo, las llamadas a /api se envían al servidor Express (puerto 3001)
    proxy: { '/api': 'http://localhost:3001' },
  },
  test: {
    environment: 'jsdom',
    exclude: [...configDefaults.exclude, 'src/tests/**/*.karma.spec.jsx', 'server/tests/**'],
  },
})
