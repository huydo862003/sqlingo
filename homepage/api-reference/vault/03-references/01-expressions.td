---
_label: "Expressions"
_icon: icon.braces
description: "The full Expression API: core methods, operator helpers, AST node types, searching, walking, and transforming."
---

Every parsed SQL element is an `Expression`. The [Guide](../02-guide/01-parsing-and-trees) introduced `.find()`, `.transform()`, and `.sql()`. This page is the complete API reference.

## Core methods

These are available on every `Expression` instance.

| Method | Returns | Description |
|--------|---------|-------------|
| `.sql(options?)` | `string` | Generate SQL. Pass `{ dialect, pretty }` for dialect-specific output |
| `.find(Type)` | `Expression` or `undefined` | First descendant of the given type |
| `.findAll(Type)` | `Iterable<Expression>` | All descendants of the given type |
| `.walk()` | `Iterable<Expression>` | All nodes, depth-first |
| `.transform(fn)` | `Expression` | Replace nodes by returning a new node from `fn` |
| `.copy()` | `Expression` | Deep copy the entire subtree |

## Operator methods

These return new AST nodes. They are useful in builder chains or when constructing conditions programmatically.

| Method | Returns | Description |
|--------|---------|-------------|
| `.as(alias)` | `AliasExpr` | Alias the expression |
| `.eq(other)` | `EqExpr` | Equality comparison |
| `.and(other)` | `AndExpr` | Logical AND |
| `.or(other)` | `OrExpr` | Logical OR |

## Expression types

Each SQL concept has its own Expression subclass. Import them from the main package.

```typescript
import { SelectExpr, ColumnExpr, TableExpr, FuncExpr } from "@hdnax/sqlingo.js";
```

| Class | Represents |
|-------|-----------|
| `SelectExpr` | A SELECT statement |
| `ColumnExpr` | A column reference |
| `TableExpr` | A table reference |
| `WhereExpr` | A WHERE clause |
| `FuncExpr` | A function call |
| `LiteralExpr` | A literal value (number, string) |
| `AliasExpr` | An aliased expression (`x AS y`) |
| `JoinExpr` | A JOIN clause |

## Example: extracting metadata

Use `.findAll()` to pull specific node types out of a parsed query.

```typescript
import { parseOne, ColumnExpr } from "@hdnax/sqlingo.js";

const ast = parseOne("SELECT a, b FROM t WHERE x > 1");

for (const col of ast.findAll(ColumnExpr)) {
  console.log(col.name);
}
// "a", "b", "x"
```

## Example: dialect-specific output

Pass a dialect to `.sql()` to get output that matches a specific database.

```typescript
import { Postgres } from "@hdnax/sqlingo.js/postgres";

ast.sql({ dialect: Postgres });
```
