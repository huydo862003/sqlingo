---
_label: "Dialects"
_icon: icon.globe
description: "How dialects work, class-based vs string-based usage, tree-shaking, and all 32 supported SQL dialects."
---

Dialects control how SQL is parsed and generated. The [Transpiling](../02-guide/02-transpiling) page showed them in action. This page explains how they work under the hood and lists every supported dialect.

## Class-based (recommended)

Pass dialect classes directly. No registration needed, fully tree-shakeable.

```typescript
import { parse, transpile } from "@hdnax/sqlingo.js";
import { MySQL } from "@hdnax/sqlingo.js/mysql";
import { Postgres } from "@hdnax/sqlingo.js/postgres";

parse("SELECT 1", { read: MySQL });
transpile("SELECT 1", { read: MySQL, write: Postgres });
```

Each dialect is a separate import, so your bundler only ships the ones you use.

## String-based (opt-in)

For apps that resolve dialects from config or user input, register them first with `Dialect.register()`.

```typescript
import { Dialect } from "@hdnax/sqlingo.js";
import { MySQL } from "@hdnax/sqlingo.js/mysql";
import { Postgres } from "@hdnax/sqlingo.js/postgres";

Dialect.register(MySQL, Postgres);

parse("SELECT 1", { read: "mysql" });
```

## How dialects work

Each dialect is a class with three parts:

1. **Tokenizer rules**: how to break SQL into tokens (keywords, identifier quoting, escape sequences)
2. **Parser overrides**: dialect-specific syntax (MySQL backtick quoting, BigQuery struct syntax, etc.)
3. **Generator transforms**: how to map AST nodes to SQL (converting `NVL` to `COALESCE`, etc.)

When you pass `{ read: MySQL, write: Postgres }`, sqlingo.js uses MySQL's tokenizer and parser to read the input, then Postgres's generator to write the output.

## Supported dialects

32 SQL dialects, each importable as a standalone module for tree-shaking.

| Dialect | Import |
|---------|--------|
| Athena | `import { Athena } from "@hdnax/sqlingo.js/athena"` |
| BigQuery | `import { BigQuery } from "@hdnax/sqlingo.js/bigquery"` |
| ClickHouse | `import { ClickHouse } from "@hdnax/sqlingo.js/clickhouse"` |
| Databricks | `import { Databricks } from "@hdnax/sqlingo.js/databricks"` |
| Doris | `import { Doris } from "@hdnax/sqlingo.js/doris"` |
| Dremio | `import { Dremio } from "@hdnax/sqlingo.js/dremio"` |
| Drill | `import { Drill } from "@hdnax/sqlingo.js/drill"` |
| Druid | `import { Druid } from "@hdnax/sqlingo.js/druid"` |
| DuckDB | `import { DuckDB } from "@hdnax/sqlingo.js/duckdb"` |
| Dune | `import { Dune } from "@hdnax/sqlingo.js/dune"` |
| Exasol | `import { Exasol } from "@hdnax/sqlingo.js/exasol"` |
| Fabric | `import { Fabric } from "@hdnax/sqlingo.js/fabric"` |
| Hive | `import { Hive } from "@hdnax/sqlingo.js/hive"` |
| Materialize | `import { Materialize } from "@hdnax/sqlingo.js/materialize"` |
| MySQL | `import { MySQL } from "@hdnax/sqlingo.js/mysql"` |
| Oracle | `import { Oracle } from "@hdnax/sqlingo.js/oracle"` |
| Postgres | `import { Postgres } from "@hdnax/sqlingo.js/postgres"` |
| Presto | `import { Presto } from "@hdnax/sqlingo.js/presto"` |
| Redshift | `import { Redshift } from "@hdnax/sqlingo.js/redshift"` |
| RisingWave | `import { RisingWave } from "@hdnax/sqlingo.js/risingwave"` |
| SingleStore | `import { SingleStore } from "@hdnax/sqlingo.js/singlestore"` |
| Snowflake | `import { Snowflake } from "@hdnax/sqlingo.js/snowflake"` |
| Solr | `import { Solr } from "@hdnax/sqlingo.js/solr"` |
| Spark | `import { Spark } from "@hdnax/sqlingo.js/spark"` |
| Spark2 | `import { Spark2 } from "@hdnax/sqlingo.js/spark2"` |
| SQLite | `import { SQLite } from "@hdnax/sqlingo.js/sqlite"` |
| StarRocks | `import { StarRocks } from "@hdnax/sqlingo.js/starrocks"` |
| Tableau | `import { Tableau } from "@hdnax/sqlingo.js/tableau"` |
| Teradata | `import { Teradata } from "@hdnax/sqlingo.js/teradata"` |
| Trino | `import { Trino } from "@hdnax/sqlingo.js/trino"` |
| TSQL | `import { TSQL } from "@hdnax/sqlingo.js/tsql"` |
