# sqlingo-homepage

## 0.3.4

### Patch Changes

- 1238a6e: **PostgreSQL**

  - `PARTITION BY RANGE/LIST/HASH (col [COLLATE collation] [opclass], ...)` is now parsed correctly; partition columns may include an optional collation and opclass after the column name without causing a parse error

  **T-SQL**

  - `INDEX [name] [UNIQUE] [CLUSTERED|NONCLUSTERED] (cols)` inline inside `CREATE TABLE` is now parsed as `IndexExpr` instead of being misclassified as a column definition

  **Base Parser**

  - `consumeDeferrable` now correctly consumes `INITIALLY DEFERRED` or `INITIALLY IMMEDIATE` after `NOT DEFERRABLE`, preventing leftover tokens from causing downstream parse failures
  - `INT ARRAY` (keyword-form array without brackets) no longer consumes the following comma, fixing parse errors on columns defined after an `INT ARRAY` column

- Updated dependencies [1238a6e]
  - sqlingo@0.12.4

## 0.3.3

### Patch Changes

- 3ac4745: **MySQL**

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

- Updated dependencies [3ac4745]
  - sqlingo@0.12.3

## 0.3.2

### Patch Changes

- c40f2cf: - fix(tsql): handle ALTER TABLE ADD DEFAULT expr FOR col
  - Supports both bare values and parenthesized values
  - Supports ADD CONSTRAINT name DEFAULT expr FOR col variant
- Updated dependencies [c40f2cf]
  - sqlingo@0.12.2

## 0.3.1

### Patch Changes

- 85fe775: Avoid infinite loop in parseNewlineDelimited when encountering syntax errors
- Updated dependencies [85fe775]
  - sqlingo@0.12.1

## 0.3.0

### Minor Changes

- cfab273: Experimental: Allows parsing newline delimited statements

### Patch Changes

- Updated dependencies [cfab273]
  - sqlingo@0.12.0

## 0.2.2

### Patch Changes

- 7fd5d09: - fix(mysql): handle CONSTRAINT name PRIMARY KEY key_name USING HASH (cols) syntax
  - Supports optional index name and USING method before column list in PRIMARY KEY constraints
  - Previously threw ParseError, now parses correctly as CreateExpr
- Updated dependencies [7fd5d09]
  - sqlingo@0.11.2

## 0.2.1

### Patch Changes

- Updated dependencies [04afc60]
  - sqlingo@0.11.1

## 0.2.0

### Minor Changes

- ee3aeb9: - fix(postgres): port CREATE TYPE AS ENUM / composite type parsing from upstream sqlglot
  - fix(mysql): port MODIFY COLUMN parsing and generation from upstream sqlglot
    - Added ModifyColumnExpr expression class and SUPPORTS_MODIFY_COLUMN generator flag
  - fix(mysql): port ALTER TABLE AUTO_INCREMENT / COMMENT parsing from upstream sqlglot
  - fix(oracle): handle NOT NULL ENABLE/DISABLE/VALIDATE/NOVALIDATE constraint modifiers
    - Previously threw ParseError; now parses correctly as CreateExpr
    - Custom fix (upstream sqlglot has the same bug), marked with FIXME
  - fix(parser): move ColumnPosition (FIRST/AFTER) parsing from parseAddColumn into parseColumnDef
  - fix(postgres): add TokenType.TYPE to CREATABLES and Postgres keywords
  - test: add regression tests for all fixed limitations (postgres, mysql, tsql, oracle)

### Patch Changes

- Updated dependencies [ee3aeb9]
  - sqlingo@0.11.0

## 0.1.19

### Patch Changes

- Updated dependencies [7d3a078]
  - sqlingo@0.10.1

## 0.1.18

### Patch Changes

- Updated dependencies [91cbb72]
  - sqlingo@0.10.0

## 0.1.17

### Patch Changes

- Updated dependencies [1fb6cd0]
  - sqlingo@0.9.0

## 0.1.16

### Patch Changes

- Updated dependencies [98bee52]
  - sqlingo@0.8.0

## 0.1.15

### Patch Changes

- Updated dependencies [b453c63]
  - sqlingo@0.7.1

## 0.1.14

### Patch Changes

