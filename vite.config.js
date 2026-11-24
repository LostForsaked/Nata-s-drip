
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { configDefaults, defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
  ],
  server: {
    proxy: { '/api': 'http://localhost:8080' },
  },
  test: {
    environment: 'jsdom',
    exclude: [...configDefaults.exclude, 'src/tests/**/*.karma.spec.jsx', 'server/tests/**'],
  },
})
