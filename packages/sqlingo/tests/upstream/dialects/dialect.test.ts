import {
  describe, test, expect,
} from 'vitest';
import {
  parseOne,
  UnsupportedError,
  ParseError,
  TokenError,
} from '../../../src/index';
import {
  ComputedColumnConstraintExpr,
  OrderedExpr,
  ColumnExpr,
  VarExpr,
} from '../../../src/expressions';
import {
  Validator,
} from './validator';
import {
  Dialect,
} from '../../../src/dialects/dialect';

// Register all dialects used in cross-dialect tests
import { BigQuery } from '../../../src/dialects/bigquery';
import { ClickHouse } from '../../../src/dialects/clickhouse';
import { Databricks } from '../../../src/dialects/databricks';
import { Doris } from '../../../src/dialects/doris';
import { Dremio } from '../../../src/dialects/dremio';
import { Drill } from '../../../src/dialects/drill';
import { DuckDB } from '../../../src/dialects/duckdb';
import { Hive } from '../../../src/dialects/hive';
import { MySQL } from '../../../src/dialects/mysql';
import { Oracle } from '../../../src/dialects/oracle';
import { Postgres } from '../../../src/dialects/postgres';
import { Presto } from '../../../src/dialects/presto';
import { Redshift } from '../../../src/dialects/redshift';
import { Snowflake } from '../../../src/dialects/snowflake';
import { Spark } from '../../../src/dialects/spark';
import { Spark2 } from '../../../src/dialects/spark2';
import { SQLite } from '../../../src/dialects/sqlite';
import { StarRocks } from '../../../src/dialects/starrocks';
import { Teradata } from '../../../src/dialects/teradata';
import { Trino } from '../../../src/dialects/trino';
import { TSQL } from '../../../src/dialects/tsql';

Dialect.register(
  BigQuery, ClickHouse, Databricks, Doris, Dremio, Drill, DuckDB, Hive,
  MySQL, Oracle, Postgres, Presto, Redshift, Snowflake, Spark, Spark2,
  SQLite, StarRocks, Teradata, Trino, TSQL,
);

class TestDialect extends Validator {
  // No dialect set; uses the default base dialect

  testCast () {
    this.validateAll(
      'CAST(a AS TEXT)',
      {
        write: {
          bigquery: 'CAST(a AS STRING)',
          clickhouse: 'CAST(a AS Nullable(String))',
          drill: 'CAST(a AS VARCHAR)',
          duckdb: 'CAST(a AS TEXT)',
          materialize: 'CAST(a AS TEXT)',
          mysql: 'CAST(a AS CHAR)',
          hive: 'CAST(a AS STRING)',
          oracle: 'CAST(a AS CLOB)',
          postgres: 'CAST(a AS TEXT)',
          presto: 'CAST(a AS VARCHAR)',
          redshift: 'CAST(a AS VARCHAR(MAX))',
          snowflake: 'CAST(a AS VARCHAR)',
          spark: 'CAST(a AS STRING)',
          starrocks: 'CAST(a AS STRING)',
          tsql: 'CAST(a AS VARCHAR(MAX))',
          doris: 'CAST(a AS STRING)',
        },
      },
    );
    this.validateAll(
      'CAST(a AS BINARY(4))',
      {
        write: {
          bigquery: 'CAST(a AS BYTES)',
          clickhouse: 'CAST(a AS Nullable(BINARY(4)))',
          drill: 'CAST(a AS VARBINARY(4))',
          duckdb: 'CAST(a AS BLOB(4))',
          materialize: 'CAST(a AS BYTEA(4))',
          mysql: 'CAST(a AS BINARY(4))',
          hive: 'CAST(a AS BINARY(4))',
          oracle: 'CAST(a AS BLOB(4))',
          postgres: 'CAST(a AS BYTEA(4))',
          presto: 'CAST(a AS VARBINARY(4))',
          redshift: 'CAST(a AS VARBYTE(4))',
          snowflake: 'CAST(a AS BINARY(4))',
          sqlite: 'CAST(a AS BLOB(4))',
          spark: 'CAST(a AS BINARY(4))',
          starrocks: 'CAST(a AS BINARY(4))',
        },
      },
    );
    this.validateAll(
      'CAST(a AS VARBINARY(4))',
      {
        write: {
          bigquery: 'CAST(a AS BYTES)',
          clickhouse: 'CAST(a AS Nullable(String))',
          duckdb: 'CAST(a AS BLOB(4))',
          materialize: 'CAST(a AS BYTEA(4))',
          mysql: 'CAST(a AS VARBINARY(4))',
          hive: 'CAST(a AS BINARY(4))',
          oracle: 'CAST(a AS BLOB(4))',
          postgres: 'CAST(a AS BYTEA(4))',
          presto: 'CAST(a AS VARBINARY(4))',
          redshift: 'CAST(a AS VARBYTE(4))',
          snowflake: 'CAST(a AS VARBINARY(4))',
          sqlite: 'CAST(a AS BLOB(4))',
          spark: 'CAST(a AS BINARY(4))',
          starrocks: 'CAST(a AS VARBINARY(4))',
        },
      },
    );
    this.validateAll(
      "CAST(MAP('a', '1') AS MAP(TEXT, TEXT))",
      {
        write: {
          clickhouse: "CAST(map('a', '1') AS Map(String, Nullable(String)))",
        },
      },
    );
    this.validateAll(
      'CAST(ARRAY(1, 2) AS ARRAY<TINYINT>)',
      {
        write: {
          clickhouse: 'CAST([1, 2] AS Array(Nullable(Int8)))',
        },
      },
    );
    this.validateAll(
      'CAST((1, 2, 3, 4) AS STRUCT<a: TINYINT, b: SMALLINT, c: INT, d: BIGINT>)',
      {
        write: {
          clickhouse: 'CAST((1, 2, 3, 4) AS Tuple(a Nullable(Int8), b Nullable(Int16), c Nullable(Int32), d Nullable(Int64)))',
        },
      },
    );
    this.validateAll(
      'SELECT ARRAY_DISTINCT(x)',
      {
        write: {
          clickhouse: 'SELECT arrayDistinct(x)',
        },
      },
    );
    this.validateAll(
      'CAST(a AS DATETIME)',
      {
        write: {
          postgres: 'CAST(a AS TIMESTAMP)',
          sqlite: 'CAST(a AS DATETIME)',
        },
      },
    );
    this.validateAll(
      'CAST(a AS STRING)',
      {
        write: {
          bigquery: 'CAST(a AS STRING)',
          drill: 'CAST(a AS VARCHAR)',
          duckdb: 'CAST(a AS TEXT)',
          materialize: 'CAST(a AS TEXT)',
          mysql: 'CAST(a AS CHAR)',
          hive: 'CAST(a AS STRING)',
          oracle: 'CAST(a AS CLOB)',
          postgres: 'CAST(a AS TEXT)',
          presto: 'CAST(a AS VARCHAR)',
          redshift: 'CAST(a AS VARCHAR(MAX))',
          snowflake: 'CAST(a AS VARCHAR)',
          spark: 'CAST(a AS STRING)',
          starrocks: 'CAST(a AS STRING)',
          tsql: 'CAST(a AS VARCHAR(MAX))',
          doris: 'CAST(a AS STRING)',
        },
      },
    );
    this.validateAll(
      'CAST(a AS VARCHAR)',
      {
        write: {
          bigquery: 'CAST(a AS STRING)',
          drill: 'CAST(a AS VARCHAR)',
          duckdb: 'CAST(a AS TEXT)',
          materialize: 'CAST(a AS VARCHAR)',
          mysql: 'CAST(a AS CHAR)',
          hive: 'CAST(a AS STRING)',
          oracle: 'CAST(a AS VARCHAR2)',
          postgres: 'CAST(a AS VARCHAR)',
          presto: 'CAST(a AS VARCHAR)',
          redshift: 'CAST(a AS VARCHAR)',
          snowflake: 'CAST(a AS VARCHAR)',
          spark: 'CAST(a AS STRING)',
          starrocks: 'CAST(a AS VARCHAR)',
          tsql: 'CAST(a AS VARCHAR)',
          doris: 'CAST(a AS VARCHAR)',
        },
      },
    );
    this.validateAll(
      'CAST(a AS VARCHAR(3))',
      {
        write: {
          bigquery: 'CAST(a AS STRING)',
          drill: 'CAST(a AS VARCHAR(3))',
          duckdb: 'CAST(a AS TEXT(3))',
          materialize: 'CAST(a AS VARCHAR(3))',
          mysql: 'CAST(a AS CHAR(3))',
          hive: 'CAST(a AS VARCHAR(3))',
          oracle: 'CAST(a AS VARCHAR2(3))',
          postgres: 'CAST(a AS VARCHAR(3))',
          presto: 'CAST(a AS VARCHAR(3))',
          redshift: 'CAST(a AS VARCHAR(3))',
          snowflake: 'CAST(a AS VARCHAR(3))',
          spark: 'CAST(a AS VARCHAR(3))',
          starrocks: 'CAST(a AS VARCHAR(3))',
          tsql: 'CAST(a AS VARCHAR(3))',
          doris: 'CAST(a AS VARCHAR(3))',
        },
      },
    );
    this.validateAll(
      'CAST(a AS CHARACTER VARYING)',
      {
        write: {
          bigquery: 'CAST(a AS STRING)',
          drill: 'CAST(a AS VARCHAR)',
          duckdb: 'CAST(a AS TEXT)',
          materialize: 'CAST(a AS VARCHAR)',
          mysql: 'CAST(a AS CHAR)',
          hive: 'CAST(a AS STRING)',
          oracle: 'CAST(a AS VARCHAR2)',
          postgres: 'CAST(a AS VARCHAR)',
          presto: 'CAST(a AS VARCHAR)',
          redshift: 'CAST(a AS VARCHAR)',
          snowflake: 'CAST(a AS VARCHAR)',
          spark: 'CAST(a AS STRING)',
          starrocks: 'CAST(a AS VARCHAR)',
          tsql: 'CAST(a AS VARCHAR)',
          doris: 'CAST(a AS VARCHAR)',
        },
      },
    );
    this.validateAll(
      'CAST(a AS CHARACTER VARYING(3))',
      {
        write: {
          bigquery: 'CAST(a AS STRING)',
          drill: 'CAST(a AS VARCHAR(3))',
          duckdb: 'CAST(a AS TEXT(3))',
          materialize: 'CAST(a AS VARCHAR(3))',
          mysql: 'CAST(a AS CHAR(3))',
          hive: 'CAST(a AS VARCHAR(3))',
          oracle: 'CAST(a AS VARCHAR2(3))',
          postgres: 'CAST(a AS VARCHAR(3))',
          presto: 'CAST(a AS VARCHAR(3))',
          redshift: 'CAST(a AS VARCHAR(3))',
          snowflake: 'CAST(a AS VARCHAR(3))',
          spark: 'CAST(a AS VARCHAR(3))',
          starrocks: 'CAST(a AS VARCHAR(3))',
          tsql: 'CAST(a AS VARCHAR(3))',
          doris: 'CAST(a AS VARCHAR(3))',
        },
      },
    );
    this.validateAll(
      'CAST(a AS SMALLINT)',
      {
        write: {
          bigquery: 'CAST(a AS INT64)',
          drill: 'CAST(a AS INTEGER)',
          duckdb: 'CAST(a AS SMALLINT)',
          materialize: 'CAST(a AS SMALLINT)',
          mysql: 'CAST(a AS SIGNED)',
          hive: 'CAST(a AS SMALLINT)',
          oracle: 'CAST(a AS SMALLINT)',
          postgres: 'CAST(a AS SMALLINT)',
          presto: 'CAST(a AS SMALLINT)',
          redshift: 'CAST(a AS SMALLINT)',
          snowflake: 'CAST(a AS SMALLINT)',
          spark: 'CAST(a AS SMALLINT)',
          sqlite: 'CAST(a AS INTEGER)',
          starrocks: 'CAST(a AS SMALLINT)',
          doris: 'CAST(a AS SMALLINT)',
        },
      },
    );
    this.validateAll(
      'CAST(a AS DOUBLE)',
      {
        read: {
          postgres: 'CAST(a AS DOUBLE PRECISION)',
          redshift: 'CAST(a AS DOUBLE PRECISION)',
        },
        write: {
          bigquery: 'CAST(a AS FLOAT64)',
          clickhouse: 'CAST(a AS Nullable(Float64))',
          doris: 'CAST(a AS DOUBLE)',
          drill: 'CAST(a AS DOUBLE)',
          duckdb: 'CAST(a AS DOUBLE)',
          materialize: 'CAST(a AS DOUBLE PRECISION)',
          mysql: 'CAST(a AS DOUBLE)',
          hive: 'CAST(a AS DOUBLE)',
          oracle: 'CAST(a AS DOUBLE PRECISION)',
          postgres: 'CAST(a AS DOUBLE PRECISION)',
          presto: 'CAST(a AS DOUBLE)',
          redshift: 'CAST(a AS DOUBLE PRECISION)',
          snowflake: 'CAST(a AS DOUBLE)',
          spark: 'CAST(a AS DOUBLE)',
          starrocks: 'CAST(a AS DOUBLE)',
        },
      },
    );
    this.validateAll(
      "CAST('1 DAY' AS INTERVAL)",
      {
        write: {
          postgres: "CAST('1 DAY' AS INTERVAL)",
          redshift: "CAST('1 DAY' AS INTERVAL)",
        },
      },
    );
    this.validateAll(
      'CAST(a AS TIMESTAMP)',
      {
        write: {
          starrocks: 'CAST(a AS DATETIME)',
          redshift: 'CAST(a AS TIMESTAMP)',
          doris: 'CAST(a AS DATETIME)',
          mysql: 'CAST(a AS DATETIME)',
        },
      },
    );
    this.validateAll(
      'CAST(a AS TIMESTAMPTZ)',
      {
        write: {
          starrocks: 'TIMESTAMP(a)',
          redshift: 'CAST(a AS TIMESTAMP WITH TIME ZONE)',
          doris: 'CAST(a AS DATETIME)',
          mysql: 'TIMESTAMP(a)',
        },
      },
    );
    this.validateAll('CAST(a AS TINYINT)', { write: { oracle: 'CAST(a AS SMALLINT)' } });
    this.validateAll('CAST(a AS SMALLINT)', { write: { oracle: 'CAST(a AS SMALLINT)' } });
    this.validateAll('CAST(a AS BIGINT)', { write: { oracle: 'CAST(a AS INT)' } });
    this.validateAll('CAST(a AS INT)', { write: { oracle: 'CAST(a AS INT)' } });
    this.validateAll(
      'CAST(a AS DECIMAL)',
      {
        read: { oracle: 'CAST(a AS NUMBER)' },
        write: { oracle: 'CAST(a AS NUMBER)' },
      },
    );
    this.validateAll(
      "CAST('127.0.0.1/32' AS INET)",
      {
        read: { postgres: "INET '127.0.0.1/32'" },
      },
    );
    expect(
      this.validateIdentity('CREATE TABLE foo (bar INT AS (foo))').find(
        ComputedColumnConstraintExpr,
      ),
    ).toBeTruthy();
    expect(
      this.validateIdentity(
        'CREATE TABLE foo (t1 INT, t2 INT, bar INT AS (t1 * t2 * 2))',
      ).find(ComputedColumnConstraintExpr),
    ).toBeTruthy();
  }

  testDdl () {
    this.validateAll(
      'CREATE TABLE a LIKE b',
      {
        write: {
          '': 'CREATE TABLE a LIKE b',
          bigquery: 'CREATE TABLE a LIKE b',
          clickhouse: 'CREATE TABLE a AS b',
          databricks: 'CREATE TABLE a LIKE b',
          doris: 'CREATE TABLE a LIKE b',
          drill: 'CREATE TABLE a AS SELECT * FROM b LIMIT 0',
          duckdb: 'CREATE TABLE a AS SELECT * FROM b LIMIT 0',
          hive: 'CREATE TABLE a LIKE b',
          mysql: 'CREATE TABLE a LIKE b',
          oracle: 'CREATE TABLE a LIKE b',
          postgres: 'CREATE TABLE a (LIKE b)',
          presto: 'CREATE TABLE a (LIKE b)',
          redshift: 'CREATE TABLE a (LIKE b)',
          snowflake: 'CREATE TABLE a LIKE b',
          spark: 'CREATE TABLE a LIKE b',
          sqlite: 'CREATE TABLE a AS SELECT * FROM b LIMIT 0',
          trino: 'CREATE TABLE a (LIKE b)',
          tsql: 'SELECT TOP 0 * INTO a FROM b AS temp',
        },
      },
    );
  }

  testHeredocStrings () {
    for (const dialect of ['clickhouse', 'postgres', 'redshift'] as const) {
      // Invalid matching tag
      expect(() => parseOne("SELECT $tag1$invalid heredoc string$tag2$", { read: dialect })).toThrow();

      // Unmatched tag
      expect(() => parseOne("SELECT $tag1$invalid heredoc string", { read: dialect })).toThrow();

      // Without tag
      this.validateAll(
        "SELECT 'this is a heredoc string'",
        { read: { [dialect]: 'SELECT $$this is a heredoc string$$' } },
      );
      this.validateAll(
        "SELECT ''",
        { read: { [dialect]: 'SELECT $$$$' } },
      );

      // With tag
      this.validateAll(
        "SELECT 'this is also a heredoc string'",
        { read: { [dialect]: 'SELECT $foo$this is also a heredoc string$foo$' } },
      );
      this.validateAll(
        "SELECT ''",
        { read: { [dialect]: 'SELECT $foo$$foo$' } },
      );
    }
  }

  testDecode () {
    this.validateIdentity('DECODE(bin, charset)');

    this.validateAll(
      "SELECT DECODE(a, 1, 'one')",
      {
        write: {
          '': "SELECT DECODE(a, 1, 'one')",
          duckdb: "SELECT CASE WHEN a = 1 THEN 'one' END",
          oracle: "SELECT DECODE(a, 1, 'one')",
          redshift: "SELECT DECODE(a, 1, 'one')",
          snowflake: "SELECT DECODE(a, 1, 'one')",
          spark: "SELECT DECODE(a, 1, 'one')",
        },
      },
    );
    this.validateAll(
      "SELECT DECODE(a, 1, 'one', 'default')",
      {
        write: {
          '': "SELECT DECODE(a, 1, 'one', 'default')",
          duckdb: "SELECT CASE WHEN a = 1 THEN 'one' ELSE 'default' END",
          oracle: "SELECT DECODE(a, 1, 'one', 'default')",
          redshift: "SELECT DECODE(a, 1, 'one', 'default')",
          snowflake: "SELECT DECODE(a, 1, 'one', 'default')",
          spark: "SELECT DECODE(a, 1, 'one', 'default')",
        },
      },
    );
    this.validateAll(
      "SELECT DECODE(a, NULL, 'null')",
      {
        write: {
          '': "SELECT DECODE(a, NULL, 'null')",
          duckdb: "SELECT CASE WHEN a IS NULL THEN 'null' END",
          oracle: "SELECT DECODE(a, NULL, 'null')",
          redshift: "SELECT DECODE(a, NULL, 'null')",
          snowflake: "SELECT DECODE(a, NULL, 'null')",
          spark: "SELECT DECODE(a, NULL, 'null')",
        },
      },
    );
    this.validateAll(
      'SELECT DECODE(a, b, c)',
      {
        write: {
          '': 'SELECT DECODE(a, b, c)',
          duckdb: 'SELECT CASE WHEN a = b OR (a IS NULL AND b IS NULL) THEN c END',
          oracle: 'SELECT DECODE(a, b, c)',
          redshift: 'SELECT DECODE(a, b, c)',
          snowflake: 'SELECT DECODE(a, b, c)',
          spark: 'SELECT DECODE(a, b, c)',
        },
      },
    );
    this.validateAll(
      "SELECT DECODE(tbl.col, 'some_string', 'foo')",
      {
        write: {
          '': "SELECT DECODE(tbl.col, 'some_string', 'foo')",
          duckdb: "SELECT CASE WHEN tbl.col = 'some_string' THEN 'foo' END",
          oracle: "SELECT DECODE(tbl.col, 'some_string', 'foo')",
          redshift: "SELECT DECODE(tbl.col, 'some_string', 'foo')",
          snowflake: "SELECT DECODE(tbl.col, 'some_string', 'foo')",
          spark: "SELECT DECODE(tbl.col, 'some_string', 'foo')",
        },
      },
    );
  }

