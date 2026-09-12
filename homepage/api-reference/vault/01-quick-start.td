---
_icon: icon.rocket
---

Get sqlingo.js running in under a minute.

## Install

```bash
npm install @hdnax/sqlingo.js luxon
```

`luxon` is a peer dependency used for date/time operations.

## Parse SQL

Every SQL string becomes an AST (abstract syntax tree). You can inspect it, transform it, or turn it back into SQL.

```typescript
import { parseOne } from "@hdnax/sqlingo.js";

const ast = parseOne("SELECT a, b FROM users WHERE active = true");
console.log(ast.sql()); // "SELECT a, b FROM users WHERE active = TRUE"
```

## Transpile between dialects

To translate SQL from one database to another, import the dialect classes and pass them to `transpile`:

```typescript
import { transpile } from "@hdnax/sqlingo.js";
import { MySQL } from "@hdnax/sqlingo.js/mysql";
import { Postgres } from "@hdnax/sqlingo.js/postgres";

const [sql] = transpile(
  "SELECT DATE_SUB(d, INTERVAL 1 DAY) FROM t",
  { read: MySQL, write: Postgres },
);
console.log(sql);
// "SELECT d - INTERVAL '1 DAY' FROM t"
```

Each dialect is a separate import, so your bundler only ships the ones you use.

## Optimize a query

With schema information, the optimizer can qualify columns, simplify conditions, and remove dead code:

```typescript
import { optimize, parseOne, MappingSchema } from "@hdnax/sqlingo.js";

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

These three operations (parse, transpile, optimize) are the foundation. The [Guide](02-guide) explains what happens under the hood: how SQL becomes a tree, how you navigate that tree, and how the tree becomes SQL again.
