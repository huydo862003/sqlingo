---
_label: "Parsing and trees"
_icon: icon.tree
description: "The core workflow: parsing SQL to an AST, searching and transforming nodes, generating SQL back, error handling, and column lineage."
---

This page walks through the central concept in sqlingo.js: SQL goes in as a string, becomes a tree of objects, and comes back out as a string. Everything else (transpiling, optimizing, building) is a variation of this cycle.

## SQL in, tree out

`parseOne` turns a SQL string into an AST (abstract syntax tree). Each node in the tree represents a SQL concept: a column, a table, a WHERE clause, a function call.

```typescript
import { parseOne } from "@hdnax/sqlingo.js";

const ast = parseOne("SELECT a, b + 1 AS c FROM users WHERE active = true");
```

The result is not a string. It is a tree of `Expression` objects that you can inspect and modify.

## Finding things in the tree

Use `.findAll(Type)` to search for specific node types. This is how you extract metadata from SQL without writing a parser.

```typescript
import { ColumnExpr, TableExpr } from "@hdnax/sqlingo.js";

// Find all column references
for (const col of ast.findAll(ColumnExpr)) {
  console.log(col.name);
}
// "a", "b", "active"

// Find all table references
for (const table of ast.findAll(TableExpr)) {
  console.log(table.name);
}
// "users"
```

`.find(Type)` returns the first match. `.walk()` iterates every node depth-first.

## Tree out, SQL back

Call `.sql()` on any node to generate SQL. Without arguments, you get the base dialect. Pass a dialect to get dialect-specific output.

```typescript
import { Postgres } from "@hdnax/sqlingo.js/postgres";

console.log(ast.sql());
// "SELECT a, b + 1 AS c FROM users WHERE active = TRUE"

console.log(ast.sql({ dialect: Postgres }));
// "SELECT a, b + 1 AS c FROM users WHERE active = TRUE"
```

The base dialect uppercases booleans (`true` becomes `TRUE`). Each dialect knows its own conventions for booleans, identifier quoting, function names, and data types.

## Transforming the tree

`.transform()` walks the tree and lets you replace nodes. Return a new node to replace the current one, or return it unchanged to keep it.

```typescript
const transformed = ast.transform((node) => {
  if (node instanceof ColumnExpr && node.name === "a") {
    return parseOne("id");
  }
  return node;
});

console.log(transformed.sql());
// "SELECT id, b + 1 AS c FROM users WHERE active = TRUE"
```

This is how transpilation works internally: the generator walks the tree and outputs dialect-specific SQL for each node type.

## Parsing multiple statements

`parse` (not `parseOne`) handles multiple statements separated by semicolons.

```typescript
import { parse } from "@hdnax/sqlingo.js";

const statements = parse("SELECT 1; SELECT 2; SELECT 3");
console.log(statements.length); // 3
```

## Column lineage

The lineage tracer follows alias chains through subqueries, qualifying columns along the way. This is useful for data governance and impact analysis.

```typescript
import { lineage } from "@hdnax/sqlingo.js";

const node = lineage("b", "SELECT a AS b FROM (SELECT x AS a FROM y)");
console.log(node.name); // "b"
console.log(node.downstream[0].name); // "_0.a"
```

## Error handling

When SQL cannot be parsed, a `ParseError` is thrown with structured details including the line and column of the error.

```typescript
import { parseOne, ParseError } from "@hdnax/sqlingo.js";

try {
  parseOne("SELECT foo FROM (SELECT baz FROM t");
} catch (e) {
  if (e instanceof ParseError) {
    console.log(e.errors);
    // [{ description: "...", line: 1, col: 35, ... }]
  }
}
```
