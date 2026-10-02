---
"sqlingo-homepage": patch
"sqlingo": patch
---

- fix(tsql): handle ALTER TABLE ADD DEFAULT expr FOR col
  - Supports both bare values and parenthesized values
  - Supports ADD CONSTRAINT name DEFAULT expr FOR col variant
