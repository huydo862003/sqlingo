---
_label: "Quick start"
_icon: icon.rocket
description: "Install sqlingo, parse your first query, transpile between dialects, and optimize with schema information."
---

Get sqlingo running in under a minute. This page covers installation and the three core operations: parsing, transpiling, and optimizing.

## Install

sqlingo ships as a single npm package. `luxon` is a peer dependency used for date and time operations.

```bash
npm install sqlingo luxon
```

## Parse SQL

Every SQL string becomes an AST (abstract syntax tree). You can inspect it, transform it, or turn it back into SQL.

```typescript
import { parseOne } from "sqlingo";

const ast = parseOne("SELECT a, b FROM users WHERE active = true");
console.log(ast.sql()); // "SELECT a, b FROM users WHERE active = TRUE"
```

## Transpile between dialects

To translate SQL from one database to another, import the dialect classes and pass them to `transpile`. Each dialect is a separate import, so your bundler only ships the ones you use.

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

## Optimize a query

With schema information, the optimizer can qualify columns, simplify conditions, and remove dead code.

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

Notice `SELECT *` expanded to named columns, `1 = 1` removed, and everything qualified.

## Next steps

These three operations are the foundation. The [Guide](02-guide/01-parsing-and-trees) explains what happens under the hood: how SQL becomes a tree, how you navigate that tree, and how the tree becomes SQL again.
