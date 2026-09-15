---
_label: "Transpiling"
_icon: icon.arrow_left_right
description: "Cross-dialect SQL translation: how functions, types, quoting, and syntax get mapped between databases."
---

Transpilation is the main use case: read SQL in one dialect, write it in another. The [previous page](01-parsing-and-trees) showed the parse-tree-generate cycle. This page covers what actually changes between dialects and how to control it.

## What gets translated

Dialects differ in function names, date handling, quoting, types, and syntax. sqlingo maps between them automatically when you specify source and target dialects.

```typescript
import { transpile } from "sqlingo";
import { DuckDB } from "sqlingo/duckdb";
import { Hive } from "sqlingo/hive";
import { MySQL } from "sqlingo/mysql";
import { Postgres } from "sqlingo/postgres";

// Function names
transpile("SELECT EPOCH_MS(1618088028295)", { read: DuckDB, write: Hive })[0];
// "SELECT FROM_UNIXTIME(1618088028295 / POW(10, 3))"

// Type casting
transpile("SELECT CAST(x AS SIGNED)", { read: MySQL, write: Postgres })[0];
// "SELECT CAST(x AS BIGINT)"

// String concatenation
transpile("SELECT a || b", { read: Postgres, write: MySQL })[0];
// "SELECT CONCAT(a, b)"
```

## `transpile(sql, options?)`

The main entry point for dialect-to-dialect translation. It returns one SQL string per statement in the input.

| Parameter | Type | Description |
|-----------|------|-------------|
| `sql` | `string` | SQL to transpile |
| `options.read` | `Dialect class` | Source dialect (how to parse the input) |
| `options.write` | `Dialect class` | Target dialect (how to generate the output) |
| `options.pretty` | `boolean` | Pretty-print the output with indentation |
| `options.identify` | `boolean` | Quote all identifiers |

When `read` is omitted, the input is parsed with the base dialect (a superset that accepts most syntax). When `write` is omitted, the output uses the same base dialect.

## Two-step transpilation

If you need to inspect or modify the AST between parsing and generating, use `parseOne` and `.sql()` separately. This gives you full control over the tree before output.

```typescript
import { parseOne } from "sqlingo";
import { MySQL } from "sqlingo/mysql";
import { Postgres } from "sqlingo/postgres";

const ast = parseOne("SELECT 1", { read: MySQL });
// inspect or transform the AST here
console.log(ast.sql({ dialect: Postgres, pretty: true }));
```

## Unsupported features

When a dialect does not support a feature, a warning is emitted rather than an error. The SQL is generated on a best-effort basis.

```typescript
const [sql] = transpile("SELECT APPROX_DISTINCT(x) FROM t", {
  read: Postgres,
  write: MySQL,
});
// MySQL doesn't have APPROX_DISTINCT; a warning is logged
```
