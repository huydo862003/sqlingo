import {
  describe, test, expect,
} from 'vitest';
import {
  parseOne,
} from '../../src/index';
import {
  AlterExpr, CommandExpr,
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
  });
});
