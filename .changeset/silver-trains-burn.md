---
"sqlingo": minor
---

Sync upstream sqlglot to v30.3.0

**BigQuery**

- `AI.FORECAST(TABLE table, ...)` function is now parsed and generated
- `AI.GENERATE_TEXT`, `AI.GENERATE_TABLE`, `AI.GENERATE_BOOL`, `AI.GENERATE_INT`, `AI.GENERATE_DOUBLE` with `MODEL`-first signature are now parsed and generated
- Nested `SELECT` queries inside `EXPORT DATA` statements are now parsed correctly
- Pipe syntax `DISTINCT` is now parsed and generated correctly
- JSON path keys now support hyphens, numbers, and a single trailing dot as a wildcard

**DuckDB**

- `TRY_PARSE_JSON` is now transpiled correctly
- DuckDB table functions are now supported
- `LEFT`/`RIGHT` from Snowflake are now transpiled to `SUBSTR`/`SUBSTRING`
- `COMPRESS` is marked as unsupported (raises `UnsupportedError`)
- `COLLATION` function is now supported
- `BIT_LENGTH` on binary types is transpiled to `BYTE_LENGTH * 8`
- `CHR` with a float argument now casts to `INT` before calling `CHR`
- `STRPOS`/`POSITION` with binary haystack/needle now converts to hex strings before searching

**Snowflake**

- `STRIP_NULL_VALUE` is now transpiled correctly
- `UNICODE` is now transpiled correctly
- `TO_DECIMAL`, `TO_NUMBER`, and `NUMERIC` with scale/precision arguments are now transpiled correctly
- `ROW ACCESS POLICY policy ON (cols)` on `CREATE VIEW`/`CREATE TABLE` is now parsed and generated

**SQLite**

- `PRAGMA` full syntax (with value assignment and function-call form) is now supported
- `CREATE VIRTUAL TABLE ... USING module[(args)]` is now parsed and generated

**PostgreSQL**

- `date_add` / `date_sub` expressions with `INTERVAL` inputs are now transpiled correctly to DuckDB and other targets

**Presto / Trino**

- `eliminate_semi_and_anti_joins` optimizer rule now iterates over a copy of the join list, preventing mutation errors during optimization

**Hive**

- `CREATE FUNCTION ... USING JAR|FILE|ARCHIVE 'path'` is now parsed into `UsingProperty` AST nodes and round-trips correctly

**Optimizer**

- `simplify_ranges` now correctly handles negative constants in range comparisons
