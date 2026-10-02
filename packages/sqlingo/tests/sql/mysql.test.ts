import {
  describe, test, expect,
} from 'vitest';
import {
  parseOne, transpile,
} from '../../src/index';
import {
  AddConstraintExpr, AlterExpr, CreateExpr, CommandExpr, ForeignKeyExpr,
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

    test('CREATE SPATIAL INDEX roundtrip', () => {
      const [sql] = transpile('CREATE SPATIAL INDEX idx ON t (geom)', {
        read: 'mysql',
        write: 'mysql',
      });

      expect(sql).toBe('CREATE SPATIAL INDEX idx ON t(geom)');
    });

    test('CREATE UNIQUE INDEX still works', () => {
      const result = parseOne('CREATE UNIQUE INDEX idx ON t (a)', {
        dialect: 'mysql',
      });

      expect(result).toBeInstanceOf(CreateExpr);
      expect((result as CreateExpr).args.unique).toBe(true);
    });

    test('plain CREATE INDEX still works', () => {
      const result = parseOne('CREATE INDEX idx ON t (a)', {
        dialect: 'mysql',
      });

      expect(result).toBeInstanceOf(CreateExpr);
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

    test('named ADD CONSTRAINT CHECK still works', () => {
      const result = parseOne('ALTER TABLE t ADD CONSTRAINT chk CHECK (a > 0)', {
        dialect: 'mysql',
      });

      expect(result).toBeInstanceOf(AlterExpr);
    });

    test('ADD PRIMARY KEY still works', () => {
      const result = parseOne('ALTER TABLE t ADD PRIMARY KEY (id)', {
        dialect: 'mysql',
      });

      expect(result).toBeInstanceOf(AlterExpr);
    });

    test('ADD FOREIGN KEY still works', () => {
      const result = parseOne('ALTER TABLE t ADD FOREIGN KEY (col) REFERENCES other(id)', {
        dialect: 'mysql',
      });

      expect(result).toBeInstanceOf(AlterExpr);
    });

    test('ADD UNIQUE still works', () => {
      const result = parseOne('ALTER TABLE t ADD UNIQUE (col)', {
        dialect: 'mysql',
      });

      expect(result).toBeInstanceOf(AlterExpr);
    });
  });

  // FIXME: upstream sqlglot doesn't handle FOREIGN KEY index_name (cols) in MySQL
  // Remove these tests if sqlglot adds support upstream
  describe('ADD FOREIGN KEY with index name', () => {
    test('FOREIGN KEY index_name (cols) REFERENCES', () => {
      const result = parseOne(
        'ALTER TABLE t ADD FOREIGN KEY idx_name (col1) REFERENCES other(id)',
        { dialect: 'mysql' },
      );

      expect(result).toBeInstanceOf(AlterExpr);
      expect(result).not.toBeInstanceOf(CommandExpr);
      const fk = result.find(ForeignKeyExpr);
      expect(fk).toBeTruthy();
    });

    test('FOREIGN KEY without index name still works', () => {
      const result = parseOne(
        'ALTER TABLE t ADD FOREIGN KEY (col1) REFERENCES other(id)',
        { dialect: 'mysql' },
      );

      expect(result).toBeInstanceOf(AlterExpr);
      const fk = result.find(ForeignKeyExpr);
      expect(fk).toBeTruthy();
    });

    test('CONSTRAINT name FOREIGN KEY still works', () => {
      const result = parseOne(
        'ALTER TABLE t ADD CONSTRAINT fk_name FOREIGN KEY (col1) REFERENCES other(id)',
        { dialect: 'mysql' },
      );

      expect(result).toBeInstanceOf(AlterExpr);
      const fk = result.find(ForeignKeyExpr);
      expect(fk).toBeTruthy();
    });
  });

  // FIXME: upstream sqlglot doesn't handle CREATE TYPE AS ENUM in MySQL
  // Remove these tests if sqlglot adds support upstream
  describe('CREATE TYPE AS ENUM (MySQL)', () => {
    test('basic enum type', () => {
      const result = parseOne("CREATE TYPE mood AS ENUM ('happy', 'sad')", {
        dialect: 'mysql',
      });

      expect(result).toBeInstanceOf(CreateExpr);
      expect(result).not.toBeInstanceOf(CommandExpr);
    });

    test('CREATE TABLE still works', () => {
      const result = parseOne('CREATE TABLE t (id INT PRIMARY KEY, name VARCHAR(100))', {
        dialect: 'mysql',
      });

      expect(result).toBeInstanceOf(CreateExpr);
    });

    test('CREATE INDEX still works', () => {
      const result = parseOne('CREATE INDEX idx ON t (a)', {
        dialect: 'mysql',
      });

      expect(result).toBeInstanceOf(CreateExpr);
    });
  });
});
