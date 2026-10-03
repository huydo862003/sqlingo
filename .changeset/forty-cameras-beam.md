---
"sqlingo-homepage": patch
"sqlingo": patch
---

**PostgreSQL**

- `PARTITION BY RANGE/LIST/HASH (col [COLLATE collation] [opclass], ...)` is now parsed correctly; partition columns may include an optional collation and opclass after the column name without causing a parse error

**T-SQL**

- `INDEX [name] [UNIQUE] [CLUSTERED|NONCLUSTERED] (cols)` inline inside `CREATE TABLE` is now parsed as `IndexExpr` instead of being misclassified as a column definition

**Base Parser**

- `consumeDeferrable` now correctly consumes `INITIALLY DEFERRED` or `INITIALLY IMMEDIATE` after `NOT DEFERRABLE`, preventing leftover tokens from causing downstream parse failures
- `INT ARRAY` (keyword-form array without brackets) no longer consumes the following comma, fixing parse errors on columns defined after an `INT ARRAY` column
