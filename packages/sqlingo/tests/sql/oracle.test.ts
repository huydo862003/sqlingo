import {
  describe, test, expect,
} from 'vitest';
import {
  parseOne, transpile,
} from '../../src/index';
import {
  CreateExpr, CommandExpr, AlterExpr, ModifyColumnExpr,
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

  // FIXME: not in upstream sqlglot
  // Oracle: constraint_def [ENABLE|DISABLE] [VALIDATE|NOVALIDATE] [RELY|NORELY]
  describe('constraint state after PRIMARY KEY / UNIQUE / CHECK', () => {
    test('PRIMARY KEY ENABLE', () => {
      const result = parseOne(
        'CREATE TABLE t (id NUMBER CONSTRAINT pk PRIMARY KEY ENABLE)',
        {
          dialect: 'oracle',
        },
      );

      expect(result).toBeInstanceOf(CreateExpr);
    });

    test('UNIQUE DISABLE NOVALIDATE', () => {
      const result = parseOne(
        'CREATE TABLE t (email VARCHAR2(100) UNIQUE DISABLE NOVALIDATE)',
        {
          dialect: 'oracle',
        },
      );

      expect(result).toBeInstanceOf(CreateExpr);
    });

    test('NOT NULL RELY', () => {
      const result = parseOne(
        'CREATE TABLE t (id NUMBER NOT NULL RELY)',
        {
          dialect: 'oracle',
        },
      );

      expect(result).toBeInstanceOf(CreateExpr);
    });

    test('CHECK ENABLE VALIDATE', () => {
      const result = parseOne(
        'CREATE TABLE t (age NUMBER CHECK (age > 0) ENABLE VALIDATE)',
        {
          dialect: 'oracle',
        },
      );

      expect(result).toBeInstanceOf(CreateExpr);
    });

    test('DEFERRABLE INITIALLY DEFERRED', () => {
      const result = parseOne(
        'CREATE TABLE t (id NUMBER CONSTRAINT pk PRIMARY KEY DEFERRABLE INITIALLY DEFERRED)',
        {
          dialect: 'oracle',
        },
      );

      expect(result).toBeInstanceOf(CreateExpr);
    });

    test('NOT DEFERRABLE', () => {
      const result = parseOne(
        'CREATE TABLE t (id NUMBER NOT NULL NOT DEFERRABLE)',
        {
          dialect: 'oracle',
        },
      );

      expect(result).toBeInstanceOf(CreateExpr);
    });
  });

  // FIXME: not in upstream sqlglot
  // Oracle 12c+: DEFAULT [ON NULL] <expr>
  describe('DEFAULT ON NULL', () => {
    test('DEFAULT ON NULL literal', () => {
      const result = parseOne(
        'CREATE TABLE t (email VARCHAR2(100) DEFAULT ON NULL \'noemail@example.com\')',
        {
          dialect: 'oracle',
        },
      );

      expect(result).toBeInstanceOf(CreateExpr);
    });

    test('DEFAULT ON NULL number', () => {
      const result = parseOne(
        'CREATE TABLE t (qty NUMBER DEFAULT ON NULL 0)',
        {
          dialect: 'oracle',
        },
      );

      expect(result).toBeInstanceOf(CreateExpr);
    });

    test('DEFAULT ON NULL with NOT NULL', () => {
      const result = parseOne(
        'CREATE TABLE t (qty NUMBER DEFAULT ON NULL 0 NOT NULL)',
        {
          dialect: 'oracle',
        },
      );

      expect(result).toBeInstanceOf(CreateExpr);
    });

    test('regular DEFAULT still works', () => {
      const result = parseOne(
        'CREATE TABLE t (qty NUMBER DEFAULT 0 NOT NULL)',
        {
          dialect: 'oracle',
        },
      );

      expect(result).toBeInstanceOf(CreateExpr);
    });
  });

  // FIXME: not in upstream sqlglot
  // INTERVAL {YEAR|DAY}[(precision)] TO {MONTH|SECOND}[(precision)]
  describe('INTERVAL with precision', () => {
    test('INTERVAL YEAR(2) TO MONTH', () => {
      const result = parseOne(
        'CREATE TABLE t (c INTERVAL YEAR(2) TO MONTH)',
        {
          dialect: 'oracle',
        },
      );

      expect(result).toBeInstanceOf(CreateExpr);
    });

    test('INTERVAL DAY(2) TO SECOND(6)', () => {
      const result = parseOne(
        'CREATE TABLE t (c INTERVAL DAY(2) TO SECOND(6))',
        {
          dialect: 'oracle',
        },
      );

      expect(result).toBeInstanceOf(CreateExpr);
    });

    test('INTERVAL YEAR TO MONTH (no precision) still works', () => {
      const result = parseOne(
        'CREATE TABLE t (c INTERVAL YEAR TO MONTH)',
        {
          dialect: 'oracle',
        },
      );

      expect(result).toBeInstanceOf(CreateExpr);
    });
  });

  // FIXME: not in upstream sqlglot
  // LONG RAW
  describe('LONG RAW type', () => {
    test('LONG RAW column', () => {
      const result = parseOne(
        'CREATE TABLE t (c LONG RAW)',
        {
          dialect: 'oracle',
        },
      );

      expect(result).toBeInstanceOf(CreateExpr);
    });
  });

  // FIXME: not in upstream sqlglot
  // PARTITION BY {RANGE|LIST} (cols) (PARTITION name VALUES ...)
  describe('PARTITION BY RANGE/LIST', () => {
    test('PARTITION BY RANGE with VALUES LESS THAN', () => {
      const result = parseOne(
        'CREATE TABLE t (id NUMBER, dt DATE) PARTITION BY RANGE (dt) (PARTITION p1 VALUES LESS THAN (TO_DATE(\'2023-01-01\', \'YYYY-MM-DD\')))',
        {
          dialect: 'oracle',
        },
      );

      expect(result).toBeInstanceOf(CreateExpr);
    });

    test('PARTITION BY LIST with VALUES', () => {
      const result = parseOne(
        'CREATE TABLE t (id NUMBER, region VARCHAR2(10)) PARTITION BY LIST (region) (PARTITION p1 VALUES (1, 2))',
        {
          dialect: 'oracle',
        },
      );

      expect(result).toBeInstanceOf(CreateExpr);
    });

    test('PARTITION BY HASH still works', () => {
      const result = parseOne(
        'CREATE TABLE t (id NUMBER) PARTITION BY HASH (id)',
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

    test('plain CREATE INDEX still works', () => {
      const result = parseOne('CREATE INDEX idx ON t (a)', {
        dialect: 'oracle',
      });

      expect(result).toBeInstanceOf(CreateExpr);
    });

    test('CREATE UNIQUE INDEX still works', () => {
      const result = parseOne('CREATE UNIQUE INDEX idx ON t (a)', {
        dialect: 'oracle',
      });

      expect(result).toBeInstanceOf(CreateExpr);
    });
  });

  // FIXME: upstream sqlglot doesn't handle Oracle CREATE INDEX REVERSE
  // Remove these tests if sqlglot adds support upstream
  describe('CREATE INDEX ... REVERSE', () => {
    test('basic reverse index', () => {
      const result = parseOne('CREATE INDEX idx ON t (a) REVERSE', {
        dialect: 'oracle',
      });

      expect(result).toBeInstanceOf(CreateExpr);
      expect(result).not.toBeInstanceOf(CommandExpr);
    });

    test('roundtrip', () => {
      const [sql] = transpile('CREATE INDEX idx ON t (a) REVERSE', {
        read: 'oracle',
        write: 'oracle',
      });

      expect(sql).toContain('REVERSE');
    });
  });

  // FIXME: upstream sqlglot doesn't handle Oracle ALTER TABLE MODIFY
  // Remove these tests if sqlglot adds support upstream
  describe('ALTER TABLE MODIFY', () => {
    test('MODIFY col NOT NULL', () => {
      const result = parseOne('ALTER TABLE t MODIFY c NOT NULL', {
        dialect: 'oracle',
      });

      expect(result).toBeInstanceOf(AlterExpr);
      expect(result).not.toBeInstanceOf(CommandExpr);
      expect(result.find(ModifyColumnExpr)).toBeTruthy();
    });

    test('MODIFY col DEFAULT 0', () => {
      const result = parseOne('ALTER TABLE t MODIFY c DEFAULT 0', {
        dialect: 'oracle',
      });

      expect(result).toBeInstanceOf(AlterExpr);
      expect(result).not.toBeInstanceOf(CommandExpr);
    });

    test('MODIFY col NULL', () => {
      const result = parseOne('ALTER TABLE t MODIFY c NULL', {
        dialect: 'oracle',
      });

      expect(result).toBeInstanceOf(AlterExpr);
      expect(result).not.toBeInstanceOf(CommandExpr);
    });

    test('MODIFY col with type', () => {
      const result = parseOne('ALTER TABLE t MODIFY c VARCHAR2(200)', {
        dialect: 'oracle',
      });

      expect(result).toBeInstanceOf(AlterExpr);
      expect(result).not.toBeInstanceOf(CommandExpr);
    });

    test('MODIFY with parens (multiple columns)', () => {
      const result = parseOne('ALTER TABLE t MODIFY (c NOT NULL)', {
        dialect: 'oracle',
      });

      expect(result).toBeInstanceOf(AlterExpr);
      expect(result).not.toBeInstanceOf(CommandExpr);
    });

    test('roundtrip uses MODIFY (not MODIFY COLUMN)', () => {
      const [sql] = transpile('ALTER TABLE t MODIFY c NOT NULL', {
        read: 'oracle',
        write: 'oracle',
      });

      expect(sql).toContain('MODIFY');
      expect(sql).not.toContain('MODIFY COLUMN');
    });

    test('ALTER TABLE ADD COLUMN still works', () => {
      const result = parseOne('ALTER TABLE t ADD (c INT)', {
        dialect: 'oracle',
      });

      expect(result).toBeInstanceOf(AlterExpr);
    });

    test('ALTER TABLE DROP CONSTRAINT still works', () => {
      const result = parseOne('ALTER TABLE t DROP CONSTRAINT chk', {
        dialect: 'oracle',
      });

      expect(result).toBeInstanceOf(AlterExpr);
    });

    test('ALTER TABLE RENAME COLUMN still works', () => {
      const result = parseOne('ALTER TABLE t RENAME COLUMN a TO b', {
        dialect: 'oracle',
      });

      expect(result).toBeInstanceOf(AlterExpr);
    });
  });
});
