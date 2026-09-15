---
_label: "Dialects"
_icon: icon.globe
description: "How dialects work, class-based vs string-based usage, tree-shaking, and all 32 supported SQL dialects."
---

Dialects control how SQL is parsed and generated. The [Transpiling](../02-guide/02-transpiling) page showed them in action. This page explains how they work under the hood and lists every supported dialect.

## Class-based (recommended)

Pass dialect classes directly. No registration needed, fully tree-shakeable.

```typescript
import { parse, transpile } from "sqlingo";
import { MySQL } from "sqlingo/mysql";
import { Postgres } from "sqlingo/postgres";

parse("SELECT 1", { read: MySQL });
transpile("SELECT 1", { read: MySQL, write: Postgres });
```

Each dialect is a separate import, so your bundler only ships the ones you use.

## String-based (opt-in)

For apps that resolve dialects from config or user input, register them first with `Dialect.register()`.

```typescript
import { Dialect } from "sqlingo";
import { MySQL } from "sqlingo/mysql";
import { Postgres } from "sqlingo/postgres";

Dialect.register(MySQL, Postgres);

parse("SELECT 1", { read: "mysql" });
```

## How dialects work

Each dialect is a class with three parts:

1. **Tokenizer rules**: how to break SQL into tokens (keywords, identifier quoting, escape sequences)
2. **Parser overrides**: dialect-specific syntax (MySQL backtick quoting, BigQuery struct syntax, etc.)
3. **Generator transforms**: how to map AST nodes to SQL (converting `NVL` to `COALESCE`, etc.)

When you pass `{ read: MySQL, write: Postgres }`, sqlingo uses MySQL's tokenizer and parser to read the input, then Postgres's generator to write the output.

## Supported dialects

32 SQL dialects, each importable as a standalone module for tree-shaking.

| Dialect | Import |
|---------|--------|
| Athena | `import { Athena } from "sqlingo/athena"` |
| BigQuery | `import { BigQuery } from "sqlingo/bigquery"` |
| ClickHouse | `import { ClickHouse } from "sqlingo/clickhouse"` |
| Databricks | `import { Databricks } from "sqlingo/databricks"` |
| Doris | `import { Doris } from "sqlingo/doris"` |
| Dremio | `import { Dremio } from "sqlingo/dremio"` |
| Drill | `import { Drill } from "sqlingo/drill"` |
| Druid | `import { Druid } from "sqlingo/druid"` |
| DuckDB | `import { DuckDB } from "sqlingo/duckdb"` |
| Dune | `import { Dune } from "sqlingo/dune"` |
| Exasol | `import { Exasol } from "sqlingo/exasol"` |
| Fabric | `import { Fabric } from "sqlingo/fabric"` |
| Hive | `import { Hive } from "sqlingo/hive"` |
| Materialize | `import { Materialize } from "sqlingo/materialize"` |
| MySQL | `import { MySQL } from "sqlingo/mysql"` |
| Oracle | `import { Oracle } from "sqlingo/oracle"` |
| Postgres | `import { Postgres } from "sqlingo/postgres"` |
| Presto | `import { Presto } from "sqlingo/presto"` |
| Redshift | `import { Redshift } from "sqlingo/redshift"` |
| RisingWave | `import { RisingWave } from "sqlingo/risingwave"` |
| SingleStore | `import { SingleStore } from "sqlingo/singlestore"` |
| Snowflake | `import { Snowflake } from "sqlingo/snowflake"` |
| Solr | `import { Solr } from "sqlingo/solr"` |
| Spark | `import { Spark } from "sqlingo/spark"` |
| Spark2 | `import { Spark2 } from "sqlingo/spark2"` |
| SQLite | `import { SQLite } from "sqlingo/sqlite"` |
| StarRocks | `import { StarRocks } from "sqlingo/starrocks"` |
| Tableau | `import { Tableau } from "sqlingo/tableau"` |
| Teradata | `import { Teradata } from "sqlingo/teradata"` |
| Trino | `import { Trino } from "sqlingo/trino"` |
| TSQL | `import { TSQL } from "sqlingo/tsql"` |
