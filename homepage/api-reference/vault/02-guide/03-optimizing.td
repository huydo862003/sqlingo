---
_label: "Optimizing"
_icon: icon.sparkles
description: "Simplify and normalize SQL queries using schema information: star expansion, column qualification, and dead condition removal."
---

Parsing and transpiling work without any knowledge of your database schema: they only understand SQL syntax. The optimizer adds semantic understanding. Given schema information, it can resolve what `*` refers to, eliminate conditions that can never filter any rows, and make every column reference unambiguous. The result is SQL that is explicit, normalized, and safe to analyze programmatically.

## Basic optimization

Pass a parsed AST and a schema to `optimize`. The schema is a mapping from table names to their columns and types.

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

Three things changed:

- `SELECT *` expanded to `"t"."x" AS "x", "t"."y" AS "y"` because the schema declared those as the columns of `t`.
- `1 = 1` was removed as a tautology that can never filter any rows.
- `x` became `"t"."x"` because every column reference is now fully qualified with its table, eliminating any ambiguity.

## `optimize(ast, options)`

| Parameter | Type | Description |
|-----------|------|-------------|
| `ast` | `Expression` | Parsed AST from `parseOne` |
| `options.schema` | `MappingSchema` or plain object | Table-to-columns mapping |
| `options.dialect` | Dialect class | Target dialect for the generated output |

A plain object works as a shorthand for simple cases:

```typescript
import { optimize, parseOne } from "sqlingo";

const optimized = optimize(
  parseOne("SELECT * FROM users"),
  { schema: { users: { id: "INT", name: "TEXT" } } },
);

console.log(optimized.sql());
// SELECT "users"."id" AS "id", "users"."name" AS "name" FROM "users" AS "users"
```

`MappingSchema` is preferred when you need to handle multiple schemas, nested catalogs, or when you are reusing the same schema object across many `optimize` calls. It also validates column type strings on construction, which catches mistakes earlier.

The column type strings (`"INT"`, `"TEXT"`, `"BIGINT"`, etc.) follow standard SQL type names. The optimizer uses them mainly to know which columns exist; the actual type values matter when the optimizer needs to perform type-aware transformations, such as coercing literals.

## What the optimizer does

The optimizer applies a pipeline of transformations, each building on the previous one. When schema information is provided, all of the following apply:

- **Star expansion**: `SELECT *` becomes an explicit list of named columns in the order they appear in the schema.
- **Column qualification**: bare column names like `x` become fully qualified references like `"t"."x"` when the table can be determined unambiguously.
- **Dead condition removal**: tautologies like `1 = 1`, `'a' = 'a'`, and `TRUE AND ...` are simplified away. Contradictions like `1 = 2` cause the entire WHERE clause to become `WHERE FALSE`.
- **Table aliasing**: `FROM t` becomes `FROM "t" AS "t"`, giving every table reference an explicit alias that matches the table name.
- **Identifier quoting**: all identifiers are double-quoted, making the output safe for case-sensitive databases and ensuring reserved words do not cause syntax errors.

The optimizer also handles subqueries, CTEs, and joins. It qualifies columns inside subqueries independently, using the scope visible to that subquery.

## Combining with transpilation

You can chain all three operations: parse SQL in one dialect, optimize it with schema information, then generate output in another dialect.

```typescript
import { optimize, parseOne } from "sqlingo";
import { MySQL } from "sqlingo/mysql";
import { Postgres } from "sqlingo/postgres";

const schema = { t: { x: "INT", y: "TEXT" } };
const ast = parseOne("SELECT * FROM t WHERE 1 = 1 AND x > 2", { read: MySQL });
const optimized = optimize(ast, { schema });

console.log(optimized.sql({ dialect: Postgres }));
// SELECT "t"."x" AS "x", "t"."y" AS "y" FROM "t" AS "t" WHERE "t"."x" > 2
```

The order matters:

- Parse first, using the source dialect, so the AST reflects that dialect's understanding of the input.
- Optimize second, so star expansion and column qualification happen on the already-correct tree.
- Generate last, passing the target dialect to `.sql()`, so the output follows that database's conventions.

The optimizer returns a new AST and does not modify the input, so you can call `.sql()` with any dialect afterward.
