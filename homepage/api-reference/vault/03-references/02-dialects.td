---
_label: "Dialects"
_icon: icon.globe
description: "How dialects work, class-based vs string-based usage, tree-shaking, extending dialects, and all 32 supported SQL dialects."
---

Dialects control how SQL is parsed and how it is generated. The [Transpiling guide](../02-guide/02-transpiling) showed them in action. This page explains how they work internally, how to register and extend them, and lists every supported dialect.

## How dialects work

A dialect is a class with three parts that together define a complete SQL variant:

1. **Tokenizer rules**: how to break a SQL string into tokens. This covers keyword sets, identifier quoting characters (double quotes, backticks, brackets), string escape rules, and comment syntax.
2. **Parser overrides**: how to parse dialect-specific syntax. MySQL uses backtick-quoted identifiers, BigQuery has struct and array literal syntax, Postgres has custom operator forms. Each of these needs special handling in the parser.
3. **Generator transforms**: how to map AST nodes to SQL strings. This is where `NVL` becomes `COALESCE`, where `||` becomes `CONCAT(a, b)`, and where `SIGNED` becomes `BIGINT`. Each node type has a function that produces the target dialect's syntax.

When you pass `{ read: MySQL, write: Postgres }` to `transpile` or `parseOne`, sqlingo:
- Uses MySQL's tokenizer to split the input into tokens (recognizing backticks, MySQL keywords, etc.)
- Uses MySQL's parser to build the AST (applying MySQL-specific grammar rules)
- Uses Postgres's generator to produce the output (applying Postgres-specific node-to-SQL mappings)

The AST in the middle is dialect-neutral.

## Class-based usage (recommended)

Pass dialect classes directly to any function that accepts a dialect. No registration step is needed, and your bundler can tree-shake unused dialects automatically.

```typescript
import { parse, transpile } from "sqlingo";
import { MySQL } from "sqlingo/mysql";
import { Postgres } from "sqlingo/postgres";

parse("SELECT 1", { read: MySQL });
transpile("SELECT 1", { read: MySQL, write: Postgres });
```

Each dialect is a separate entry point (`sqlingo/mysql`, `sqlingo/postgres`, etc.). If you only import MySQL and Postgres, the other 30 dialects are not included in your bundle. This matters for browser builds where bundle size is a concern.

## String-based usage (opt-in)

For applications that resolve dialects from config files or user input, register them first with `Dialect.register()`, then pass their names as strings:

```typescript
import { Dialect, parse } from "sqlingo";
import { MySQL } from "sqlingo/mysql";
import { Postgres } from "sqlingo/postgres";

Dialect.register(MySQL, Postgres);

parse("SELECT 1", { read: "mysql" });
transpile("SELECT 1", { read: "mysql", write: "postgres" });
```

The string key for each dialect is its `DIALECT_NAME` static property (e.g., `MySQL.DIALECT_NAME === "mysql"`). You still import the dialect classes to register them, so tree-shaking still works for the dialects you do not register.

## Custom dialects

You can extend any existing dialect to override specific behavior. The most common use case is adding custom function mappings in the generator:

```typescript
import { Dialect, Generator, ArrayAggExpr, transpile } from "sqlingo";

class MyGenerator extends Generator {
  static get ORIGINAL_TRANSFORMS() {
    return new Map([
      ...Generator.TRANSFORMS,
      // Rewrite ARRAY_AGG as GROUP_CONCAT for this dialect
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
console.log(result);
// "SELECT GROUP_CONCAT(x) FROM t"
```

You can also override the `Tokenizer` or `Parser` class on your dialect to handle custom syntax. All three components (Tokenizer, Parser, Generator) can be extended independently.

Some dialects already extend each other. `Databricks` extends `Spark`, `Spark2` is a variant of `Spark`, and `RisingWave` and `Materialize` extend `Postgres`. When you extend an existing dialect, you inherit all of its tokenizer, parser, and generator rules and only override what you need.

## Supported dialects

32 SQL dialects are supported, each importable as a standalone module.

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
