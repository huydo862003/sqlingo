import {
  describe, test, expect,
} from 'vitest';
import {
  parseOne, transpile,
} from '../../src/index';
import {
  AddConstraintExpr, AlterExpr, CreateExpr, CommandExpr,
} from '../../src/expressions';

describe('MySQL custom fixes', () => {
  // FIXME: upstream sqlglot doesn't handle CREATE FULLTEXT INDEX
  // Remove these tests if sqlglot adds support upstream
  describe('CREATE FULLTEXT INDEX', () => {
    test('basic fulltext index', () => {
      const result = parseOne('CREATE FULLTEXT INDEX idx ON t (a)', {
        dialect: 'mysql',
      });

      expect(result).toBeInstanceOf(CreateExpr);
      expect(result).not.toBeInstanceOf(CommandExpr);
    });

    test('roundtrip', () => {
      const [sql] = transpile('CREATE FULLTEXT INDEX idx ON t (a)', {
        read: 'mysql',
        write: 'mysql',
      });

      expect(sql).toBe('CREATE FULLTEXT INDEX idx ON t(a)');
    });
  });

  // FIXME: upstream sqlglot doesn't handle ALTER TABLE ADD CHECK (unnamed)
  // Remove these tests if sqlglot adds support upstream
  describe('ALTER TABLE ADD CHECK (unnamed)', () => {
    test('basic add check', () => {
      const result = parseOne('ALTER TABLE payments ADD CHECK (amount > 0)', {
        dialect: 'mysql',
      });

      expect(result).toBeInstanceOf(AlterExpr);
      expect(result).not.toBeInstanceOf(CommandExpr);
    });
  });
});
