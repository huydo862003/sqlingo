import {
  globSync,
} from 'node:fs';
import {
  defineConfig,
} from 'tsup';

const dialectEntries = globSync('src/dialects/!(dialect).ts');

export default defineConfig({
  entry: [
    'src/index.ts',
    ...dialectEntries,
  ],
  format: [
    'esm',
    'cjs',
  ],
  dts: true,
  sourcemap: true,
  minify: true,
  // FuncExpr.sqlNames() derives SQL names from class names at runtime
  keepNames: true,
  external: ['luxon'],
  clean: true,
  splitting: true,
  outDir: 'dist',
});
