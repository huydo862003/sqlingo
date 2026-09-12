---
_icon: icon.tree
---

Every parsed SQL element is an `Expression`. The [Guide](02-guide) introduced `.find()`, `.transform()`, and `.sql()`. This page is the full reference.

## Core methods

| Method | Returns | Description |
|--------|---------|-------------|
| `.sql(options?)` | `string` | Generate SQL. Pass `{ dialect, pretty }` for dialect-specific output. |
| `.find(Type)` | `Expression` or `undefined` | First descendant of the given type |
| `.findAll(Type)` | `Iterable<Expression>` | All descendants of the given type |
| `.walk()` | `Iterable<Expression>` | All nodes, depth-first |
| `.transform(fn)` | `Expression` | Replace nodes by returning a new node from `fn` |
| `.copy()` | `Expression` | Deep copy the entire subtree |

## Operator methods

These return new AST nodes, useful in builder chains or transforms:

| Method | Returns | Description |
|--------|---------|-------------|
| `.as(alias)` | `AliasExpr` | Alias the expression |
| `.eq(other)` | `EqExpr` | Equality comparison |
| `.and(other)` | `AndExpr` | Logical AND |
| `.or(other)` | `OrExpr` | Logical OR |

## Example: extracting metadata

```typescript
import { parseOne, ColumnExpr } from "@hdnax/sqlingo.js";

const ast = parseOne("SELECT a, b FROM t WHERE x > 1");

for (const col of ast.findAll(ColumnExpr)) {
  console.log(col.name);
}
// "a", "b", "x"
```

## Example: generating in a specific dialect

```typescript
import { Postgres } from "@hdnax/sqlingo.js/postgres";

ast.sql({ dialect: Postgres });
```

## Expression types

Each SQL concept has its own Expression subclass. Common ones:

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

Import them from the main package:

```typescript
import { SelectExpr, ColumnExpr, TableExpr, FuncExpr } from "@hdnax/sqlingo.js";
```

## Next: [Dialects](07-dialect)

Expressions are dialect-agnostic. The next page explains how dialects control parsing and generation, how tree-shaking works, and how to write a custom dialect.
