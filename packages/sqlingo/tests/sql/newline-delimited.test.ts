import {
  describe, test, expect,
} from 'vitest';
import {
  parseNewlineDelimited,
} from '../../src/index';
import {
  AlterExpr, CreateExpr,
} from '../../src/expressions';

describe('parseNewlineDelimited', () => {
  describe('newline-delimited statements', () => {
    test('two CREATE TABLE on separate lines', () => {
      const results = parseNewlineDelimited(
        'CREATE TABLE t (a INT)\nCREATE TABLE u (b INT)',
        {
          dialect: 'mysql',
        },
      );

      expect(results).toHaveLength(2);
      expect(results[0]).toBeInstanceOf(CreateExpr);
      expect(results[1]).toBeInstanceOf(CreateExpr);
    });

    test('CREATE then ALTER on separate lines', () => {
      const results = parseNewlineDelimited(
        'CREATE TABLE t (a INT)\nALTER TABLE t ADD COLUMN b INT',
        {
          dialect: 'mysql',
        },
      );

      expect(results).toHaveLength(2);
      expect(results[0]).toBeInstanceOf(CreateExpr);
      expect(results[1]).toBeInstanceOf(AlterExpr);
    });

    test('three DDL statements on separate lines', () => {
      const results = parseNewlineDelimited(
        'CREATE TABLE t (a INT)\nALTER TABLE t ADD COLUMN b INT\nDROP TABLE t',
        {
          dialect: 'mysql',
        },
      );

      expect(results).toHaveLength(3);
      expect(results[0]).toBeInstanceOf(CreateExpr);
      expect(results[1]).toBeInstanceOf(AlterExpr);
    });

    test('TSQL dialect', () => {
      const results = parseNewlineDelimited(
        'CREATE TABLE t (a INT)\nALTER TABLE t ADD b INT',
        {
          dialect: 'tsql',
        },
      );

      expect(results).toHaveLength(2);
      expect(results[0]).toBeInstanceOf(CreateExpr);
      expect(results[1]).toBeInstanceOf(AlterExpr);
    });

    test('postgres dialect', () => {
      const results = parseNewlineDelimited(
        'CREATE TABLE t (a INT)\nALTER TABLE t ADD COLUMN b INT',
        {
          dialect: 'postgres',
        },
      );

      expect(results).toHaveLength(2);
      expect(results[0]).toBeInstanceOf(CreateExpr);
      expect(results[1]).toBeInstanceOf(AlterExpr);
    });
  });

  describe('semicolons still work', () => {
    test('semicolon-separated', () => {
      const results = parseNewlineDelimited(
        'CREATE TABLE t (a INT); ALTER TABLE t ADD COLUMN b INT',
        {
          dialect: 'mysql',
        },
      );

      expect(results).toHaveLength(2);
      expect(results[0]).toBeInstanceOf(CreateExpr);
      expect(results[1]).toBeInstanceOf(AlterExpr);
    });
  });

  describe('single statement', () => {
    test('single CREATE TABLE', () => {
      const results = parseNewlineDelimited('CREATE TABLE t (a INT)', {
        dialect: 'mysql',
      });

      expect(results).toHaveLength(1);
      expect(results[0]).toBeInstanceOf(CreateExpr);
    });

    test('multi-line single statement', () => {
      const results = parseNewlineDelimited(
        'CREATE TABLE t (\n  a INT,\n  b VARCHAR(100)\n)',
        {
          dialect: 'mysql',
        },
      );

      expect(results).toHaveLength(1);
      expect(results[0]).toBeInstanceOf(CreateExpr);
    });
  });

  describe('does not split mid-line', () => {
    test('INSERT INTO t SELECT on same line', () => {
      const results = parseNewlineDelimited('INSERT INTO t SELECT * FROM u', {
        dialect: 'mysql',
      });

      expect(results).toHaveLength(1);
    });
  });

  describe('edge cases', () => {
    test('empty input returns same as parse()', () => {
      const results = parseNewlineDelimited('', {
        dialect: 'mysql',
      });

      expect(results.filter(Boolean)).toHaveLength(0);
    });

    test('only semicolons returns same as parse()', () => {
      const results = parseNewlineDelimited(';;;', {
        dialect: 'mysql',
      });

      expect(results.filter(Boolean)).toHaveLength(0);
    });
  });
});
