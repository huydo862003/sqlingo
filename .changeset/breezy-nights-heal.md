---
"sqlingo-homepage": patch
"sqlingo": patch
---

- fix(mysql): handle CONSTRAINT name PRIMARY KEY key_name USING HASH (cols) syntax
  - Supports optional index name and USING method before column list in PRIMARY KEY constraints
  - Previously threw ParseError, now parses correctly as CreateExpr