  testToBinary () {
    this.validateAll(
      "TO_BINARY('1C')",
      {
        read: {
          '': "TO_BINARY('1C')",
          snowflake: "TO_BINARY('1C')",
          starrocks: "TO_BINARY('1C')",
          duckdb: "TO_BINARY('1C')",
          spark: "TO_BINARY('1C')",
          databricks: "TO_BINARY('1C')",
        },
        write: {
          snowflake: "TO_BINARY('1C')",
          starrocks: "TO_BINARY('1C')",
          duckdb: "TO_BINARY('1C')",
          spark: "TO_BINARY('1C')",
          databricks: "TO_BINARY('1C')",
        },
      },
    );
    this.validateAll(
      "TO_BINARY('1C', 'HEX')",
      {
        read: {
          '': "TO_BINARY('1C', 'HEX')",
          snowflake: "TO_BINARY('1C', 'HEX')",
          starrocks: "TO_BINARY('1C', 'HEX')",
          spark: "TO_BINARY('1C', 'HEX')",
          databricks: "TO_BINARY('1C', 'HEX')",
        },
        write: {
          snowflake: "TO_BINARY('1C', 'HEX')",
          starrocks: "TO_BINARY('1C', 'HEX')",
          spark: "TO_BINARY('1C', 'HEX')",
          databricks: "TO_BINARY('1C', 'HEX')",
        },
      },
    );
  }

  testIfNull () {
    this.validateAll(
      'SELECT IFNULL(1, NULL) FROM foo',
      {
        write: {
          '': 'SELECT COALESCE(1, NULL) FROM foo',
          redshift: 'SELECT COALESCE(1, NULL) FROM foo',
          postgres: 'SELECT COALESCE(1, NULL) FROM foo',
          mysql: 'SELECT COALESCE(1, NULL) FROM foo',
          duckdb: 'SELECT COALESCE(1, NULL) FROM foo',
          spark: 'SELECT COALESCE(1, NULL) FROM foo',
          bigquery: 'SELECT COALESCE(1, NULL) FROM foo',
          presto: 'SELECT COALESCE(1, NULL) FROM foo',
        },
      },
    );
  }

  testIsAscii () {
    this.validateAll(
      'SELECT IS_ASCII(x)',
      {
        write: {
          '': 'SELECT IS_ASCII(x)',
          sqlite: "SELECT (NOT x GLOB CAST(x'2a5b5e012d7f5d2a' AS TEXT))",
          mysql: "SELECT REGEXP_LIKE(x, '^[[:ascii:]]*$')",
          postgres: "SELECT (x ~ '^[[:ascii:]]*$')",
          tsql: "SELECT (PATINDEX(CONVERT(VARCHAR(MAX), 0x255b5e002d7f5d25) COLLATE Latin1_General_BIN, x) = 0)",
          oracle: "SELECT NVL(REGEXP_LIKE(x, '^[' || CHR(1) || '-' || CHR(127) || ']*$'), TRUE)",
        },
      },
    );
  }

  testNvl2 () {
    this.validateAll(
      'SELECT NVL2(a, b, c)',
      {
        write: {
          '': 'SELECT NVL2(a, b, c)',
          bigquery: 'SELECT CASE WHEN NOT a IS NULL THEN b ELSE c END',
          clickhouse: 'SELECT CASE WHEN NOT (a IS NULL) THEN b ELSE c END',
          databricks: 'SELECT NVL2(a, b, c)',
          doris: 'SELECT CASE WHEN NOT a IS NULL THEN b ELSE c END',
          dremio: 'SELECT CASE WHEN NOT a IS NULL THEN b ELSE c END',
          drill: 'SELECT CASE WHEN NOT a IS NULL THEN b ELSE c END',
          duckdb: 'SELECT CASE WHEN NOT a IS NULL THEN b ELSE c END',
          hive: 'SELECT CASE WHEN NOT a IS NULL THEN b ELSE c END',
          mysql: 'SELECT CASE WHEN NOT a IS NULL THEN b ELSE c END',
          oracle: 'SELECT NVL2(a, b, c)',
          postgres: 'SELECT CASE WHEN NOT a IS NULL THEN b ELSE c END',
          presto: 'SELECT CASE WHEN NOT a IS NULL THEN b ELSE c END',
          redshift: 'SELECT NVL2(a, b, c)',
          snowflake: 'SELECT NVL2(a, b, c)',
          spark: 'SELECT NVL2(a, b, c)',
          spark2: 'SELECT NVL2(a, b, c)',
          sqlite: 'SELECT CASE WHEN NOT a IS NULL THEN b ELSE c END',
          starrocks: 'SELECT CASE WHEN NOT a IS NULL THEN b ELSE c END',
          teradata: 'SELECT NVL2(a, b, c)',
          trino: 'SELECT CASE WHEN NOT a IS NULL THEN b ELSE c END',
          tsql: 'SELECT CASE WHEN NOT a IS NULL THEN b ELSE c END',
        },
      },
    );
    this.validateAll(
      'SELECT NVL2(a, b)',
      {
        write: {
          '': 'SELECT NVL2(a, b)',
          bigquery: 'SELECT CASE WHEN NOT a IS NULL THEN b END',
          clickhouse: 'SELECT CASE WHEN NOT (a IS NULL) THEN b END',
          databricks: 'SELECT NVL2(a, b)',
          doris: 'SELECT CASE WHEN NOT a IS NULL THEN b END',
          dremio: 'SELECT CASE WHEN NOT a IS NULL THEN b END',
          drill: 'SELECT CASE WHEN NOT a IS NULL THEN b END',
          duckdb: 'SELECT CASE WHEN NOT a IS NULL THEN b END',
          hive: 'SELECT CASE WHEN NOT a IS NULL THEN b END',
          mysql: 'SELECT CASE WHEN NOT a IS NULL THEN b END',
          oracle: 'SELECT NVL2(a, b)',
          postgres: 'SELECT CASE WHEN NOT a IS NULL THEN b END',
          presto: 'SELECT CASE WHEN NOT a IS NULL THEN b END',
          redshift: 'SELECT NVL2(a, b)',
          snowflake: 'SELECT NVL2(a, b)',
          spark: 'SELECT NVL2(a, b)',
          spark2: 'SELECT NVL2(a, b)',
          sqlite: 'SELECT CASE WHEN NOT a IS NULL THEN b END',
          starrocks: 'SELECT CASE WHEN NOT a IS NULL THEN b END',
          teradata: 'SELECT NVL2(a, b)',
          trino: 'SELECT CASE WHEN NOT a IS NULL THEN b END',
          tsql: 'SELECT CASE WHEN NOT a IS NULL THEN b END',
        },
      },
    );
  }

