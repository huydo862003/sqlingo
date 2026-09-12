---
_icon: icon.sparkles
---

The previous pages showed how to parse and transpile SQL. This page adds the third operation: optimization. Given schema information, the optimizer can qualify columns, simplify conditions, and remove dead code.

## Basic optimization

```typescript
import { optimize, parseOne, MappingSchema } from "@hdnax/sqlingo.js";

const schema = new MappingSchema({ t: { x: "INT", y: "INT" } });
const optimized = optimize(
  parseOne("SELECT * FROM t WHERE 1 = 1 AND x > 2"),
  { schema },
);

console.log(optimized.sql());
// SELECT "t"."x" AS "x", "t"."y" AS "y" FROM "t" AS "t" WHERE "t"."x" > 2
```

Three things happened:

1. `SELECT *` expanded to named columns (`"t"."x"`, `"t"."y"`)
2. `1 = 1` (always true) was removed
3. All identifiers were qualified with table names

## `optimize(ast, options)`

| Parameter | Type | Description |
|-----------|------|-------------|
| `ast` | `Expression` | Parsed AST (from `parseOne`) |
| `options.schema` | `MappingSchema or object` | Table-to-columns mapping |
| `options.dialect` | `Dialect class` | Target dialect for generation |

Returns `Expression`: the optimized AST. Call `.sql()` to get the SQL string.

You can pass a plain object instead of `MappingSchema` for simple cases:

```typescript
const optimized = optimize(
  parseOne("SELECT * FROM users"),
  { schema: { users: { id: "INT", name: "TEXT" } } },
);
```

## What the optimizer does

- **Star expansion**: `SELECT *` becomes explicit column names
- **Column qualification**: `x` becomes `"t"."x"` when unambiguous
- **Dead condition removal**: `WHERE 1 = 1 AND ...` simplifies to `WHERE ...`
- **Table aliasing**: `FROM t` becomes `FROM "t" AS "t"`
- **Identifier quoting**: All identifiers are double-quoted

## Combining with transpilation

Optimization and transpilation compose naturally. Parse in one dialect, optimize, then generate in another:

```typescript
import { MySQL } from "@hdnax/sqlingo.js/mysql";
import { Postgres } from "@hdnax/sqlingo.js/postgres";

const ast = parseOne("SELECT * FROM t WHERE 1 = 1 AND x > 2", { read: MySQL });
const optimized = optimize(ast, { schema: { t: { x: "INT" } } });
console.log(optimized.sql({ dialect: Postgres }));
```

## Next: [Building SQL](05-builders)

So far, every query started as a string. The next page shows how to build queries programmatically using a fluent API, without writing SQL at all.
