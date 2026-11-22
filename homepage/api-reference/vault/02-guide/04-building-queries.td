---
_label: "Building queries"
_icon: icon.hammer
description: "Construct SQL programmatically with a fluent API: select, condition, logical helpers, DML builders, and dialect output."
---

The previous pages started with SQL strings. This page goes the other direction: constructing queries from code using a fluent builder API.

The builders produce the same `Expression` tree that `parseOne` would, so you can pass the result to `optimize`, call `.sql()` with any dialect, or combine it with parsed fragments.

## SELECT queries

```typescript
import { select } from "sqlingo";

select(["x", "y"]).from("t").where("x > 1").sql();
// "SELECT x, y FROM t WHERE x > 1"

select("x").select("y").from("t").sql();
// "SELECT x, y FROM t"
```

Columns can be plain strings (parsed as SQL) or `Expression` instances. The builder also supports `.limit()`, `.offset()`, `.orderBy()`, and `.with()` for CTEs:

```typescript
select("x").from("t").orderBy("x DESC").limit(10).offset(20).sql();
// "SELECT x FROM t ORDER BY x DESC LIMIT 10 OFFSET 20"
```

You can also start from the FROM clause with the `from` function:

```typescript
import { from } from "sqlingo";

from("t").select(["x", "y"]).where("x > 1").sql();
// "SELECT x, y FROM t WHERE x > 1"
```

## WHERE conditions

`condition` builds composable WHERE clauses with `.and()` and `.or()`. Parenthesization follows standard SQL precedence (AND binds tighter than OR):

```typescript
import { condition } from "sqlingo";

condition("x = 1").and("y = 2").or("z = 3").sql();
// "(x = 1 AND y = 2) OR z = 3"
```

## Logical helpers

Standalone functions for combining conditions from arrays:

```typescript
import { and, or, not } from "sqlingo";

and(["x = 1", "y = 2"]).sql();  // "x = 1 AND y = 2"
or(["x = 1", "y = 2"]).sql();   // "x = 1 OR y = 2"
not("x = 1").sql();              // "NOT x = 1"
```

## Expression builders

Functions for creating individual AST nodes:

| Function | Example | Output |
|----------|---------|--------|
| `column({ col, table? })` | `column({ col: "x", table: "t" })` | `t.x` |
| `table(name)` | `table("users")` | `users` |
| `func(name, ...args)` | `func("COALESCE", "x", 1)` | `COALESCE(x, 1)` |
| `cast(expr, type)` | `cast("x", "INT")` | `CAST(x AS INT)` |
| `null_()` | `null_()` | `NULL` |
| `true_()` / `false_()` | `true_()` | `TRUE` |
| `case_()` | `case_().when("x = 1", "a").else("b")` | `CASE WHEN x = 1 THEN a ELSE b END` |

String arguments to `func`, `cast`, and `case_` are parsed as SQL expressions, so `func("COALESCE", "x", "y")` produces `COALESCE(x, y)`, not string literals.

## DML builders

```typescript
import { insert, update, delete_, union } from "sqlingo";

insert("SELECT 1", "t").sql();           // "INSERT INTO t SELECT 1"
update("t", { x: 1, y: "foo" }).sql();   // "UPDATE t SET x = 1, y = foo"
delete_("t", { where: "x = 1" }).sql();  // "DELETE FROM t WHERE x = 1"
union(["SELECT 1", "SELECT 2"]).sql();    // "SELECT 1 UNION SELECT 2"
```

## Dialect-specific output

Since builders produce AST nodes, you can call `.sql()` with any dialect or pass the result to `optimize`:

```typescript
import { select, optimize } from "sqlingo";

const query = select("*").from("users");
const optimized = optimize(query, { schema: { users: { id: "INT", name: "TEXT" } } });
console.log(optimized.sql());
// SELECT "users"."id" AS "id", "users"."name" AS "name" FROM "users" AS "users"
```
