---
_label: "Optimizing"
_icon: icon.sparkles
description: "Simplify and normalize SQL queries using schema information: star expansion, column qualification, and dead condition removal."
---

The previous pages showed how to parse and transpile SQL. This page adds the third operation: optimization. Given schema information, the optimizer can qualify columns, simplify conditions, and remove dead code.

## Basic optimization

Pass a parsed AST and a schema to `optimize`. The schema tells the optimizer which tables exist and what columns they have.

```typescript
import { optimize, parseOne, MappingSchema } from "sqlingo";

const schema = new MappingSchema({ t: { x: "INT", y: "INT" } });
const optimized = optimize(
  parseOne("SELECT * FROM t WHERE 1 = 1 AND x > 2"),
  { schema },
);

console.log(optimized.sql());
// SELECT "t"."x" AS "x", "t"."y" AS "y" FROM "t" AS "t" WHERE "t"."x" > 2
```

Three things happened:

- `SELECT *` expanded to named columns (`x`, `y`)
- `1 = 1` was removed (always true, dead condition)
- All identifiers were qualified with table names (`x` became `"t"."x"`)

## `optimize(ast, options)`

| Parameter | Type | Description |
|-----------|------|-------------|
| `ast` | `Expression` | Parsed AST (from `parseOne`) |
| `options.schema` | `MappingSchema or object` | Table-to-columns mapping |
| `options.dialect` | `Dialect class` | Target dialect for generation |

You can call `.sql()` on the result to get the SQL string. For simple cases, a plain object works instead of `MappingSchema`:

```typescript
import { optimize, parseOne } from "sqlingo";

const optimized = optimize(
  parseOne("SELECT * FROM users"),
  { schema: { users: { id: "INT", name: "TEXT" } } },
);

console.log(optimized.sql());
// SELECT "users"."id" AS "id", "users"."name" AS "name" FROM "users" AS "users"
```

## What the optimizer does

Here is the full list of transformations the optimizer applies when schema information is available:

- **Star expansion**: `SELECT *` becomes explicit column names
- **Column qualification**: `x` becomes `"t"."x"` when unambiguous
- **Dead condition removal**: `WHERE 1 = 1 AND ...` simplifies to `WHERE ...`
- **Table aliasing**: `FROM t` becomes `FROM "t" AS "t"`
- **Identifier quoting**: all identifiers are double-quoted

## Combining with transpilation

You can chain all three operations: parse SQL in one dialect, optimize it with schema information, then generate output in another dialect.

```typescript
import { optimize, parseOne } from "sqlingo";
import { MySQL } from "sqlingo/mysql";
import { Postgres } from "sqlingo/postgres";

const ast = parseOne("SELECT * FROM t WHERE 1 = 1 AND x > 2", { read: MySQL });
const optimized = optimize(ast, { schema: { t: { x: "INT" } } });
console.log(optimized.sql({ dialect: Postgres }));
```