  testTime () {
    this.validateAll(
      "STR_TO_TIME(x, '%Y-%m-%dT%H:%M:%S')",
      {
        read: {
          duckdb: "STRPTIME(x, '%Y-%m-%dT%H:%M:%S')",
        },
        write: {
          mysql: "STR_TO_DATE(x, '%Y-%m-%dT%T')",
          duckdb: "STRPTIME(x, '%Y-%m-%dT%H:%M:%S')",
          hive: "CAST(FROM_UNIXTIME(UNIX_TIMESTAMP(x, 'yyyy-MM-ddTHH:mm:ss')) AS TIMESTAMP)",
          presto: "DATE_PARSE(x, '%Y-%m-%dT%T')",
          drill: "TO_TIMESTAMP(x, 'yyyy-MM-dd''T''HH:mm:ss')",
          redshift: "TO_TIMESTAMP(x, 'YYYY-MM-DDTHH24:MI:SS')",
          spark: "TO_TIMESTAMP(x, 'yyyy-MM-ddTHH:mm:ss')",
        },
      },
    );
    this.validateAll(
      "STR_TO_TIME('2020-01-01', '%Y-%m-%d')",
      {
        write: {
          drill: "TO_TIMESTAMP('2020-01-01', 'yyyy-MM-dd')",
          duckdb: "STRPTIME('2020-01-01', '%Y-%m-%d')",
          hive: "CAST('2020-01-01' AS TIMESTAMP)",
          oracle: "TO_TIMESTAMP('2020-01-01', 'YYYY-MM-DD')",
          postgres: "TO_TIMESTAMP('2020-01-01', 'YYYY-MM-DD')",
          presto: "DATE_PARSE('2020-01-01', '%Y-%m-%d')",
          redshift: "TO_TIMESTAMP('2020-01-01', 'YYYY-MM-DD')",
          spark: "TO_TIMESTAMP('2020-01-01', 'yyyy-MM-dd')",
        },
      },
    );
    this.validateAll(
      "STR_TO_TIME(x, '%y')",
      {
        write: {
          drill: "TO_TIMESTAMP(x, 'yy')",
          duckdb: "STRPTIME(x, '%y')",
          hive: "CAST(FROM_UNIXTIME(UNIX_TIMESTAMP(x, 'yy')) AS TIMESTAMP)",
          materialize: "TO_TIMESTAMP(x, 'YY')",
          presto: "DATE_PARSE(x, '%y')",
          oracle: "TO_TIMESTAMP(x, 'YY')",
          postgres: "TO_TIMESTAMP(x, 'YY')",
          redshift: "TO_TIMESTAMP(x, 'YY')",
          spark: "TO_TIMESTAMP(x, 'yy')",
        },
      },
    );
    this.validateAll(
      "STR_TO_UNIX('2020-01-01', '%Y-%m-%d')",
      {
        write: {
          duckdb: "EPOCH(STRPTIME('2020-01-01', '%Y-%m-%d'))",
          hive: "UNIX_TIMESTAMP('2020-01-01', 'yyyy-MM-dd')",
          presto: "TO_UNIXTIME(COALESCE(TRY(DATE_PARSE(CAST('2020-01-01' AS VARCHAR), '%Y-%m-%d')), PARSE_DATETIME(DATE_FORMAT(CAST('2020-01-01' AS TIMESTAMP), '%Y-%m-%d'), 'yyyy-MM-dd')))",
          starrocks: "UNIX_TIMESTAMP('2020-01-01', '%Y-%m-%d')",
          doris: "UNIX_TIMESTAMP('2020-01-01', '%Y-%m-%d')",
        },
      },
    );
    this.validateAll(
      "TIME_STR_TO_DATE('2020-01-01')",
      {
        write: {
          drill: "CAST('2020-01-01' AS DATE)",
          duckdb: "CAST('2020-01-01' AS DATE)",
          hive: "TO_DATE('2020-01-01')",
          presto: "CAST('2020-01-01' AS TIMESTAMP)",
          starrocks: "TO_DATE('2020-01-01')",
          doris: "TO_DATE('2020-01-01')",
        },
      },
    );
    this.validateAll(
      "TIME_STR_TO_TIME('2020-01-01')",
      {
        write: {
          bigquery: "CAST('2020-01-01' AS DATETIME)",
          databricks: "CAST('2020-01-01' AS TIMESTAMP)",
          duckdb: "CAST('2020-01-01' AS TIMESTAMP)",
          tsql: "CAST('2020-01-01' AS DATETIME2)",
          mysql: "CAST('2020-01-01' AS DATETIME)",
          postgres: "CAST('2020-01-01' AS TIMESTAMP)",
          redshift: "CAST('2020-01-01' AS TIMESTAMP)",
          snowflake: "CAST('2020-01-01' AS TIMESTAMP)",
          spark: "CAST('2020-01-01' AS TIMESTAMP)",
          trino: "CAST('2020-01-01' AS TIMESTAMP)",
          clickhouse: "CAST('2020-01-01' AS DateTime64(6))",
          drill: "CAST('2020-01-01' AS TIMESTAMP)",
          hive: "CAST('2020-01-01' AS TIMESTAMP)",
          presto: "CAST('2020-01-01' AS TIMESTAMP)",
          sqlite: "'2020-01-01'",
          doris: "CAST('2020-01-01' AS DATETIME)",
        },
      },
    );
    this.validateAll(
      "TIME_STR_TO_TIME('2020-01-01 12:13:14.123456+00:00')",
      {
        write: {
          mysql: "CAST('2020-01-01 12:13:14.123456+00:00' AS DATETIME(6))",
          trino: "CAST('2020-01-01 12:13:14.123456+00:00' AS TIMESTAMP(6))",
          presto: "CAST('2020-01-01 12:13:14.123456+00:00' AS TIMESTAMP)",
        },
      },
    );
    this.validateAll(
      "TIME_STR_TO_TIME('2020-01-01 12:13:14.123-08:00', 'America/Los_Angeles')",
      {
        write: {
          mysql: "TIMESTAMP('2020-01-01 12:13:14.123-08:00')",
          trino: "CAST('2020-01-01 12:13:14.123-08:00' AS TIMESTAMP(3) WITH TIME ZONE)",
          presto: "CAST('2020-01-01 12:13:14.123-08:00' AS TIMESTAMP WITH TIME ZONE)",
        },
      },
    );
    this.validateAll(
      "TIME_STR_TO_TIME('2020-01-01 12:13:14-08:00', 'America/Los_Angeles')",
      {
        write: {
          bigquery: "CAST('2020-01-01 12:13:14-08:00' AS TIMESTAMP)",
          databricks: "CAST('2020-01-01 12:13:14-08:00' AS TIMESTAMP)",
          duckdb: "CAST('2020-01-01 12:13:14-08:00' AS TIMESTAMPTZ)",
          tsql: "CAST('2020-01-01 12:13:14-08:00' AS DATETIMEOFFSET) AT TIME ZONE 'UTC'",
          mysql: "TIMESTAMP('2020-01-01 12:13:14-08:00')",
          postgres: "CAST('2020-01-01 12:13:14-08:00' AS TIMESTAMPTZ)",
          redshift: "CAST('2020-01-01 12:13:14-08:00' AS TIMESTAMP WITH TIME ZONE)",
          snowflake: "CAST('2020-01-01 12:13:14-08:00' AS TIMESTAMPTZ)",
          spark: "CAST('2020-01-01 12:13:14-08:00' AS TIMESTAMP)",
          trino: "CAST('2020-01-01 12:13:14-08:00' AS TIMESTAMP WITH TIME ZONE)",
          clickhouse: "CAST('2020-01-01 12:13:14' AS DateTime64(6, 'America/Los_Angeles'))",
          drill: "CAST('2020-01-01 12:13:14-08:00' AS TIMESTAMP)",
          hive: "CAST('2020-01-01 12:13:14-08:00' AS TIMESTAMP)",
          presto: "CAST('2020-01-01 12:13:14-08:00' AS TIMESTAMP WITH TIME ZONE)",
          sqlite: "'2020-01-01 12:13:14-08:00'",
          doris: "CAST('2020-01-01 12:13:14-08:00' AS DATETIME)",
        },
      },
    );
    this.validateAll(
      "TIME_STR_TO_TIME(col, 'America/Los_Angeles')",
      {
        write: {
          bigquery: 'CAST(col AS TIMESTAMP)',
          databricks: 'CAST(col AS TIMESTAMP)',
          duckdb: 'CAST(col AS TIMESTAMPTZ)',
          tsql: "CAST(col AS DATETIMEOFFSET) AT TIME ZONE 'UTC'",
          mysql: 'TIMESTAMP(col)',
          postgres: 'CAST(col AS TIMESTAMPTZ)',
          redshift: 'CAST(col AS TIMESTAMP WITH TIME ZONE)',
          snowflake: 'CAST(col AS TIMESTAMPTZ)',
          spark: 'CAST(col AS TIMESTAMP)',
          trino: 'CAST(col AS TIMESTAMP WITH TIME ZONE)',
          clickhouse: "CAST(col AS DateTime64(6, 'America/Los_Angeles'))",
          drill: 'CAST(col AS TIMESTAMP)',
          hive: 'CAST(col AS TIMESTAMP)',
          presto: 'CAST(col AS TIMESTAMP WITH TIME ZONE)',
          sqlite: 'col',
          doris: 'CAST(col AS DATETIME)',
        },
      },
    );
    this.validateAll(
      "TIME_STR_TO_UNIX('2020-01-01')",
      {
        write: {
          duckdb: "EPOCH(CAST('2020-01-01' AS TIMESTAMP))",
          hive: "UNIX_TIMESTAMP('2020-01-01')",
          mysql: "UNIX_TIMESTAMP('2020-01-01')",
          presto: "TO_UNIXTIME(DATE_PARSE('2020-01-01', '%Y-%m-%d %T'))",
          doris: "UNIX_TIMESTAMP('2020-01-01')",
        },
      },
    );
    this.validateAll(
      "TIME_TO_STR(x, '%Y-%m-%d')",
      {
        write: {
          bigquery: "FORMAT_DATE('%F', x)",
          drill: "TO_CHAR(x, 'yyyy-MM-dd')",
          duckdb: "STRFTIME(x, '%Y-%m-%d')",
          hive: "DATE_FORMAT(x, 'yyyy-MM-dd')",
          materialize: "TO_CHAR(x, 'YYYY-MM-DD')",
          oracle: "TO_CHAR(x, 'YYYY-MM-DD')",
          postgres: "TO_CHAR(x, 'YYYY-MM-DD')",
          presto: "DATE_FORMAT(x, '%Y-%m-%d')",
          redshift: "TO_CHAR(x, 'YYYY-MM-DD')",
          doris: "DATE_FORMAT(x, '%Y-%m-%d')",
        },
      },
    );
    this.validateAll(
      "TIME_TO_STR(a, '%Y-%m-%d %H:%M:%S.%f')",
      {
        write: {
          redshift: "TO_CHAR(a, 'YYYY-MM-DD HH24:MI:SS.US')",
          tsql: "FORMAT(a, 'yyyy-MM-dd HH:mm:ss.ffffff')",
        },
      },
    );
    this.validateAll(
      'TIME_TO_TIME_STR(x)',
      {
        write: {
          drill: 'CAST(x AS VARCHAR)',
          duckdb: 'CAST(x AS TEXT)',
          hive: 'CAST(x AS STRING)',
          presto: 'CAST(x AS VARCHAR)',
          redshift: 'CAST(x AS VARCHAR(MAX))',
          doris: 'CAST(x AS STRING)',
        },
      },
    );
    this.validateAll(
      'TIME_TO_UNIX(x)',
      {
        write: {
          drill: 'UNIX_TIMESTAMP(x)',
          duckdb: 'EPOCH(x)',
          hive: 'UNIX_TIMESTAMP(x)',
          presto: 'TO_UNIXTIME(x)',
          doris: 'UNIX_TIMESTAMP(x)',
        },
      },
    );
    this.validateAll(
      'TS_OR_DS_TO_DATE_STR(x)',
      {
        write: {
          duckdb: 'SUBSTRING(CAST(x AS TEXT), 1, 10)',
          hive: 'SUBSTRING(CAST(x AS STRING), 1, 10)',
          presto: 'SUBSTRING(CAST(x AS VARCHAR), 1, 10)',
          doris: 'SUBSTRING(CAST(x AS STRING), 1, 10)',
        },
      },
    );
    this.validateAll(
      'TS_OR_DS_TO_DATE(x)',
      {
        write: {
          bigquery: 'CAST(x AS DATE)',
          duckdb: 'CAST(x AS DATE)',
          hive: 'TO_DATE(x)',
          materialize: 'CAST(x AS DATE)',
          postgres: 'CAST(x AS DATE)',
          presto: 'CAST(CAST(x AS TIMESTAMP) AS DATE)',
          snowflake: 'TO_DATE(x)',
          doris: 'TO_DATE(x)',
          mysql: 'DATE(x)',
        },
      },
    );
    this.validateAll(
      "TS_OR_DS_TO_DATE(x, '%-d')",
      {
        write: {
          duckdb: "CAST(STRPTIME(x, '%-d') AS DATE)",
          hive: "TO_DATE(x, 'd')",
          presto: "CAST(DATE_PARSE(x, '%e') AS DATE)",
          spark: "TO_DATE(x, 'd')",
        },
      },
    );
    this.validateAll(
      'UNIX_TO_STR(x, y)',
      {
        write: {
          duckdb: 'STRFTIME(TO_TIMESTAMP(x), y)',
          hive: 'FROM_UNIXTIME(x, y)',
          presto: 'DATE_FORMAT(FROM_UNIXTIME(x), y)',
          starrocks: 'FROM_UNIXTIME(x, y)',
          doris: 'FROM_UNIXTIME(x, y)',
        },
      },
    );
    this.validateAll(
      'UNIX_TO_TIME(x)',
      {
        write: {
          duckdb: 'TO_TIMESTAMP(x)',
          hive: 'FROM_UNIXTIME(x)',
          oracle: "TO_DATE('1970-01-01', 'YYYY-MM-DD') + (x / 86400)",
          materialize: 'TO_TIMESTAMP(x)',
          postgres: 'TO_TIMESTAMP(x)',
          presto: 'FROM_UNIXTIME(x)',
          starrocks: 'FROM_UNIXTIME(x)',
          doris: 'FROM_UNIXTIME(x)',
          exasol: 'FROM_POSIX_TIME(x)',
        },
      },
    );
    this.validateAll(
      'UNIX_TO_TIME_STR(x)',
      {
        write: {
          duckdb: 'CAST(TO_TIMESTAMP(x) AS TEXT)',
          hive: 'FROM_UNIXTIME(x)',
          presto: 'CAST(FROM_UNIXTIME(x) AS VARCHAR)',
        },
      },
    );
    this.validateAll(
      'DATE_TO_DATE_STR(x)',
      {
        write: {
          drill: 'CAST(x AS VARCHAR)',
          duckdb: 'CAST(x AS TEXT)',
          hive: 'CAST(x AS STRING)',
          presto: 'CAST(x AS VARCHAR)',
        },
      },
    );
    this.validateAll(
      'DATE_TO_DI(x)',
      {
        write: {
          drill: "CAST(TO_DATE(x, 'yyyyMMdd') AS INT)",
          duckdb: "CAST(STRFTIME(x, '%Y%m%d') AS INT)",
          hive: "CAST(DATE_FORMAT(x, 'yyyyMMdd') AS INT)",
          presto: "CAST(DATE_FORMAT(x, '%Y%m%d') AS INT)",
        },
      },
    );
    this.validateAll(
      'DI_TO_DATE(x)',
      {
        write: {
          drill: "TO_DATE(CAST(x AS VARCHAR), 'yyyyMMdd')",
          duckdb: "CAST(STRPTIME(CAST(x AS TEXT), '%Y%m%d') AS DATE)",
          hive: "TO_DATE(CAST(x AS STRING), 'yyyyMMdd')",
          presto: "CAST(DATE_PARSE(CAST(x AS VARCHAR), '%Y%m%d') AS DATE)",
        },
      },
    );
    this.validateAll(
      'TS_OR_DI_TO_DI(x)',
      {
        write: {
          duckdb: "CAST(SUBSTR(REPLACE(CAST(x AS TEXT), '-', ''), 1, 8) AS INT)",
          hive: "CAST(SUBSTR(REPLACE(CAST(x AS STRING), '-', ''), 1, 8) AS INT)",
          presto: "CAST(SUBSTR(REPLACE(CAST(x AS VARCHAR), '-', ''), 1, 8) AS INT)",
          spark: "CAST(SUBSTR(REPLACE(CAST(x AS STRING), '-', ''), 1, 8) AS INT)",
        },
      },
    );
    this.validateAll(
      "DATE_ADD(x, 1, 'DAY')",
      {
        read: {
          snowflake: "DATEADD('DAY', 1, x)",
          dremio: 'DATE_ADD(x, 1)',
        },
        write: {
          bigquery: 'DATE_ADD(x, INTERVAL 1 DAY)',
          drill: 'DATE_ADD(x, INTERVAL 1 DAY)',
          duckdb: 'x + INTERVAL 1 DAY',
          hive: 'DATE_ADD(x, 1)',
          materialize: "x + INTERVAL '1 DAY'",
          mysql: 'DATE_ADD(x, INTERVAL 1 DAY)',
          postgres: "x + INTERVAL '1 DAY'",
          presto: "DATE_ADD('DAY', 1, x)",
          snowflake: 'DATEADD(DAY, 1, x)',
          spark: 'DATE_ADD(x, 1)',
          sqlite: "DATE(x, '1 DAY')",
          starrocks: 'DATE_ADD(x, INTERVAL 1 DAY)',
          tsql: 'DATEADD(DAY, 1, x)',
          doris: 'DATE_ADD(x, INTERVAL 1 DAY)',
          dremio: 'DATE_ADD(x, 1)',
        },
      },
    );
    this.validateAll(
      'DATE_ADD(x, 1)',
      {
        write: {
          bigquery: 'DATE_ADD(x, INTERVAL 1 DAY)',
          drill: 'DATE_ADD(x, INTERVAL 1 DAY)',
          duckdb: 'x + INTERVAL 1 DAY',
          hive: 'DATE_ADD(x, 1)',
          mysql: 'DATE_ADD(x, INTERVAL 1 DAY)',
          presto: "DATE_ADD('DAY', 1, x)",
          spark: 'DATE_ADD(x, 1)',
          starrocks: 'DATE_ADD(x, INTERVAL 1 DAY)',
          doris: 'DATE_ADD(x, INTERVAL 1 DAY)',
          dremio: 'DATE_ADD(x, 1)',
        },
      },
    );
    this.validateAll(
      "DATE_TRUNC('DAY', x)",
      {
        read: {
          bigquery: 'DATE_TRUNC(x, day)',
          spark: "TRUNC(x, 'day')",
        },
        write: {
          bigquery: 'DATE_TRUNC(x, DAY)',
          duckdb: "DATE_TRUNC('DAY', x)",
          mysql: 'DATE(x)',
          presto: "DATE_TRUNC('DAY', x)",
          materialize: "DATE_TRUNC('DAY', x)",
          postgres: "DATE_TRUNC('DAY', x)",
          snowflake: "DATE_TRUNC('DAY', x)",
          starrocks: "DATE_TRUNC('DAY', x)",
          spark: "TRUNC(x, 'DAY')",
          doris: "DATE_TRUNC(x, 'DAY')",
        },
      },
    );
    this.validateAll(
      'TIMESTAMP_TRUNC(x, DAY)',
      {
        read: {
          bigquery: 'TIMESTAMP_TRUNC(x, day)',
          duckdb: "DATE_TRUNC('day', x)",
          materialize: "DATE_TRUNC('day', x)",
          presto: "DATE_TRUNC('day', x)",
          postgres: "DATE_TRUNC('day', x)",
          snowflake: "DATE_TRUNC('day', x)",
          starrocks: "DATE_TRUNC('day', x)",
          spark: "DATE_TRUNC('day', x)",
          doris: "DATE_TRUNC('day', x)",
        },
      },
    );
    this.validateAll(
      "DATE_TRUNC('DAY', CAST(x AS DATE))",
      {
        read: {
          presto: "DATE_TRUNC('DAY', x::DATE)",
          snowflake: "DATE_TRUNC('DAY', x::DATE)",
        },
      },
    );
    this.validateAll(
      'TIMESTAMP_TRUNC(CAST(x AS DATE), DAY)',
      { read: { postgres: "DATE_TRUNC('day', x::DATE)" } },
    );
    this.validateAll(
      'TIMESTAMP_TRUNC(CAST(x AS DATE), DAY)',
      { read: { starrocks: "DATE_TRUNC('day', x::DATE)" } },
    );
    this.validateAll(
      "DATE_TRUNC('week', x)",
      {
        write: {
          mysql: "STR_TO_DATE(CONCAT(YEAR(x), ' ', WEEK(x, 1), ' 1'), '%Y %u %w')",
        },
      },
    );
    this.validateAll(
      "DATE_TRUNC('month', x)",
      {
        write: {
          mysql: "STR_TO_DATE(CONCAT(YEAR(x), ' ', MONTH(x), ' 1'), '%Y %c %e')",
        },
      },
    );
    this.validateAll(
      "DATE_TRUNC('quarter', x)",
      {
        write: {
          mysql: "STR_TO_DATE(CONCAT(YEAR(x), ' ', QUARTER(x) * 3 - 2, ' 1'), '%Y %c %e')",
        },
      },
    );
    this.validateAll(
      "DATE_TRUNC('year', x)",
      {
        write: {
          mysql: "STR_TO_DATE(CONCAT(YEAR(x), ' 1 1'), '%Y %c %e')",
        },
      },
    );
    this.validateAll(
      "DATE_TRUNC('millennium', x)",
      { write: { mysql: UnsupportedError } },
    );
    this.validateAll(
      "DATE_TRUNC('YEAR', x)",
      {
        read: {
          bigquery: 'DATE_TRUNC(x, year)',
          spark: "TRUNC(x, 'year')",
        },
        write: {
          bigquery: 'DATE_TRUNC(x, YEAR)',
          materialize: "DATE_TRUNC('YEAR', x)",
          mysql: "STR_TO_DATE(CONCAT(YEAR(x), ' 1 1'), '%Y %c %e')",
          postgres: "DATE_TRUNC('YEAR', x)",
          snowflake: "DATE_TRUNC('YEAR', x)",
          starrocks: "DATE_TRUNC('YEAR', x)",
          spark: "TRUNC(x, 'YEAR')",
          doris: "DATE_TRUNC(x, 'YEAR')",
        },
      },
    );
    this.validateAll(
      'TIMESTAMP_TRUNC(x, YEAR)',
      {
        read: {
          bigquery: 'TIMESTAMP_TRUNC(x, year)',
          materialize: "DATE_TRUNC('YEAR', x)",
          postgres: 'DATE_TRUNC(year, x)',
          spark: "DATE_TRUNC('year', x)",
          snowflake: 'DATE_TRUNC(year, x)',
          starrocks: "DATE_TRUNC('year', x)",
        },
        write: {
          bigquery: 'TIMESTAMP_TRUNC(x, YEAR)',
          spark: "DATE_TRUNC('YEAR', x)",
          doris: "DATE_TRUNC(x, 'YEAR')",
        },
      },
    );
    this.validateAll(
      "DATE_TRUNC('millennium', x)",
      { write: { mysql: UnsupportedError } },
    );
    this.validateAll(
      'NEXT_DAY(x, y)',
      {
        write: {
          snowflake: 'NEXT_DAY(x, y)',
          databricks: 'NEXT_DAY(x, y)',
          oracle: 'NEXT_DAY(x, y)',
          redshift: 'NEXT_DAY(x, y)',
        },
      },
    );
    this.validateAll(
      "STR_TO_DATE(x, '%Y-%m-%dT%H:%M:%S')",
      {
        write: {
          drill: "TO_DATE(x, 'yyyy-MM-dd''T''HH:mm:ss')",
          mysql: "STR_TO_DATE(x, '%Y-%m-%dT%T')",
          starrocks: "STR_TO_DATE(x, '%Y-%m-%dT%T')",
          hive: "CAST(FROM_UNIXTIME(UNIX_TIMESTAMP(x, 'yyyy-MM-ddTHH:mm:ss')) AS DATE)",
          presto: "CAST(DATE_PARSE(x, '%Y-%m-%dT%T') AS DATE)",
          spark: "TO_DATE(x, 'yyyy-MM-ddTHH:mm:ss')",
          doris: "STR_TO_DATE(x, '%Y-%m-%dT%T')",
        },
      },
    );
    this.validateAll(
      "STR_TO_DATE(x, '%Y-%m-%d')",
      {
        write: {
          drill: 'CAST(x AS DATE)',
          mysql: "STR_TO_DATE(x, '%Y-%m-%d')",
          starrocks: "STR_TO_DATE(x, '%Y-%m-%d')",
          hive: 'CAST(x AS DATE)',
          presto: "CAST(DATE_PARSE(x, '%Y-%m-%d') AS DATE)",
          spark: 'TO_DATE(x)',
          doris: "STR_TO_DATE(x, '%Y-%m-%d')",
        },
      },
    );
    this.validateAll(
      'DATE_STR_TO_DATE(x)',
      {
        write: {
          drill: 'CAST(x AS DATE)',
          duckdb: 'CAST(x AS DATE)',
          hive: 'CAST(x AS DATE)',
          presto: 'CAST(x AS DATE)',
          spark: 'CAST(x AS DATE)',
          sqlite: 'x',
          tsql: 'CAST(x AS DATE)',
        },
      },
    );
    this.validateAll(
      "TS_OR_DS_ADD('2021-02-01', 1, 'DAY')",
      {
        write: {
          drill: "DATE_ADD(CAST('2021-02-01' AS DATE), INTERVAL 1 DAY)",
          duckdb: "CAST('2021-02-01' AS DATE) + INTERVAL 1 DAY",
          hive: "DATE_ADD('2021-02-01', 1)",
          presto: "DATE_ADD('DAY', 1, CAST(CAST('2021-02-01' AS TIMESTAMP) AS DATE))",
          spark: "DATE_ADD('2021-02-01', 1)",
          mysql: "DATE_ADD('2021-02-01', INTERVAL 1 DAY)",
        },
      },
    );
    this.validateAll(
      "TS_OR_DS_ADD(x, 1, 'DAY')",
      {
        write: {
          presto: "DATE_ADD('DAY', 1, CAST(CAST(x AS TIMESTAMP) AS DATE))",
          hive: 'DATE_ADD(x, 1)',
        },
      },
    );
    this.validateAll(
      "TS_OR_DS_ADD(CURRENT_DATE, 1, 'DAY')",
      {
        write: {
          presto: "DATE_ADD('DAY', 1, CAST(CAST(CURRENT_DATE AS TIMESTAMP) AS DATE))",
          hive: 'DATE_ADD(CURRENT_DATE, 1)',
        },
      },
    );
    this.validateAll(
      "DATE_ADD(CAST('2020-01-01' AS DATE), 1)",
      {
        write: {
          drill: "DATE_ADD(CAST('2020-01-01' AS DATE), INTERVAL 1 DAY)",
          duckdb: "CAST('2020-01-01' AS DATE) + INTERVAL 1 DAY",
          hive: "DATE_ADD(CAST('2020-01-01' AS DATE), 1)",
          presto: "DATE_ADD('DAY', 1, CAST('2020-01-01' AS DATE))",
          spark: "DATE_ADD(CAST('2020-01-01' AS DATE), 1)",
          dremio: "DATE_ADD(CAST('2020-01-01' AS DATE), 1)",
        },
      },
    );
    this.validateAll(
      "TIMESTAMP '2022-01-01'",
      {
        write: {
          drill: "CAST('2022-01-01' AS TIMESTAMP)",
          mysql: "CAST('2022-01-01' AS DATETIME)",
          starrocks: "CAST('2022-01-01' AS DATETIME)",
          hive: "CAST('2022-01-01' AS TIMESTAMP)",
          doris: "CAST('2022-01-01' AS DATETIME)",
        },
      },
    );
    this.validateAll(
      "TIMESTAMP('2022-01-01')",
      {
        write: {
          mysql: "TIMESTAMP('2022-01-01')",
          starrocks: "TIMESTAMP('2022-01-01')",
          hive: "TIMESTAMP('2022-01-01')",
          doris: "TIMESTAMP('2022-01-01')",
        },
      },
    );
    this.validateAll(
      "TIMESTAMP_TRUNC(x, DAY, 'UTC')",
      {
        write: {
          '': "TIMESTAMP_TRUNC(x, DAY, 'UTC')",
          duckdb: "DATE_TRUNC('DAY', x AT TIME ZONE 'UTC') AT TIME ZONE 'UTC'",
          materialize: "DATE_TRUNC('DAY', x, 'UTC')",
          presto: "DATE_TRUNC('DAY', x)",
          postgres: "DATE_TRUNC('DAY', x, 'UTC')",
          snowflake: "DATE_TRUNC('DAY', x)",
          databricks: "DATE_TRUNC('DAY', x)",
          clickhouse: "dateTrunc('DAY', x, 'UTC')",
        },
      },
    );

    for (const unit of ['DAY', 'MONTH', 'YEAR'] as const) {
      const readDialects: Record<string, string> = {};
      for (const d of ['bigquery', 'drill', 'duckdb', 'presto'] as const) {
        readDialects[d] = `${unit}(x)`;
      }
      const writeDialects: Record<string, string> = {};
      for (const d of ['bigquery', 'drill', 'duckdb', 'mysql', 'presto', 'hive', 'spark'] as const) {
        writeDialects[d] = `${unit}(x)`;
      }
      this.validateAll(`${unit}(x)`, { read: readDialects, write: writeDialects });

      const writeTsOrDs: Record<string, string> = {};
      for (const d of ['mysql', 'doris', 'starrocks'] as const) {
        writeTsOrDs[d] = `${unit}(x)`;
      }
      this.validateAll(`${unit}(TS_OR_DS_TO_DATE(x))`, { write: writeTsOrDs });

      const readCast: Record<string, string> = {};
      for (const d of ['mysql', 'doris', 'starrocks'] as const) {
        readCast[d] = `${unit}(x)`;
      }
      this.validateAll(`${unit}(CAST(x AS DATE))`, { read: readCast });
    }
  }

