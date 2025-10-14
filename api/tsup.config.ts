import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/http/server.ts'],
  format: ['esm'],
  target: 'node18',
  platform: 'node',
  sourcemap: true,
  clean: true,
  bundle: true,
  minify: false,
  noExternal: [/@idiomax\/.*/],
  esbuildOptions(options) {
    options.mainFields = ['module', 'main']
    options.format = 'esm'
    options.platform = 'node'
    options.target = 'node18'
  }
})
