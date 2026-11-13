---
"sqlingo": minor
---

Sync upstream sqlglot to v30.5.0

**DuckDB**

- Add `$` as a single-token identifier character (`VAR_SINGLE_TOKENS`)
- Add `JSON_ARRAY` parser mapping to `JsonArrayExpr`
- Add unsupported-function stubs with warnings: `ENCRYPT`, `DECRYPT`, `DECRYPT_RAW`, `ENCRYPT_RAW`, `PARSE_URL`, `PARSE_IP`, `SOUNDEX`, `ARRAY_UNION_AGG`
- Add `STUFF` transpilation: binary branch uses `UNHEX(STUFF(HEX(...)))`, non-binary branch uses `CONCAT`/`SUBSTRING`
- Add `SUBSTRING` transpilation for Snowflake zero-indexed `SUBSTR` (adjusts start/length to 1-based DuckDB semantics)
- Add `JAROWINKLER_SIMILARITY` transpilation to `JARO_WINKLER_SIMILARITY` with optional `* 100` integer-scale cast
- Add `BYTE_LENGTH` transpilation: wraps text args with `ENCODE` before `OCTET_LENGTH`
- Add `REDUCE` transpilation to `list_reduce` (drops unsupported `finish` arg, sets colon-style lambda)

**Snowflake**

- Add `integerScale: true` flag on `JAROWINKLER_SIMILARITY` so DuckDB output multiplies by 100
- Add `SUBSTR` function parser that sets `zeroStart: true` on `SubstringExpr`
- Map `DataTypeExprKind.JSON` to `VARIANT` in type mapping
- Transpile `JsonArrayExpr` to `TO_VARIANT(ARRAY_CONSTRUCT(...))`

**BigQuery**

- Add `FOR SYSTEM TIME` (space-separated) as an alias for `FOR SYSTEM_TIME` token

**Databricks**

- Add `IFF` as a synonym for `IF` (normalizes to `IF` on output, `IFF` on Snowflake)
- Add `TRY_DIVIDE` parser mapping (inherits from Spark)

**Spark**

- Add `TRY_DIVIDE` parser mapping and generator transform

**Exasol**

- Add `MINUS` as a tokenizer alias for `EXCEPT`
