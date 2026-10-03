import {
  describe, test, expect,
} from 'vitest';
import {
  parseOne, transpile,
} from '../../src/index';
import {
  AlterExpr, CreateExpr, CommandExpr, ForeignKeyExpr, IndexColumnConstraintExpr, ColumnDefExpr,
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
        {
          dialect: 'mysql',
        },
      );

      expect(result).toBeInstanceOf(AlterExpr);
      expect(result).not.toBeInstanceOf(CommandExpr);
      const fk = result.find(ForeignKeyExpr);

      expect(fk).toBeTruthy();
    });

    test('FOREIGN KEY without index name still works', () => {
      const result = parseOne(
        'ALTER TABLE t ADD FOREIGN KEY (col1) REFERENCES other(id)',
        {
          dialect: 'mysql',
        },
      );

      expect(result).toBeInstanceOf(AlterExpr);
      const fk = result.find(ForeignKeyExpr);

      expect(fk).toBeTruthy();
    });

    test('CONSTRAINT name FOREIGN KEY still works', () => {
      const result = parseOne(
        'ALTER TABLE t ADD CONSTRAINT fk_name FOREIGN KEY (col1) REFERENCES other(id)',
        {
          dialect: 'mysql',
        },
      );

      expect(result).toBeInstanceOf(AlterExpr);
      const fk = result.find(ForeignKeyExpr);

      expect(fk).toBeTruthy();
    });
  });

  // MySQL: UNIQUE [INDEX|KEY] with expression indexes ((expr))
  describe('UNIQUE INDEX with expression', () => {
    test('UNIQUE INDEX with double-paren expression', () => {
      const result = parseOne(
        'CREATE TABLE t (id INT, UNIQUE INDEX uk ((LOWER(email))))',
        {
          dialect: 'mysql',
        },
      );

      expect(result).toBeInstanceOf(CreateExpr);
      expect(result).not.toBeInstanceOf(CommandExpr);
    });

    test('INDEX with double-paren expression still works', () => {
      const result = parseOne(
        'CREATE TABLE t (d INT, INDEX k ((d + 1)))',
        {
          dialect: 'mysql',
        },
      );

      expect(result).toBeInstanceOf(CreateExpr);
    });

    test('UNIQUE INDEX with simple column still works', () => {
      const result = parseOne(
        'CREATE TABLE t (a INT, UNIQUE INDEX uk (a))',
        {
          dialect: 'mysql',
        },
      );

      expect(result).toBeInstanceOf(CreateExpr);
    });

    test('inline column UNIQUE still works', () => {
      const result = parseOne(
        'CREATE TABLE t (a INT UNIQUE)',
        {
          dialect: 'mysql',
        },
      );

      expect(result).toBeInstanceOf(CreateExpr);
    });
  });

  // FIXME: not in upstream sqlglot
  // MySQL: COLUMN_FORMAT {FIXED | DYNAMIC | DEFAULT}
  describe('COLUMN_FORMAT column attribute', () => {
    test('COLUMN_FORMAT FIXED', () => {
      const result = parseOne(
        'CREATE TABLE t (id INT, col VARCHAR(100) COLUMN_FORMAT FIXED)',
        {
          dialect: 'mysql',
        },
      );

      expect(result).toBeInstanceOf(CreateExpr);
      expect(result).not.toBeInstanceOf(CommandExpr);
    });

    test('COLUMN_FORMAT DYNAMIC', () => {
      const result = parseOne(
        'CREATE TABLE t (col TEXT COLUMN_FORMAT DYNAMIC)',
        {
          dialect: 'mysql',
        },
      );

      expect(result).toBeInstanceOf(CreateExpr);
    });

    test('COLUMN_FORMAT DEFAULT', () => {
      const result = parseOne(
        'CREATE TABLE t (col VARCHAR(100) COLUMN_FORMAT DEFAULT)',
        {
          dialect: 'mysql',
        },
      );

      expect(result).toBeInstanceOf(CreateExpr);
    });

    test('COLUMN_FORMAT with other constraints', () => {
      const result = parseOne(
        'CREATE TABLE t (col VARCHAR(50) COLUMN_FORMAT FIXED NOT NULL DEFAULT "x")',
        {
          dialect: 'mysql',
        },
      );

      expect(result).toBeInstanceOf(CreateExpr);
    });
  });

  // FIXME: not in upstream sqlglot
  // MySQL: STORAGE {DISK | MEMORY | DEFAULT}
  describe('STORAGE column attribute', () => {
    test('STORAGE DISK', () => {
      const result = parseOne(
        'CREATE TABLE t (col INT STORAGE DISK)',
        {
          dialect: 'mysql',
        },
      );

      expect(result).toBeInstanceOf(CreateExpr);
    });

    test('STORAGE MEMORY', () => {
      const result = parseOne(
        'CREATE TABLE t (col INT STORAGE MEMORY)',
        {
          dialect: 'mysql',
        },
      );

      expect(result).toBeInstanceOf(CreateExpr);
    });

    test('STORAGE DEFAULT', () => {
      const result = parseOne(
        'CREATE TABLE t (col INT STORAGE DEFAULT)',
        {
          dialect: 'mysql',
        },
      );

      expect(result).toBeInstanceOf(CreateExpr);
    });
  });

  // FIXME: upstream sqlglot doesn't handle CREATE TYPE AS ENUM in MySQL
  // Remove these tests if sqlglot adds support upstream
  describe('CREATE TYPE AS ENUM (MySQL)', () => {
    test('basic enum type', () => {
      const result = parseOne('CREATE TYPE mood AS ENUM (\'happy\', \'sad\')', {
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

  // FIXME: upstream sqlglot doesn't handle USING after column list in CREATE INDEX
  // Remove these tests if sqlglot adds support upstream
  describe('CREATE INDEX ... (cols) USING BTREE/HASH', () => {
    test('USING BTREE after columns', () => {
      const result = parseOne('CREATE INDEX idx ON t (a) USING BTREE', {
        dialect: 'mysql',
      });

      expect(result).toBeInstanceOf(CreateExpr);
      expect(result).not.toBeInstanceOf(CommandExpr);
    });

    test('USING HASH after columns', () => {
      const result = parseOne('CREATE INDEX idx ON t (a) USING HASH', {
        dialect: 'mysql',
      });

      expect(result).toBeInstanceOf(CreateExpr);
      expect(result).not.toBeInstanceOf(CommandExpr);
    });

    test('UNIQUE INDEX with USING after columns', () => {
      const result = parseOne('CREATE UNIQUE INDEX idx ON t (a) USING BTREE', {
        dialect: 'mysql',
      });

      expect(result).toBeInstanceOf(CreateExpr);
      expect(result).not.toBeInstanceOf(CommandExpr);
    });

    test('USING before columns still works', () => {
      const result = parseOne('CREATE INDEX idx ON t USING BTREE (a)', {
        dialect: 'mysql',
      });

      expect(result).toBeInstanceOf(CreateExpr);
    });
  });

  // FIXME: upstream sqlglot doesn't handle PRIMARY KEY key_name USING HASH (cols)
  // Remove these tests if sqlglot adds support upstream
  describe('PRIMARY KEY key_name USING HASH (cols)', () => {
    test('CONSTRAINT pk PRIMARY KEY key_name USING HASH (a)', () => {
      const result = parseOne(
        'CREATE TABLE t (a INT, CONSTRAINT pk PRIMARY KEY key_name USING HASH (a))',
        {
          dialect: 'mysql',
        },
      );

      expect(result).toBeInstanceOf(CreateExpr);
      expect(result).not.toBeInstanceOf(CommandExpr);
    });

    test('PRIMARY KEY USING BTREE (a)', () => {
      const result = parseOne(
        'CREATE TABLE t (a INT, PRIMARY KEY USING BTREE (a))',
        {
          dialect: 'mysql',
        },
      );

      expect(result).toBeInstanceOf(CreateExpr);
      expect(result).not.toBeInstanceOf(CommandExpr);
    });

    test('PRIMARY KEY (a) still works', () => {
      const result = parseOne(
        'CREATE TABLE t (a INT, PRIMARY KEY (a))',
        {
          dialect: 'mysql',
        },
      );

      expect(result).toBeInstanceOf(CreateExpr);
    });

    test('inline column PRIMARY KEY still works', () => {
      const result = parseOne(
        'CREATE TABLE t (id INT PRIMARY KEY, name VARCHAR(100))',
        {
          dialect: 'mysql',
        },
      );

      expect(result).toBeInstanceOf(CreateExpr);
    });
  });

  // INDEX / KEY inside CREATE TABLE should parse as IndexColumnConstraintExpr, not ColumnDefExpr
  describe('INDEX inside CREATE TABLE', () => {
    test('INDEX k (id) is IndexColumnConstraintExpr', () => {
      const result = parseOne('CREATE TABLE t (id INT, INDEX k (id))', {
        dialect: 'mysql',
      });

      expect(result).toBeInstanceOf(CreateExpr);
      const schema = (result as CreateExpr).args.this as any;
      const exprs: any[] = schema?.args?.expressions ?? [];
      const indexExpr = exprs.find((e: any) => !(e instanceof ColumnDefExpr));

      expect(indexExpr).toBeInstanceOf(IndexColumnConstraintExpr);
    });

    test('KEY k (id) is IndexColumnConstraintExpr', () => {
      const result = parseOne('CREATE TABLE t (id INT, KEY k (id))', {
        dialect: 'mysql',
      });

      expect(result).toBeInstanceOf(CreateExpr);
      const schema = (result as CreateExpr).args.this as any;
      const exprs: any[] = schema?.args?.expressions ?? [];
      const indexExpr = exprs.find((e: any) => !(e instanceof ColumnDefExpr));

      expect(indexExpr).toBeInstanceOf(IndexColumnConstraintExpr);
    });

    test('expression index INDEX k ((d + 1)) is IndexColumnConstraintExpr', () => {
      const result = parseOne('CREATE TABLE t (d INT, INDEX k ((d + 1)))', {
        dialect: 'mysql',
      });

      expect(result).toBeInstanceOf(CreateExpr);
      const schema = (result as CreateExpr).args.this as any;
      const exprs: any[] = schema?.args?.expressions ?? [];
      const indexExpr = exprs.find((e: any) => !(e instanceof ColumnDefExpr));

      expect(indexExpr).toBeInstanceOf(IndexColumnConstraintExpr);
    });
  });
});
