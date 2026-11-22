import {
  existsSync, readFileSync,
} from 'node:fs';
import {
  join,
} from 'node:path';
import {
  describe, it, expect, vi, afterEach,
} from 'vitest';
import {
  parseOne, transpile,
} from '../src/index';
import {
  traverseScope,
} from '../src/optimizer';

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
});

describe('scope selectedSources', () => {
  it.each([
    'constructor',
    'toString',
    'hasOwnProperty',
    '__proto__',
  ])('handles a source named %s', (name) => {
    const [scope] = traverseScope(parseOne(`SELECT * FROM ${name} JOIN other ON TRUE`));

    expect(Object.keys(scope.selectedSources).sort()).toEqual([
      name,
      'other',
    ].sort());
  });
});

describe('generator console output', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('does not log when generating raw strings', () => {
    const log = vi.spyOn(console, 'log').mockImplementation(() => {});

    transpile('SELECT r\'\\x21\'', {
      read: 'bigquery',
      write: 'bigquery',
    });
    expect(log).not.toHaveBeenCalled();
  });
});
