---
"sqlingo": minor
---

Sync upstream sqlglot to v30.4.0

**DuckDB**

- Add transpilation support for Snowflake `COLLATE` function: drops default specifiers (`cs`, `as`, `ps`), warns on unsupported ones, and passes remaining specifiers through
- Add transpilation support for `RTRIMMED_LENGTH(x)` as `LENGTH(RTRIM(x))`
- Add `CONCAT_WS` binary type handling using `||` operator

**Snowflake**

- Fix `HANDLER` property to emit `HANDLER = 'fn'` syntax (was missing `=`)
- Fix `CONCAT_WS` NULL semantics: wrap in `CASE WHEN ... IS NULL THEN NULL ELSE ... END` when transpiling to DuckDB

**TSQL**

- Fix `SELECT TOP (subquery)` parsing to support subquery expressions inside parentheses

**Core**

- Fix `CONCAT_WS` NULL semantics for `CONCAT_COALESCE` dialects: wrap in CASE expression returning NULL if any input is NULL
