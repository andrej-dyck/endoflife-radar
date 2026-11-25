import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    tailwindcss(),
  ],
  build: {
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [{
            name: '@react',
            test: /node_modules[\\/](react|react-.+)[\\/]/,
          }, {
            name: '@zod',
            test: /node_modules[\\/]zod[\\/]/,
          }],
        },
      },
    },
  },
})
