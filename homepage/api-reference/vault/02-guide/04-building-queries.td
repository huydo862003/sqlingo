---
_label: "Building queries"
_icon: icon.hammer
description: "Construct SQL programmatically with a fluent API: select, condition, logical helpers, DML builders, and dialect output."
---

The previous pages started with SQL strings and worked with the resulting tree. This page shows the opposite direction: constructing queries from code using a fluent builder API.

The builders produce the same `Expression` tree that `parseOne` would, so you can feed the result into `optimize`, call `.sql()` with any dialect, or combine it with parsed fragments. Everything works the same way.

Use builders when your query structure depends on runtime values and constructing a SQL string with string interpolation would be error-prone. Builders handle quoting and parenthesization correctly by construction.

## SELECT queries

The `select` function starts a SELECT builder. Columns can be passed up front as an array, or added incrementally with chained `.select()` calls. All builder methods return the same expression, so you can chain them freely.

```typescript
import { select } from "sqlingo";

select(["x", "y"]).from("t").where("x > 1").sql();
// "SELECT x, y FROM t WHERE x > 1"

select("x").select("y").from("t").sql();
// "SELECT x, y FROM t"
```

Column arguments can be plain strings (parsed as SQL expressions), or `Expression` instances from other builders or `parseOne`. Mixing both is fine:

```typescript
import { select, column } from "sqlingo";
import { parseOne } from "sqlingo";

const col = column({ col: "id", table: "users" });
select([col, parseOne("name")]).from("users").sql();
// "SELECT users.id, name FROM users"
```

The `select` builder also supports `.limit()`, `.offset()`, `.orderBy()`, and `.with()` for CTEs:

```typescript
select("x").from("t").orderBy("x DESC").limit(10).offset(20).sql();
// "SELECT x FROM t ORDER BY x DESC LIMIT 10 OFFSET 20"

select("x").from("cte").with("cte", "SELECT x FROM t WHERE x > 1").sql();
// "WITH cte AS (SELECT x FROM t WHERE x > 1) SELECT x FROM cte"
```

Alternatively, start from the FROM clause using the `from` function when you find that more readable:

```typescript
import { from } from "sqlingo";

from("t").select(["x", "y"]).where("x > 1").sql();
// "SELECT x, y FROM t WHERE x > 1"
```

## WHERE conditions

Use `condition` to build composable WHERE clauses. Each call parses its argument as a SQL expression and wraps it in an object with `.and()` and `.or()` methods for combining conditions.

```typescript
import { condition } from "sqlingo";

condition("x = 1").and("y = 2").or("z = 3").sql();
// "(x = 1 AND y = 2) OR z = 3"
```

The parenthesization follows standard SQL precedence rules: AND binds tighter than OR, so chaining `.and()` before `.or()` groups the ANDs in parentheses automatically. The builder always produces logically correct output without you having to manage parentheses manually.

You can also pass condition expressions to `.where()` on the select builder:

```typescript
import { select, condition } from "sqlingo";

const filter = condition("status = 'active'").and("age > 18");
select("*").from("users").where(filter).sql();
// "SELECT * FROM users WHERE status = 'active' AND age > 18"
```

## Logical helpers

For combining conditions without starting from a builder, use the standalone `and`, `or`, and `not` functions. These accept arrays of conditions and return an `Expression`:

```typescript
import { and, or, not } from "sqlingo";

and(["x = 1", "y = 2"]).sql();  // "x = 1 AND y = 2"
or(["x = 1", "y = 2"]).sql();   // "x = 1 OR y = 2"
not("x = 1").sql();              // "NOT x = 1"
```

These are especially useful when you have a list of conditions computed at runtime and want to combine them without manually constructing the chain:

```typescript
const filters = ["status = 'active'", "region = 'us'", "age > 18"];
select("*").from("users").where(and(filters)).sql();
// "SELECT * FROM users WHERE status = 'active' AND region = 'us' AND age > 18"
```

## Expression builders

These functions create individual AST nodes. Use them when you need to construct expressions precisely: in builder chains, in `.transform()` callbacks, or when plain strings would be ambiguous.

| Function | Example | Output |
|----------|---------|--------|
| `column({ col, table? })` | `column({ col: "x", table: "t" })` | `t.x` |
| `table(name)` | `table("users")` | `users` |
| `func(name, ...args)` | `func("COALESCE", "x", 1)` | `COALESCE(x, 1)` |
| `cast(expr, type)` | `cast("x", "INT")` | `CAST(x AS INT)` |
| `null_()` | `null_()` | `NULL` |
| `true_()` / `false_()` | `true_()` | `TRUE` |
| `case_()` | `case_().when("x = 1", "a").else("b")` | `CASE WHEN x = 1 THEN a ELSE b END` |

String arguments to `func`, `cast`, and `case_` are parsed as SQL expressions, so `func("COALESCE", "x", "y")` correctly produces `COALESCE(x, y)` rather than treating `"x"` and `"y"` as string literals.

## DML builders

Insert, update, delete, and set operations follow the same fluent pattern. Each returns an `Expression` that you call `.sql()` on:

```typescript
import { insert, update, delete_, union } from "sqlingo";

insert("SELECT 1", "t").sql();
// "INSERT INTO t SELECT 1"

update("t", { x: 1, y: "foo" }).sql();
// "UPDATE t SET x = 1, y = foo"

delete_("t", { where: "x = 1" }).sql();
// "DELETE FROM t WHERE x = 1"

union(["SELECT 1", "SELECT 2"]).sql();
// "SELECT 1 UNION SELECT 2"
```

## Using builders with transpilation

Since builders produce AST nodes, you can call `.sql()` with any dialect to generate database-specific output. The same builder expression can produce correct SQL for multiple targets:

```typescript
import { select, func } from "sqlingo";
import { MySQL } from "sqlingo/mysql";
import { Postgres } from "sqlingo/postgres";

const query = select([func("NOW")]).from("t");

query.sql({ dialect: MySQL });
// "SELECT NOW() FROM t"

query.sql({ dialect: Postgres });
// "SELECT NOW() FROM t"
```

You can also pass the result of a builder directly to `optimize`:

```typescript
import { select, optimize } from "sqlingo";

const query = select("*").from("users");
const optimized = optimize(query, { schema: { users: { id: "INT", name: "TEXT" } } });
console.log(optimized.sql());
// SELECT "users"."id" AS "id", "users"."name" AS "name" FROM "users" AS "users"
```
