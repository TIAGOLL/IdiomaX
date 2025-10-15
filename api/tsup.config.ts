import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src'],
  format: ['esm', 'esm'],
  splitting: false,
  sourcemap: true,
  clean: true,
  noExternal: ['@idiomax/validation-schemas', '@idiomax/authorization'],
})