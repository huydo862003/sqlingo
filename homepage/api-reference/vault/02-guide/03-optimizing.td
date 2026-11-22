---
_label: "Optimizing"
_icon: icon.sparkles
description: "Simplify and normalize SQL queries using schema information: star expansion, column qualification, and dead condition removal."
---

Parsing and transpiling only understand SQL syntax. The optimizer adds schema awareness: it knows which tables and columns exist, so it can expand `SELECT *`, qualify ambiguous column references, and remove conditions that can never filter any rows.

## Basic usage

Pass a parsed AST and a schema to `optimize`. The schema maps table names to their columns and types.

```typescript
import { optimize, parseOne, MappingSchema } from "sqlingo";

const schema = new MappingSchema({ t: { x: "INT", y: "INT" } });
const optimized = optimize(
  parseOne("SELECT * FROM t WHERE 1 = 1 AND x > 2"),
  { schema },
);

console.log(optimized.sql());
// SELECT "t"."x" AS "x", "t"."y" AS "y" FROM "t" AS "t" WHERE "t"."x" > 2
```

What changed:

- `SELECT *` expanded to named columns from the schema
- `1 = 1` removed (tautology)
- Columns qualified with table names and double-quoted

## `optimize(ast, options)`

| Parameter | Type | Description |
|-----------|------|-------------|
| `ast` | `Expression` | Parsed AST from `parseOne` |
| `options.schema` | `MappingSchema` or plain object | Table-to-columns mapping |
| `options.dialect` | Dialect class | Target dialect for generation |
| `options.rules` | `Function[]` | Subset of optimizer rules to apply (defaults to all) |

A plain object works as a shorthand for simple schemas:

```typescript
const optimized = optimize(
  parseOne("SELECT * FROM users"),
  { schema: { users: { id: "INT", name: "TEXT" } } },
);
```

`MappingSchema` is preferred for multiple schemas, nested catalogs, or reuse across calls. Column type strings (`"INT"`, `"TEXT"`, `"BIGINT"`, etc.) follow standard SQL type names.

## The optimizer pipeline

The optimizer runs 13 rules in sequence, each receiving the output of the previous one.

```mermaid
graph TD
    A["AST"] --> B["qualify"]
    B --> C["pushdownProjections"]
    C --> D["normalize"]
    D --> E["unnestSubqueries"]
    E --> F["pushdownPredicates"]
    F --> G["optimizeJoins"]
    G --> H["eliminateSubqueries"]
    H --> I["mergeSubqueries"]
    I --> J["eliminateJoins"]
    J --> K["eliminateCtes"]
    K --> L["quoteIdentifiers"]
    L --> M["annotateTypes"]
    M --> N["simplify"]
    N --> O["optimized AST"]

    B -.- B1["Resolve SELECT *, qualify columns\nwith table names, alias tables"]
    C -.- C1["Drop unused columns\nfrom inner queries"]
    D -.- D1["Convert WHERE to conjunctive\nnormal form (CNF)"]
    E -.- E1["Rewrite correlated subqueries\ninto JOINs or CTEs"]
    F -.- F1["Move filters closer to the\ntables they reference"]
    G -.- G1["Reorder JOINs based on\npredicate structure"]
    H -.- H1["Remove redundant wrapper\nsubqueries"]
    I -.- I1["Fold subqueries into their\nparent when safe"]
    J -.- J1["Remove JOINs whose table\nis never referenced"]
    K -.- K1["Remove CTEs that\nno one references"]
    L -.- L1["Quote all identifiers for\ncase-sensitive databases"]
    M -.- M1["Infer data types from\nschema for type-aware rules"]
    N -.- N1["Remove tautologies, fold\nconstants, flatten booleans"]
```

## Running a subset of rules

The full pipeline rewrites aggressively, turning subqueries into CTEs and JOINs. If you only need some of those transformations, pass a `rules` array with the rules you want. Each rule is a function exported from `sqlingo/optimizer`.

```typescript
import { optimize, parseOne, MappingSchema } from "sqlingo";
import { qualify, simplify } from "sqlingo/optimizer";
import { Postgres } from "sqlingo/postgres";

const schema = new MappingSchema({
  doc: { id: "INT", is_folder: "BOOLEAN" },
  new: { id: "INT", doc_id: "INT" },
});
```

Running only `qualify` resolves columns and expands `*`, but keeps the query structure intact. Subqueries remain as subqueries:

```typescript
const sql = optimize(
  parseOne("SELECT (SELECT is_folder FROM doc WHERE id = new.doc_id) = TRUE FROM new", { read: Postgres }),
  { schema, dialect: Postgres, rules: [qualify] },
).sql({ dialect: Postgres });

// Columns qualified, subquery kept intact:
// SELECT (SELECT doc.is_folder AS is_folder FROM doc AS doc
//   WHERE doc.id = new.doc_id) = TRUE AS _col_0
// FROM new AS new
```

Adding `simplify` also removes dead conditions, while still preserving the query shape:

```typescript
const sql = optimize(
  parseOne("SELECT * FROM doc WHERE 1 = 1 AND id > 2", { read: Postgres }),
  { schema, dialect: Postgres, rules: [qualify, simplify] },
).sql({ dialect: Postgres });

// Star expanded, 1 = 1 removed, columns qualified:
// SELECT doc.id AS id, doc.is_folder AS is_folder
// FROM doc AS doc WHERE doc.id > 2
```

The default pipeline (no `rules` option) rewrites the same subquery into a CTE and LEFT JOIN:

```typescript
const sql = optimize(
  parseOne("SELECT (SELECT is_folder FROM doc WHERE id = new.doc_id) = TRUE FROM new", { read: Postgres }),
  { schema, dialect: Postgres },
).sql({ dialect: Postgres });

// Subquery rewritten into CTE + LEFT JOIN:
// WITH "_u_0" AS (SELECT ARRAY_AGG("doc"."is_folder") AS "is_folder", ...)
// SELECT "_u_0"."is_folder" = TRUE AS "_col_0"
// FROM "new" AS "new" LEFT JOIN "_u_0" AS "_u_0" ON ...
```

`qualify` should always come first when used, since most other rules depend on columns being qualified. When in doubt, pick a prefix of the default pipeline.

## Combining with transpilation

Parse in one dialect, optimize with schema information, generate in another:

```typescript
import { optimize, parseOne } from "sqlingo";
import { MySQL } from "sqlingo/mysql";
import { Postgres } from "sqlingo/postgres";

const schema = { t: { x: "INT", y: "TEXT" } };
const ast = parseOne("SELECT * FROM t WHERE 1 = 1 AND x > 2", { read: MySQL });
const optimized = optimize(ast, { schema });

console.log(optimized.sql({ dialect: Postgres }));
// SELECT "t"."x" AS "x", "t"."y" AS "y" FROM "t" AS "t" WHERE "t"."x" > 2
```

The order matters:

- Parse first with the source dialect
- Optimize second with schema information
- Generate last with the target dialect

The optimizer returns a new AST without modifying the input.
