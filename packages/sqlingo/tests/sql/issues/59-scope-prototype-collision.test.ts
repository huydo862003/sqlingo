// #59: Scope.selectedSources collides with Object.prototype members
// A table named "constructor", "toString", etc. triggers "Alias already used"
// because `name in {}` finds Object.prototype properties
import {
  describe, it, expect,
} from 'vitest';
import {
  parseOne, optimize, MappingSchema,
} from '../../../src/index';
import {
  traverseScope,
} from '../../../src/optimizer';
import {
  Postgres,
} from '../../../src/dialects/postgres';

describe('#59: scope selectedSources prototype collision', () => {
  it.each([
    'constructor',
    'toString',
    'hasOwnProperty',
    '__proto__',
    'valueOf',
    'isPrototypeOf',
    'propertyIsEnumerable',
  ])('selectedSources includes a table named %s', (name) => {
    const [scope] = traverseScope(parseOne(`SELECT * FROM ${name} JOIN other ON TRUE`));

    expect(Object.keys(scope.selectedSources).sort()).toEqual([
      name,
      'other',
    ].sort());
  });

  it.each([
    'constructor',
    'toString',
    'hasOwnProperty',
  ])('table named %s works as the only source', (name) => {
    const [scope] = traverseScope(parseOne(`SELECT * FROM ${name}`));

    expect(Object.keys(scope.selectedSources)).toEqual([name]);
  });

  it('prototype-named tables round-trip through transpile', () => {
    const ast = parseOne('SELECT * FROM constructor WHERE constructor.id = 1');

    expect(ast.sql()).toContain('constructor');
  });

  it('prototype-named tables work with the optimizer', () => {
    const schema = new MappingSchema({
      users: {
        id: 'INT',
        name: 'TEXT',
      },
    });
    const optimized = optimize(
      parseOne('SELECT * FROM users AS constructor'),
      {
        schema,
      },
    );

    expect(optimized.sql()).toContain('"constructor"');
  });

  it('prototype-named tables work in multi-table joins', () => {
    const sql = 'SELECT a.x, b.y FROM toString AS a JOIN valueOf AS b ON a.id = b.id';
    const [scope] = traverseScope(parseOne(sql));

    expect(Object.keys(scope.selectedSources).sort()).toEqual([
      'a',
      'b',
    ]);
  });

  it('prototype-named columns resolve in qualify_columns', () => {
    const schema = {
      t: {
        id: 'INT',
        value: 'TEXT',
      },
    };
    const optimized = optimize(
      parseOne('SELECT * FROM t AS constructor'),
      {
        schema,
      },
    );
    const sql = optimized.sql();

    expect(sql).toContain('"constructor"."id"');
    expect(sql).toContain('"constructor"."value"');
  });
});
