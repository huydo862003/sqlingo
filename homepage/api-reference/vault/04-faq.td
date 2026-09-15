---
_label: "FAQ"
_icon: icon.help
description: "Common questions about output differences, dialect selection, tree-shaking, browser support, and SQLGlot compatibility."
---

Answers to common questions that come up when using sqlingo.

## Why does the output differ from the input?

The base dialect normalizes SQL: booleans are uppercased (`true` becomes `TRUE`), and some syntax is canonicalized. To preserve a specific dialect's conventions, pass `write` explicitly.

```typescript
transpile("SELECT true", { read: MySQL, write: MySQL })[0];
// "SELECT TRUE"
```

## Do I need to specify a dialect?

No. When `read` is omitted, sqlingo uses a base dialect that accepts most SQL syntax. This is fine for parsing generic SQL. When `write` is omitted, the output uses the same base dialect.

Specify `read` when your SQL uses dialect-specific syntax (like MySQL's backtick quoting or BigQuery's struct literals) that the base dialect might parse differently.

## How does tree-shaking work?

Each dialect is a separate entry point (`sqlingo/mysql`, `sqlingo/postgres`, etc.). If you only import MySQL and Postgres, the other 30 dialects are not included in your bundle.

## Is this the same as SQLGlot?

sqlingo is a JavaScript/TypeScript port of [SQLGlot](https://github.com/tobymao/sqlglot), the popular Python SQL parser by Toby Mao. The API is similar but adapted for JavaScript conventions (camelCase, class imports, etc.). The AST structure and dialect mappings mirror SQLGlot closely.

## Can I use it in the browser?

Yes. sqlingo works in both Node.js and browsers. The package ships ESM builds. Try it in the [Playground](https://huydo862003.github.io/sqlingo.js/playground/).

## How large is the bundle?

The core parser is around 200KB minified (before gzip). Each dialect adds 10-40KB depending on complexity. Because each dialect is a separate entry point, your bundler only includes the ones you import.

## How do I report a bug or request a feature?

Open an issue on [GitHub](https://github.com/huydo862003/sqlingo.js/issues). Include the input SQL, the expected output, and the dialect pair if applicable.
