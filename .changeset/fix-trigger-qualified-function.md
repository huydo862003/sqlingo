---
"sqlingo": patch
---

Fix issue #60: Postgres `CREATE TRIGGER ... EXECUTE FUNCTION` now parses schema-qualified function names like `public.f()`. Forward-port of upstream sqlglot `8e5e2557c` (v30.10.0).
