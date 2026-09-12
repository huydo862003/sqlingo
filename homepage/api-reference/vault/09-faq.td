---
_icon: icon.info
---

## Why does the output differ from the input?

The base dialect normalizes SQL: booleans are uppercased (`true` becomes `TRUE`), and some syntax is canonicalized. To preserve a specific dialect's conventions, pass `write` explicitly:

```typescript
transpile("SELECT true", { read: MySQL, write: MySQL })[0];
// "SELECT TRUE"
```

## Do I need to specify a dialect?

No. When `read` is omitted, sqlingo.js uses a base dialect that accepts most SQL syntax. This is fine for parsing generic SQL. When `write` is omitted, the output uses the same base dialect.

Specify `read` when your SQL uses dialect-specific syntax (like MySQL's backtick quoting or BigQuery's struct literals) that the base dialect might parse differently.

## How does tree-shaking work?

Each dialect is a separate entry point (`@hdnax/sqlingo.js/mysql`, `@hdnax/sqlingo.js/postgres`, etc.). If you only import MySQL and Postgres, the other 30 dialects are not included in your bundle.

## Is this the same as SQLGlot?

sqlingo.js is a JavaScript/TypeScript port of [SQLGlot](https://github.com/tobymao/sqlglot), the popular Python SQL parser. The API is similar but adapted for JavaScript conventions (camelCase, class imports, etc.). The AST structure and dialect mappings mirror SQLGlot closely.

## Can I use it in the browser?

Yes. sqlingo.js works in both Node.js and browsers. The package ships ESM and CJS builds.