  testArray () {
    this.validateAll(
      'ARRAY(0, 1, 2)',
      {
        write: {
          bigquery: '[0, 1, 2]',
          duckdb: '[0, 1, 2]',
          presto: 'ARRAY[0, 1, 2]',
          spark: 'ARRAY(0, 1, 2)',
        },
      },
    );
    this.validateAll(
      'ARRAY_SIZE(x)',
      {
        write: {
          bigquery: 'ARRAY_LENGTH(x)',
          duckdb: 'ARRAY_LENGTH(x)',
          drill: 'REPEATED_COUNT(x)',
          presto: 'CARDINALITY(x)',
          spark: 'SIZE(x)',
        },
      },
    );
    this.validateAll(
      'ARRAY_SUM(ARRAY(1, 2))',
      {
        write: {
          trino: 'REDUCE(ARRAY[1, 2], 0, (acc, x) -> acc + x, acc -> acc)',
          duckdb: 'LIST_SUM([1, 2])',
          hive: 'ARRAY_SUM(ARRAY(1, 2))',
          presto: 'ARRAY_SUM(ARRAY[1, 2])',
          spark: 'AGGREGATE(ARRAY(1, 2), 0, (acc, x) -> acc + x, acc -> acc)',
        },
      },
    );
    this.validateAll(
      'REDUCE(x, 0, (acc, x) -> acc + x, acc -> acc)',
      {
        write: {
          trino: 'REDUCE(x, 0, (acc, x) -> acc + x, acc -> acc)',
          duckdb: 'REDUCE(x, 0, (acc, x) -> acc + x, acc -> acc)',
          hive: 'REDUCE(x, 0, (acc, x) -> acc + x, acc -> acc)',
          spark: 'AGGREGATE(x, 0, (acc, x) -> acc + x, acc -> acc)',
          presto: 'REDUCE(x, 0, (acc, x) -> acc + x, acc -> acc)',
        },
      },
    );
    this.validateAll(
      'ARRAY_INTERSECT(x, y)',
      {
        read: {
          hive: 'ARRAY_INTERSECT(x, y)',
          spark2: 'ARRAY_INTERSECT(x, y)',
          spark: 'ARRAY_INTERSECT(x, y)',
          databricks: 'ARRAY_INTERSECT(x, y)',
          presto: 'ARRAY_INTERSECT(x, y)',
          trino: 'ARRAY_INTERSECT(x, y)',
          snowflake: 'ARRAY_INTERSECTION(x, y)',
          starrocks: 'ARRAY_INTERSECT(x, y)',
          duckdb: 'ARRAY_INTERSECT(x, y)',
        },
        write: {
          hive: 'ARRAY_INTERSECT(x, y)',
          spark2: 'ARRAY_INTERSECT(x, y)',
          spark: 'ARRAY_INTERSECT(x, y)',
          databricks: 'ARRAY_INTERSECT(x, y)',
          presto: 'ARRAY_INTERSECT(x, y)',
          trino: 'ARRAY_INTERSECT(x, y)',
          snowflake: 'ARRAY_INTERSECTION(x, y)',
          starrocks: 'ARRAY_INTERSECT(x, y)',
          duckdb: 'ARRAY_INTERSECT(x, y)',
        },
      },
    );
    this.validateIdentity('SELECT ARRAY_INTERSECT(x, y, z)');
    this.validateAll(
      'ARRAY_REVERSE(x)',
      {
        read: {
          clickhouse: 'arrayReverse(x)',
          bigquery: 'ARRAY_REVERSE(x)',
          snowflake: 'ARRAY_REVERSE(x)',
          duckdb: 'ARRAY_REVERSE(x)',
        },
        write: {
          clickhouse: 'arrayReverse(x)',
          bigquery: 'ARRAY_REVERSE(x)',
          snowflake: 'ARRAY_REVERSE(x)',
          duckdb: 'ARRAY_REVERSE(x)',
        },
      },
    );
    this.validateAll(
      'ARRAY_SLICE(x, 1, 3)',
      {
        read: {
          clickhouse: 'arraySlice(x, 1, 3)',
          bigquery: 'ARRAY_SLICE(x, 1, 3)',
          snowflake: 'ARRAY_SLICE(x, 1, 3)',
          duckdb: 'ARRAY_SLICE(x, 1, 3)',
          spark2: 'SLICE(x, 1, 3)',
          spark: 'SLICE(x, 1, 3)',
          databricks: 'SLICE(x, 1, 3)',
          presto: 'SLICE(x, 1, 3)',
          trino: 'SLICE(x, 1, 3)',
        },
        write: {
          clickhouse: 'arraySlice(x, 1, 3)',
          bigquery: 'ARRAY_SLICE(x, 1, 3)',
          snowflake: 'ARRAY_SLICE(x, 1, 3)',
          duckdb: 'ARRAY_SLICE(x, 1, 3)',
          spark2: 'SLICE(x, 1, 3)',
          spark: 'SLICE(x, 1, 3)',
          databricks: 'SLICE(x, 1, 3)',
          presto: 'SLICE(x, 1, 3)',
          trino: 'SLICE(x, 1, 3)',
        },
      },
    );
    this.validateAll(
      'SORT_ARRAY(x)',
      {
        write: {
          duckdb: 'LIST_SORT(x)',
          hive: 'SORT_ARRAY(x)',
          presto: 'ARRAY_SORT(x)',
          snowflake: 'ARRAY_SORT(x)',
          spark: 'SORT_ARRAY(x)',
        },
      },
    );
    this.validateAll(
      'ARRAY_PREPEND(arr, x)',
      {
        read: {
          duckdb: 'LIST_PREPEND(x, arr)',
          postgres: 'ARRAY_PREPEND(x, arr)',
        },
        write: {
          duckdb: 'LIST_PREPEND(x, arr)',
          postgres: 'ARRAY_PREPEND(x, arr)',
        },
      },
    );
    this.validateAll(
      'ARRAY_APPEND(arr, x)',
      {
        read: {
          duckdb: 'LIST_APPEND(arr, x)',
          postgres: 'ARRAY_APPEND(arr, x)',
        },
        write: {
          duckdb: 'LIST_APPEND(arr, x)',
          postgres: 'ARRAY_APPEND(arr, x)',
        },
      },
    );

    // NULL propagation semantics: NULL-propagating dialects to array-creating dialects
    for (const sourceDialect of ['snowflake', 'databricks', 'spark'] as const) {
      const expr = parseOne('ARRAY_APPEND(arr, x)', { read: sourceDialect });
      expect(expr.sql({ dialect: 'duckdb' })).toBe(
        'CASE WHEN arr IS NULL THEN NULL ELSE LIST_APPEND(arr, x) END',
      );
      expect(expr.sql({ dialect: 'postgres' })).toBe(
        'CASE WHEN arr IS NULL THEN NULL ELSE ARRAY_APPEND(arr, x) END',
      );
    }

    // Array creation semantics: array-creating dialects to NULL-propagating dialects
    for (const [sourceDialect, sourceSql] of [
      ['duckdb', 'LIST_APPEND(arr, x)'],
      ['postgres', 'ARRAY_APPEND(arr, x)'],
    ] as const) {
      const expr = parseOne(sourceSql, { read: sourceDialect });
      expect(expr.sql({ dialect: 'snowflake' })).toBe('ARRAY_APPEND(COALESCE(arr, []), x)');
      expect(expr.sql({ dialect: 'databricks' })).toBe('ARRAY_APPEND(COALESCE(arr, ARRAY()), x)');
      expect(expr.sql({ dialect: 'spark' })).toBe('ARRAY_APPEND(COALESCE(arr, ARRAY()), x)');
    }

    // Identity transpilation (should NOT add wrappers)
    for (const [dialect, sql] of [
      ['duckdb', 'LIST_APPEND(arr, x)'],
      ['postgres', 'ARRAY_APPEND(arr, x)'],
      ['snowflake', 'ARRAY_APPEND(arr, x)'],
      ['databricks', 'ARRAY_APPEND(arr, x)'],
      ['spark', 'ARRAY_APPEND(arr, x)'],
    ] as const) {
      const expr = parseOne(sql, { read: dialect });
      expect(expr.sql({ dialect })).toBe(sql);
    }

    // ARRAY_PREPEND NULL propagation
    for (const sourceDialect of ['snowflake', 'databricks', 'spark'] as const) {
      const expr = parseOne('ARRAY_PREPEND(arr, x)', { read: sourceDialect });
      expect(expr.sql({ dialect: 'duckdb' })).toBe(
        'CASE WHEN arr IS NULL THEN NULL ELSE LIST_PREPEND(x, arr) END',
      );
      expect(expr.sql({ dialect: 'postgres' })).toBe(
        'CASE WHEN arr IS NULL THEN NULL ELSE ARRAY_PREPEND(x, arr) END',
      );
    }

    // ARRAY_PREPEND array creation semantics
    for (const [sourceDialect, sourceSql] of [
      ['duckdb', 'LIST_PREPEND(x, arr)'],
      ['postgres', 'ARRAY_PREPEND(x, arr)'],
    ] as const) {
      const expr = parseOne(sourceSql, { read: sourceDialect });
      expect(expr.sql({ dialect: 'snowflake' })).toBe('ARRAY_PREPEND(COALESCE(arr, []), x)');
      expect(expr.sql({ dialect: 'databricks' })).toBe('ARRAY_PREPEND(COALESCE(arr, ARRAY()), x)');
      expect(expr.sql({ dialect: 'spark' })).toBe('ARRAY_PREPEND(COALESCE(arr, ARRAY()), x)');
    }

    // ARRAY_PREPEND identity
    for (const [dialect, sql] of [
      ['duckdb', 'LIST_PREPEND(x, arr)'],
      ['postgres', 'ARRAY_PREPEND(x, arr)'],
      ['snowflake', 'ARRAY_PREPEND(arr, x)'],
      ['databricks', 'ARRAY_PREPEND(arr, x)'],
      ['spark', 'ARRAY_PREPEND(arr, x)'],
    ] as const) {
      const expr = parseOne(sql, { read: dialect });
      expect(expr.sql({ dialect })).toBe(sql);
    }

    // ARRAY_CAT NULL propagation
    for (const [sourceDialect, sourceSql] of [
      ['snowflake', 'ARRAY_CAT(arr1, arr2)'],
      ['redshift', 'ARRAY_CONCAT(arr1, arr2)'],
    ] as const) {
      const expr = parseOne(sourceSql, { read: sourceDialect });
      expect(expr.sql({ dialect: 'duckdb' })).toBe(
        'CASE WHEN arr1 IS NULL OR arr2 IS NULL THEN NULL ELSE LIST_CONCAT(arr1, arr2) END',
      );
      expect(expr.sql({ dialect: 'postgres' })).toBe(
        'CASE WHEN arr1 IS NULL OR arr2 IS NULL THEN NULL ELSE ARRAY_CAT(arr1, arr2) END',
      );
    }

    // ARRAY_CAT NULL skipping
    for (const [sourceDialect, sourceSql] of [
      ['duckdb', 'LIST_CONCAT(arr1, arr2)'],
      ['postgres', 'ARRAY_CAT(arr1, arr2)'],
    ] as const) {
      const expr = parseOne(sourceSql, { read: sourceDialect });
      expect(expr.sql({ dialect: 'snowflake' })).toBe('ARRAY_CAT(COALESCE(arr1, []), COALESCE(arr2, []))');
      expect(expr.sql({ dialect: 'redshift' })).toBe('ARRAY_CONCAT(COALESCE(arr1, ARRAY()), COALESCE(arr2, ARRAY()))');
    }

    // ARRAY_CAT identity
    for (const [dialect, sql] of [
      ['duckdb', 'LIST_CONCAT(arr1, arr2)'],
      ['postgres', 'ARRAY_CAT(arr1, arr2)'],
      ['snowflake', 'ARRAY_CAT(arr1, arr2)'],
      ['redshift', 'ARRAY_CONCAT(arr1, arr2)'],
    ] as const) {
      const expr = parseOne(sql, { read: dialect });
      expect(expr.sql({ dialect })).toBe(sql);
    }

    // ARRAY_CAT variadic
    for (const [sourceDialect, sourceSql, expected] of [
      [
        'snowflake',
        'ARRAY_CAT(arr1, arr2, arr3)',
        'CASE WHEN arr1 IS NULL OR arr2 IS NULL OR arr3 IS NULL THEN NULL ELSE LIST_CONCAT(arr1, arr2, arr3) END',
      ],
      [
        'redshift',
        'ARRAY_CONCAT(arr1, arr2, arr3)',
        'CASE WHEN arr1 IS NULL OR arr2 IS NULL OR arr3 IS NULL THEN NULL ELSE LIST_CONCAT(arr1, arr2, arr3) END',
      ],
    ] as const) {
      const expr = parseOne(sourceSql, { read: sourceDialect });
      expect(expr.sql({ dialect: 'duckdb' })).toBe(expected);
    }

    // Variadic COALESCE wrapping
    for (const [sourceDialect, sourceSql, expectedSnowflake, expectedRedshift] of [
      [
        'duckdb',
        'LIST_CONCAT(arr1, arr2, arr3)',
        'ARRAY_CAT(COALESCE(arr1, []), ARRAY_CAT(COALESCE(arr2, []), COALESCE(arr3, [])))',
        'ARRAY_CONCAT(COALESCE(arr1, ARRAY()), ARRAY_CONCAT(COALESCE(arr2, ARRAY()), COALESCE(arr3, ARRAY())))',
      ],
      [
        'postgres',
        'ARRAY_CAT(arr1, arr2, arr3)',
        'ARRAY_CAT(COALESCE(arr1, []), ARRAY_CAT(COALESCE(arr2, []), COALESCE(arr3, [])))',
        'ARRAY_CONCAT(COALESCE(arr1, ARRAY()), ARRAY_CONCAT(COALESCE(arr2, ARRAY()), COALESCE(arr3, ARRAY())))',
      ],
    ] as const) {
      const expr = parseOne(sourceSql, { read: sourceDialect });
      expect(expr.sql({ dialect: 'snowflake' })).toBe(expectedSnowflake);
      expect(expr.sql({ dialect: 'redshift' })).toBe(expectedRedshift);
    }

    // PostgreSQL to Snowflake (2 args)
    const pgExpr = parseOne('ARRAY_CAT(arr1, arr2)', { read: 'postgres' });
    expect(pgExpr.sql({ dialect: 'snowflake' })).toBe('ARRAY_CAT(COALESCE(arr1, []), COALESCE(arr2, []))');

    // Edge case: array literal optimization
    const litExpr = parseOne('ARRAY_CAT([1, 2], arr2)', { read: 'snowflake' });
    expect(litExpr.sql({ dialect: 'duckdb' })).toBe('LIST_CONCAT([1, 2], arr2)');

    // Edge case: single argument
    const singleExpr = parseOne('ARRAY_CAT(arr1)', { read: 'snowflake' });
    expect(singleExpr.sql({ dialect: 'duckdb' })).toBe('LIST_CONCAT(arr1)');

    // ARRAY_MAX
    this.validateAll(
      'ARRAY_MAX(x)',
      {
        read: {
          athena: 'array_max(x)',
          clickhouse: 'arrayMax(x)',
          databricks: 'array_max(x)',
          duckdb: 'list_max(x)',
          presto: 'array_max(x)',
          snowflake: 'ARRAY_MAX(x)',
          spark: 'array_max(x)',
          trino: 'array_max(x)',
        },
        write: {
          athena: 'ARRAY_MAX(x)',
          clickhouse: 'arrayMax(x)',
          databricks: 'ARRAY_MAX(x)',
          duckdb: 'LIST_MAX(x)',
          presto: 'ARRAY_MAX(x)',
          snowflake: 'ARRAY_MAX(x)',
          spark: 'ARRAY_MAX(x)',
          trino: 'ARRAY_MAX(x)',
        },
      },
    );

    // ARRAY_MIN
    this.validateAll(
      'ARRAY_MIN(x)',
      {
        read: {
          athena: 'array_min(x)',
          clickhouse: 'arrayMin(x)',
          databricks: 'array_min(x)',
          duckdb: 'list_min(x)',
          presto: 'array_min(x)',
          snowflake: 'ARRAY_MIN(x)',
          spark: 'array_min(x)',
          trino: 'array_min(x)',
        },
        write: {
          athena: 'ARRAY_MIN(x)',
          clickhouse: 'arrayMin(x)',
          databricks: 'ARRAY_MIN(x)',
          duckdb: 'LIST_MIN(x)',
          presto: 'ARRAY_MIN(x)',
          snowflake: 'ARRAY_MIN(x)',
          spark: 'ARRAY_MIN(x)',
          trino: 'ARRAY_MIN(x)',
        },
      },
    );

    this.validateAll(
      'SELECT ARRAY_EXCEPT(ARRAY(1, 2, 3), ARRAY(2))',
      {
        read: {
          spark: 'SELECT array_except(array(1, 2, 3), array(2))',
          databricks: 'SELECT array_except(array(1, 2, 3), array(2))',
        },
        write: {
          snowflake: 'SELECT ARRAY_EXCEPT([1, 2, 3], [2])',
          spark: 'SELECT ARRAY_EXCEPT(ARRAY(1, 2, 3), ARRAY(2))',
          databricks: 'SELECT ARRAY_EXCEPT(ARRAY(1, 2, 3), ARRAY(2))',
          trino: 'SELECT ARRAY_EXCEPT(ARRAY[1, 2, 3], ARRAY[2])',
          presto: 'SELECT ARRAY_EXCEPT(ARRAY[1, 2, 3], ARRAY[2])',
          athena: 'SELECT ARRAY_EXCEPT(ARRAY[1, 2, 3], ARRAY[2])',
          duckdb: "SELECT CASE WHEN [1, 2, 3] IS NULL OR [2] IS NULL THEN NULL ELSE LIST_FILTER(LIST_DISTINCT([1, 2, 3]), e -> LENGTH(LIST_FILTER([2], x -> x IS NOT DISTINCT FROM e)) = 0) END",
        },
      },
    );

    this.validateAll(
      'SELECT ARRAY_POSITION(ARRAY(1, 2, 3), 2)',
      {
        read: {
          spark: 'SELECT array_position(array(1, 2, 3), 2)',
          databricks: 'SELECT array_position(array(1, 2, 3), 2)',
          trino: 'SELECT array_position(array[1, 2, 3], 2)',
          presto: 'SELECT array_position(array[1, 2, 3], 2)',
          athena: 'SELECT array_position(array[1, 2, 3], 2)',
        },
        write: {
          snowflake: 'SELECT ARRAY_POSITION(2, [1, 2, 3])',
          spark: 'SELECT ARRAY_POSITION(ARRAY(1, 2, 3), 2)',
          databricks: 'SELECT ARRAY_POSITION(ARRAY(1, 2, 3), 2)',
          trino: 'SELECT ARRAY_POSITION(ARRAY[1, 2, 3], 2)',
          presto: 'SELECT ARRAY_POSITION(ARRAY[1, 2, 3], 2)',
          athena: 'SELECT ARRAY_POSITION(ARRAY[1, 2, 3], 2)',
          duckdb: 'SELECT ARRAY_POSITION([1, 2, 3], 2)',
        },
      },
    );
  }

  testOrderBy () {
    this.validateIdentity(
      'SELECT c FROM t ORDER BY a, b,',
      'SELECT c FROM t ORDER BY a, b',
    );

    this.validateAll(
      'SELECT fname, lname, age FROM person ORDER BY age DESC NULLS FIRST, fname ASC NULLS LAST, lname',
      {
        write: {
          bigquery: 'SELECT fname, lname, age FROM person ORDER BY age DESC NULLS FIRST, fname ASC NULLS LAST, lname',
          duckdb: 'SELECT fname, lname, age FROM person ORDER BY age DESC NULLS FIRST, fname ASC, lname NULLS FIRST',
          presto: 'SELECT fname, lname, age FROM person ORDER BY age DESC NULLS FIRST, fname ASC, lname NULLS FIRST',
          hive: 'SELECT fname, lname, age FROM person ORDER BY age DESC NULLS FIRST, fname ASC NULLS LAST, lname',
          spark: 'SELECT fname, lname, age FROM person ORDER BY age DESC NULLS FIRST, fname ASC NULLS LAST, lname',
        },
      },
    );

    const orderByAllSql = 'SELECT * FROM t ORDER BY ALL';
    (this.validateIdentity(orderByAllSql).find(OrderedExpr)!.args.this as any).assertIs(ColumnExpr);

    for (const dialect of ['duckdb', 'spark', 'databricks'] as const) {
      (parseOne(orderByAllSql, { read: dialect }).find(OrderedExpr)!.args.this as any).assertIs(VarExpr);
    }
  }

