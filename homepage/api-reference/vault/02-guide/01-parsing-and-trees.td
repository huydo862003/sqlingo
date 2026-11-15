---
_label: "Parsing and trees"
_icon: icon.tree
description: "The core workflow: parsing SQL to an AST, searching and transforming nodes, generating SQL back, and error handling."
---

The central concept in sqlingo is that SQL is a tree. A query string goes in, becomes a tree of objects, and comes back out as a string. Transpiling, optimizing, and building are all variations of this cycle. Understanding the tree is the prerequisite for everything else.

## Parsing a statement

`parseOne` turns a SQL string into an AST. Each node in the tree is an `Expression` object representing one SQL concept: a SELECT statement, a column reference, a binary operation, a WHERE clause, a function call, or a literal value. The nodes are connected: each node knows its parent and its children, forming a tree rooted at the top-level statement.

```typescript
import { parseOne } from "sqlingo";

const ast = parseOne("SELECT a, b + 1 AS c FROM users WHERE active = true");
```

The result is not a string. It is a live object you can inspect, search, transform, and generate SQL back from. The root of the tree here is a `SelectExpr` node. Its children include a `FromExpr` (pointing to the `users` table), a `WhereExpr` (pointing to the `active = true` condition), and a list of column expressions.

By default, `parseOne` uses the base dialect, a permissive superset that accepts most SQL syntax. To parse dialect-specific SQL (MySQL backtick quoting, BigQuery struct literals, etc.), pass the dialect explicitly:

```typescript
import { parseOne } from "sqlingo";
import { MySQL } from "sqlingo/mysql";

const ast = parseOne("SELECT `id` FROM `users`", { read: MySQL });
```

## Searching the tree

Once you have a tree, use `.findAll(Type)` to extract all nodes of a given type. It walks the entire tree and yields every node that is an instance of the given class (column names, table references, function calls) without you having to write your own traversal.

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

Notice that `active` appears even though it is in the WHERE clause, not the SELECT list. `.findAll()` searches the entire subtree rooted at whatever node you call it on. If you call it on the whole AST, it searches everything. If you call it on just the WHERE clause node, it only searches there.

`.find(Type)` returns the first match and stops, which is useful when you know there is exactly one and you don't need to iterate:

```typescript
import { parseOne, WhereExpr } from "sqlingo";

const ast = parseOne("SELECT a FROM t WHERE x > 1");
const where = ast.find(WhereExpr);
console.log(where?.sql()); // "WHERE x > 1"
```

## Walking all nodes

`.walk()` visits every node in the tree in breadth-first order by default, yielding each one so you can inspect or filter it. Use it when you need to process all nodes without filtering to a specific type, or when you want to prune certain subtrees:

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

Pass `{ bfs: false }` to switch to depth-first order. Pass a `prune` function to skip entire subtrees, which is useful when you want to avoid descending into subqueries:

```typescript
import { parseOne, SubqueryExpr } from "sqlingo";

const ast = parseOne("SELECT a FROM t WHERE x IN (SELECT x FROM s)");

for (const node of ast.walk({ prune: (n) => n instanceof SubqueryExpr })) {
  // SubqueryExpr nodes are yielded, but their children are skipped
}
```

## Generating SQL back

Call `.sql()` on any node to turn it back into a SQL string. You can call it on the root to get the full query, or on any subtree to get just that part. Pass a dialect to get database-specific output with different quoting styles, function names, operator syntax, and boolean conventions.

```typescript
import { parseOne } from "sqlingo";
import { MySQL } from "sqlingo/mysql";

const ast = parseOne("SELECT a || b FROM t");

console.log(ast.sql());
// "SELECT a || b FROM t"

console.log(ast.sql({ dialect: MySQL }));
// "SELECT CONCAT(a, b) FROM t"
```

Pass `pretty: true` for indented, human-readable output:

```typescript
ast.sql({ pretty: true });
// SELECT
//   a || b
// FROM
//   t
```

## Transforming the tree

`.transform()` rewrites the tree. It walks every node and calls your function on each one. Whatever you return from the function becomes the new node. Return the same node to leave it unchanged, or return a different expression to replace it.

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

By default, `.transform()` works on a copy of the tree and leaves the original unchanged. The original `ast` is unmodified after the call. Pass `{ copy: false }` to transform in place if you are sure you do not need the original.

## Parsing multiple statements

When your input contains more than one statement, use `parse` instead of `parseOne`. It returns an array of ASTs, one per statement. This is useful when processing migration files, DDL scripts, or any batch of SQL commands.

```typescript
import { parse } from "sqlingo";

const statements = parse("CREATE TABLE t (id INT); INSERT INTO t VALUES (1); SELECT * FROM t");
console.log(statements.length); // 3
```

If the input has parse errors in some statements but not others, the successfully parsed statements still appear in the array. Only `parseOne` throws on failure; `parse` by default collects errors and continues.

## Error handling

When SQL cannot be parsed, sqlingo throws a `ParseError`. The error contains a list of individual problems, each with a line number, column position, and description. This is useful for surfacing parse errors in editors, linters, or migration tools.

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

You can control how strict parsing is by passing `errorLevel`. By default it is set to raise errors; you can lower it to log warnings instead, or raise it to treat all warnings as errors.
