---
_label: "Quick start"
_icon: icon.rocket
description: "Install sqlingo, parse your first query, transpile between dialects, and optimize with schema information."
---

Install sqlingo, run the three core operations, and see the output.

## Install

```bash
npm install sqlingo luxon
```

`luxon` is a peer dependency used for date/time literal handling across dialects.

## Parse SQL

`parseOne` turns a SQL string into an AST you can inspect, search, transform, and generate back.

```typescript
import { parseOne } from "sqlingo";

const ast = parseOne("SELECT a, b FROM users WHERE active = true");
console.log(ast.sql()); // "SELECT a, b FROM users WHERE active = TRUE"
```

The base dialect normalizes output: `true` becomes `TRUE`, whitespace is collapsed. Pass a dialect to `.sql()` for database-specific output.

## Transpile between dialects

`transpile` converts SQL from one database to another. It returns an array (one string per statement).

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

- `read` controls how the input is parsed (tokenizer rules, keywords, syntax quirks)
- `write` controls how the output is generated
- Each dialect is a separate import for tree-shaking

## Optimize a query

`optimize` rewrites SQL using schema information: expands `SELECT *`, qualifies columns, and removes dead conditions.

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

What changed:

- `SELECT *` expanded to named columns from the schema
- `1 = 1` removed (tautology)
- Columns qualified with table names and double-quoted

## Next steps

- [Parsing and trees](02-guide/01-parsing-and-trees): how the AST works, searching, transforming
- [Transpiling](02-guide/02-transpiling): dialect mapping in depth
- [Optimizing](02-guide/03-optimizing): the full optimizer pipeline and running subsets of rules
- [Building queries](02-guide/04-building-queries): constructing SQL from code
