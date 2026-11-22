---
_label: "Parsing and trees"
_icon: icon.tree
description: "The core workflow: parsing SQL to an AST, searching and transforming nodes, generating SQL back, and error handling."
---

Every operation in sqlingo follows the same cycle:

1. A SQL string goes in and becomes a tree of expression objects
2. You search, transform, or optimize the tree
3. The tree comes back out as a SQL string

Transpiling, optimizing, and building queries are all variations of this cycle.

## Parsing a statement

`parseOne` turns a SQL string into an AST. Each node is an `Expression` object: a SELECT, a column reference, a WHERE clause, a function call, a literal.

```typescript
import { parseOne } from "sqlingo";

const ast = parseOne("SELECT a, b + 1 AS c FROM users WHERE active = true");
```

The root is a `SelectExpr`. Its children include a `FromExpr`, a `WhereExpr`, and a list of column expressions. Each node knows its parent and children.

By default, `parseOne` uses the base dialect, which accepts most SQL. For dialect-specific syntax, pass the dialect:

```typescript
import { parseOne } from "sqlingo";
import { MySQL } from "sqlingo/mysql";

const ast = parseOne("SELECT `id` FROM `users`", { read: MySQL });
```

## Searching the tree

You can explore the tree with expression helpers to find columns, tables, and other nodes in a query. `.findAll(Type)` yields every matching node:

```typescript
import { parseOne, ColumnExpr, TableExpr } from "sqlingo";

const ast = parseOne("SELECT a, b + 1 AS c FROM users WHERE active = true");

for (const col of ast.findAll(ColumnExpr)) {
  console.log(col.name);
}
// "a", "b", "active"

for (const table of ast.findAll(TableExpr)) {
  console.log(table.name);
}
// "users"
```

`.find(Type)` returns the first match only:

```typescript
const where = ast.find(WhereExpr);
console.log(where?.sql()); // "WHERE x > 1"
```

## Walking all nodes

For lower-level traversal, `.walk()` visits every node in breadth-first order. You can pass `{ bfs: false }` for depth-first, or `prune` to skip entire subtrees:

```typescript
import { parseOne, FuncExpr } from "sqlingo";

const ast = parseOne("SELECT f(x) + g(y) FROM t");

for (const node of ast.walk()) {
  if (node instanceof FuncExpr) {
    console.log(node.name);
  }
}
// "f", "g"
```

## Generating SQL

Call `.sql()` on any node to turn it back into a SQL string. You can pass a dialect to get database-specific output:

```typescript
import { parseOne } from "sqlingo";
import { MySQL } from "sqlingo/mysql";

const ast = parseOne("SELECT a || b FROM t");

ast.sql();                      // "SELECT a || b FROM t"
ast.sql({ dialect: MySQL });    // "SELECT CONCAT(a, b) FROM t"
ast.sql({ pretty: true });
// SELECT
//   a || b
// FROM
//   t
```

## Transforming the tree

You can rewrite the tree before generating SQL. `.transform()` walks every node and lets you replace specific ones:

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

Pass `{ copy: false }` to transform in place.

## Multiple statements

`parse` returns an array of ASTs, one per statement:

```typescript
import { parse } from "sqlingo";

const statements = parse("CREATE TABLE t (id INT); INSERT INTO t VALUES (1); SELECT * FROM t");
console.log(statements.length); // 3
```

If the input has parse errors in some statements, the successfully parsed ones still appear in the array. `parseOne` throws on the first error, while `parse` collects errors and continues.

## Error handling

`ParseError` contains a list of problems with line/column positions:

```typescript
import { parseOne, ParseError } from "sqlingo";

try {
  parseOne("SELECT foo FROM (SELECT baz FROM t");
} catch (e) {
  if (e instanceof ParseError) {
    for (const error of e.errors) {
      console.log(`Line ${error.line}, col ${error.col}: ${error.description}`);
    }
  }
}
```

Pass `errorLevel` to control strictness: raise errors (default), log warnings, or treat all warnings as errors.
