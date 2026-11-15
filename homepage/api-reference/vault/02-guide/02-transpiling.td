---
_label: "Transpiling"
_icon: icon.arrow_left_right
description: "Cross-dialect SQL translation: how functions, types, quoting, and syntax get mapped between databases."
---

Transpilation is the most common use case for sqlingo: read SQL written for one database, produce SQL that works in another. The [previous page](01-parsing-and-trees) introduced the parse-tree-generate cycle. Transpilation is exactly that cycle with a different dialect on each end: MySQL's parser reads the input, Postgres's generator writes the output, and the same AST travels through the middle.

## What gets translated

Dialects differ in function names, date and interval handling, type names, quoting conventions, and operator syntax. sqlingo maps between them automatically. Here are representative examples:

```typescript
import { transpile } from "sqlingo";
import { DuckDB } from "sqlingo/duckdb";
import { Hive } from "sqlingo/hive";
import { MySQL } from "sqlingo/mysql";
import { Postgres } from "sqlingo/postgres";

// Function names differ: DuckDB EPOCH_MS -> Hive FROM_UNIXTIME
transpile("SELECT EPOCH_MS(1618088028295)", { read: DuckDB, write: Hive })[0];
// "SELECT FROM_UNIXTIME(1618088028295 / POW(10, 3))"

// Type names differ: MySQL SIGNED -> Postgres BIGINT
transpile("SELECT CAST(x AS SIGNED)", { read: MySQL, write: Postgres })[0];
// "SELECT CAST(x AS BIGINT)"

// Operators differ: Postgres || -> MySQL CONCAT
transpile("SELECT a || b", { read: Postgres, write: MySQL })[0];
// "SELECT CONCAT(a, b)"
```

These mappings are defined in each dialect's generator. When you pass `{ read: MySQL, write: Postgres }`, sqlingo uses MySQL's tokenizer and parser to understand the input (backtick quoting, MySQL-specific keywords, etc.), then uses Postgres's generator to produce output that uses Postgres conventions. The AST in between is dialect-neutral.

## `transpile(sql, options?)`

`transpile` is the main entry point for dialect-to-dialect translation. It always returns an array, one SQL string per statement in the input, because a single input may contain multiple semicolon-separated statements.

| Parameter | Type | Description |
|-----------|------|-------------|
| `sql` | `string` | SQL to transpile |
| `options.read` | Dialect class | Source dialect: controls how the input is parsed |
| `options.write` | Dialect class | Target dialect: controls how the output is generated |
| `options.pretty` | `boolean` | Indent the output for readability |
| `options.identify` | `boolean` | Quote all identifiers, even ones that don't need it |

When `read` is omitted, the input is parsed with the base dialect, a permissive superset that accepts most standard SQL. When `write` is omitted, `transpile` defaults to writing in the same dialect it read (or the base dialect if `read` is also omitted). This means calling `transpile` with no dialect options still normalizes the SQL, because generating it through the base dialect applies standard capitalization and formatting.

The `pretty` option wraps the output with indentation, which helps when producing SQL for logs, debugging, or human review:

```typescript
transpile("SELECT a, b FROM t WHERE x > 1", { pretty: true })[0];
// SELECT
//   a,
//   b
// FROM
//   t
// WHERE
//   x > 1
```

The `identify` option wraps every identifier in quotes, including ones that would not normally need it. This is useful when generating SQL for systems that are case-sensitive or have reserved-word conflicts:

```typescript
import { transpile } from "sqlingo";
import { Postgres } from "sqlingo/postgres";

transpile("SELECT user FROM t", { write: Postgres, identify: true })[0];
// 'SELECT "user" FROM "t"'
```

## Two-step transpilation

If you need to inspect or modify the AST between parsing and generating, skip `transpile` and use `parseOne` with `.sql()` directly. This gives you the full tree to work with before producing output:

```typescript
import { parseOne, ColumnExpr } from "sqlingo";
import { MySQL } from "sqlingo/mysql";
import { Postgres } from "sqlingo/postgres";

const ast = parseOne("SELECT a, b FROM t WHERE x > 1", { read: MySQL });

// Inspect or transform the AST before generating
const columnNames = [...ast.findAll(ColumnExpr)].map((c) => c.name);
console.log(columnNames); // ["a", "b", "x"]

console.log(ast.sql({ dialect: Postgres, pretty: true }));
```

This pattern is also more efficient when you need to generate output in multiple target dialects from the same input: parse once, then call `.sql()` with different dialects.

## Unsupported features

When a source dialect uses a feature that the target dialect has no equivalent for, sqlingo logs a warning to the console and generates SQL on a best-effort basis. The function name or syntax may pass through unchanged, which may or may not be valid in the target database.

```typescript
import { transpile } from "sqlingo";
import { Postgres } from "sqlingo/postgres";
import { MySQL } from "sqlingo/mysql";

// MySQL has no APPROX_COUNT_DISTINCT
// sqlingo warns and passes it through unchanged
const [sql] = transpile("SELECT APPROX_COUNT_DISTINCT(x) FROM t", {
  read: Postgres,
  write: MySQL,
});
```

Best-effort output is useful in migration pipelines where you want to process as much SQL as possible and review problematic cases separately. If you need strict failure on unsupported constructs, check for `UnsupportedError` in the warning output or set `errorLevel` to raise on all warnings.
