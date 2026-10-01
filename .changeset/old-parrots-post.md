---
"sqlingo-homepage": minor
"sqlingo": minor
---

- fix(postgres): port CREATE TYPE AS ENUM / composite type parsing from upstream sqlglot
- fix(mysql): port MODIFY COLUMN parsing and generation from upstream sqlglot
  - Added ModifyColumnExpr expression class and SUPPORTS_MODIFY_COLUMN generator flag
- fix(mysql): port ALTER TABLE AUTO_INCREMENT / COMMENT parsing from upstream sqlglot
- fix(oracle): handle NOT NULL ENABLE/DISABLE/VALIDATE/NOVALIDATE constraint modifiers
  - Previously threw ParseError; now parses correctly as CreateExpr
  - Custom fix (upstream sqlglot has the same bug), marked with FIXME
- fix(parser): move ColumnPosition (FIRST/AFTER) parsing from parseAddColumn into parseColumnDef
- fix(postgres): add TokenType.TYPE to CREATABLES and Postgres keywords
- test: add regression tests for all fixed limitations (postgres, mysql, tsql, oracle)
