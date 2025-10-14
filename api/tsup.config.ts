import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/**/*.ts'],
  format: ['esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  bundle: true,
  minify: false,
  outExtension: () => ({
    js: '.js'
  }),
  platform: 'node',
  esbuildOptions(options) {
    options.mainFields = ['module', 'main']
    options.conditions = ['module']
    options.format = 'esm'
  }
})
