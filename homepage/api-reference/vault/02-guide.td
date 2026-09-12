---
_icon: icon.compass
---

This guide walks through the core concept behind sqlingo.js: SQL goes in as a string, becomes a tree, and comes back out as a string. Everything else (transpiling, optimizing, building) is a variation of this cycle.

## SQL in, tree out

`parseOne` turns a SQL string into an AST (abstract syntax tree). Each node in the tree represents a SQL concept: a column, a table, a WHERE clause, a function call.

```typescript
import { parseOne } from "@hdnax/sqlingo.js";

const ast = parseOne("SELECT a, b + 1 AS c FROM users WHERE active = true");
```

The result is not a string. It is a tree of `Expression` objects that you can inspect and modify.

## Finding things in the tree

Use `.findAll(Type)` to search for specific node types. This is how you extract metadata from SQL:

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

`.find(Type)` returns the first match. `.walk()` iterates every node.

## Tree out, SQL back

Call `.sql()` on any node to generate SQL. Without arguments, you get the base dialect. Pass a dialect to get dialect-specific output:

```typescript
import { Postgres } from "@hdnax/sqlingo.js/postgres";

console.log(ast.sql());
// "SELECT a, b + 1 AS c FROM users WHERE active = TRUE"

console.log(ast.sql({ dialect: Postgres }));
// "SELECT a, b + 1 AS c FROM users WHERE active = TRUE"
```

The base dialect uppercases booleans (`true` becomes `TRUE`). Each dialect knows its own conventions for booleans, identifier quoting, function names, and data types.

## Transforming the tree

`.transform()` walks the tree and lets you replace nodes:

```typescript
const transformed = ast.transform((node) => {
  // Rename column "a" to "id"
  if (node instanceof ColumnExpr && node.name === "a") {
    return parseOne("id");
  }
  return node; // keep everything else
});

console.log(transformed.sql());
// "SELECT id, b + 1 AS c FROM users WHERE active = TRUE"
```

This is how transpilation works internally: the generator walks the tree and outputs dialect-specific SQL for each node type.

## Parsing multiple statements

`parse` (not `parseOne`) handles multiple statements separated by semicolons:

```typescript
import { parse } from "@hdnax/sqlingo.js";

const statements = parse("SELECT 1; SELECT 2; SELECT 3");
console.log(statements.length); // 3
```

## Column lineage

Trace where a column comes from through subqueries and aliases:

```typescript
import { lineage } from "@hdnax/sqlingo.js";

const node = lineage("b", "SELECT a AS b FROM (SELECT x AS a FROM y)");
console.log(node.name); // "b"
console.log(node.downstream[0].name); // "_0.a"
```

The lineage tracer follows the alias chain through subqueries, qualifying columns along the way.

## Error handling

When SQL cannot be parsed, a `ParseError` is thrown with structured details:

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

## What's next

Now that you understand the parse-tree-generate cycle, the rest of the docs go deeper:

- [Transpiling](03-transpiling) shows how dialects map functions, types, and syntax between databases
- [Optimization](04-optimize) shows how schema information enables query simplification
- [Building SQL](05-builders) shows how to construct ASTs without parsing a string first
- [Expressions](06-expression) is the full reference for the AST node API