  testJson () {
    this.validateAll(
      'JSON_EXTRACT(x, \'$["a b"]\')',
      {
        write: {
          '': 'JSON_EXTRACT(x, \'$["a b"]\')',
          bigquery: "JSON_EXTRACT(x, '$[\\'a b\\']')",
          clickhouse: "JSONExtractString(x, 'a b')",
          duckdb: "x -> '$.\"a b\"'",
          mysql: "JSON_EXTRACT(x, '$.\"a b\"')",
          postgres: "JSON_EXTRACT_PATH(x, 'a b')",
          presto: 'JSON_EXTRACT(x, \'$["a b"]\')',
          redshift: "JSON_EXTRACT_PATH_TEXT(x, 'a b')",
          snowflake: "GET_PATH(PARSE_JSON(x), '[\"a b\"]')",
          spark: "GET_JSON_OBJECT(x, '$[\\'a b\\']')",
          sqlite: "x -> '$.\"a b\"'",
          trino: 'JSON_EXTRACT(x, \'$["a b"]\')',
          tsql: "ISNULL(JSON_QUERY(x, '$.\"a b\"'), JSON_VALUE(x, '$.\"a b\"'))",
        },
      },
    );
    this.validateAll(
      "JSON_EXTRACT(x, '$.y')",
      {
        read: {
          bigquery: "JSON_EXTRACT(x, '$.y')",
          duckdb: "x -> 'y'",
          doris: "JSON_EXTRACT(x, '$.y')",
          mysql: "JSON_EXTRACT(x, '$.y')",
          postgres: "x->'y'",
          presto: "JSON_EXTRACT(x, '$.y')",
          snowflake: "GET_PATH(x, 'y')",
          sqlite: "x -> '$.y'",
          starrocks: "x -> '$.y'",
        },
        write: {
          bigquery: "JSON_EXTRACT(x, '$.y')",
          clickhouse: "JSONExtractString(x, 'y')",
          doris: "JSON_EXTRACT(x, '$.y')",
          duckdb: "x -> '$.y'",
          mysql: "JSON_EXTRACT(x, '$.y')",
          oracle: "JSON_EXTRACT(x, '$.y')",
          postgres: "JSON_EXTRACT_PATH(x, 'y')",
          presto: "JSON_EXTRACT(x, '$.y')",
          snowflake: "GET_PATH(PARSE_JSON(x), 'y')",
          spark: "GET_JSON_OBJECT(x, '$.y')",
          sqlite: "x -> '$.y'",
          starrocks: "x -> '$.y'",
          tsql: "ISNULL(JSON_QUERY(x, '$.y'), JSON_VALUE(x, '$.y'))",
        },
      },
    );
    this.validateAll(
      "JSON_EXTRACT_SCALAR(x, '$.y')",
      {
        read: {
          bigquery: "JSON_EXTRACT_SCALAR(x, '$.y')",
          clickhouse: "JSONExtractString(x, 'y')",
          duckdb: "x ->> 'y'",
          postgres: "x ->> 'y'",
          presto: "JSON_EXTRACT_SCALAR(x, '$.y')",
          redshift: "JSON_EXTRACT_PATH_TEXT(x, 'y')",
          spark: "GET_JSON_OBJECT(x, '$.y')",
          snowflake: "JSON_EXTRACT_PATH_TEXT(x, 'y')",
          sqlite: "x ->> '$.y'",
        },
        write: {
          bigquery: "JSON_EXTRACT_SCALAR(x, '$.y')",
          clickhouse: "JSONExtractString(x, 'y')",
          duckdb: "x ->> '$.y'",
          postgres: "JSON_EXTRACT_PATH_TEXT(x, 'y')",
          presto: "JSON_EXTRACT_SCALAR(x, '$.y')",
          redshift: "JSON_EXTRACT_PATH_TEXT(x, 'y')",
          snowflake: "JSON_EXTRACT_PATH_TEXT(x, 'y')",
          spark: "GET_JSON_OBJECT(x, '$.y')",
          sqlite: "x ->> '$.y'",
          tsql: "ISNULL(JSON_QUERY(x, '$.y'), JSON_VALUE(x, '$.y'))",
        },
      },
    );
    this.validateAll(
      "JSON_EXTRACT(x, '$.y[0].z')",
      {
        read: {
          bigquery: "JSON_EXTRACT(x, '$.y[0].z')",
          duckdb: "x -> '$.y[0].z'",
          doris: "JSON_EXTRACT(x, '$.y[0].z')",
          mysql: "JSON_EXTRACT(x, '$.y[0].z')",
          presto: "JSON_EXTRACT(x, '$.y[0].z')",
          snowflake: "GET_PATH(x, 'y[0].z')",
          sqlite: "x -> '$.y[0].z'",
          starrocks: "x -> '$.y[0].z'",
        },
        write: {
          bigquery: "JSON_EXTRACT(x, '$.y[0].z')",
          clickhouse: "JSONExtractString(x, 'y', 1, 'z')",
          doris: "JSON_EXTRACT(x, '$.y[0].z')",
          duckdb: "x -> '$.y[0].z'",
          mysql: "JSON_EXTRACT(x, '$.y[0].z')",
          oracle: "JSON_EXTRACT(x, '$.y[0].z')",
          postgres: "JSON_EXTRACT_PATH(x, 'y', '0', 'z')",
          presto: "JSON_EXTRACT(x, '$.y[0].z')",
          redshift: "JSON_EXTRACT_PATH_TEXT(x, 'y', '0', 'z')",
          snowflake: "GET_PATH(PARSE_JSON(x), 'y[0].z')",
          spark: "GET_JSON_OBJECT(x, '$.y[0].z')",
          sqlite: "x -> '$.y[0].z'",
          starrocks: "x -> '$.y[0].z'",
          tsql: "ISNULL(JSON_QUERY(x, '$.y[0].z'), JSON_VALUE(x, '$.y[0].z'))",
        },
      },
    );
    this.validateAll(
      "JSON_EXTRACT_SCALAR(x, '$.y[0].z')",
      {
        read: {
          bigquery: "JSON_EXTRACT_SCALAR(x, '$.y[0].z')",
          clickhouse: "JSONExtractString(x, 'y', 1, 'z')",
          duckdb: "x ->> '$.y[0].z'",
          presto: "JSON_EXTRACT_SCALAR(x, '$.y[0].z')",
          snowflake: "JSON_EXTRACT_PATH_TEXT(x, 'y[0].z')",
          spark: 'GET_JSON_OBJECT(x, "$.y[0].z")',
          sqlite: "x ->> '$.y[0].z'",
        },
        write: {
          bigquery: "JSON_EXTRACT_SCALAR(x, '$.y[0].z')",
          clickhouse: "JSONExtractString(x, 'y', 1, 'z')",
          duckdb: "x ->> '$.y[0].z'",
          postgres: "JSON_EXTRACT_PATH_TEXT(x, 'y', '0', 'z')",
          presto: "JSON_EXTRACT_SCALAR(x, '$.y[0].z')",
          redshift: "JSON_EXTRACT_PATH_TEXT(x, 'y', '0', 'z')",
          snowflake: "JSON_EXTRACT_PATH_TEXT(x, 'y[0].z')",
          spark: "GET_JSON_OBJECT(x, '$.y[0].z')",
          sqlite: "x ->> '$.y[0].z'",
          tsql: "ISNULL(JSON_QUERY(x, '$.y[0].z'), JSON_VALUE(x, '$.y[0].z'))",
        },
      },
    );
    this.validateAll(
      "JSON_EXTRACT(x, '$.y[*]')",
      {
        write: {
          bigquery: UnsupportedError,
          clickhouse: UnsupportedError,
          duckdb: "x -> '$.y[*]'",
          mysql: "JSON_EXTRACT(x, '$.y[*]')",
          postgres: UnsupportedError,
          presto: "JSON_EXTRACT(x, '$.y[*]')",
          redshift: UnsupportedError,
          snowflake: UnsupportedError,
          spark: "GET_JSON_OBJECT(x, '$.y[*]')",
          sqlite: UnsupportedError,
          tsql: UnsupportedError,
        },
      },
    );
    this.validateAll(
      "JSON_EXTRACT(x, '$.y[*]')",
      {
        write: {
          bigquery: "JSON_EXTRACT(x, '$.y')",
          clickhouse: "JSONExtractString(x, 'y')",
          postgres: "JSON_EXTRACT_PATH(x, 'y')",
          redshift: "JSON_EXTRACT_PATH_TEXT(x, 'y')",
          snowflake: "GET_PATH(PARSE_JSON(x), 'y')",
          sqlite: "x -> '$.y'",
          tsql: "ISNULL(JSON_QUERY(x, '$.y'), JSON_VALUE(x, '$.y'))",
        },
      },
    );
    this.validateAll(
      "JSON_EXTRACT(x, '$.y.*')",
      {
        write: {
          bigquery: UnsupportedError,
          clickhouse: UnsupportedError,
          duckdb: "x -> '$.y.*'",
          mysql: "JSON_EXTRACT(x, '$.y.*')",
          postgres: UnsupportedError,
          presto: "JSON_EXTRACT(x, '$.y.*')",
          redshift: UnsupportedError,
          snowflake: UnsupportedError,
          spark: UnsupportedError,
          sqlite: UnsupportedError,
          tsql: UnsupportedError,
        },
      },
    );

    for (const dialect of ['duckdb', 'starrocks'] as const) {
      expect(
        parseOne(`select '{"0": "v"}' -> '0'`, { read: dialect }).sql({ dialect }),
      ).toBe(`SELECT '{"0": "v"}' -> '0'`);
    }
  }

  testCrossJoin () {
    this.validateAll(
      'SELECT a FROM x CROSS JOIN UNNEST(y) AS t (a)',
      {
        write: {
          drill: 'SELECT a FROM x CROSS JOIN UNNEST(y) AS t(a)',
          presto: 'SELECT a FROM x CROSS JOIN UNNEST(y) AS t(a)',
          spark: 'SELECT a FROM x LATERAL VIEW EXPLODE(y) t AS a',
        },
      },
    );
    this.validateAll(
      'SELECT a, b FROM x CROSS JOIN UNNEST(y, z) AS t (a, b)',
      {
        write: {
          drill: 'SELECT a, b FROM x CROSS JOIN UNNEST(y, z) AS t(a, b)',
          presto: 'SELECT a, b FROM x CROSS JOIN UNNEST(y, z) AS t(a, b)',
          spark: 'SELECT a, b FROM x LATERAL VIEW INLINE(ARRAYS_ZIP(y, z)) t AS a, b',
        },
      },
    );
    this.validateAll(
      'SELECT a FROM x CROSS JOIN UNNEST(y) WITH ORDINALITY AS t (a)',
      {
        write: {
          presto: 'SELECT a FROM x CROSS JOIN UNNEST(y) WITH ORDINALITY AS t(a)',
          spark2: 'SELECT a FROM x LATERAL VIEW POSEXPLODE(y) t AS pos, a',
          spark: 'SELECT a FROM x LATERAL VIEW POSEXPLODE(y) t AS pos, a',
          databricks: 'SELECT a FROM x LATERAL VIEW POSEXPLODE(y) t AS pos, a',
        },
      },
    );
    this.validateAll(
      'SELECT * FROM x CROSS JOIN UNNEST(y) AS t',
      {
        write: {
          presto: 'SELECT * FROM x CROSS JOIN UNNEST(y) AS t',
          spark: UnsupportedError,
          databricks: UnsupportedError,
        },
      },
    );
    this.validateAll(
      'SELECT a, b FROM x CROSS JOIN UNNEST(y) AS t (a, b)',
      {
        write: {
          presto: 'SELECT a, b FROM x CROSS JOIN UNNEST(y) AS t(a, b)',
          spark: 'SELECT a, b FROM x LATERAL VIEW EXPLODE(y) t AS a, b',
          hive: 'SELECT a, b FROM x LATERAL VIEW EXPLODE(y) t AS a, b',
        },
      },
    );
    this.validateAll(
      "SELECT numbers, animals, n, a FROM (SELECT ARRAY(2, 5) AS numbers, ARRAY('dog', 'cat', 'bird') AS animals UNION ALL SELECT ARRAY(7, 8, 9), ARRAY('cow', 'pig')) AS x CROSS JOIN UNNEST(numbers, animals) AS t(n, a)",
      {
        write: {
          presto: "SELECT numbers, animals, n, a FROM (SELECT ARRAY[2, 5] AS numbers, ARRAY['dog', 'cat', 'bird'] AS animals UNION ALL SELECT ARRAY[7, 8, 9], ARRAY['cow', 'pig']) AS x CROSS JOIN UNNEST(numbers, animals) AS t(n, a)",
          spark: "SELECT numbers, animals, n, a FROM (SELECT ARRAY(2, 5) AS numbers, ARRAY('dog', 'cat', 'bird') AS animals UNION ALL SELECT ARRAY(7, 8, 9), ARRAY('cow', 'pig')) AS x LATERAL VIEW INLINE(ARRAYS_ZIP(numbers, animals)) t AS n, a",
          hive: UnsupportedError,
        },
      },
    );
    this.validateAll(
      'SELECT a, b, c, d, e FROM x CROSS JOIN UNNEST(y) AS t(a, b, c, d)',
      {
        write: {
          presto: 'SELECT a, b, c, d, e FROM x CROSS JOIN UNNEST(y) AS t(a, b, c, d)',
          spark: UnsupportedError,
          hive: UnsupportedError,
        },
      },
    );
  }

  testMultipleChainedUnnest () {
    this.validateAll(
      'SELECT * FROM x CROSS JOIN UNNEST(a) AS j(lista) CROSS JOIN UNNEST(b) AS k(listb) CROSS JOIN UNNEST(c) AS l(listc)',
      {
        write: {
          presto: 'SELECT * FROM x CROSS JOIN UNNEST(a) AS j(lista) CROSS JOIN UNNEST(b) AS k(listb) CROSS JOIN UNNEST(c) AS l(listc)',
          spark: 'SELECT * FROM x LATERAL VIEW EXPLODE(a) j AS lista LATERAL VIEW EXPLODE(b) k AS listb LATERAL VIEW EXPLODE(c) l AS listc',
          hive: 'SELECT * FROM x LATERAL VIEW EXPLODE(a) j AS lista LATERAL VIEW EXPLODE(b) k AS listb LATERAL VIEW EXPLODE(c) l AS listc',
        },
      },
    );
  }

  testLateralSubquery () {
    this.validateIdentity(
      'SELECT art FROM tbl1 INNER JOIN LATERAL (SELECT art FROM tbl2) AS tbl2 ON tbl1.art = tbl2.art',
    );
    this.validateIdentity(
      'SELECT * FROM tbl AS t LEFT JOIN LATERAL (SELECT * FROM b WHERE b.t_id = t.t_id) AS t ON TRUE',
    );
  }

  testSetOperators () {
    this.validateAll(
      'SELECT * FROM a UNION SELECT * FROM b ORDER BY x LIMIT 1',
      {
        write: {
          '': 'SELECT * FROM a UNION SELECT * FROM b ORDER BY x LIMIT 1',
          clickhouse: 'SELECT * FROM (SELECT * FROM a UNION DISTINCT SELECT * FROM b) AS _l_0 ORDER BY x NULLS FIRST LIMIT 1',
          tsql: 'SELECT TOP 1 * FROM (SELECT * FROM a UNION SELECT * FROM b) AS _l_0 ORDER BY x',
        },
      },
    );
    this.validateAll(
      'SELECT * FROM a UNION SELECT * FROM b',
      {
        read: {
          bigquery: 'SELECT * FROM a UNION DISTINCT SELECT * FROM b',
          clickhouse: 'SELECT * FROM a UNION DISTINCT SELECT * FROM b',
          duckdb: 'SELECT * FROM a UNION SELECT * FROM b',
          presto: 'SELECT * FROM a UNION SELECT * FROM b',
          spark: 'SELECT * FROM a UNION SELECT * FROM b',
        },
        write: {
          bigquery: 'SELECT * FROM a UNION DISTINCT SELECT * FROM b',
          drill: 'SELECT * FROM a UNION SELECT * FROM b',
          duckdb: 'SELECT * FROM a UNION SELECT * FROM b',
          presto: 'SELECT * FROM a UNION SELECT * FROM b',
          spark: 'SELECT * FROM a UNION SELECT * FROM b',
        },
      },
    );
    this.validateAll(
      'SELECT * FROM a UNION ALL SELECT * FROM b',
      {
        read: {
          bigquery: 'SELECT * FROM a UNION ALL SELECT * FROM b',
          clickhouse: 'SELECT * FROM a UNION ALL SELECT * FROM b',
          duckdb: 'SELECT * FROM a UNION ALL SELECT * FROM b',
          presto: 'SELECT * FROM a UNION ALL SELECT * FROM b',
          spark: 'SELECT * FROM a UNION ALL SELECT * FROM b',
        },
        write: {
          bigquery: 'SELECT * FROM a UNION ALL SELECT * FROM b',
          duckdb: 'SELECT * FROM a UNION ALL SELECT * FROM b',
          presto: 'SELECT * FROM a UNION ALL SELECT * FROM b',
          spark: 'SELECT * FROM a UNION ALL SELECT * FROM b',
        },
      },
    );
    this.validateAll(
      'SELECT * FROM a INTERSECT SELECT * FROM b',
      {
        read: {
          bigquery: 'SELECT * FROM a INTERSECT DISTINCT SELECT * FROM b',
          clickhouse: 'SELECT * FROM a INTERSECT DISTINCT SELECT * FROM b',
          duckdb: 'SELECT * FROM a INTERSECT SELECT * FROM b',
          presto: 'SELECT * FROM a INTERSECT SELECT * FROM b',
          spark: 'SELECT * FROM a INTERSECT SELECT * FROM b',
        },
        write: {
          bigquery: 'SELECT * FROM a INTERSECT DISTINCT SELECT * FROM b',
          clickhouse: 'SELECT * FROM a INTERSECT DISTINCT SELECT * FROM b',
          duckdb: 'SELECT * FROM a INTERSECT SELECT * FROM b',
          presto: 'SELECT * FROM a INTERSECT SELECT * FROM b',
          spark: 'SELECT * FROM a INTERSECT SELECT * FROM b',
        },
      },
    );
    this.validateAll(
      'SELECT * FROM a EXCEPT SELECT * FROM b',
      {
        read: {
          bigquery: 'SELECT * FROM a EXCEPT DISTINCT SELECT * FROM b',
          clickhouse: 'SELECT * FROM a EXCEPT DISTINCT SELECT * FROM b',
          duckdb: 'SELECT * FROM a EXCEPT SELECT * FROM b',
          presto: 'SELECT * FROM a EXCEPT SELECT * FROM b',
          spark: 'SELECT * FROM a EXCEPT SELECT * FROM b',
        },
        write: {
          bigquery: 'SELECT * FROM a EXCEPT DISTINCT SELECT * FROM b',
          clickhouse: 'SELECT * FROM a EXCEPT DISTINCT SELECT * FROM b',
          duckdb: 'SELECT * FROM a EXCEPT SELECT * FROM b',
          presto: 'SELECT * FROM a EXCEPT SELECT * FROM b',
          spark: 'SELECT * FROM a EXCEPT SELECT * FROM b',
        },
      },
    );
    this.validateAll(
      'SELECT * FROM a UNION DISTINCT SELECT * FROM b',
      {
        write: {
          bigquery: 'SELECT * FROM a UNION DISTINCT SELECT * FROM b',
          duckdb: 'SELECT * FROM a UNION SELECT * FROM b',
          presto: 'SELECT * FROM a UNION SELECT * FROM b',
          spark: 'SELECT * FROM a UNION SELECT * FROM b',
        },
      },
    );
    this.validateAll(
      'SELECT * FROM a INTERSECT DISTINCT SELECT * FROM b',
      {
        write: {
          bigquery: 'SELECT * FROM a INTERSECT DISTINCT SELECT * FROM b',
          clickhouse: 'SELECT * FROM a INTERSECT DISTINCT SELECT * FROM b',
          duckdb: 'SELECT * FROM a INTERSECT SELECT * FROM b',
          presto: 'SELECT * FROM a INTERSECT SELECT * FROM b',
          spark: 'SELECT * FROM a INTERSECT SELECT * FROM b',
        },
      },
    );
    this.validateAll(
      'SELECT * FROM a INTERSECT ALL SELECT * FROM b',
      {
        write: {
          bigquery: 'SELECT * FROM a INTERSECT ALL SELECT * FROM b',
          clickhouse: 'SELECT * FROM a INTERSECT SELECT * FROM b',
          duckdb: 'SELECT * FROM a INTERSECT ALL SELECT * FROM b',
          presto: 'SELECT * FROM a INTERSECT ALL SELECT * FROM b',
          spark: 'SELECT * FROM a INTERSECT ALL SELECT * FROM b',
        },
      },
    );
    this.validateAll(
      'SELECT * FROM a EXCEPT DISTINCT SELECT * FROM b',
      {
        write: {
          bigquery: 'SELECT * FROM a EXCEPT DISTINCT SELECT * FROM b',
          clickhouse: 'SELECT * FROM a EXCEPT DISTINCT SELECT * FROM b',
          duckdb: 'SELECT * FROM a EXCEPT SELECT * FROM b',
          presto: 'SELECT * FROM a EXCEPT SELECT * FROM b',
          spark: 'SELECT * FROM a EXCEPT SELECT * FROM b',
        },
      },
    );
    this.validateAll(
      'SELECT * FROM a EXCEPT ALL SELECT * FROM b',
      {
        read: {
          bigquery: 'SELECT * FROM a EXCEPT ALL SELECT * FROM b',
          clickhouse: 'SELECT * FROM a EXCEPT ALL SELECT * FROM b',
          duckdb: 'SELECT * FROM a EXCEPT ALL SELECT * FROM b',
          presto: 'SELECT * FROM a EXCEPT ALL SELECT * FROM b',
          spark: 'SELECT * FROM a EXCEPT ALL SELECT * FROM b',
        },
      },
    );
  }

