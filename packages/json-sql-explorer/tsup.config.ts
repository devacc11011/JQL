import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  sourcemap: true,
  clean: true,
  external: ['react', 'react-dom', 'monaco-editor'],
  treeshake: true,
  splitting: false,
  minify: false,
  outDir: 'dist',
});
