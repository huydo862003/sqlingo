import {
  describe, test, expect,
} from 'vitest';
import {
  parseOne,
} from '../../src/index';
import {
  AlterExpr, CommandExpr, ForeignKeyExpr,
} from '../../src/expressions';

describe('TSQL custom fixes', () => {
  // FIXME: upstream sqlglot doesn't handle WITH NOCHECK
  // Remove these tests if sqlglot adds support upstream
  describe('ALTER TABLE WITH NOCHECK ADD CONSTRAINT', () => {
    test('WITH NOCHECK ADD CONSTRAINT FK', () => {
      const result = parseOne(
        'ALTER TABLE t WITH NOCHECK ADD CONSTRAINT fk FOREIGN KEY (a) REFERENCES b(id)',
        { dialect: 'tsql' },
      );

      expect(result).toBeInstanceOf(AlterExpr);
      expect(result).not.toBeInstanceOf(CommandExpr);
      expect(result.find(ForeignKeyExpr)).toBeTruthy();
    });

    test('WITH CHECK ADD CONSTRAINT FK still works', () => {
      const result = parseOne(
        'ALTER TABLE t WITH CHECK ADD CONSTRAINT fk FOREIGN KEY (a) REFERENCES b(id)',
        { dialect: 'tsql' },
      );

      expect(result).toBeInstanceOf(AlterExpr);
      expect(result.find(ForeignKeyExpr)).toBeTruthy();
    });

    test('plain ADD CONSTRAINT FK still works', () => {
      const result = parseOne(
        'ALTER TABLE t ADD CONSTRAINT fk FOREIGN KEY (a) REFERENCES b(id)',
        { dialect: 'tsql' },
      );

      expect(result).toBeInstanceOf(AlterExpr);
    });
  });
});
