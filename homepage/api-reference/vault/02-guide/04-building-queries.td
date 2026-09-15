---
_label: "Building queries"
_icon: icon.hammer
description: "Construct SQL programmatically with a fluent API: select, condition, logical helpers, DML builders, and dialect output."
---

The previous pages started with SQL strings. This page shows the opposite direction: building queries from code. The fluent API produces the same AST that `parseOne` would, so you can optimize, transpile, or inspect the result the same way.

## `select(...).from(...).where(...)`

The most common builder chains SELECT queries. You can add columns incrementally with `.select()`.

```typescript
import { select } from "@hdnax/sqlingo.js";

select(["x", "y"]).from("t").where("x > 1").sql();
// "SELECT x, y FROM t WHERE x > 1"

select("x").select("y").from("t").sql();
// "SELECT x, y FROM t"
```

## `condition(sql)`

Build composable WHERE clauses that can be combined with `.and()` and `.or()`.

```typescript
import { condition } from "@hdnax/sqlingo.js";

condition("x = 1").and("y = 2").or("z = 3").sql();
// "(x = 1 AND y = 2) OR z = 3"
```

## Logical helpers

Standalone functions for combining conditions without starting from a builder.

```typescript
import { and, or, not } from "@hdnax/sqlingo.js";

and(["x = 1", "y = 2"]).sql();  // "x = 1 AND y = 2"
or(["x = 1", "y = 2"]).sql();   // "x = 1 OR y = 2"
not("x = 1").sql();              // "NOT x = 1"
```

## Expression builders

These functions create individual AST nodes for use in builder chains or transforms.

| Function | Example | Output |
|----------|---------|--------|
| `column({ col, table })` | `column({ col: "x", table: "t" })` | `t.x` |
| `table(name)` | `table("users")` | `users` |
| `func(name, ...args)` | `func("COALESCE", "x", 1)` | `COALESCE(x, 1)` |
| `cast(expr, type)` | `cast("x", "INT")` | `CAST(x AS INT)` |
| `null_()` | `null_()` | `NULL` |
| `true_()` / `false_()` | `true_()` | `TRUE` |
| `case_().when().else()` | `case_().when("x = 1", "a").else("b")` | `CASE WHEN x = 1 THEN a ELSE b END` |

## DML builders

Insert, update, delete, and set operations follow the same pattern.

```typescript
import { insert, update, delete_, union, intersect, except } from "@hdnax/sqlingo.js";

insert("SELECT 1", "t").sql();           // "INSERT INTO t SELECT 1"
update("t", { x: 1 }).sql();             // "UPDATE t SET x = 1"
delete_("t", { where: "x = 1" }).sql();  // "DELETE FROM t WHERE x = 1"
union(["SELECT 1", "SELECT 2"]).sql();    // "SELECT 1 UNION SELECT 2"
```

## Using builders with transpilation

Since builders produce AST nodes, you can generate dialect-specific SQL from them just like parsed queries.

```typescript
import { Postgres } from "@hdnax/sqlingo.js/postgres";

select("x").from("t").where("x > 1").sql({ dialect: Postgres });
```
