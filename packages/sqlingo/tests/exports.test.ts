// Verify package.json subpath exports map to existing source entries
// and that key exports are importable at runtime
import {
  existsSync, readFileSync,
} from 'node:fs';
import {
  join,
} from 'node:path';
import {
  describe, it, expect,
} from 'vitest';

const pkgRoot = join(__dirname, '..');

describe('package exports', () => {
  const pkg = JSON.parse(readFileSync(join(pkgRoot, 'package.json'), 'utf8'));

  it('exposes the optimizer subpath', () => {
    expect(pkg.exports['./optimizer']).toEqual({
      types: './dist/optimizer/index.d.ts',
      import: './dist/optimizer/index.js',
      require: './dist/optimizer/index.cjs',
    });
  });

  it('maps every subpath export to an existing source entry', () => {
    for (const [
      subpath,
      target,
    ] of Object.entries<Record<string, string>>(pkg.exports)) {
      const src = target.import.replace(/^\.\/dist\//, 'src/').replace(/\.js$/, '.ts');

      expect(existsSync(join(pkgRoot, src)), `${subpath} -> ${src}`).toBe(true);
    }
  });

  it('every dialect subpath has types, import, and require entries', () => {
    for (const [
      subpath,
      target,
    ] of Object.entries<Record<string, string>>(pkg.exports)) {
      expect(target.types, `${subpath} missing types`).toBeDefined();
      expect(target.import, `${subpath} missing import`).toBeDefined();
      expect(target.require, `${subpath} missing require`).toBeDefined();
    }
  });

  it('optimizer exports are importable', async () => {
    const optimizer = await import('../src/optimizer');

    expect(optimizer.traverseScope).toBeTypeOf('function');
    expect(optimizer.buildScope).toBeTypeOf('function');
    expect(optimizer.Scope).toBeTypeOf('function');
  });
});
