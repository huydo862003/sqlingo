---
_label: "Quick start"
_icon: icon.rocket
description: "Install sqlingo, parse your first query, transpile between dialects, and optimize with schema information."
---

Get sqlingo running in under a minute. This page covers installation and the three core operations: parsing, transpiling, and optimizing.

## Install

sqlingo ships as a single npm package. `luxon` is a peer dependency used internally for date and time literal handling across dialects.

```bash
npm install sqlingo luxon
```

## Parse SQL

Parsing turns a SQL string into a tree you can inspect and manipulate. This is the entry point for everything else.

```typescript
import { parseOne } from "sqlingo";

const ast = parseOne("SELECT a, b FROM users WHERE active = true");
console.log(ast.sql()); // "SELECT a, b FROM users WHERE active = TRUE"
```

## Transpile between dialects

Transpiling converts SQL from one database to another. Pass the source and target dialect, and sqlingo handles function names, types, quoting, and syntax differences.

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

The optimizer rewrites SQL to be more explicit. It needs schema information to know which tables and columns exist.

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

Three things happened:

- `SELECT *` expanded to named columns (`a`, `b`)
- `1 = 1` was removed (always true, dead condition)
- All identifiers were qualified with table names (`a` became `"t"."a"`)

## Next steps

The [Guide](02-guide/01-parsing-and-trees) explains what happens under the hood: how the tree works, how you search and transform it, and how transpiling and optimizing build on the same cycle.
