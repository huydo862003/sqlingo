// #51: class-based dialects drop format args on date/time functions without Dialect.register()
import {
  describe, test, expect, beforeEach, afterEach,
} from 'vitest';
import {
  transpile,
} from '../../src/index';
import {
  Dialect,
} from '../../src/dialects/dialect';
import {
  MySQL,
} from '../../src/dialects/mysql';
import {
  Postgres,
} from '../../src/dialects/postgres';
import {
  Oracle,
} from '../../src/dialects/oracle';

describe('Class-based dialects without Dialect.register()', () => {
  const saved = new Map<string, typeof Dialect>();

  beforeEach(() => {
    for (const [
      key,
      value,
    ] of Dialect.registry) {
      saved.set(key, value);
    }
    Dialect.registry.clear();
  });

  afterEach(() => {
    Dialect.registry.clear();
    for (const [
      key,
      value,
    ] of saved) {
      Dialect.registry.set(key, value);
    }
    saved.clear();
  });

  // #51: DATE_FORMAT format arg dropped when MySQL not registered
  test('MySQL DATE_FORMAT to Postgres TO_CHAR without register', () => {
    const [sql] = transpile('SELECT DATE_FORMAT(d, \'%Y-%m\') FROM t', {
      read: MySQL,
      write: Postgres,
    });

    expect(sql).toBe('SELECT TO_CHAR(CAST(d AS TIMESTAMP), \'YYYY-MM\') FROM t');
  });

  // #51: TO_CHAR format arg dropped when Postgres not registered
  test('Postgres TO_CHAR to MySQL DATE_FORMAT without register', () => {
    const [sql] = transpile('SELECT TO_CHAR(d, \'YYYY-MM\') FROM t', {
      read: Postgres,
      write: MySQL,
    });

    expect(sql).toBe('SELECT DATE_FORMAT(d, \'%Y-%m\') FROM t');
  });

  // #51: Oracle TO_DATE format arg dropped when Oracle not registered
  test('Oracle TO_DATE to Postgres TO_DATE without register', () => {
    const [sql] = transpile('SELECT TO_DATE(s, \'YYYY-MM-DD\') FROM t', {
      read: Oracle,
      write: Postgres,
    });

    expect(sql).toBe('SELECT TO_DATE(s, \'YYYY-MM-DD\') FROM t');
  });
});
