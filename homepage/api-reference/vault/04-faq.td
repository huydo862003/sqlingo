---
_label: "FAQ"
_icon: icon.help
description: "Common questions about output differences, dialect selection, tree-shaking, browser support, TypeScript types, and SQLGlot compatibility."
---

## Why does the output differ from the input?

The base dialect normalizes SQL during generation:

- Booleans are uppercased (`true` becomes `TRUE`)
- Whitespace is collapsed
- Some operators are canonicalized

Pass `write` explicitly to match a specific database's conventions.

## Do I need to specify a dialect?

Not always. The base dialect accepts most standard SQL. Specify `read` when your SQL uses dialect-specific syntax that the base dialect might parse differently:

- MySQL backtick identifiers: `` SELECT `col` FROM `table` ``
- BigQuery struct/array literals: `SELECT STRUCT(1, 2)`
- Snowflake dollar-sign strings: `$$this is a string$$`
- TSQL bracket identifiers: `SELECT [col] FROM [table]`

Specify `write` when you need output in a specific database's conventions.

## How does tree-shaking work?

Each dialect is a separate entry point (`sqlingo/mysql`, `sqlingo/postgres`, etc.). Your bundler only includes the ones you import. The core parser is around 200KB minified before gzip, and each dialect adds 10-40KB.

## Is this the same as SQLGlot?

sqlingo is a TypeScript port of [SQLGlot](https://github.com/tobymao/sqlglot) by Toby Mao. The API is adapted for JS conventions:

- `expressions.Select` becomes `SelectExpr`
- `find_all` becomes `findAll`
- `expression.sql(dialect=Postgres)` becomes `expression.sql({ dialect: Postgres })`

The AST structure, dialect mappings, and optimizer logic are ported directly. sqlingo tracks a specific SQLGlot release and updates periodically.

## Can I use it in the browser?

Yes. sqlingo ships ESM builds with no native dependencies and no WASM. Try it in the [Playground](/playground/).

## What TypeScript types are available?

All public functions and classes are fully typed. Expression subclasses like `SelectExpr` and `ColumnExpr` carry typed properties. Import types from the main package:

```typescript
import type { Expression, SelectExpr, ColumnExpr } from "sqlingo";
```

## How do I debug a parse failure?

The `ParseError` object contains a list of errors with line and column positions:

```typescript
import { parseOne, ParseError } from "sqlingo";

try {
  parseOne("SELECT a FROM (SELECT b FROM t");
} catch (e) {
  if (e instanceof ParseError) {
    for (const err of e.errors) {
      console.log(`${err.line}:${err.col} ${err.description}`);
    }
  }
}
```

If you are unsure whether the SQL is valid, try parsing with the specific source dialect. Some SQL that fails in the base dialect is valid in a dialect-specific parser.

## How do I report a bug?

Open an issue on [GitHub](https://github.com/huydo862003/sqlingo/issues). Include the input SQL, source and target dialects, expected output, and actual output or error.
