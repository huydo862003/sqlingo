---
"sqlingo": minor
---

- Sync to sqlglot version 30.0.3
  - fix(duckdb): FROM pipe syntax in subquery
  - fix: escape comment markers in sanitize_comment for all dialects
  - fix(expressions): restore Expression.alias for non-Identifier alias nodes
  - feat(duckdb): add transpilation support for ARRAY_TO_STRING function
  - fix(parser): ARRAY_INTERSECT builder, UNIQUE constraint, lineage error message
  - perf: optimize parser for nested function calls (parse_atom fast path, TYPED_LAMBDA_ARGS)
  - perf: inline token parsing in parseDisjunction/Conjunction/Equality/Comparison/Exponent
  - feat(snowflake): support transpilation of STRTOK to duckdb
  - feat(duckdb): add transpilation support for neg position args for CHARINDEX
  - fix(clickhouse): lowercase dateTrunc units for versions before 23.12
  - perf: optimize parser fast path for simple table references
  - fix: match Python ifSql (remove parent check), hoist STRTOK_TEMPLATE, remove dead parseTokens
  - fix: add missing tests (lineage error, ARRAY_INTERSECT read, ifSql regression), fix DTS build
