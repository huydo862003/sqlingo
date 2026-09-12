---
"@hdnax/sqlingo.js": minor
---

- 4f36310: Sync to sqlglot v30.0.0:
  - feat: support multi-word DESCRIBE kinds in Snowflake (DYNAMIC TABLE, MASKING POLICY, API INTEGRATION, etc.)
  - feat(duckdb): ARRAY_SORT, ARRAY_SLICE, ARRAY_INTERSECTION/EXCEPT bag/set semantics, ARRAYS_OVERLAP, SPLIT_PART, MAP_INSERT, MAP_PICK, RANDOM, DATE_TRUNC week start, IGNORE NULLS in AGG FUNC, GROUPS window frame, TO_VARIANT
  - feat(snowflake): window frame for ranking functions, positional GENERATOR args, TO_GEOGRAPHY/TO_GEOMETRY as Cast, SPLIT NULL/empty separator, JSON path dynamic brackets, ARRAY_SORT with nulls
  - feat(clickhouse): DETACH, combined aggregate functions (multi-suffix), cityHash64, ASSUME/CHECK constraints, dotcolon JSON array types, nested field INSERT, ArrayDistinct, ANY/ALL joins
  - feat: consolidate SecurityProperty into SqlSecurityProperty with MySQL locateProperties
  - feat(hive/spark): IGNORE NULLS boolean arg, dash in JSON path, RECURSIVE CTEs
  - feat: parser fast path for column reference parsing
  - fix: Athena kind case mismatch, Oracle InOutColumnConstraint.pop(), Spark DECLARE_DEFAULT_ASSIGNMENT, WindowSpecExpr type-only import, ClickHouse parseDefiner override
  - fix: optimizer pushdown_dnf forward-reference guard, qualify_tables FQN alias mapping, unnest_subqueries crash
