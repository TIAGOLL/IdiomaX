import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src'],
  splitting: false,
  sourcemap: true,
  clean: true,
  format: ['esm'],
  dts: true,
  minify: false,
  bundle: true,
  outExtension: () => ({
    js: '.js',
  }),
  esbuildOptions(options) {
    options.platform = 'node'
    options.format = 'esm'
    options.outExtension = { '.js': '.js' }
    options.banner = {
      js: `import { createRequire } from 'module';const require = createRequire(import.meta.url);`,
    }
  },
})