- Updated dependencies [a87134d]
  - sqlingo@0.7.0

## 0.1.13

### Patch Changes

- Updated dependencies [e6fdbfa]
  - sqlingo@0.6.1

## 0.1.12

### Patch Changes

- Updated dependencies [625fb15]
  - sqlingo@0.6.0

## 0.1.11

### Patch Changes

- Updated dependencies [920aef4]
  - sqlingo@0.5.0

## 0.1.10

### Patch Changes

- cd3a34c: Bump deps to resolve dependabot security alerts: `vite` ^8.0.10 to ^8.1.0, `dompurify` override to ^3.4.11, add `ws` ^8.21.0 and `js-yaml` ^4.2.0 overrides
- 88cef5c: Bump `@hdnax/genuix` ^0.15.1 to ^0.15.2, `@hdnax/nuclint` ^0.17.3 to ^0.17.4
- f0d9075: Override read-yaml-file to fix changeset js-yaml compatibility
- Updated dependencies [cd3a34c]
  - sqlingo@0.4.2

## 0.1.9

### Patch Changes

- 4b88cb0: Bump @hdnax/genuix to ^0.15.2
- e0253fe: Bump esbuild to ^0.28.1 to resolve vulnerability issues'

## 0.1.8

### Patch Changes

- Updated dependencies [13e61b1]
  - sqlingo@0.4.1

## 0.1.7

### Patch Changes

- Updated dependencies [ec190bb]
- Updated dependencies [7ad6584]
- Updated dependencies [7ad6584]
- Updated dependencies [7ad6584]
  - sqlingo@0.4.0

## 0.1.6

### Patch Changes

- Updated dependencies [92777d6]
  - sqlingo@0.3.2

## 0.1.5

### Patch Changes

- Updated dependencies
  - sqlingo@0.3.1

## 0.1.4

### Patch Changes

- Updated dependencies [cdd20a2]
- Updated dependencies [067de4d]
  - sqlingo@0.3.0

## 0.1.3

### Patch Changes

- Updated dependencies [e9855e1]
  - sqlingo@0.2.3

## 0.1.2

### Patch Changes

- Updated dependencies [98abe58]
  - sqlingo@0.2.2

## 0.1.1

### Patch Changes

- 7c03a7e:
  - Update `dompurify` from 3.2.7 to 3.4.2 to resolve vulnerability issues [#1](https://github.com/huydo862003/sqlingo/pull/1)
  - Update `picomatch` from 2.3.1 to 4.0.4 to resolve vulnerability issues [#1](https://github.com/huydo862003/sqlingo/pull/1)
  - Update `postcss` from 8.5.8 to 8.5.14 to resolve vulnerability issues [#1](https://github.com/huydo862003/sqlingo/pull/1)
- Updated dependencies [7c03a7e]
  - sqlingo@0.2.1

## 0.1.0

### Minor Changes

- 62626fd: Complete AI migration. Most code are human-generated now.

### Patch Changes

- Updated dependencies [62626fd]
  - sqlingo@0.2.0

## 0.0.7

### Patch Changes

- 29256e1: Fix vulnerability issues
- b4924ce: Bump flatted to 3.4.2 to fix vulnerability issue
- Updated dependencies [29256e1]
- Updated dependencies [b4924ce]
  - sqlingo@0.1.7

## 0.0.6

### Patch Changes

- Updated dependencies [8967932]
  - sqlingo@0.1.6

## 0.0.5

### Patch Changes

- Updated dependencies
  - sqlingo@0.1.5

## 0.0.4

### Patch Changes

- 1ad4d3e: (fck-AI-slop) Migrating from AI slops
- Updated dependencies [1ad4d3e]
  - sqlingo@0.1.4

## 0.0.3

### Patch Changes

- 6aeadaa: Add disclaimer about AI usage
- Updated dependencies [6aeadaa]
  - sqlingo@0.1.3

## 0.0.2

### Patch Changes

- a0cbe60: Add warnings to npm doc page
- Updated dependencies [a0cbe60]
  - sqlingo@0.1.2

## 0.0.1

### Patch Changes

- c90ac1e: Update API doc for npm package
- Updated dependencies [c90ac1e]
  - sqlingo@0.1.1
