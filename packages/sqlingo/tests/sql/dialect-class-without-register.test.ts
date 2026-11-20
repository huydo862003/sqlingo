// #58: class-based dialects fail on internal string dialect lookups without Dialect.register()
import {
  describe, test, expect, beforeEach, afterEach,
} from 'vitest';
import {
  parse, parseOne, transpile,
} from '../../src/index';
import {
  Dialect,
} from '../../src/dialects/dialect';
import {
  BigQuery,
} from '../../src/dialects/bigquery';
import {
  Snowflake,
} from '../../src/dialects/snowflake';
import {
  Spark2,
} from '../../src/dialects/spark2';
import {
  Postgres,
} from '../../src/dialects/postgres';

describe('#58: class-based dialects without Dialect.register()', () => {
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

  // BigQuery: UNNEST(GENERATE_TIMESTAMP_ARRAY(...)) triggers annotateTypes
  // which calls DataTypeExpr.build with the dialect
  test('BigQuery UNNEST(GENERATE_TIMESTAMP_ARRAY) parses without register', () => {
    expect(() => {
      parse(
        'SELECT d FROM UNNEST(GENERATE_TIMESTAMP_ARRAY(a, b, INTERVAL 1 HOUR)) AS d',
        {
          dialect: BigQuery,
        },
      );
    }).not.toThrow();
  });

  test('BigQuery GENERATE_DATE_ARRAY parses without register', () => {
    expect(() => {
      parse(
        'SELECT d FROM UNNEST(GENERATE_DATE_ARRAY(a, b, INTERVAL 1 DAY)) AS d',
        {
          dialect: BigQuery,
        },
      );
    }).not.toThrow();
  });

  test('BigQuery GENERATE_TIMESTAMP_ARRAY standalone parses without register', () => {
    expect(() => {
      parse(
        'SELECT GENERATE_TIMESTAMP_ARRAY(a, b, INTERVAL 1 HOUR)',
        {
          dialect: BigQuery,
        },
      );
    }).not.toThrow();
  });

  // BigQuery: TO_CODE_POINTS triggers DataTypeExpr.build('ARRAY<BIGINT>')
  test('BigQuery TO_CODE_POINTS parses without register', () => {
    expect(() => {
      parseOne(
        "SELECT TO_CODE_POINTS('abc') FROM t",
        {
          read: BigQuery,
        },
      );
    }).not.toThrow();
  });

  // BigQuery: JSON_VALUE_ARRAY triggers DataTypeExpr.build('ARRAY<VARCHAR>')
  test('BigQuery JSON_VALUE_ARRAY parses without register', () => {
    expect(() => {
      parseOne(
        'SELECT JSON_VALUE_ARRAY(j) FROM t',
        {
          read: BigQuery,
        },
      );
    }).not.toThrow();
  });

  // Snowflake: HASH_AGG annotator uses DataTypeExpr.build('NUMBER(19, 0)')
  test('Snowflake HASH_AGG parses without register', () => {
    expect(() => {
      parseOne(
        'SELECT HASH_AGG(*) FROM t',
        {
          read: Snowflake,
        },
      );
    }).not.toThrow();
  });

  // Spark2: TO_TIMESTAMP with format triggers buildFormattedTime
  test('Spark2 TO_TIMESTAMP with format parses without register', () => {
    expect(() => {
      parseOne(
        "SELECT TO_TIMESTAMP(s, 'yyyy-MM-dd') FROM t",
        {
          read: Spark2,
        },
      );
    }).not.toThrow();
  });

  // Transpiling from these dialects should also work without registration
  test('BigQuery UNNEST(GENERATE_TIMESTAMP_ARRAY) transpiles to Postgres without register', () => {
    const [sql] = transpile(
      'SELECT d FROM UNNEST(GENERATE_TIMESTAMP_ARRAY(a, b, INTERVAL 1 HOUR)) AS d',
      {
        read: BigQuery,
        write: Postgres,
      },
    );

    expect(sql).toBeTruthy();
    expect(sql).toContain('GENERATE_TIMESTAMP_ARRAY');
  });

  test('Spark2 TO_TIMESTAMP transpiles to Postgres without register', () => {
    const [sql] = transpile(
      "SELECT TO_TIMESTAMP(s, 'yyyy-MM-dd') FROM t",
      {
        read: Spark2,
        write: Postgres,
      },
    );

    expect(sql).toBeTruthy();
    expect(sql).toContain('TO_TIMESTAMP');
  });
});
