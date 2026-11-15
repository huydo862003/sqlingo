---
_label: "FAQ"
_icon: icon.help
description: "Common questions about output differences, dialect selection, tree-shaking, browser support, TypeScript types, and SQLGlot compatibility."
---

Answers to questions that come up when using sqlingo.

## Why does the output differ from the input?

The base dialect normalizes SQL as it generates. This normalization is intentional: it makes the output predictable regardless of how the input was formatted. Specifically:

- Boolean literals are uppercased (`true` becomes `TRUE`).
- Whitespace is collapsed to single spaces.
- Some operators are canonicalized (e.g. `<>` becomes `!=` or vice versa, depending on the dialect).

If you need the output to match a specific database's conventions, pass `write` explicitly. For example, to round-trip MySQL SQL through MySQL's generator:

```typescript
import { transpile } from "sqlingo";
import { MySQL } from "sqlingo/mysql";

transpile("SELECT true", { read: MySQL, write: MySQL })[0];
// "SELECT TRUE"
```

If you want output that is as close to the input as possible without normalization, there is currently no raw passthrough mode. The generator always applies dialect rules.

## Do I need to specify a dialect?

No. When `read` is omitted, sqlingo uses the base dialect, a permissive superset that accepts most SQL syntax. This works fine for parsing standard SQL that does not use vendor-specific extensions.

You should specify `read` when your SQL uses dialect-specific syntax that the base dialect might parse incorrectly:

- MySQL backtick-quoted identifiers: `` SELECT `col` FROM `table` ``
- BigQuery struct and array literals: `SELECT STRUCT(1, 2)`, `SELECT [1, 2, 3]`
- Snowflake double-dollar-sign string literals: `$$this is a string$$`
- TSQL square bracket identifiers: `SELECT [col] FROM [table]`

You should specify `write` when you need output that uses a specific database's conventions rather than the base dialect's normalized form.

## How does tree-shaking work?

Each dialect is a separate entry point (`sqlingo/mysql`, `sqlingo/postgres`, etc.). When you import only MySQL and Postgres, the other 30 dialects are excluded from your bundle entirely. This works because each dialect entry point exports a single class with no side effects, so bundlers like Vite, esbuild, and Rollup can safely eliminate unused imports.

The core parser (which is always included) is around 200KB minified before gzip. Each dialect adds 10-40KB depending on complexity. Because dialect modules are separate, your bundle only pays for the ones you actually import.

## Is this the same as SQLGlot?

sqlingo is a JavaScript/TypeScript port of [SQLGlot](https://github.com/tobymao/sqlglot), the Python SQL parser by Toby Mao. The API mirrors SQLGlot's Python API closely, adapted for JavaScript conventions:

- Python class names like `expressions.Select` become `SelectExpr` in TypeScript.
- Python's `snake_case` methods become `camelCase` (`find_all` becomes `findAll`).
- Python's `expression.sql(dialect=Postgres)` becomes `expression.sql({ dialect: Postgres })`.

The AST node types, dialect mappings, and optimizer logic are ported directly from SQLGlot. sqlingo tracks a specific SQLGlot release and updates periodically as SQLGlot evolves. See the README for the current tracked version.

## Can I use it in the browser?

Yes. sqlingo works in both Node.js and browser runtimes. The package ships ESM builds with no native dependencies and no WASM. You can try it in the [Playground](/playground/) which runs entirely in the browser.

The main concern for browsers is bundle size. Use the class-based dialect imports to take advantage of tree-shaking, and only import the dialects your application needs.

## What TypeScript types are available?

All public functions and classes are fully typed. The `Expression` subclasses (like `SelectExpr`, `ColumnExpr`, `FuncExpr`) carry their own typed properties, so accessing `.name` on a `ColumnExpr` is type-safe. The dialect type `DialectType` accepts either a dialect class or a dialect name string (after registration).

You can import types directly from the main package:

```typescript
import type { Expression, SelectExpr, ColumnExpr } from "sqlingo";
import { ParseError } from "sqlingo";
```

## How do I debug a parse failure?

If `parseOne` throws and you are not sure why, the `ParseError` object contains a list of individual errors, each with a line number and column position:

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

If you are unsure whether your SQL is valid, try parsing it with the specific source dialect. Some SQL that is invalid in the base dialect is valid in a dialect-specific parser:

```typescript
import { parseOne } from "sqlingo";
import { MySQL } from "sqlingo/mysql";

parseOne("SELECT `column` FROM `table`", { read: MySQL });
```

## How do I report a bug?

Open an issue on [GitHub](https://github.com/huydo862003/sqlingo/issues). Include the input SQL, the source and target dialects (if applicable), the expected output, and the actual output or error message. A minimal reproducible example is the fastest path to a fix.
