import {
  describe, test, expect,
} from 'vitest';
import {
  parseOne,
} from '../../src/index';
import {
  AlterExpr, CommandExpr, CreateExpr, ForeignKeyExpr,
} from '../../src/expressions';

describe('Postgres custom fixes', () => {
  // FIXME: upstream sqlglot doesn't handle ALTER TABLE ADD CHECK (unnamed)
  // Remove these tests if sqlglot adds support upstream
  describe('ALTER TABLE ADD CHECK (unnamed)', () => {
    test('basic add check', () => {
      const result = parseOne('ALTER TABLE payments ADD CHECK (amount > 0)', {
        dialect: 'postgres',
      });

      expect(result).toBeInstanceOf(AlterExpr);
      expect(result).not.toBeInstanceOf(CommandExpr);
    });

    test('named ADD CONSTRAINT CHECK still works', () => {
      const result = parseOne('ALTER TABLE t ADD CONSTRAINT chk CHECK (a > 0)', {
        dialect: 'postgres',
      });

      expect(result).toBeInstanceOf(AlterExpr);
    });

    test('ADD PRIMARY KEY still works', () => {
      const result = parseOne('ALTER TABLE t ADD PRIMARY KEY (id)', {
        dialect: 'postgres',
      });

      expect(result).toBeInstanceOf(AlterExpr);
    });

    test('ADD FOREIGN KEY still works', () => {
      const result = parseOne('ALTER TABLE t ADD FOREIGN KEY (col) REFERENCES other(id)', {
        dialect: 'postgres',
      });

      expect(result).toBeInstanceOf(AlterExpr);
      const fk = result.find(ForeignKeyExpr);

      expect(fk).toBeTruthy();
    });
  });

  describe('CREATE TYPE AS ENUM still works', () => {
    test('basic enum', () => {
      const result = parseOne('CREATE TYPE mood AS ENUM (\'happy\', \'sad\')', {
        dialect: 'postgres',
      });

      expect(result).toBeInstanceOf(CreateExpr);
      expect(result).not.toBeInstanceOf(CommandExpr);
    });
  });

  // FIXME: not in upstream sqlglot
  // PostgreSQL: CREATE [LOCAL | GLOBAL] {TEMP | TEMPORARY} TABLE ...
  describe('CREATE LOCAL TEMP TABLE', () => {
    test('LOCAL TEMP TABLE', () => {
      const result = parseOne(
        'CREATE LOCAL TEMP TABLE t (id INT)',
        { dialect: 'postgres' },
      );
      expect(result).toBeInstanceOf(CreateExpr);
      expect(result).not.toBeInstanceOf(CommandExpr);
    });

    test('LOCAL TEMPORARY TABLE IF NOT EXISTS', () => {
      const result = parseOne(
        'CREATE LOCAL TEMPORARY TABLE IF NOT EXISTS t (id INT)',
        { dialect: 'postgres' },
      );
      expect(result).toBeInstanceOf(CreateExpr);
    });

    test('GLOBAL TEMPORARY TABLE still works', () => {
      const result = parseOne(
        'CREATE GLOBAL TEMPORARY TABLE t (id INT)',
        { dialect: 'postgres' },
      );
      expect(result).toBeInstanceOf(CreateExpr);
    });

    test('plain TEMP TABLE still works', () => {
      const result = parseOne(
        'CREATE TEMP TABLE t (id INT)',
        { dialect: 'postgres' },
      );
      expect(result).toBeInstanceOf(CreateExpr);
    });
  });

  // FIXME: upstream sqlglot doesn't handle USING after column list in CREATE INDEX
  // Remove these tests if sqlglot adds support upstream
  describe('CREATE INDEX ... (cols) USING btree', () => {
    test('USING btree after columns', () => {
      const result = parseOne('CREATE INDEX idx ON t (a) USING btree', {
        dialect: 'postgres',
      });

      expect(result).toBeInstanceOf(CreateExpr);
      expect(result).not.toBeInstanceOf(CommandExpr);
    });

    test('USING before columns still works', () => {
      const result = parseOne('CREATE INDEX idx ON t USING gin (a)', {
        dialect: 'postgres',
      });

      expect(result).toBeInstanceOf(CreateExpr);
    });
  });
});
