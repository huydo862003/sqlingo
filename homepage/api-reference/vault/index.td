---
_icon: icon.book
---

A JavaScript/TypeScript port of [SQLGlot](https://github.com/tobymao/sqlglot), the popular Python SQL parser. Parse, transpile, optimize, and build SQL across 32 dialects, in the browser or Node.js.

sqlingo.js reads SQL in one dialect, builds an abstract syntax tree (AST), and writes it back in another dialect. This means `DATE_SUB(d, INTERVAL 1 DAY)` in MySQL becomes `d - INTERVAL '1 DAY'` in Postgres, without string manipulation.

```typescript
import { transpile } from "@hdnax/sqlingo.js";
import { MySQL } from "@hdnax/sqlingo.js/mysql";
import { Postgres } from "@hdnax/sqlingo.js/postgres";

const [sql] = transpile("SELECT DATE_SUB(d, INTERVAL 1 DAY) FROM t", {
  read: MySQL,
  write: Postgres,
});
// "SELECT d - INTERVAL '1 DAY' FROM t"
```

## Documentation

Start here and work through in order. Each page builds on the previous one.

1. [Quick start](01-quick-start) - Install, parse your first query, transpile between two dialects
2. [Guide](02-guide) - The core workflow: parsing to AST, navigating the tree, transforming nodes, and generating SQL back
3. [Transpiling](03-transpiling) - Cross-dialect translation: how functions, types, and syntax get mapped
4. [Optimization](04-optimize) - Simplify and normalize queries using schema information
5. [Building SQL](05-builders) - Construct queries programmatically instead of concatenating strings
6. [Expressions](06-expression) - The AST node API: searching, walking, transforming, and generating
7. [Dialects](07-dialect) - How dialects work, tree-shaking, and writing custom dialects
8. [Dialect reference](08-dialects) - All 32 supported SQL dialects
9. [FAQ](09-faq) - Common questions and troubleshooting
