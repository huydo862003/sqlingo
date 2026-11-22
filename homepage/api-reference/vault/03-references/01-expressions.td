---
_label: "Expressions"
_icon: icon.code
description: "The full Expression API: core methods, operator helpers, AST node types, searching, walking, and transforming."
---

Every parsed SQL element is an `Expression`: a column reference, a function call, an entire SELECT statement. The same `.find()`, `.transform()`, and `.sql()` methods work at every level of the tree.

## Core methods

| Method | Returns | Description |
|--------|---------|-------------|
| `.sql(options?)` | `string` | Generate SQL. Pass `{ dialect, pretty }` for dialect-specific output. |
| `.find(Type)` | `Expression \| undefined` | First descendant matching the type, **breadth-first**. |
| `.findAll(Type)` | `Generator<Expression>` | All descendants matching the type, **breadth-first**. Includes the root if it matches. |
| `.walk(options?)` | `Generator<Expression>` | All nodes. **Breadth-first** by default. Pass `{ bfs: false }` for depth-first, `{ prune }` to skip subtrees. |
| `.transform(fn, options?)` | `Expression` | Walk every node and replace it with what `fn` returns. **Copies the tree** by default. |
| `.copy()` | `Expression` | Deep copy the entire subtree. |
| `.pipe(fn, ...args)` | `R` | Call `fn(this, ...args)` and return the result. |
| `.apply(fn, ...args)` | `this` | Call `fn(this, ...args)` for side effects, return the same expression. |

`.transform()` does not re-visit children of replaced nodes. Pass `{ copy: false }` to transform in place.

## Operator methods

| Method | Returns | Description |
|--------|---------|-------------|
| `.as(alias, options?)` | `AliasExpr` | `expr AS alias`. Pass `{ quoted: true }` to quote the alias. |
| `.eq(other)` | `EqExpr` | `this = other` |
| `.and(other)` | `AndExpr` | Logical AND |
| `.or(other)` | `OrExpr` | Logical OR |
| `.negate()` | `NotExpr` | `NOT this` |

## Expression types

Each SQL concept has its own subclass. The most commonly used:

| Class | Represents |
|-------|-----------|
| `SelectExpr` | SELECT statement |
| `SubqueryExpr` | Subquery as expression or table |
| `ColumnExpr` | Column reference |
| `TableExpr` | Table reference |
| `WhereExpr` | WHERE clause |
| `FuncExpr` | Function call |
| `LiteralExpr` | Literal value (number, string, boolean) |
| `AliasExpr` | Aliased expression (`x AS y`) |
| `JoinExpr` | JOIN clause |
| `AndExpr` / `OrExpr` / `NotExpr` | Logical operators |
| `EqExpr` / `NEQExpr` / `GTExpr` / `LTExpr` | Comparisons |
| `WithExpr` | WITH (CTE) clause |

## Example: extracting metadata

```typescript
import { parseOne, ColumnExpr, TableExpr, FuncExpr } from "sqlingo";

const ast = parseOne("SELECT f(a), b FROM t JOIN s ON t.id = s.id");

const tables = [...ast.findAll(TableExpr)].map((t) => t.name);
// ["t", "s"]

const cols = [...ast.findAll(ColumnExpr)].map((c) => c.name);
// ["a", "b", "id", "id"]

const funcs = [...ast.findAll(FuncExpr)].map((f) => f.name);
// ["f"]
```

## Example: pipe and apply

`.pipe()` passes the expression to a function and continues the chain from whatever it returns. `.apply()` calls a function for side effects and returns the same expression.

```typescript
import { parseOne, optimize } from "sqlingo";

// pipe: chain continues from the optimized AST
const sql = parseOne("SELECT * FROM t WHERE 1 = 1")
  .pipe(optimize, { schema: { t: { x: "INT" } } })
  .sql();

// apply: chain continues from the same expression
parseOne("SELECT a FROM t")
  .apply((e) => console.log("before:", e.sql()))
  .transform((node) => node)
  .apply((e) => console.log("after:", e.sql()));
```
