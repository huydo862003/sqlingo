---
_icon: icon.globe
---

Dialects control how SQL is parsed and generated. The [Transpiling](03-transpiling) page showed them in action. This page explains how they work under the hood.

## Class-based (recommended)

Pass dialect classes directly. No registration needed, fully tree-shakeable:

```typescript
import { parse, transpile } from "@hdnax/sqlingo.js";
import { MySQL } from "@hdnax/sqlingo.js/mysql";
import { Postgres } from "@hdnax/sqlingo.js/postgres";

parse("SELECT 1", { read: MySQL });
transpile("SELECT 1", { read: MySQL, write: Postgres });
```

Each dialect is a separate import, so your bundler only ships the ones you use.

## String-based (opt-in)

For apps that resolve dialects from config or user input, register them first:

```typescript
import { Dialect } from "@hdnax/sqlingo.js";
import { MySQL } from "@hdnax/sqlingo.js/mysql";
import { Postgres } from "@hdnax/sqlingo.js/postgres";

Dialect.register(MySQL, Postgres);

parse("SELECT 1", { read: "mysql" });
```

## `Dialect.register(...dialects)`

Register dialect classes for string-based lookup.

| Parameter | Type | Description |
|-----------|------|-------------|
| `dialects` | `...typeof Dialect` | One or more dialect classes to register |

## How dialects work

Each dialect is a class with three parts:

1. **Tokenizer rules**: how to break SQL into tokens (keywords, identifier quoting, escape sequences)
2. **Parser overrides**: dialect-specific syntax (e.g., MySQL's backtick quoting, BigQuery's struct syntax)
3. **Generator transforms**: how to map AST nodes to SQL (e.g., converting `NVL` to `COALESCE`)

When you pass `{ read: MySQL, write: Postgres }`, sqlingo.js uses MySQL's tokenizer and parser to read the input, then Postgres's generator to write the output.

## Next: [Dialect reference](08-dialects)

The next page lists all 32 supported dialects with their import paths.
