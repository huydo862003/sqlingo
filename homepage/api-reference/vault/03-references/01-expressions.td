---
_label: "Expressions"
_icon: icon.code
description: "The full Expression API: core methods, operator helpers, AST node types, searching, walking, and transforming."
---

Every parsed SQL element is an `Expression`. A column reference, a function call, an entire SELECT statement: they are all instances of `Expression` or one of its subclasses. This uniformity is what makes the API consistent: the same `.find()`, `.transform()`, and `.sql()` methods work at every level of the tree. The [Guide](../02-guide/01-parsing-and-trees) introduced the core usage. This page is the complete API reference.

## Core methods

These methods are available on every `Expression` instance, from the root of a query down to a single literal value.

| Method | Returns | Description |
|--------|---------|-------------|
| `.sql(options?)` | `string` | Generate SQL from this node. Pass `{ dialect, pretty }` for dialect-specific output. |
| `.find(Type)` | `Expression` or `undefined` | First descendant of the given type, in breadth-first order. Returns `undefined` if none found. |
| `.findAll(Type)` | `Generator<Expression>` | All descendants of the given type, in breadth-first order. The root itself is included if it matches. |
| `.walk(options?)` | `Generator<Expression>` | All nodes in the subtree. Defaults to breadth-first. Pass `{ bfs: false }` for depth-first, or `{ prune }` to skip subtrees. |
| `.transform(fn, options?)` | `Expression` | Walk every node and replace it with what `fn` returns. By default copies the tree first so the original is unchanged. |
| `.copy()` | `Expression` | Deep copy the entire subtree. |
| `.pipe(fn, ...args)` | `R` | Calls `fn(this, ...args)` and returns the result. Lets you apply any function in a fluent chain. |
| `.apply(fn, ...args)` | `this` | Calls `fn(this, ...args)` for side effects, then returns the same expression. Useful for inline debugging. |

### Traversal order

`.find()` and `.findAll()` both use breadth-first search by default, which means shallower nodes are visited before deeper ones. This is usually what you want when searching for the "nearest" match. You can pass `{ bfs: false }` to `.findAll()` to switch to depth-first.

`.walk()` also defaults to breadth-first. All traversal methods include the root node itself, so if the root matches your type filter, it will be yielded.

### How `.transform()` works

`.transform(fn)` visits every node in the tree. For each node, it calls `fn(node)`. Whatever `fn` returns replaces that node in the tree. If `fn` returns the same node unchanged, that subtree is preserved as-is. By default, `.transform()` works on a copy of the tree and leaves the original unchanged. Pass `{ copy: false }` to transform in place.

The transformation is applied recursively: if `fn` returns a new node, that new node's children are not re-visited. If you need recursive replacement, return the same node and let the traversal handle it.

## Operator methods

These methods construct new AST nodes. They are most useful in builder chains or when composing expressions programmatically.

| Method | Returns | Description |
|--------|---------|-------------|
| `.as(alias, options?)` | `AliasExpr` | Wraps this expression as `expr AS alias`. Pass `{ quoted: true }` to quote the alias. |
| `.eq(other)` | `EqExpr` | Equality comparison: `this = other`. |
| `.and(other, options?)` | `AndExpr` | Logical AND. Pass `{ wrap: false }` to skip automatic parenthesization. |
| `.or(other, options?)` | `OrExpr` | Logical OR. Pass `{ wrap: false }` to skip automatic parenthesization. |
| `.negate(options?)` | `NotExpr` | Wraps this expression in `NOT`. |

## Expression types

Each SQL concept has its own Expression subclass. Import them from the main package. This list covers the most commonly used types; there are many more for DDL, DML, and dialect-specific constructs.

```typescript
import { SelectExpr, ColumnExpr, TableExpr, FuncExpr, WhereExpr } from "sqlingo";
```

| Class | Represents |
|-------|-----------|
| `SelectExpr` | A SELECT statement |
| `SubqueryExpr` | A subquery used as an expression or table |
| `ColumnExpr` | A column reference (`t.x`, `x`) |
| `TableExpr` | A table reference in FROM |
| `WhereExpr` | A WHERE clause |
| `FuncExpr` | A function call (`f(x, y)`) |
| `LiteralExpr` | A literal value (number, string, boolean) |
| `AliasExpr` | An aliased expression (`x AS y`) |
| `JoinExpr` | A JOIN clause |
| `AndExpr` / `OrExpr` / `NotExpr` | Logical operators |
| `EqExpr` / `NEQExpr` / `GTExpr` / `LTExpr` | Comparison operators |
| `ConditionExpr` | Base class for boolean expressions |
| `WithExpr` | A WITH (CTE) clause |

## Example: extracting metadata

`.findAll()` is the primary tool for pulling specific node types out of a parsed query without writing manual traversal:

```typescript
import { parseOne, ColumnExpr, TableExpr, FuncExpr } from "sqlingo";

const ast = parseOne("SELECT f(a), b FROM t JOIN s ON t.id = s.id");

const tables = [...ast.findAll(TableExpr)].map((t) => t.name);
console.log(tables); // ["t", "s"]

const cols = [...ast.findAll(ColumnExpr)].map((c) => c.name);
console.log(cols); // ["a", "b", "id", "id"]

const funcs = [...ast.findAll(FuncExpr)].map((f) => f.name);
console.log(funcs); // ["f"]
```

## Example: dialect-specific output

Call `.sql()` with a dialect to get output formatted for a specific database. The same tree produces different SQL depending on the target:

```typescript
import { parseOne } from "sqlingo";
import { MySQL } from "sqlingo/mysql";
import { Postgres } from "sqlingo/postgres";

const ast = parseOne("SELECT a || b FROM t");

ast.sql({ dialect: Postgres });
// "SELECT a || b FROM t"

ast.sql({ dialect: MySQL });
// "SELECT CONCAT(a, b) FROM t"
```

## Example: pipe and apply

Both `.pipe()` and `.apply()` let you call external functions inside a fluent chain without breaking it into separate variables.

- `.pipe(fn, ...args)` hands off the expression to `fn` and continues the chain from whatever `fn` returns. Use it when the function produces a new value you want to keep chaining on, such as `optimize` which returns a different AST.
- `.apply(fn, ...args)` calls `fn` for its side effects and always returns the same expression. Use it when you want to observe or log the current expression without affecting what comes next.

```typescript
import { parseOne, optimize } from "sqlingo";

// pipe: the chain continues from what optimize returns (a new optimized AST)
const sql = parseOne("SELECT * FROM t WHERE 1 = 1")
  .pipe(optimize, { schema: { t: { x: "INT" } } })
  .sql();

// apply: the chain continues from the same expression, unchanged
parseOne("SELECT a FROM t")
  .apply((e) => console.log("before:", e.sql()))
  .transform((node) => node)
  .apply((e) => console.log("after:", e.sql()));
```
