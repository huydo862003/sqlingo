import {
  Dialect,
} from 'sqlingo';
import {
  MySQL,
} from 'sqlingo/mysql';
import {
  Postgres,
} from 'sqlingo/postgres';
import {
  SQLite,
} from 'sqlingo/sqlite';
import {
  DuckDB,
} from 'sqlingo/duckdb';
import {
  BigQuery,
} from 'sqlingo/bigquery';
import {
  Snowflake,
} from 'sqlingo/snowflake';
import {
  Spark,
} from 'sqlingo/spark';
import {
  Hive,
} from 'sqlingo/hive';
import {
  Trino,
} from 'sqlingo/trino';
import {
  TSQL,
} from 'sqlingo/mssql';
import {
  Oracle,
} from 'sqlingo/oracle';
import {
  Redshift,
} from 'sqlingo/redshift';

Dialect.register(
  MySQL,
  Postgres,
  SQLite,
  DuckDB,
  BigQuery,
  Snowflake,
  Spark,
  Hive,
  Trino,
  TSQL,
  Oracle,
  Redshift,
);

export const DIALECTS = [
  {
    value: 'mysql',
    label: 'MySQL',
  },
  {
    value: 'postgres',
    label: 'Postgres',
  },
  {
    value: 'sqlite',
    label: 'SQLite',
  },
  {
    value: 'duckdb',
    label: 'DuckDB',
  },
  {
    value: 'bigquery',
    label: 'BigQuery',
  },
  {
    value: 'snowflake',
    label: 'Snowflake',
  },
  {
    value: 'spark',
    label: 'Spark',
  },
  {
    value: 'hive',
    label: 'Hive',
  },
  {
    value: 'trino',
    label: 'Trino',
  },
  {
    value: 'mssql',
    label: 'MSSQL',
  },
  {
    value: 'oracle',
    label: 'Oracle',
  },
  {
    value: 'redshift',
    label: 'Redshift',
  },
] as const;

export type DialectValue = typeof DIALECTS[number]['value'];

export function getDialectLabel (value: string): string {
  return DIALECTS.find((dialect) => dialect.value === value)?.label ?? value;
}
