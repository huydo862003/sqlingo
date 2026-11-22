---
_label: "Transpiling"
_icon: icon.arrow_left_right
description: "Cross-dialect SQL translation: how functions, types, quoting, and syntax get mapped between databases."
---

Transpiling reads SQL in one dialect and writes it in another. The parse-tree-generate cycle from the [previous page](01-parsing-and-trees) with a different dialect on each end.

## What gets translated

Dialects differ in function names, type names, operators, and quoting. sqlingo maps between them:

```typescript
import { transpile } from "sqlingo";
import { DuckDB } from "sqlingo/duckdb";
import { Hive } from "sqlingo/hive";
import { MySQL } from "sqlingo/mysql";
import { Postgres } from "sqlingo/postgres";

// Function names
transpile("SELECT EPOCH_MS(1618088028295)", { read: DuckDB, write: Hive })[0];
// "SELECT FROM_UNIXTIME(1618088028295 / POW(10, 3))"

// Type names
transpile("SELECT CAST(x AS SIGNED)", { read: MySQL, write: Postgres })[0];
// "SELECT CAST(x AS BIGINT)"

// Operators
transpile("SELECT a || b", { read: Postgres, write: MySQL })[0];
// "SELECT CONCAT(a, b)"
```

The `read` dialect controls how the input is tokenized and parsed, the `write` dialect controls how the output is generated, and the AST that travels between them is dialect-neutral.

## `transpile(sql, options?)`

Returns an array of SQL strings, one per statement in the input.

| Parameter | Type | Description |
|-----------|------|-------------|
| `sql` | `string` | SQL to transpile |
| `options.read` | Dialect class | Source dialect for parsing |
| `options.write` | Dialect class | Target dialect for generation |
| `options.pretty` | `boolean` | Indent the output |
| `options.identify` | `boolean` | Quote all identifiers |

When `read` is omitted, the base dialect is used. When `write` is omitted, it defaults to the same dialect as `read`.

### Pretty output

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

### Quoting all identifiers

```typescript
transpile("SELECT user FROM t", { write: Postgres, identify: true })[0];
// 'SELECT "user" FROM "t"'
```

## Two-step transpilation

Use `parseOne` + `.sql()` separately to inspect or modify the AST before generating:

```typescript
import { parseOne, ColumnExpr } from "sqlingo";
import { MySQL } from "sqlingo/mysql";
import { Postgres } from "sqlingo/postgres";

const ast = parseOne("SELECT a, b FROM t WHERE x > 1", { read: MySQL });

const columnNames = [...ast.findAll(ColumnExpr)].map((c) => c.name);
console.log(columnNames); // ["a", "b", "x"]

console.log(ast.sql({ dialect: Postgres, pretty: true }));
```

This is also more efficient when generating output in multiple dialects from the same input.

## Unsupported features

When a feature has no equivalent in the target dialect, sqlingo logs a warning and passes the syntax through unchanged.

```typescript
// MySQL has no APPROX_COUNT_DISTINCT
// sqlingo warns and passes it through unchanged
const [sql] = transpile("SELECT APPROX_COUNT_DISTINCT(x) FROM t", {
  read: Postgres,
  write: MySQL,
});
```

Set `errorLevel` to raise on warnings if you need strict failure.
