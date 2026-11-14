---
_label: "Parsing and trees"
_icon: icon.tree
description: "The core workflow: parsing SQL to an AST, searching and transforming nodes, generating SQL back, and error handling."
---

This page walks through the central concept in sqlingo: SQL goes in as a string, becomes a tree of objects, and comes back out as a string. Transpiling, optimizing, and building are all variations of this cycle.

## Parsing a statement

`parseOne` turns a SQL string into an AST (abstract syntax tree). Each node in the tree represents a SQL concept: a column, a table, a WHERE clause, a function call.

```typescript
import { parseOne } from "sqlingo";

const ast = parseOne("SELECT a, b + 1 AS c FROM users WHERE active = true");
```

The result is a tree of `Expression` objects, not a string. You can inspect it, search for specific nodes, transform parts of it, or generate SQL back from it.

## Searching the tree

Once you have a tree, you can pull specific pieces out of it. Use `.findAll(Type)` to extract all nodes of a given type - column names, table references, function calls - without writing a parser yourself.

```typescript
import { parseOne, ColumnExpr, TableExpr } from "sqlingo";

const ast = parseOne("SELECT a, b + 1 AS c FROM users WHERE active = true");

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

You can also use `.find(Type)` to get just the first match, or `.walk()` to iterate every node depth-first.

## Generating SQL back

Call `.sql()` on any node to turn the tree back into a SQL string. Pass a dialect to get database-specific output - different quoting, function names, and boolean conventions.

```typescript
import { parseOne } from "sqlingo";
import { MySQL } from "sqlingo/mysql";

const ast = parseOne("SELECT a || b FROM t");

console.log(ast.sql());
// "SELECT a || b FROM t"

console.log(ast.sql({ dialect: MySQL }));
// "SELECT CONCAT(a, b) FROM t"
```

Without a dialect argument, the base dialect is used. Each dialect applies its own conventions for quoting, operators, and syntax, so the same tree can produce different SQL depending on the target.

## Transforming the tree

You can rewrite the tree before generating SQL. `.transform()` walks every node and lets you replace specific ones - useful for renaming columns, swapping tables, or rewriting conditions.

```typescript
import { parseOne, ColumnExpr } from "sqlingo";

const ast = parseOne("SELECT a, b + 1 AS c FROM users WHERE active = true");

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

When your input contains more than one statement, use `parse` instead of `parseOne`. It returns an array of ASTs, one per statement.

```typescript
import { parse } from "sqlingo";

const statements = parse("SELECT 1; SELECT 2; SELECT 3");
console.log(statements.length); // 3
```

## Error handling

When SQL cannot be parsed, sqlingo throws a `ParseError` with the line and column of the problem. Use this to surface parse errors in editors, linters, or migration tools.

```typescript
import { parseOne, ParseError } from "sqlingo";

try {
  parseOne("SELECT foo FROM (SELECT baz FROM t");
} catch (e) {
  if (e instanceof ParseError) {
    console.log(e.errors);
    // [{ description: "...", line: 1, col: 35, ... }]
  }
}
```
