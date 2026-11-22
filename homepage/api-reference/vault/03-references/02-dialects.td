---
_label: "Dialects"
_icon: icon.globe
description: "How dialects work, class-based vs string-based usage, tree-shaking, extending dialects, and all 32 supported SQL dialects."
---

Dialects control how SQL is parsed and generated. Each dialect is a class with three parts:

- **Tokenizer rules**: how to break SQL into tokens (keyword sets, identifier quoting, escape rules)
- **Parser overrides**: dialect-specific syntax (MySQL backticks, BigQuery structs, etc.)
- **Generator transforms**: how to map AST nodes to SQL (`NVL` to `COALESCE`, `||` to `CONCAT`, etc.)

When you pass `{ read: MySQL, write: Postgres }`, sqlingo uses MySQL's tokenizer and parser for the input, then Postgres's generator for the output.

## Class-based usage (recommended)

Pass dialect classes directly. No registration needed, and your bundler tree-shakes unused dialects.

```typescript
import { parse, transpile } from "sqlingo";
import { MySQL } from "sqlingo/mysql";
import { Postgres } from "sqlingo/postgres";

parse("SELECT 1", { read: MySQL });
transpile("SELECT 1", { read: MySQL, write: Postgres });
```

Each dialect is a separate entry point. Only the ones you import end up in your bundle.

## String-based usage (opt-in)

For applications that resolve dialects from config or user input, register them first:

```typescript
import { Dialect, parse } from "sqlingo";
import { MySQL } from "sqlingo/mysql";
import { Postgres } from "sqlingo/postgres";

Dialect.register(MySQL, Postgres);

parse("SELECT 1", { read: "mysql" });
```

The string key is the dialect's `DIALECT_NAME` property (e.g., `MySQL.DIALECT_NAME === "mysql"`).

## Custom dialects

Extend any dialect to override specific behavior. The most common case is adding function mappings in the generator:

```typescript
import { Dialect, Generator, ArrayAggExpr, transpile } from "sqlingo";

class MyGenerator extends Generator {
  static get ORIGINAL_TRANSFORMS() {
    return new Map([
      ...Generator.TRANSFORMS,
      [ArrayAggExpr, function (this: MyGenerator, e: ArrayAggExpr) {
        return `GROUP_CONCAT(${this.sql(e, "this")})`;
      }],
    ]);
  }
}

class MyDialect extends Dialect {
  static DIALECT_NAME = "my_dialect";
  static Generator = MyGenerator;
}

Dialect.register(MyDialect);

const [result] = transpile("SELECT ARRAY_AGG(x) FROM t", { write: MyDialect });
// "SELECT GROUP_CONCAT(x) FROM t"
```

All three components (Tokenizer, Parser, Generator) can be extended independently. Some dialects already extend each other: `Databricks` extends `Spark`, `RisingWave` extends `Postgres`.

## Supported dialects

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
| PRQL | `import { PRQL } from "sqlingo/prql"` |
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