  testOperators () {
    this.validateIdentity("some.column LIKE 'foo' || another.column || 'bar' || LOWER(x)");
    this.validateIdentity("some.column LIKE 'foo' + another.column + 'bar'");
    this.validateAll("LIKE(x, 'z')", { write: { '': "'z' LIKE x" } });
    this.validateAll(
      'CONCAT(a, b, c)',
      {
        write: {
          '': 'CONCAT(a, b, c)',
          redshift: 'a || b || c',
          sqlite: 'a || b || c',
        },
      },
    );
    this.validateAll(
      "x ILIKE '%y'",
      {
        read: {
          clickhouse: "x ILIKE '%y'",
          duckdb: "x ILIKE '%y'",
          postgres: "x ILIKE '%y'",
          snowflake: "x ILIKE '%y'",
        },
        write: {
          bigquery: "LOWER(x) LIKE LOWER('%y')",
          clickhouse: "x ILIKE '%y'",
          drill: "x `ILIKE` '%y'",
          duckdb: "x ILIKE '%y'",
          hive: "LOWER(x) LIKE LOWER('%y')",
          mysql: "LOWER(x) LIKE LOWER('%y')",
          oracle: "LOWER(x) LIKE LOWER('%y')",
          postgres: "x ILIKE '%y'",
          presto: "LOWER(x) LIKE LOWER('%y')",
          snowflake: "x ILIKE '%y'",
          spark: "x ILIKE '%y'",
          sqlite: "LOWER(x) LIKE LOWER('%y')",
          starrocks: "LOWER(x) LIKE LOWER('%y')",
          trino: "LOWER(x) LIKE LOWER('%y')",
          doris: "LOWER(x) LIKE LOWER('%y')",
        },
      },
    );
    // STR_POSITION tests
    this.validateAll(
      'STR_POSITION(haystack, needle)',
      {
        read: {
          tableau: 'FIND(haystack, needle)',
        },
        write: {
          athena: 'STRPOS(haystack, needle)',
          bigquery: 'INSTR(haystack, needle)',
          clickhouse: 'POSITION(haystack, needle)',
          databricks: 'LOCATE(needle, haystack)',
          doris: 'LOCATE(needle, haystack)',
          drill: 'STRPOS(haystack, needle)',
          duckdb: 'STRPOS(haystack, needle)',
          hive: 'LOCATE(needle, haystack)',
          materialize: 'POSITION(needle IN haystack)',
          mysql: 'LOCATE(needle, haystack)',
          oracle: 'INSTR(haystack, needle)',
          postgres: 'POSITION(needle IN haystack)',
          presto: 'STRPOS(haystack, needle)',
          redshift: 'POSITION(needle IN haystack)',
          risingwave: 'POSITION(needle IN haystack)',
          snowflake: 'CHARINDEX(needle, haystack)',
          spark: 'LOCATE(needle, haystack)',
          spark2: 'LOCATE(needle, haystack)',
          sqlite: 'INSTR(haystack, needle)',
          tableau: 'FIND(haystack, needle)',
          teradata: 'INSTR(haystack, needle)',
          trino: 'STRPOS(haystack, needle)',
          tsql: 'CHARINDEX(needle, haystack)',
        },
      },
    );
    this.validateAll(
      "CONCAT_WS('-', 'a', 'b')",
      {
        write: {
          clickhouse: "CONCAT_WS('-', 'a', 'b')",
          duckdb: "CONCAT_WS('-', 'a', 'b')",
          presto: "CONCAT_WS('-', CAST('a' AS VARCHAR), CAST('b' AS VARCHAR))",
          hive: "CONCAT_WS('-', 'a', 'b')",
          spark: "CONCAT_WS('-', 'a', 'b')",
          trino: "CONCAT_WS('-', CAST('a' AS VARCHAR), CAST('b' AS VARCHAR))",
        },
      },
    );
    this.validateAll(
      'IF(x > 1, 1, 0)',
      {
        write: {
          drill: '`IF`(x > 1, 1, 0)',
          duckdb: 'CASE WHEN x > 1 THEN 1 ELSE 0 END',
          presto: 'IF(x > 1, 1, 0)',
          hive: 'IF(x > 1, 1, 0)',
          spark: 'IF(x > 1, 1, 0)',
          tableau: 'IF x > 1 THEN 1 ELSE 0 END',
        },
      },
    );
    this.validateAll(
      'LEVENSHTEIN(col1, col2)',
      {
        read: {
          bigquery: 'EDIT_DISTANCE(col1, col2)',
          clickhouse: 'editDistance(col1, col2)',
          drill: 'LEVENSHTEIN_DISTANCE(col1, col2)',
          duckdb: 'LEVENSHTEIN(col1, col2)',
          hive: 'LEVENSHTEIN(col1, col2)',
          spark: 'LEVENSHTEIN(col1, col2)',
          postgres: 'LEVENSHTEIN(col1, col2)',
          presto: 'LEVENSHTEIN_DISTANCE(col1, col2)',
          snowflake: 'EDITDISTANCE(col1, col2)',
          sqlite: 'EDITDIST3(col1, col2)',
          trino: 'LEVENSHTEIN_DISTANCE(col1, col2)',
        },
        write: {
          bigquery: 'EDIT_DISTANCE(col1, col2)',
          clickhouse: 'editDistance(col1, col2)',
          drill: 'LEVENSHTEIN_DISTANCE(col1, col2)',
          duckdb: 'LEVENSHTEIN(col1, col2)',
          hive: 'LEVENSHTEIN(col1, col2)',
          spark: 'LEVENSHTEIN(col1, col2)',
          postgres: 'LEVENSHTEIN(col1, col2)',
          presto: 'LEVENSHTEIN_DISTANCE(col1, col2)',
          snowflake: 'EDITDISTANCE(col1, col2)',
          sqlite: 'EDITDIST3(col1, col2)',
          trino: 'LEVENSHTEIN_DISTANCE(col1, col2)',
        },
      },
    );
    this.validateAll(
      'a / b',
      {
        write: {
          bigquery: 'a / b',
          clickhouse: 'a / b',
          databricks: 'a / b',
          duckdb: 'a / b',
          hive: 'a / b',
          mysql: 'a / b',
          oracle: 'a / b',
          snowflake: 'a / b',
          spark: 'a / b',
          starrocks: 'a / b',
          drill: 'CAST(a AS DOUBLE) / b',
          postgres: 'CAST(a AS DOUBLE PRECISION) / b',
          presto: 'CAST(a AS DOUBLE) / b',
          redshift: 'CAST(a AS DOUBLE PRECISION) / b',
          sqlite: 'CAST(a AS REAL) / b',
          teradata: 'CAST(a AS DOUBLE PRECISION) / b',
          trino: 'CAST(a AS DOUBLE) / b',
          tsql: 'CAST(a AS FLOAT) / b',
        },
      },
    );
    this.validateAll(
      'MOD(8 - 1 + 7, 7)',
      {
        write: {
          '': '(8 - 1 + 7) % 7',
          hive: '(8 - 1 + 7) % 7',
          presto: '(8 - 1 + 7) % 7',
          snowflake: '(8 - 1 + 7) % 7',
          bigquery: 'MOD(8 - 1 + 7, 7)',
        },
      },
    );
    this.validateAll(
      'ARRAY_FILTER(the_array, x -> x > 0)',
      {
        write: {
          presto: 'FILTER(the_array, x -> x > 0)',
          hive: 'FILTER(the_array, x -> x > 0)',
          spark: 'FILTER(the_array, x -> x > 0)',
        },
      },
    );
  }

  testLimit () {
    this.validateAll(
      'SELECT * FROM data LIMIT 10, 20',
      { write: { sqlite: 'SELECT * FROM data LIMIT 20 OFFSET 10' } },
    );
    this.validateAll(
      'SELECT x FROM y LIMIT 10',
      {
        read: {
          teradata: 'SELECT TOP 10 x FROM y',
          tsql: 'SELECT TOP 10 x FROM y',
          snowflake: 'SELECT TOP 10 x FROM y',
        },
        write: {
          sqlite: 'SELECT x FROM y LIMIT 10',
          oracle: 'SELECT x FROM y FETCH FIRST 10 ROWS ONLY',
          tsql: 'SELECT TOP 10 x FROM y',
        },
      },
    );
    this.validateAll(
      'SELECT x FROM y LIMIT 10 OFFSET 5',
      {
        write: {
          sqlite: 'SELECT x FROM y LIMIT 10 OFFSET 5',
          oracle: 'SELECT x FROM y OFFSET 5 ROWS FETCH FIRST 10 ROWS ONLY',
        },
      },
    );
    this.validateAll(
      'SELECT x FROM y OFFSET 10 FETCH FIRST 3 ROWS ONLY',
      {
        write: {
          sqlite: 'SELECT x FROM y LIMIT 3 OFFSET 10',
          oracle: 'SELECT x FROM y OFFSET 10 ROWS FETCH FIRST 3 ROWS ONLY',
        },
      },
    );
  }

  testAlias () {
    this.validateAll(
      'SELECT y x FROM my_table t',
      {
        write: {
          drill: 'SELECT y AS x FROM my_table AS t',
          hive: 'SELECT y AS x FROM my_table AS t',
          oracle: 'SELECT y AS x FROM my_table t',
          postgres: 'SELECT y AS x FROM my_table AS t',
          sqlite: 'SELECT y AS x FROM my_table AS t',
        },
      },
    );
    this.validateAll(
      'SELECT 1 AS "foo"',
      {
        read: {
          mysql: "SELECT 1 'foo'",
          sqlite: "SELECT 1 'foo'",
          tsql: "SELECT 1 'foo'",
        },
      },
    );

    for (const dialect of ['presto', 'hive', 'postgres', 'clickhouse', 'bigquery', 'snowflake', 'duckdb'] as const) {
      expect(() => parseOne("SELECT 1 'foo'", { read: dialect })).toThrow(ParseError);
    }
  }

  testNullsafeEq () {
    this.validateAll(
      'SELECT a IS NOT DISTINCT FROM b',
      {
        read: {
          mysql: 'SELECT a <=> b',
          postgres: 'SELECT a IS NOT DISTINCT FROM b',
        },
        write: {
          mysql: 'SELECT a <=> b',
          postgres: 'SELECT a IS NOT DISTINCT FROM b',
        },
      },
    );
  }

  testNullsafeNeq () {
    this.validateAll(
      'SELECT a IS DISTINCT FROM b',
      {
        read: {
          postgres: 'SELECT a IS DISTINCT FROM b',
        },
        write: {
          mysql: 'SELECT NOT a <=> b',
          postgres: 'SELECT a IS DISTINCT FROM b',
        },
      },
    );
  }

  testHashComments () {
    this.validateAll(
      'SELECT 1 /* arbitrary content,,, until end-of-line */',
      {
        read: {
          mysql: 'SELECT 1 # arbitrary content,,, until end-of-line',
          bigquery: 'SELECT 1 # arbitrary content,,, until end-of-line',
          clickhouse: 'SELECT 1 #! arbitrary content,,, until end-of-line',
        },
      },
    );
  }

  testTransactions () {
    this.validateAll(
      'BEGIN TRANSACTION',
      {
        write: {
          bigquery: 'BEGIN TRANSACTION',
          mysql: 'BEGIN',
          postgres: 'BEGIN',
          presto: 'START TRANSACTION',
          trino: 'START TRANSACTION',
          redshift: 'BEGIN',
          snowflake: 'BEGIN',
          sqlite: 'BEGIN TRANSACTION',
          tsql: 'BEGIN TRANSACTION',
        },
      },
    );
  }

  testMerge () {
    this.validateAll(
      `
      MERGE INTO target USING source ON target.id = source.id
          WHEN NOT MATCHED THEN INSERT (id) values (source.id)
      `,
      {
        write: {
          bigquery: 'MERGE INTO target USING source ON target.id = source.id WHEN NOT MATCHED THEN INSERT (id) VALUES (source.id)',
          snowflake: 'MERGE INTO target USING source ON target.id = source.id WHEN NOT MATCHED THEN INSERT (id) VALUES (source.id)',
          spark: 'MERGE INTO target USING source ON target.id = source.id WHEN NOT MATCHED THEN INSERT (id) VALUES (source.id)',
        },
      },
    );
    this.validateAll(
      `
      MERGE INTO target USING source ON target.id = source.id
          WHEN MATCHED AND source.is_deleted = 1 THEN DELETE
          WHEN MATCHED THEN UPDATE SET val = source.val
          WHEN NOT MATCHED THEN INSERT (id, val) VALUES (source.id, source.val)
      `,
      {
        write: {
          bigquery: 'MERGE INTO target USING source ON target.id = source.id WHEN MATCHED AND source.is_deleted = 1 THEN DELETE WHEN MATCHED THEN UPDATE SET val = source.val WHEN NOT MATCHED THEN INSERT (id, val) VALUES (source.id, source.val)',
          snowflake: 'MERGE INTO target USING source ON target.id = source.id WHEN MATCHED AND source.is_deleted = 1 THEN DELETE WHEN MATCHED THEN UPDATE SET val = source.val WHEN NOT MATCHED THEN INSERT (id, val) VALUES (source.id, source.val)',
          spark: 'MERGE INTO target USING source ON target.id = source.id WHEN MATCHED AND source.is_deleted = 1 THEN DELETE WHEN MATCHED THEN UPDATE SET val = source.val WHEN NOT MATCHED THEN INSERT (id, val) VALUES (source.id, source.val)',
        },
      },
    );
  }

  testSubstring () {
    this.validateAll(
      "SUBSTR('123456', 2, 3)",
      {
        write: {
          bigquery: "SUBSTRING('123456', 2, 3)",
          oracle: "SUBSTR('123456', 2, 3)",
          postgres: "SUBSTRING('123456' FROM 2 FOR 3)",
        },
      },
    );
    this.validateAll(
      "SUBSTRING('123456', 2, 3)",
      {
        write: {
          bigquery: "SUBSTRING('123456', 2, 3)",
          oracle: "SUBSTR('123456', 2, 3)",
          postgres: "SUBSTRING('123456' FROM 2 FOR 3)",
        },
      },
    );
  }

  testLogarithm () {
    for (const base of [2, 10]) {
      this.validateAll(
        `LOG(${base}, a)`,
        {
          read: {
            '': `LOG${base}(a)`,
            bigquery: `LOG${base}(a)`,
            clickhouse: `LOG${base}(a)`,
            databricks: `LOG${base}(a)`,
            dremio: `LOG${base}(a)`,
            duckdb: `LOG${base}(a)`,
            mysql: `LOG${base}(a)`,
            postgres: `LOG${base}(a)`,
            presto: `LOG${base}(a)`,
            spark: `LOG${base}(a)`,
            sqlite: `LOG${base}(a)`,
            trino: `LOG${base}(a)`,
            tsql: `LOG${base}(a)`,
          },
          write: {
            bigquery: `LOG(a, ${base})`,
            clickhouse: `LOG${base}(a)`,
            dremio: `LOG(${base}, a)`,
            duckdb: `LOG(${base}, a)`,
            mysql: `LOG(${base}, a)`,
            oracle: `LOG(${base}, a)`,
            postgres: `LOG(${base}, a)`,
            presto: `LOG${base}(a)`,
            redshift: `LOG(${base}, a)`,
            snowflake: `LOG(${base}, a)`,
            spark2: `LOG(${base}, a)`,
            spark: `LOG(${base}, a)`,
            sqlite: `LOG(${base}, a)`,
            starrocks: `LOG(${base}, a)`,
            tableau: `LOG(a, ${base})`,
            trino: `LOG(${base}, a)`,
            tsql: `LOG(a, ${base})`,
          },
        },
      );
    }
    this.validateAll(
      'LOG(b, n)',
      {
        read: {
          bigquery: 'LOG(n, b)',
          databricks: 'LOG(b, n)',
          drill: 'LOG(b, n)',
          duckdb: 'LOG(b, n)',
          hive: 'LOG(b, n)',
          mysql: 'LOG(b, n)',
          oracle: 'LOG(b, n)',
          postgres: 'LOG(b, n)',
          snowflake: 'LOG(b, n)',
          spark: 'LOG(b, n)',
          sqlite: 'LOG(b, n)',
          trino: 'LOG(b, n)',
          tsql: 'LOG(n, b)',
        },
        write: {
          clickhouse: UnsupportedError,
          presto: UnsupportedError,
        },
      },
    );
  }

  testCountIf () {
    this.validateIdentity('COUNT_IF(DISTINCT cond)');
    this.validateAll(
      'SELECT COUNT_IF(cond) FILTER',
      { write: { '': 'SELECT COUNT_IF(cond) AS FILTER' } },
    );
    this.validateAll(
      'SELECT COUNT_IF(col % 2 = 0) FROM foo',
      {
        write: {
          '': 'SELECT COUNT_IF(col % 2 = 0) FROM foo',
          databricks: 'SELECT COUNT_IF(col % 2 = 0) FROM foo',
          presto: 'SELECT COUNT_IF(col % 2 = 0) FROM foo',
          snowflake: 'SELECT COUNT_IF(col % 2 = 0) FROM foo',
          sqlite: 'SELECT SUM(IIF(col % 2 = 0, 1, 0)) FROM foo',
          tsql: 'SELECT COUNT_IF(col % 2 = 0) FROM foo',
          postgres: 'SELECT SUM(CASE WHEN col % 2 = 0 THEN 1 ELSE 0 END) FROM foo',
          redshift: 'SELECT SUM(CASE WHEN col % 2 = 0 THEN 1 ELSE 0 END) FROM foo',
        },
      },
    );
  }

  testCastToUserDefinedType () {
    this.validateIdentity('CAST(x AS some_udt(1234))');
    this.validateAll(
      'CAST(x AS some_udt)',
      {
        write: {
          '': 'CAST(x AS some_udt)',
          oracle: 'CAST(x AS some_udt)',
          postgres: 'CAST(x AS some_udt)',
          presto: 'CAST(x AS some_udt)',
          teradata: 'CAST(x AS some_udt)',
          tsql: 'CAST(x AS some_udt)',
        },
      },
    );
    expect(() => parseOne('CAST(x AS some_udt)', { read: 'bigquery' })).toThrow(ParseError);
  }

  testQualify () {
    this.validateAll(
      'SELECT * FROM t QUALIFY COUNT(*) OVER () > 1',
      {
        write: {
          duckdb: 'SELECT * FROM t QUALIFY COUNT(*) OVER () > 1',
          snowflake: 'SELECT * FROM t QUALIFY COUNT(*) OVER () > 1',
          clickhouse: 'SELECT * FROM t QUALIFY COUNT(*) OVER () > 1',
          mysql: 'SELECT * FROM (SELECT *, COUNT(*) OVER () AS _w FROM t) AS _t WHERE _w > 1',
          oracle: 'SELECT * FROM (SELECT *, COUNT(*) OVER () AS _w FROM t) _t WHERE _w > 1',
          postgres: 'SELECT * FROM (SELECT *, COUNT(*) OVER () AS _w FROM t) AS _t WHERE _w > 1',
          tsql: 'SELECT * FROM (SELECT *, COUNT_BIG(*) OVER () AS _w FROM t) AS _t WHERE _w > 1',
        },
      },
    );
  }

  testWindowExclude () {
    for (const option of ['CURRENT ROW', 'TIES', 'GROUP'] as const) {
      this.validateAll(
        `SELECT SUM(X) OVER (PARTITION BY x RANGE BETWEEN 1 PRECEDING AND CURRENT ROW EXCLUDE ${option})`,
        {
          write: {
            duckdb: `SELECT SUM(X) OVER (PARTITION BY x RANGE BETWEEN 1 PRECEDING AND CURRENT ROW EXCLUDE ${option})`,
            postgres: `SELECT SUM(X) OVER (PARTITION BY x RANGE BETWEEN 1 PRECEDING AND CURRENT ROW EXCLUDE ${option})`,
            sqlite: `SELECT SUM(X) OVER (PARTITION BY x RANGE BETWEEN 1 PRECEDING AND CURRENT ROW EXCLUDE ${option})`,
            oracle: `SELECT SUM(X) OVER (PARTITION BY x RANGE BETWEEN 1 PRECEDING AND CURRENT ROW EXCLUDE ${option})`,
          },
        },
      );
    }
    this.validateAll(
      'SELECT SUM(X) OVER (PARTITION BY x RANGE BETWEEN 1 PRECEDING AND CURRENT ROW)',
      {
        read: {
          duckdb: 'SELECT SUM(X) OVER (PARTITION BY x RANGE BETWEEN 1 PRECEDING AND CURRENT ROW EXCLUDE NO OTHERS)',
          postgres: 'SELECT SUM(X) OVER (PARTITION BY x RANGE BETWEEN 1 PRECEDING AND CURRENT ROW EXCLUDE NO OTHERS)',
          sqlite: 'SELECT SUM(X) OVER (PARTITION BY x RANGE BETWEEN 1 PRECEDING AND CURRENT ROW EXCLUDE NO OTHERS)',
          oracle: 'SELECT SUM(X) OVER (PARTITION BY x RANGE BETWEEN 1 PRECEDING AND CURRENT ROW EXCLUDE NO OTHERS)',
        },
        write: {
          duckdb: 'SELECT SUM(X) OVER (PARTITION BY x RANGE BETWEEN 1 PRECEDING AND CURRENT ROW)',
          postgres: 'SELECT SUM(X) OVER (PARTITION BY x RANGE BETWEEN 1 PRECEDING AND CURRENT ROW)',
          sqlite: 'SELECT SUM(X) OVER (PARTITION BY x RANGE BETWEEN 1 PRECEDING AND CURRENT ROW)',
          oracle: 'SELECT SUM(X) OVER (PARTITION BY x RANGE BETWEEN 1 PRECEDING AND CURRENT ROW)',
        },
      },
    );
  }

  testNestedCtes () {
    this.validateAll(
      'SELECT * FROM (WITH t AS (SELECT 1 AS c) SELECT c FROM t) AS subq',
      {
        write: {
          bigquery: 'SELECT * FROM (WITH t AS (SELECT 1 AS c) SELECT c FROM t) AS subq',
          clickhouse: 'SELECT * FROM (WITH t AS (SELECT 1 AS c) SELECT c FROM t) AS subq',
          databricks: 'WITH t AS (SELECT 1 AS c) SELECT * FROM (SELECT c FROM t) AS subq',
          duckdb: 'SELECT * FROM (WITH t AS (SELECT 1 AS c) SELECT c FROM t) AS subq',
          hive: 'WITH t AS (SELECT 1 AS c) SELECT * FROM (SELECT c FROM t) AS subq',
          mysql: 'SELECT * FROM (WITH t AS (SELECT 1 AS c) SELECT c FROM t) AS subq',
          postgres: 'SELECT * FROM (WITH t AS (SELECT 1 AS c) SELECT c FROM t) AS subq',
          presto: 'SELECT * FROM (WITH t AS (SELECT 1 AS c) SELECT c FROM t) AS subq',
          redshift: 'SELECT * FROM (WITH t AS (SELECT 1 AS c) SELECT c FROM t) AS subq',
          snowflake: 'SELECT * FROM (WITH t AS (SELECT 1 AS c) SELECT c FROM t) AS subq',
          spark: 'WITH t AS (SELECT 1 AS c) SELECT * FROM (SELECT c FROM t) AS subq',
          spark2: 'WITH t AS (SELECT 1 AS c) SELECT * FROM (SELECT c FROM t) AS subq',
          sqlite: 'SELECT * FROM (WITH t AS (SELECT 1 AS c) SELECT c FROM t) AS subq',
          trino: 'SELECT * FROM (WITH t AS (SELECT 1 AS c) SELECT c FROM t) AS subq',
          tsql: 'WITH t AS (SELECT 1 AS c) SELECT * FROM (SELECT c AS c FROM t) AS subq',
        },
      },
    );
  }

