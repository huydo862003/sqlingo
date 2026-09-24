---
_icon: icon.book
description: "API reference for sqlingo (sqlingojs): a TypeScript SQL parser, transpiler, and query optimizer supporting 32 dialects including BigQuery, Snowflake, Postgres, MySQL, and DuckDB."
---

A TypeScript port of [SQLGlot](https://github.com/tobymao/sqlglot), the popular Python SQL parser. Parse, transpile, optimize, and build SQL across 32 dialects, in the browser or Node.js.

sqlingo reads SQL in one dialect, builds an abstract syntax tree (AST), and writes it back in another dialect. This means `DATE_SUB(d, INTERVAL 1 DAY)` in MySQL becomes `d - INTERVAL '1 DAY'` in Postgres, without string manipulation.

```typescript
import { transpile } from "sqlingo";
import { MySQL } from "sqlingo/mysql";
import { Postgres } from "sqlingo/postgres";

const [sql] = transpile("SELECT DATE_SUB(d, INTERVAL 1 DAY) FROM t", {
  read: MySQL,
  write: Postgres,
});
// "SELECT d - INTERVAL '1 DAY' FROM t"
```

## What you get

**Parsing**: every SQL string becomes a typed AST you can inspect, search, and transform. **Transpiling**: convert between 32 dialects with automatic function, type, and syntax mapping. **Optimization**: given schema information, the optimizer qualifies columns, simplifies conditions, and eliminates dead code. **Building**: construct queries programmatically with a fluent API that produces the same AST.

## Documentation

Start with the quick start, then work through the guide. The reference pages are for lookup once you know what you need.

1. [Quick start](01-quick-start): install, parse your first query, transpile between two dialects
2. [Guide](02-guide/index): the core workflow from parsing to transpiling, optimizing, and building
3. [Reference](03-references/index): the full Expression API and all 32 dialect imports
4. [FAQ](04-faq): common questions and troubleshooting

## Roadmap

sqlingo tracks [SQLGlot](https://github.com/tobymao/sqlglot) upstream. Planned work:

- Catch up with SQLGlot v26 (PRQL dialect, improved type inference)
- WASM build for zero-dependency browser usage
- Schema extraction from DDL statements
- Performance benchmarks against the Python implementation

## Links

- [Changelog](https://github.com/huydo862003/sqlingo/blob/master/packages/sqlingo/CHANGELOG.md) for release history
- [GitHub](https://github.com/huydo862003/sqlingo) for source code
- [Issues](https://github.com/huydo862003/sqlingo/issues) for bug reports and feature requests
- [npm](https://www.npmjs.com/package/sqlingo) for the published package
- [Playground](https://huydo862003.github.io/sqlingo/playground/) to try it in the browser
