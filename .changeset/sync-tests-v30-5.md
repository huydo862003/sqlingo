---
"sqlingo": patch
---

Sync upstream sqlglot v30.5.0 tests and fix bugs

- Port all missing v30.5.0 test cases across all dialect files
- Close validate call gaps: duckdb (+97), clickhouse (+36), snowflake (+27), dialect (+84), spark (+14), exasol (+11), hive (+4), oracle (+3), tsql (+7), databricks (+4), duckdb minor (+5), presto (+1)
- Fix generator EXCLUDE bug: pass `undefined` as first arg to `this.expressions()` instead of object
- Fix `renameindexSql` → `alterRenameIndexSql` method name mismatch
- Fix `InvisibleColumnConstraintExpr` missing empty `requiredArgs` override
- Fix `unnestGenerateDateArrayUsingRecursiveCte` to use `DateAddExpr` instead of `AnonymousExpr`
- Add `ALL` to `JoinExprKind` enum for ClickHouse ALL JOIN support
- Fix `parseDictProperty` to use `parseFunction() || parsePrimaryOrVar()`
- Sync 3 optimizer fixture files from upstream
- Add new test methods: `testMaxNodes`, `testGetOrRaise`, `testCompareDialects`, `testCompareDialectVersions`, `testReservedKeywords`, `testCount`, `testDistinctOn`, `testGenerateDateArray`