  testRandom () {
    this.validateAll(
      'RAND()',
      {
        write: {
          bigquery: 'RAND()',
          clickhouse: 'randCanonical()',
          databricks: 'RAND()',
          doris: 'RAND()',
          drill: 'RAND()',
          duckdb: 'RANDOM()',
          hive: 'RAND()',
          mysql: 'RAND()',
          oracle: 'DBMS_RANDOM.VALUE()',
          postgres: 'RANDOM()',
          presto: 'RAND()',
          spark: 'RAND()',
          sqlite: 'RANDOM()',
          tsql: 'RAND()',
        },
        read: {
          bigquery: 'RAND()',
          clickhouse: 'randCanonical()',
          databricks: 'RAND()',
          doris: 'RAND()',
          drill: 'RAND()',
          duckdb: 'RANDOM()',
          hive: 'RAND()',
          mysql: 'RAND()',
          oracle: 'DBMS_RANDOM.VALUE()',
          postgres: 'RANDOM()',
          presto: 'RAND()',
          spark: 'RAND()',
          sqlite: 'RANDOM()',
          tsql: 'RAND()',
        },
      },
    );
  }

  testArrayAny () {
    this.validateAll(
      'ARRAY_ANY(arr, x -> pred)',
      {
        write: {
          '': 'ARRAY_ANY(arr, x -> pred)',
          bigquery: '(ARRAY_LENGTH(arr) = 0 OR ARRAY_LENGTH(ARRAY(SELECT x FROM UNNEST(arr) AS x WHERE pred)) <> 0)',
          clickhouse: '(LENGTH(arr) = 0 OR LENGTH(arrayFilter(x -> pred, arr)) <> 0)',
          databricks: '(SIZE(arr) = 0 OR SIZE(FILTER(arr, x -> pred)) <> 0)',
          doris: UnsupportedError,
          drill: UnsupportedError,
          duckdb: '(ARRAY_LENGTH(arr) = 0 OR ARRAY_LENGTH(LIST_FILTER(arr, x -> pred)) <> 0)',
          hive: UnsupportedError,
          mysql: UnsupportedError,
          oracle: UnsupportedError,
          postgres: '(ARRAY_LENGTH(arr, 1) = 0 OR ARRAY_LENGTH(ARRAY(SELECT x FROM UNNEST(arr) AS _t0(x) WHERE pred), 1) <> 0)',
          presto: 'ANY_MATCH(arr, x -> pred)',
          redshift: UnsupportedError,
          snowflake: UnsupportedError,
          spark: '(SIZE(arr) = 0 OR SIZE(FILTER(arr, x -> pred)) <> 0)',
          spark2: '(SIZE(arr) = 0 OR SIZE(FILTER(arr, x -> pred)) <> 0)',
          sqlite: UnsupportedError,
          starrocks: UnsupportedError,
          tableau: UnsupportedError,
          teradata: '(CARDINALITY(arr) = 0 OR CARDINALITY(FILTER(arr, x -> pred)) <> 0)',
          trino: 'ANY_MATCH(arr, x -> pred)',
          tsql: UnsupportedError,
        },
      },
    );
  }

  testTruncate () {
    this.validateIdentity('TRUNCATE TABLE table');
    this.validateIdentity('TRUNCATE TABLE db.schema.test');
    this.validateIdentity('TRUNCATE TABLE IF EXISTS db.schema.test');
    this.validateIdentity('TRUNCATE TABLE t1, t2, t3');
  }

  testCreateSequence () {
    this.validateIdentity('CREATE SEQUENCE seq');
    this.validateIdentity(
      "CREATE TEMPORARY SEQUENCE seq AS SMALLINT START WITH 3 INCREMENT BY 2 MINVALUE 1 MAXVALUE 10 CACHE 1 NO CYCLE OWNED BY table.col",
    );
    this.validateIdentity(
      'CREATE SEQUENCE seq START WITH 1 NO MINVALUE NO MAXVALUE CYCLE NO CACHE',
    );
    this.validateIdentity('CREATE OR REPLACE TEMPORARY SEQUENCE seq INCREMENT BY 1 NO CYCLE');
    this.validateIdentity(
      "CREATE OR REPLACE SEQUENCE IF NOT EXISTS seq COMMENT='test comment' ORDER",
    );
  }

  testStringFunctions () {
    for (const padFunc of ['LPAD', 'RPAD'] as const) {
      const chAlias = padFunc === 'LPAD' ? 'LEFTPAD' : 'RIGHTPAD';
      for (const fillPattern of ['', ", ' '"] as const) {
        this.validateAll(
          `SELECT ${padFunc}('bar', 5${fillPattern})`,
          {
            read: {
              snowflake: `SELECT ${padFunc}('bar', 5${fillPattern})`,
              databricks: `SELECT ${padFunc}('bar', 5${fillPattern})`,
              spark: `SELECT ${padFunc}('bar', 5${fillPattern})`,
              postgres: `SELECT ${padFunc}('bar', 5${fillPattern})`,
              clickhouse: `SELECT ${chAlias}('bar', 5${fillPattern})`,
            },
            write: {
              '': `SELECT ${padFunc}('bar', 5${fillPattern})`,
              spark: `SELECT ${padFunc}('bar', 5${fillPattern})`,
              postgres: `SELECT ${padFunc}('bar', 5${fillPattern})`,
              clickhouse: `SELECT ${padFunc}('bar', 5${fillPattern})`,
              snowflake: `SELECT ${padFunc}('bar', 5${fillPattern})`,
              databricks: `SELECT ${padFunc}('bar', 5${fillPattern})`,
              duckdb: `SELECT ${padFunc}('bar', 5, ' ')`,
              mysql: `SELECT ${padFunc}('bar', 5, ' ')`,
              hive: `SELECT ${padFunc}('bar', 5, ' ')`,
              spark2: `SELECT ${padFunc}('bar', 5, ' ')`,
              presto: `SELECT ${padFunc}('bar', 5, ' ')`,
              trino: `SELECT ${padFunc}('bar', 5, ' ')`,
            },
          },
        );
      }
    }
  }

  testSetOperationSpecifiers () {
    this.validateAll(
      'SELECT 1 EXCEPT ALL SELECT 1',
      {
        write: {
          '': 'SELECT 1 EXCEPT ALL SELECT 1',
          bigquery: UnsupportedError,
          clickhouse: 'SELECT 1 EXCEPT SELECT 1',
          databricks: 'SELECT 1 EXCEPT ALL SELECT 1',
          duckdb: 'SELECT 1 EXCEPT ALL SELECT 1',
          mysql: 'SELECT 1 EXCEPT ALL SELECT 1',
          oracle: 'SELECT 1 EXCEPT ALL SELECT 1',
          postgres: 'SELECT 1 EXCEPT ALL SELECT 1',
          presto: UnsupportedError,
          redshift: UnsupportedError,
          snowflake: UnsupportedError,
          spark: 'SELECT 1 EXCEPT ALL SELECT 1',
          sqlite: UnsupportedError,
          starrocks: UnsupportedError,
          trino: 'SELECT 1 EXCEPT ALL SELECT 1',
          tsql: UnsupportedError,
        },
      },
    );
  }

  testTrim () {
    this.validateAll(
      "TRIM('abc', 'a')",
      {
        read: {
          bigquery: "TRIM('abc', 'a')",
          snowflake: "TRIM('abc', 'a')",
          hive: "TRIM('abc', 'a')",
          spark2: "TRIM('a', 'abc')",
          spark: "TRIM('a', 'abc')",
          databricks: "TRIM('a', 'abc')",
        },
        write: {
          bigquery: "TRIM('abc', 'a')",
          snowflake: "TRIM('abc', 'a')",
          hive: "TRIM('a' FROM 'abc')",
          spark2: "TRIM('a' FROM 'abc')",
          spark: "TRIM('a' FROM 'abc')",
          databricks: "TRIM('a' FROM 'abc')",
        },
      },
    );
  }

  testUuid () {
    this.validateAll(
      'UUID()',
      {
        read: {
          hive: 'UUID()',
          spark2: 'UUID()',
          spark: 'UUID()',
          databricks: 'UUID()',
          duckdb: 'UUID()',
          presto: 'UUID()',
          trino: 'UUID()',
          mysql: 'UUID()',
          postgres: 'GEN_RANDOM_UUID()',
          snowflake: 'UUID_STRING()',
          tsql: 'NEWID()',
        },
        write: {
          hive: 'UUID()',
          spark2: 'UUID()',
          spark: 'UUID()',
          databricks: 'UUID()',
          duckdb: 'UUID()',
          presto: 'UUID()',
          trino: 'UUID()',
          mysql: 'UUID()',
          postgres: 'GEN_RANDOM_UUID()',
          bigquery: 'GENERATE_UUID()',
          snowflake: 'UUID_STRING()',
          tsql: 'NEWID()',
        },
      },
    );
  }

  testEscapedIdentifierDelimiter () {
    for (const dialect of ['databricks', 'hive', 'mysql', 'spark2', 'spark'] as const) {
      this.validateAll(
        'SELECT 1 AS "x`"',
        {
          read: { [dialect]: 'SELECT 1 AS `x```' },
          write: { [dialect]: 'SELECT 1 AS `x```' },
        },
      );
    }

    for (const dialect of ['', 'clickhouse', 'duckdb', 'postgres', 'presto', 'trino', 'redshift', 'snowflake', 'sqlite'] as const) {
      this.validateAll(
        'SELECT 1 AS "x"""',
        {
          read: { [dialect]: 'SELECT 1 AS "x"""' },
          write: { [dialect]: 'SELECT 1 AS "x"""' },
        },
      );
    }
  }

  testMedian () {
    for (const suffix of ['', ' OVER ()'] as const) {
      this.validateAll(
        `MEDIAN(x)${suffix}`,
        {
          read: {
            snowflake: `MEDIAN(x)${suffix}`,
            duckdb: `MEDIAN(x)${suffix}`,
            spark: `MEDIAN(x)${suffix}`,
            databricks: `MEDIAN(x)${suffix}`,
            redshift: `MEDIAN(x)${suffix}`,
            oracle: `MEDIAN(x)${suffix}`,
          },
          write: {
            snowflake: `MEDIAN(x)${suffix}`,
            duckdb: `MEDIAN(x)${suffix}`,
            spark: `MEDIAN(x)${suffix}`,
            databricks: `MEDIAN(x)${suffix}`,
            redshift: `MEDIAN(x)${suffix}`,
            oracle: `MEDIAN(x)${suffix}`,
            clickhouse: `median(x)${suffix}`,
            postgres: `PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY x)${suffix}`,
          },
        },
      );
    }
  }

  testCurrentSchema () {
    this.validateAll(
      'CURRENT_SCHEMA()',
      {
        read: {
          mysql: 'SCHEMA()',
          postgres: 'CURRENT_SCHEMA()',
          tsql: 'SCHEMA_NAME()',
        },
        write: {
          sqlite: "'main'",
          mysql: 'SCHEMA()',
          postgres: 'CURRENT_SCHEMA',
          tsql: 'SCHEMA_NAME()',
        },
      },
    );
  }

  testIntegerHexStrings () {
    const integerDialects = ['bigquery', 'clickhouse'] as const;
    for (const readDialect of integerDialects) {
      for (const writeDialect of ['', 'duckdb', 'databricks', 'snowflake', 'spark', 'redshift'] as const) {
        expect(
          parseOne('SELECT 0xCC', { read: readDialect }).sql({ dialect: writeDialect || undefined }),
        ).toBe('SELECT 204');
      }
      for (const other of integerDialects) {
        expect(
          parseOne('SELECT 0xCC', { read: readDialect }).sql({ dialect: other }),
        ).toBe('SELECT 0xCC');
      }
    }
  }

  testAscii () {
    this.validateAll(
      "ASCII('A')",
      {
        read: {
          bigquery: "ASCII('A')",
          clickhouse: "ASCII('A')",
          databricks: "ASCII('A')",
          hive: "ASCII('A')",
          mysql: "ASCII('A')",
          postgres: "ASCII('A')",
          redshift: "ASCII('A')",
          snowflake: "ASCII('A')",
          tsql: "ASCII('A')",
        },
        write: {
          bigquery: "ASCII('A')",
          clickhouse: "ASCII('A')",
          databricks: "ASCII('A')",
          hive: "ASCII('A')",
          mysql: "ASCII('A')",
          postgres: "ASCII('A')",
          redshift: "ASCII('A')",
          snowflake: "ASCII('A')",
          tsql: "ASCII('A')",
        },
      },
    );
  }

  testBetween () {
    this.validateAll(
      'SELECT x BETWEEN 2 AND 10',
      {
        read: {
          '': 'SELECT x BETWEEN 2 AND 10',
          clickhouse: 'SELECT x BETWEEN 2 AND 10',
          duckdb: 'SELECT x BETWEEN 2 AND 10',
          mysql: 'SELECT x BETWEEN 2 AND 10',
          postgres: 'SELECT x BETWEEN 2 AND 10',
        },
        write: {
          '': 'SELECT x BETWEEN 2 AND 10',
          clickhouse: 'SELECT x BETWEEN 2 AND 10',
          duckdb: 'SELECT x BETWEEN 2 AND 10',
          mysql: 'SELECT x BETWEEN 2 AND 10',
          postgres: 'SELECT x BETWEEN 2 AND 10',
        },
      },
    );
    this.validateAll(
      'SELECT x BETWEEN SYMMETRIC 10 AND 2',
      {
        write: {
          '': 'SELECT (x BETWEEN 10 AND 2 OR x BETWEEN 2 AND 10)',
          clickhouse: 'SELECT (x BETWEEN 10 AND 2 OR x BETWEEN 2 AND 10)',
          duckdb: 'SELECT (x BETWEEN 10 AND 2 OR x BETWEEN 2 AND 10)',
          mysql: 'SELECT (x BETWEEN 10 AND 2 OR x BETWEEN 2 AND 10)',
          postgres: 'SELECT x BETWEEN SYMMETRIC 10 AND 2',
        },
      },
    );
  }

  testLikeQuantifiers () {
    for (const quantifier of ['ANY', 'ALL'] as const) {
      const connector = quantifier === 'ANY' ? 'OR' : 'AND';
      this.validateAll(
        `SELECT col LIKE ${quantifier} (x, y, z)`,
        {
          read: {
            '': `SELECT col LIKE ${quantifier} (x, y, z)`,
            bigquery: `SELECT col LIKE ${quantifier} (x, y, z)`,
            snowflake: `SELECT col LIKE ${quantifier} (x, y, z)`,
            spark: `SELECT col LIKE ${quantifier} (x, y, z)`,
            databricks: `SELECT col LIKE ${quantifier} (x, y, z)`,
          },
          write: {
            bigquery: `SELECT col LIKE ${quantifier} (x, y, z)`,
            snowflake: `SELECT col LIKE ${quantifier} (x, y, z)`,
            spark: `SELECT col LIKE ${quantifier} (x, y, z)`,
            databricks: `SELECT col LIKE ${quantifier} (x, y, z)`,
            duckdb: `SELECT (col LIKE x ${connector} col LIKE y) ${connector} col LIKE z`,
          },
        },
      );
    }
  }

  testDateToUnixDate () {
    this.validateAll(
      'DATE_FROM_UNIX_DATE(1)',
      {
        write: {
          '': "DATE_ADD(CAST('1970-01-01' AS DATE), 1, 'DAY')",
          bigquery: 'DATE_FROM_UNIX_DATE(1)',
          spark: 'DATE_FROM_UNIX_DATE(1)',
          databricks: 'DATE_FROM_UNIX_DATE(1)',
          snowflake: "DATEADD(DAY, 1, CAST('1970-01-01' AS DATE))",
          duckdb: "CAST('1970-01-01' AS DATE) + INTERVAL 1 DAY",
          redshift: "DATEADD(DAY, 1, CAST('1970-01-01' AS DATE))",
          presto: "DATE_ADD('DAY', 1, CAST('1970-01-01' AS DATE))",
          trino: "DATE_ADD('DAY', 1, CAST('1970-01-01' AS DATE))",
        },
      },
    );
  }

  testWeekOfYear () {
    this.validateAll(
      "WEEKOFYEAR(CAST('2025-01-01' AS DATE))",
      {
        write: {
          duckdb: "WEEKOFYEAR(CAST('2025-01-01' AS DATE))",
          exasol: "WEEK(CAST('2025-01-01' AS DATE))",
          hive: "WEEKOFYEAR(CAST('2025-01-01' AS DATE))",
          mysql: "WEEKOFYEAR(CAST('2025-01-01' AS DATE))",
          spark: "WEEKOFYEAR(CAST('2025-01-01' AS DATE))",
          snowflake: "WEEKISO(CAST('2025-01-01' AS DATE))",
        },
      },
    );
  }

  testJustify () {
    this.validateAll(
      "JUSTIFY_DAYS(INTERVAL '1' DAY)",
      {
        read: {
          '': "JUSTIFY_DAYS(INTERVAL '1' DAY)",
          bigquery: "JUSTIFY_DAYS(INTERVAL '1' DAY)",
          postgres: "JUSTIFY_DAYS(INTERVAL '1 DAY')",
          materialize: "JUSTIFY_DAYS(INTERVAL '1 DAY')",
        },
        write: {
          bigquery: "JUSTIFY_DAYS(INTERVAL '1' DAY)",
          postgres: "JUSTIFY_DAYS(INTERVAL '1 DAY')",
          materialize: "JUSTIFY_DAYS(INTERVAL '1 DAY')",
        },
      },
    );
  }

  testUnixTime () {
    this.validateAll(
      'UNIX_MICROS(foo)',
      {
        read: {
          '': 'UNIX_MICROS(foo)',
          bigquery: 'UNIX_MICROS(foo)',
          spark: 'UNIX_MICROS(foo)',
          databricks: 'UNIX_MICROS(foo)',
        },
        write: {
          bigquery: 'UNIX_MICROS(foo)',
          spark: 'UNIX_MICROS(foo)',
          databricks: 'UNIX_MICROS(foo)',
        },
      },
    );
    this.validateAll(
      'UNIX_MILLIS(foo)',
      {
        read: {
          '': 'UNIX_MILLIS(foo)',
          bigquery: 'UNIX_MILLIS(foo)',
          spark: 'UNIX_MILLIS(foo)',
          databricks: 'UNIX_MILLIS(foo)',
        },
        write: {
          bigquery: 'UNIX_MILLIS(foo)',
          spark: 'UNIX_MILLIS(foo)',
          databricks: 'UNIX_MILLIS(foo)',
        },
      },
    );
  }

  testReverse () {
    this.validateAll(
      'REVERSE(x)',
      {
        read: {
          '': 'REVERSE(x)',
          bigquery: 'REVERSE(x)',
          hive: 'REVERSE(x)',
          spark: 'REVERSE(x)',
          mysql: 'REVERSE(x)',
          postgres: 'REVERSE(x)',
          tsql: 'REVERSE(x)',
          snowflake: 'REVERSE(x)',
          presto: 'REVERSE(x)',
          clickhouse: 'REVERSE(x)',
          redshift: 'REVERSE(x)',
        },
        write: {
          bigquery: 'REVERSE(x)',
          hive: 'REVERSE(x)',
          spark: 'REVERSE(x)',
          mysql: 'REVERSE(x)',
          postgres: 'REVERSE(x)',
          tsql: 'REVERSE(x)',
          snowflake: 'REVERSE(x)',
          presto: 'REVERSE(x)',
          clickhouse: 'REVERSE(x)',
          redshift: 'REVERSE(x)',
        },
      },
    );
  }

  testRegrCount () {
    this.validateAll(
      'REGR_COUNT(x, y)',
      {
        read: {
          '': 'REGR_COUNT(x, y)',
          databricks: 'REGR_COUNT(x, y)',
          duckdb: 'REGR_COUNT(x, y)',
          postgres: 'REGR_COUNT(x, y)',
          snowflake: 'REGR_COUNT(x, y)',
        },
        write: {
          '': 'REGR_COUNT(x, y)',
          databricks: 'REGR_COUNT(x, y)',
          duckdb: 'REGR_COUNT(x, y)',
          postgres: 'REGR_COUNT(x, y)',
          snowflake: 'REGR_COUNT(x, y)',
        },
      },
    );
  }

