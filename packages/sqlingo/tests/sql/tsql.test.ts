import {
  describe, test, expect,
} from 'vitest';
import {
  parseOne,
} from '../../src/index';
import {
  AlterColumnExpr, AlterExpr, CommandExpr, ForeignKeyExpr,
} from '../../src/expressions';

describe('TSQL custom fixes', () => {
  // FIXME: upstream sqlglot doesn't handle WITH NOCHECK
  // Remove these tests if sqlglot adds support upstream
  describe('ALTER TABLE WITH NOCHECK ADD CONSTRAINT', () => {
    test('WITH NOCHECK ADD CONSTRAINT FK', () => {
      const result = parseOne(
        'ALTER TABLE t WITH NOCHECK ADD CONSTRAINT fk FOREIGN KEY (a) REFERENCES b(id)',
        {
          dialect: 'tsql',
        },
      );

      expect(result).toBeInstanceOf(AlterExpr);
      expect(result).not.toBeInstanceOf(CommandExpr);
      expect(result.find(ForeignKeyExpr)).toBeTruthy();
    });

    test('WITH CHECK ADD CONSTRAINT FK still works', () => {
      const result = parseOne(
        'ALTER TABLE t WITH CHECK ADD CONSTRAINT fk FOREIGN KEY (a) REFERENCES b(id)',
        {
          dialect: 'tsql',
        },
      );

      expect(result).toBeInstanceOf(AlterExpr);
      expect(result.find(ForeignKeyExpr)).toBeTruthy();
    });

    test('plain ADD CONSTRAINT FK still works', () => {
      const result = parseOne(
        'ALTER TABLE t ADD CONSTRAINT fk FOREIGN KEY (a) REFERENCES b(id)',
        {
          dialect: 'tsql',
        },
      );

      expect(result).toBeInstanceOf(AlterExpr);
    });
  });

  // FIXME: upstream sqlglot doesn't handle ADD DEFAULT ... FOR
  // Remove these tests if sqlglot adds support upstream
  describe('ALTER TABLE ADD DEFAULT ... FOR', () => {
    test('ADD DEFAULT value FOR col', () => {
      const result = parseOne('ALTER TABLE t ADD DEFAULT 0 FOR col', {
        dialect: 'tsql',
      });

      expect(result).toBeInstanceOf(AlterExpr);
      expect(result).not.toBeInstanceOf(CommandExpr);
      expect(result.find(AlterColumnExpr)).toBeTruthy();
    });

    test('ADD DEFAULT (value) FOR col', () => {
      const result = parseOne('ALTER TABLE t ADD DEFAULT (0) FOR col', {
        dialect: 'tsql',
      });

      expect(result).toBeInstanceOf(AlterExpr);
      expect(result.find(AlterColumnExpr)).toBeTruthy();
    });

    test('ADD DEFAULT string FOR col', () => {
      const result = parseOne('ALTER TABLE t ADD DEFAULT (\'test\') FOR col', {
        dialect: 'tsql',
      });

      expect(result).toBeInstanceOf(AlterExpr);
      expect(result.find(AlterColumnExpr)).toBeTruthy();
    });

    test('ADD CONSTRAINT name DEFAULT value FOR col', () => {
      const result = parseOne(
        'ALTER TABLE t ADD CONSTRAINT df_col DEFAULT 0 FOR col',
        {
          dialect: 'tsql',
        },
      );

      expect(result).toBeInstanceOf(AlterExpr);
      expect(result.find(AlterColumnExpr)).toBeTruthy();
    });

    test('ADD CONSTRAINT still works for FK', () => {
      const result = parseOne(
        'ALTER TABLE t ADD CONSTRAINT fk FOREIGN KEY (a) REFERENCES b(id)',
        {
          dialect: 'tsql',
        },
      );

      expect(result).toBeInstanceOf(AlterExpr);
      expect(result.find(ForeignKeyExpr)).toBeTruthy();
    });

    test('ADD CONSTRAINT still works for CHECK', () => {
      const result = parseOne(
        'ALTER TABLE t ADD CONSTRAINT chk CHECK (a > 0)',
        {
          dialect: 'tsql',
        },
      );

      expect(result).toBeInstanceOf(AlterExpr);
    });
  });
});
