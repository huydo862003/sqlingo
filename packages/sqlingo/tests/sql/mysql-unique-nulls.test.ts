// #51: MySQL UNIQUE (col) transpiles to UNIQUE (col NULLS FIRST) in Postgres
import {
  describe, test, expect,
} from 'vitest';
import {
  transpile,
} from '../../src/index';
import {
  MySQL,
} from '../../src/dialects/mysql';
import {
  Postgres,
} from '../../src/dialects/postgres';

describe('MySQL UNIQUE constraint should not add NULLS FIRST', () => {
  // #51: MySQL UNIQUE (a, b) to Postgres adds spurious NULLS FIRST
  test('CREATE TABLE with UNIQUE', () => {
    const [sql] = transpile('CREATE TABLE t (a INT, b INT, UNIQUE (a, b))', {
      read: MySQL,
      write: Postgres,
    });

    expect(sql).toBe('CREATE TABLE t (a INT, b INT, UNIQUE (a, b))');
  });

  // #51: ALTER TABLE UNIQUE (a) to Postgres adds spurious NULLS FIRST
  test('ALTER TABLE ADD CONSTRAINT UNIQUE', () => {
    const [sql] = transpile('ALTER TABLE t ADD CONSTRAINT u UNIQUE (a)', {
      read: MySQL,
      write: Postgres,
    });

    expect(sql).toBe('ALTER TABLE t ADD CONSTRAINT u UNIQUE (a)');
  });
});
