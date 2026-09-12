---
_icon: icon.file_code
---

Transpilation is the main use case: read SQL in one dialect, write it in another. The [Guide](02-guide) showed the basic cycle. This page covers what actually changes between dialects and how to control it.

## What gets translated

Dialects differ in function names, date handling, quoting, types, and syntax. sqlingo.js maps between them:

```typescript
import { transpile } from "@hdnax/sqlingo.js";
import { DuckDB } from "@hdnax/sqlingo.js/duckdb";
import { Hive } from "@hdnax/sqlingo.js/hive";
import { MySQL } from "@hdnax/sqlingo.js/mysql";
import { Postgres } from "@hdnax/sqlingo.js/postgres";

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

| Parameter | Type | Description |
|-----------|------|-------------|
| `sql` | `string` | SQL to transpile |
| `options.read` | `Dialect class` | Source dialect (how to parse the input) |
| `options.write` | `Dialect class` | Target dialect (how to generate the output) |
| `options.pretty` | `boolean` | Pretty-print the output with indentation |
| `options.identify` | `boolean` | Quote all identifiers |

Returns `string[]`: one SQL string per statement.

When `read` is omitted, the input is parsed with the base dialect (a superset that accepts most syntax). When `write` is omitted, the output uses the same base dialect.

## `parse` and `parseOne`

If you need the AST instead of a string, use `parse` or `parseOne`:

```typescript
import { parse, parseOne } from "@hdnax/sqlingo.js";
import { MySQL } from "@hdnax/sqlingo.js/mysql";

// Multiple statements
const stmts = parse("SELECT 1; SELECT 2", { read: MySQL });

// Single statement
const ast = parseOne("SELECT 1", { read: MySQL });
```

Then generate SQL from the AST:

```typescript
import { Postgres } from "@hdnax/sqlingo.js/postgres";

console.log(ast.sql({ dialect: Postgres, pretty: true }));
```

This two-step approach is useful when you want to inspect or modify the AST between parsing and generating, as described in the [Guide](02-guide).

## Unsupported features

When a dialect does not support a feature, a warning is emitted rather than an error. The SQL is generated on a best-effort basis:

```typescript
const [sql] = transpile("SELECT APPROX_DISTINCT(x) FROM t", {
  read: Postgres,
  write: MySQL,
});
// MySQL doesn't have APPROX_DISTINCT; a warning is logged
```

## Next: [Optimization](04-optimize)

Once you can transpile SQL, the next step is optimizing it. The optimizer uses schema information to simplify conditions, qualify columns, and eliminate dead code.
