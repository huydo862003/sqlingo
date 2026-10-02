import {
  describe, test, expect,
} from 'vitest';
import {
  parseOne,
} from '../../src/index';
import {
  CreateExpr, CommandExpr,
} from '../../src/expressions';

describe('Oracle custom fixes', () => {
  // FIXME: upstream sqlglot doesn't handle ENABLE/DISABLE/VALIDATE/NOVALIDATE
  // Remove these tests if sqlglot adds support upstream
  describe('NOT NULL ENABLE/DISABLE constraint modifiers', () => {
    test('NOT NULL ENABLE', () => {
      const result = parseOne('CREATE TABLE t (level NUMBER(2) NOT NULL ENABLE)', {
        dialect: 'oracle',
      });

      expect(result).toBeInstanceOf(CreateExpr);
    });

    test('NOT NULL DISABLE', () => {
      const result = parseOne('CREATE TABLE t (priority NUMBER(2) NOT NULL DISABLE)', {
        dialect: 'oracle',
      });

      expect(result).toBeInstanceOf(CreateExpr);
    });

    test('NOT NULL ENABLE VALIDATE', () => {
      const result = parseOne('CREATE TABLE t (amount NUMBER(10,2) NOT NULL ENABLE VALIDATE)', {
        dialect: 'oracle',
      });

      expect(result).toBeInstanceOf(CreateExpr);
    });

    test('NOT NULL ENABLE NOVALIDATE', () => {
      const result = parseOne('CREATE TABLE t (discount NUMBER(10,2) NOT NULL ENABLE NOVALIDATE)', {
        dialect: 'oracle',
      });

      expect(result).toBeInstanceOf(CreateExpr);
    });

    test('NOT NULL DISABLE NOVALIDATE', () => {
      const result = parseOne('CREATE TABLE t (weight NUMBER(8,2) NOT NULL DISABLE NOVALIDATE)', {
        dialect: 'oracle',
      });

      expect(result).toBeInstanceOf(CreateExpr);
    });

    test('multiple columns with ENABLE/DISABLE', () => {
      const result = parseOne(
        'CREATE TABLE t (level NUMBER(2) NOT NULL ENABLE, rating NUMBER(2) NOT NULL DISABLE)',
        {
          dialect: 'oracle',
        },
      );

      expect(result).toBeInstanceOf(CreateExpr);
    });
  });

  // FIXME: upstream sqlglot doesn't handle CREATE BITMAP INDEX
  // Remove these tests if sqlglot adds support upstream
  describe('CREATE BITMAP INDEX', () => {
    test('basic bitmap index', () => {
      const result = parseOne('CREATE BITMAP INDEX idx ON t (col)', {
        dialect: 'oracle',
      });

      expect(result).toBeInstanceOf(CreateExpr);
      expect(result).not.toBeInstanceOf(CommandExpr);
    });
  });
});
