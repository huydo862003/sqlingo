---
_label: "Quick start"
_icon: icon.rocket
description: "Install sqlingo, parse your first query, transpile between dialects, and optimize with schema information."
---

sqlingo is built around one idea: SQL is a tree. A query string goes in, becomes a tree of objects you can inspect and transform, and comes back out as a string in any dialect. Parsing, transpiling, optimizing, and building queries are all variations of this same cycle. Once that model clicks, the rest of the API follows naturally.

This page gets the library installed and shows each major operation once so you have a working mental map before reading the full guide.

## Install

sqlingo ships as a single npm package with one peer dependency. `luxon` is used internally for date and time literal handling: dialects differ substantially in how they represent dates (`DATE_SUB` in MySQL, interval arithmetic in Postgres, `DATE_ADD` in BigQuery), and luxon provides the cross-platform date parsing that lets sqlingo correctly transpile between them.

```bash
npm install sqlingo luxon
```

## Parse SQL

Parsing is always the first step. `parseOne` takes a SQL string and returns a tree of `Expression` objects: an AST (abstract syntax tree) where each node represents one SQL concept such as a column reference, a function call, a WHERE clause, or a literal value. The tree is what you work with. Generating SQL, searching for columns, and running transformations all operate on that tree.

```typescript
import { parseOne } from "sqlingo";

const ast = parseOne("SELECT a, b FROM users WHERE active = true");
console.log(ast.sql()); // "SELECT a, b FROM users WHERE active = TRUE"
```

Notice that `true` became `TRUE` in the output. The base dialect normalizes SQL as it generates: booleans are uppercased, whitespace is collapsed, and some syntax is canonicalized to a standard form. This normalization is deliberate. It makes query comparison and transformation predictable. If you need output that matches a specific database's conventions, pass that dialect to `.sql()`, or use `transpile` with explicit `read` and `write` options.

## Transpile between dialects

Transpiling converts SQL from one database syntax to another. The `transpile` function accepts a SQL string and returns an **array** of SQL strings, one per statement in the input, since a single input can contain multiple semicolon-separated statements. When you are transpiling a single statement, the typical pattern is to destructure with `[sql]`.

```typescript
import { transpile } from "sqlingo";
import { MySQL } from "sqlingo/mysql";
import { Postgres } from "sqlingo/postgres";

const [sql] = transpile(
  "SELECT DATE_SUB(d, INTERVAL 1 DAY) FROM t",
  { read: MySQL, write: Postgres },
);
console.log(sql);
// "SELECT d - INTERVAL '1 DAY' FROM t"
```

The `read` option tells sqlingo how to parse the input: which tokenizer rules to use, which keywords to recognize, and which syntax quirks to expect. The `write` option controls how the output is generated. Here, MySQL's `DATE_SUB` has no direct Postgres equivalent, so sqlingo converts it to interval arithmetic automatically. The same mechanism handles type casting, string concatenation operators, quoting conventions, and hundreds of other dialect differences.

Each dialect is imported from a separate entry point (`sqlingo/mysql`, `sqlingo/postgres`, etc.), which lets bundlers tree-shake the ones you don't use. Only the dialects you import end up in your bundle.

## Optimize a query

The optimizer rewrites SQL to be more explicit and normalized. It needs schema information to know which tables and columns exist, so it can expand `SELECT *`, qualify ambiguous column references, and remove dead conditions.

```typescript
import { optimize, parseOne, MappingSchema } from "sqlingo";

const schema = new MappingSchema({ t: { a: "int", b: "int" } });
const optimized = optimize(
  parseOne("SELECT * FROM t WHERE 1 = 1 AND a > 2"),
  { schema },
);

console.log(optimized.sql());
// SELECT "t"."a" AS "a", "t"."b" AS "b" FROM "t" AS "t" WHERE "t"."a" > 2
```

Three transformations happened here:

- `SELECT *` expanded to `"t"."a" AS "a", "t"."b" AS "b"` because the schema declared `a` and `b` as the columns of `t`.
- `1 = 1` was removed as a tautology that can never cause a row to be filtered.
- All identifiers were qualified with their table name and double-quoted, turning `a` into `"t"."a"`.

Optimization is optional. Use it when you need explicit, unambiguous SQL for query analysis tools, migration pipelines, lineage tracking, or any situation where you need to know precisely which table every column comes from.

## Next steps

The [Guide](02-guide/01-parsing-and-trees) explains what happens under the hood:

- How the tree is structured and what each node type represents
- How to search and transform nodes with `.find()`, `.findAll()`, and `.transform()`
- How transpiling and optimizing build on the same parse-tree-generate cycle