  testTranslate () {
    this.validateAll(
      'TRANSLATE(x, y, z)',
      {
        read: {
          '': 'TRANSLATE(x, y, z)',
          bigquery: 'TRANSLATE(x, y, z)',
          hive: 'TRANSLATE(x, y, z)',
          postgres: 'TRANSLATE(x, y, z)',
          snowflake: 'TRANSLATE(x, y, z)',
          oracle: 'TRANSLATE(x, y, z)',
        },
        write: {
          '': 'TRANSLATE(x, y, z)',
          bigquery: 'TRANSLATE(x, y, z)',
          hive: 'TRANSLATE(x, y, z)',
          postgres: 'TRANSLATE(x, y, z)',
          snowflake: 'TRANSLATE(x, y, z)',
          oracle: 'TRANSLATE(x, y, z)',
        },
      },
    );
  }

  testSoundex () {
    this.validateAll(
      'SOUNDEX(x)',
      {
        read: {
          '': 'SOUNDEX(x)',
          bigquery: 'SOUNDEX(x)',
          postgres: 'SOUNDEX(x)',
          snowflake: 'SOUNDEX(x)',
          oracle: 'SOUNDEX(x)',
        },
        write: {
          bigquery: 'SOUNDEX(x)',
          postgres: 'SOUNDEX(x)',
          snowflake: 'SOUNDEX(x)',
          oracle: 'SOUNDEX(x)',
        },
      },
    );
  }

  testGrouping () {
    this.validateAll(
      'GROUPING(x)',
      {
        read: {
          '': 'GROUPING(x)',
          bigquery: 'GROUPING(x)',
          postgres: 'GROUPING(x)',
          snowflake: 'GROUPING(x)',
        },
        write: {
          bigquery: 'GROUPING(x)',
          postgres: 'GROUPING(x)',
          snowflake: 'GROUPING(x)',
        },
      },
    );
  }

  testFarmFingerprint () {
    this.validateAll(
      'FARM_FINGERPRINT(x)',
      {
        read: {
          '': 'FARM_FINGERPRINT(x)',
          bigquery: 'FARM_FINGERPRINT(x)',
          clickhouse: 'farmFingerprint64(x)',
          redshift: 'FARMFINGERPRINT64(x)',
        },
        write: {
          bigquery: 'FARM_FINGERPRINT(x)',
          clickhouse: 'farmFingerprint64(x)',
          redshift: 'FARMFINGERPRINT64(x)',
        },
      },
    );
  }

  testFromToBase32 () {
    this.validateAll(
      'FROM_BASE32(x)',
      {
        read: {
          '': 'FROM_BASE32(x)',
          bigquery: 'FROM_BASE32(x)',
          presto: 'FROM_BASE32(x)',
          trino: 'FROM_BASE32(x)',
        },
        write: {
          bigquery: 'FROM_BASE32(x)',
          presto: 'FROM_BASE32(x)',
          trino: 'FROM_BASE32(x)',
        },
      },
    );
    this.validateAll(
      'TO_BASE32(x)',
      {
        read: {
          '': 'TO_BASE32(x)',
          bigquery: 'TO_BASE32(x)',
          presto: 'TO_BASE32(x)',
          trino: 'TO_BASE32(x)',
        },
        write: {
          bigquery: 'TO_BASE32(x)',
          presto: 'TO_BASE32(x)',
          trino: 'TO_BASE32(x)',
        },
      },
    );
  }

  testRegexpInstr () {
    this.validateAll(
      'REGEXP_INSTR(src, reg)',
      {
        read: {
          '': 'REGEXP_INSTR(src, reg)',
          bigquery: 'REGEXP_INSTR(src, reg)',
          snowflake: 'REGEXP_INSTR(src, reg)',
          oracle: 'REGEXP_INSTR(src, reg)',
          mysql: 'REGEXP_INSTR(src, reg)',
          postgres: 'REGEXP_INSTR(src, reg)',
        },
        write: {
          bigquery: 'REGEXP_INSTR(src, reg)',
          snowflake: 'REGEXP_INSTR(src, reg)',
          oracle: 'REGEXP_INSTR(src, reg)',
          mysql: 'REGEXP_INSTR(src, reg)',
          postgres: 'REGEXP_INSTR(src, reg)',
        },
      },
    );
  }

  testFormat () {
    this.validateAll(
      "FORMAT('str fmt1 fmt2', 1, 'a')",
      {
        read: {
          '': "FORMAT('str fmt1 fmt2', 1, 'a')",
          bigquery: "FORMAT('str fmt1 fmt2', 1, 'a')",
          postgres: "FORMAT('str fmt1 fmt2', 1, 'a')",
          duckdb: "FORMAT('str fmt1 fmt2', 1, 'a')",
        },
        write: {
          bigquery: "FORMAT('str fmt1 fmt2', 1, 'a')",
          postgres: "FORMAT('str fmt1 fmt2', 1, 'a')",
          spark2: "FORMAT_STRING('str fmt1 fmt2', 1, 'a')",
          spark: "FORMAT_STRING('str fmt1 fmt2', 1, 'a')",
          databricks: "FORMAT_STRING('str fmt1 fmt2', 1, 'a')",
          duckdb: "FORMAT('str fmt1 fmt2', 1, 'a')",
        },
      },
    );
  }

  testJsonArrayAppend () {
    this.validateAll(
      `JSON_ARRAY_APPEND(PARSE_JSON('["a", "b", "c"]'), '$', 1)`,
      {
        read: {
          '': `JSON_ARRAY_APPEND(PARSE_JSON('["a", "b", "c"]'), '$', 1)`,
          bigquery: `JSON_ARRAY_APPEND(PARSE_JSON('["a", "b", "c"]'), '$', 1)`,
        },
        write: {
          bigquery: `JSON_ARRAY_APPEND(PARSE_JSON('["a", "b", "c"]'), '$', 1)`,
          mysql: `JSON_ARRAY_APPEND('["a", "b", "c"]', '$', 1)`,
        },
      },
    );
  }

  testJsonArrayInsert () {
    this.validateAll(
      `JSON_ARRAY_INSERT(PARSE_JSON('["a", ["b", "c"], "d"]'), '$[1]', 1)`,
      {
        read: {
          '': `JSON_ARRAY_INSERT(PARSE_JSON('["a", ["b", "c"], "d"]'), '$[1]', 1)`,
          bigquery: `JSON_ARRAY_INSERT(PARSE_JSON('["a", ["b", "c"], "d"]'), '$[1]', 1)`,
        },
        write: {
          bigquery: `JSON_ARRAY_INSERT(PARSE_JSON('["a", ["b", "c"], "d"]'), '$[1]', 1)`,
          mysql: `JSON_ARRAY_INSERT('["a", ["b", "c"], "d"]', '$[1]', 1)`,
        },
      },
    );
  }

  testJsonRemove () {
    this.validateAll(
      `JSON_REMOVE(PARSE_JSON('["a", ["b", "c"], "d"]'), '$[1]', '$[1]')`,
      {
        read: {
          '': `JSON_REMOVE(PARSE_JSON('["a", ["b", "c"], "d"]'), '$[1]', '$[1]')`,
          bigquery: `JSON_REMOVE(PARSE_JSON('["a", ["b", "c"], "d"]'), '$[1]', '$[1]')`,
        },
        write: {
          bigquery: `JSON_REMOVE(PARSE_JSON('["a", ["b", "c"], "d"]'), '$[1]', '$[1]')`,
          mysql: `JSON_REMOVE('["a", ["b", "c"], "d"]', '$[1]', '$[1]')`,
          sqlite: `JSON_REMOVE('["a", ["b", "c"], "d"]', '$[1]', '$[1]')`,
        },
      },
    );
  }

  testJsonSet () {
    this.validateAll(
      `JSON_SET(PARSE_JSON('{"a": 1}'), '$', PARSE_JSON('{"b": 2, "c": 3}'))`,
      {
        read: {
          '': `JSON_SET(PARSE_JSON('{"a": 1}'), '$', PARSE_JSON('{"b": 2, "c": 3}'))`,
          bigquery: `JSON_SET(PARSE_JSON('{"a": 1}'), '$', PARSE_JSON('{"b": 2, "c": 3}'))`,
        },
        write: {
          bigquery: `JSON_SET(PARSE_JSON('{"a": 1}'), '$', PARSE_JSON('{"b": 2, "c": 3}'))`,
          mysql: `JSON_SET('{"a": 1}', '$', '{"b": 2, "c": 3}')`,
          sqlite: `JSON_SET('{"a": 1}', '$', '{"b": 2, "c": 3}')`,
          doris: `JSON_SET('{"a": 1}', '$', '{"b": 2, "c": 3}')`,
        },
      },
    );
  }

  testJsonStripNulls () {
    this.validateAll(
      `JSON_STRIP_NULLS(PARSE_JSON('[{"f1":1,"f2":null},2,null,3]'))`,
      {
        read: {
          '': `JSON_STRIP_NULLS(PARSE_JSON('[{"f1":1,"f2":null},2,null,3]'))`,
          bigquery: `JSON_STRIP_NULLS(PARSE_JSON('[{"f1":1,"f2":null},2,null,3]'))`,
        },
        write: {
          bigquery: `JSON_STRIP_NULLS(PARSE_JSON('[{"f1":1,"f2":null},2,null,3]'))`,
          postgres: `JSON_STRIP_NULLS(CAST('[{"f1":1,"f2":null},2,null,3]' AS JSON))`,
        },
      },
    );
  }

  testIsUnknown () {
    this.validateAll(
      'x IS NULL',
      {
        read: {
          '': 'x IS UNKNOWN',
          bigquery: 'x IS UNKNOWN',
          mysql: 'x IS UNKNOWN',
          postgres: 'x IS UNKNOWN',
          redshift: 'x IS UNKNOWN',
          duckdb: 'x IS UNKNOWN',
          spark: 'x IS UNKNOWN',
          databricks: 'x IS UNKNOWN',
        },
      },
    );
    this.validateAll(
      'NOT x IS NULL',
      {
        read: {
          '': 'x IS NOT UNKNOWN',
          bigquery: 'x IS NOT UNKNOWN',
          mysql: 'x IS NOT UNKNOWN',
          postgres: 'x IS NOT UNKNOWN',
          redshift: 'x IS NOT UNKNOWN',
          duckdb: 'x IS NOT UNKNOWN',
          spark: 'x IS NOT UNKNOWN',
          databricks: 'x IS NOT UNKNOWN',
        },
      },
    );
  }

  testIsWithDcolon () {
    // IS NULL::TYPE works (non-negate case calls parseColumnOps)
    this.validateAll(
      'SELECT CAST(col IS NULL AS BOOLEAN) FROM (SELECT 1 AS col) AS t',
      {
        read: {
          '': 'SELECT col IS NULL::BOOLEAN FROM (SELECT 1 AS col) AS t',
          duckdb: 'SELECT col IS NULL::BOOLEAN FROM (SELECT 1 AS col) AS t',
          redshift: 'SELECT col IS NULL::BOOLEAN FROM (SELECT 1 AS col) AS t',
          postgres: 'SELECT col IS NULL::BOOLEAN FROM (SELECT 1 AS col) AS t',
        },
      },
    );
    // TODO: IS NOT NULL::TYPE needs parser fix to call parseColumnOps for negate path
    // without breaking ON CONFLICT...DO UPDATE parsing
  }

  testRegexpReplace () {
    for (const targetDialect of ['postgres', 'duckdb'] as const) {
      for (const readDialect of ['', 'bigquery', 'presto', 'trino', 'spark', 'databricks'] as const) {
        const sql = parseOne("REGEXP_REPLACE('aaa', 'a', 'b')", { read: readDialect || undefined }).sql({ dialect: targetDialect });
        expect(sql).toBe("REGEXP_REPLACE('aaa', 'a', 'b', 'g')");
      }
    }
  }

  testSubqueryUnwrap () {
    this.validateIdentity(
      'WITH sub_query AS (SELECT a FROM table) (SELECT a FROM sub_query)',
      'WITH sub_query AS (SELECT a FROM table) SELECT a FROM sub_query',
    );
    this.validateIdentity(
      'WITH sub_query AS (SELECT a FROM table) ((((SELECT a FROM sub_query))))',
      'WITH sub_query AS (SELECT a FROM table) SELECT a FROM sub_query',
    );
  }

  testJsonKeys () {
    this.validateAll(
      'JSON_KEYS(foo)',
      {
        read: {
          '': 'JSON_KEYS(foo)',
          spark: 'JSON_OBJECT_KEYS(foo)',
          databricks: 'JSON_OBJECT_KEYS(foo)',
          mysql: 'JSON_KEYS(foo)',
          starrocks: 'JSON_KEYS(foo)',
          duckdb: 'JSON_KEYS(foo)',
          snowflake: 'OBJECT_KEYS(foo)',
          doris: 'JSON_KEYS(foo)',
          singlestore: 'JSON_KEYS(foo)',
        },
        write: {
          spark: 'JSON_OBJECT_KEYS(foo)',
          databricks: 'JSON_OBJECT_KEYS(foo)',
          mysql: 'JSON_KEYS(foo)',
          starrocks: 'JSON_KEYS(foo)',
          duckdb: 'JSON_KEYS(foo)',
          snowflake: 'OBJECT_KEYS(foo)',
          doris: 'JSON_KEYS(foo)',
          singlestore: 'JSON_KEYS(foo)',
        },
      },
    );
    this.validateAll(
      "JSON_KEYS(foo, '$.a')",
      {
        read: {
          '': "JSON_KEYS(foo, '$.a')",
          mysql: "JSON_KEYS(foo, '$.a')",
          starrocks: "JSON_KEYS(foo, '$.a')",
          duckdb: "JSON_KEYS(foo, '$.a')",
          doris: "JSON_KEYS(foo, '$.a')",
        },
        write: {
          mysql: "JSON_KEYS(foo, '$.a')",
          starrocks: "JSON_KEYS(foo, '$.a')",
          duckdb: "JSON_KEYS(foo, '$.a')",
          doris: "JSON_KEYS(foo, '$.a')",
        },
      },
    );
  }

  testIntervalWithUnitsDcolon () {
    this.validateIdentity(
      "SELECT interval '00:00:01'::interval AS foo",
      "SELECT CAST(INTERVAL '00:00:01' AS INTERVAL) AS foo",
    );
    this.validateIdentity(
      "SELECT ROW_NUMBER() OVER(PARTITION BY event_time + interval '00:00:01'::interval) AS foo FROM t",
      "SELECT ROW_NUMBER() OVER (PARTITION BY event_time + CAST(INTERVAL '00:00:01' AS INTERVAL)) AS foo FROM t",
    );
  }

  testGenerateDateArray () {
    this.validateAll(
      "SELECT * FROM UNNEST(GENERATE_DATE_ARRAY(DATE '2020-01-01', DATE '2020-02-01', INTERVAL 1 WEEK))",
      {
        write: {
          bigquery: "SELECT * FROM UNNEST(GENERATE_DATE_ARRAY(CAST('2020-01-01' AS DATE), CAST('2020-02-01' AS DATE), INTERVAL '1' WEEK))",
          databricks: "SELECT * FROM EXPLODE(SEQUENCE(CAST('2020-01-01' AS DATE), CAST('2020-02-01' AS DATE), INTERVAL '1' WEEK))",
          duckdb: "SELECT * FROM UNNEST(CAST(GENERATE_SERIES(CAST('2020-01-01' AS DATE), CAST('2020-02-01' AS DATE), INTERVAL '1' WEEK) AS DATE[]))",
          presto: "SELECT * FROM UNNEST(SEQUENCE(CAST('2020-01-01' AS DATE), CAST('2020-02-01' AS DATE), (1 * INTERVAL '7' DAY)))",
          spark: "SELECT * FROM EXPLODE(SEQUENCE(CAST('2020-01-01' AS DATE), CAST('2020-02-01' AS DATE), INTERVAL '1' WEEK))",
          trino: "SELECT * FROM UNNEST(SEQUENCE(CAST('2020-01-01' AS DATE), CAST('2020-02-01' AS DATE), (1 * INTERVAL '7' DAY)))",
        },
      },
    );
  }

  testUnsupportedNullOrdering () {
    // Basic smoke test for null ordering transpilation
    const withLastNulls = 'duckdb';
    const withSmallNulls = 'spark';
    const withLargeNulls = 'postgres';

    const sql = 'SELECT * FROM t ORDER BY c';
    const sqlNullsLast = 'SELECT * FROM t ORDER BY CASE WHEN c IS NULL THEN 1 ELSE 0 END, c';

    // duckdb default ASC (nulls last) to mysql should add CASE
    const expr = parseOne(sql, { read: withLastNulls });
    expect(expr.sql({ dialect: 'mysql' })).toBe(sqlNullsLast);
  }
}

const t = new TestDialect();

describe('TestDialect', () => {
  test('testCast', () => t.testCast());
  test('testDdl', () => t.testDdl());
  test('testHeredocStrings', () => t.testHeredocStrings());
  test('testDecode', () => t.testDecode());
  test('testToBinary', () => t.testToBinary());
  test('testIfNull', () => t.testIfNull());
  test('testIsAscii', () => t.testIsAscii());
  test('testNvl2', () => t.testNvl2());
  test('testTime', () => t.testTime());
  test('testArray', () => t.testArray());
  test('testOrderBy', () => t.testOrderBy());
  test('testJson', () => t.testJson());
  test('testCrossJoin', () => t.testCrossJoin());
  test('testMultipleChainedUnnest', () => t.testMultipleChainedUnnest());
  test('testLateralSubquery', () => t.testLateralSubquery());
  test('testSetOperators', () => t.testSetOperators());
  test('testOperators', () => t.testOperators());
  test('testLimit', () => t.testLimit());
  test('testAlias', () => t.testAlias());
  test('testNullsafeEq', () => t.testNullsafeEq());
  test('testNullsafeNeq', () => t.testNullsafeNeq());
  test('testHashComments', () => t.testHashComments());
  test('testTransactions', () => t.testTransactions());
  test('testMerge', () => t.testMerge());
  test('testSubstring', () => t.testSubstring());
  test('testLogarithm', () => t.testLogarithm());
  test('testCountIf', () => t.testCountIf());
  test('testCastToUserDefinedType', () => t.testCastToUserDefinedType());
  test('testQualify', () => t.testQualify());
  test('testWindowExclude', () => t.testWindowExclude());
  test('testNestedCtes', () => t.testNestedCtes());
  test('testRandom', () => t.testRandom());
  test('testArrayAny', () => t.testArrayAny());
  test('testTruncate', () => t.testTruncate());
  test('testCreateSequence', () => t.testCreateSequence());
  test('testStringFunctions', () => t.testStringFunctions());
  test('testSetOperationSpecifiers', () => t.testSetOperationSpecifiers());
  test('testTrim', () => t.testTrim());
  test('testUuid', () => t.testUuid());
  test('testEscapedIdentifierDelimiter', () => t.testEscapedIdentifierDelimiter());
  test('testMedian', () => t.testMedian());
  test('testCurrentSchema', () => t.testCurrentSchema());
  test('testIntegerHexStrings', () => t.testIntegerHexStrings());
  test('testAscii', () => t.testAscii());
  test('testBetween', () => t.testBetween());
  test('testLikeQuantifiers', () => t.testLikeQuantifiers());
  test('testDateToUnixDate', () => t.testDateToUnixDate());
  test('testWeekOfYear', () => t.testWeekOfYear());
  test('testJustify', () => t.testJustify());
  test('testUnixTime', () => t.testUnixTime());
  test('testReverse', () => t.testReverse());
  test('testRegrCount', () => t.testRegrCount());
  test('testTranslate', () => t.testTranslate());
  test('testSoundex', () => t.testSoundex());
  test('testGrouping', () => t.testGrouping());
  test('testFarmFingerprint', () => t.testFarmFingerprint());
  test('testFromToBase32', () => t.testFromToBase32());
  test('testRegexpInstr', () => t.testRegexpInstr());
  test('testFormat', () => t.testFormat());
  test('testJsonArrayAppend', () => t.testJsonArrayAppend());
  test('testJsonArrayInsert', () => t.testJsonArrayInsert());
  test('testJsonRemove', () => t.testJsonRemove());
  test('testJsonSet', () => t.testJsonSet());
  test('testJsonStripNulls', () => t.testJsonStripNulls());
  test('testIsUnknown', () => t.testIsUnknown());
  test('testIsWithDcolon', () => t.testIsWithDcolon());
  test('testRegexpReplace', () => t.testRegexpReplace());
  test('testSubqueryUnwrap', () => t.testSubqueryUnwrap());
  test('testJsonKeys', () => t.testJsonKeys());
  test('testIntervalWithUnitsDcolon', () => t.testIntervalWithUnitsDcolon());
  test('testGenerateDateArray', () => t.testGenerateDateArray());
  test('testUnsupportedNullOrdering', () => t.testUnsupportedNullOrdering());
});
