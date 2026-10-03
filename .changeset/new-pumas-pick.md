---
"sqlingo-homepage": patch
"sqlingo": patch
---

**MySQL**

- Column constraints now accept `COLUMN_FORMAT`, `STORAGE`, `INVISIBLE`, and `VISIBLE` modifiers, which are silently consumed and no longer cause parse errors
- `UNIQUE [KEY|INDEX] [name] [USING type] (cols) [USING type]` inside `CREATE TABLE` is now parsed correctly, supporting optional key name, pre- and post-column `USING` clause, and `KEY`/`INDEX` synonyms

**Oracle**

- `CONSTRAINT STATE` clauses (`RELY`, `NORELY`, `ENABLE`, `DISABLE`, `VALIDATE`, `NOVALIDATE`, `[NOT] DEFERRABLE [INITIALLY DEFERRED|IMMEDIATE]`) are now consumed after column constraints, table constraints, and `CREATE/ALTER` constraints
- `LONG RAW` is now recognized as a valid data type
- `INTERVAL YEAR|DAY|MONTH|SECOND [(precision)] TO YEAR|DAY|MONTH|SECOND [(precision)]` interval types are now parsed
- Oracle storage properties with balanced parentheses (e.g. `STORAGE (...)`, `HEAP (...)`) are now consumed correctly via `consumeBalancedParens`

**PostgreSQL**

- `[NOT] DEFERRABLE [INITIALLY DEFERRED|IMMEDIATE]` is now consumed after column constraints, NOT NULL constraints, key constraint options (`USING INDEX [TABLESPACE]`, `INCLUDE (...)`), and table constraints
- `USING INDEX [TABLESPACE name]` and `INCLUDE (cols)` inside key constraint options are now handled

**Base Parser**

- Added `protected consumeDeferrable()`: shared helper for `[NOT] DEFERRABLE [INITIALLY DEFERRED|IMMEDIATE]` -- used by both Oracle and PostgreSQL dialects, removing duplication
- Added `protected skipBalancedParens()`: shared depth-counting parenthesis skip helper, used by Oracle
- `CREATE TEMPORARY TABLE ... LOCAL` is now handled via a `LOCAL` property keyword
- `IndexExprArgs` gains `params` and `using` fields
- `ReferenceExprArgs` gains `options: (Expression | string)[]` to carry `ON DELETE`/`ON UPDATE` action strings
