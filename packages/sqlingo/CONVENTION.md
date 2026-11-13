# Convention

This document describes the conventions used when porting SQLGlot (Python) to sqlingo (TypeScript). It is intended to help contributors understand the mapping decisions and avoid common pitfalls.


## Naming Conventions

We follow TypeScript conventions: camelCase for variables and functions, PascalCase for classes and types.

### Expression Classes

Use PascalCase with an `Expr` suffix:

| Wrong | Correct |
|---|---|
| `SHA2Expr` | `Sha2Expr` |
| `MD5DigestExpr` | `Md5DigestExpr` |
| `SHAExpr` | `ShaExpr` |
| `JSONExtractExpr` | `JsonExtractExpr` |

## Mirror Guide

### Multi-inheritance

Python uses multiple inheritance heavily. In TypeScript, use `multiInherit()`.

- `super` only calls the direct superclass's constructor: Python's MRO-based `__init__` chaining does not carry over.
- `instanceof` checks work correctly for all inherited classes when using `multiInherit`.

### Class Attributes

Python class attributes (defined at the class body level) become `@cache` static getters in TypeScript.

```ts
class MyDialect extends Dialect {
  @cache
  static get KEYWORDS() { return { ...super.KEYWORDS, ... }; }
}
```

Circular references are common across dialects. Lazy getters defer initialization and break the cycle.

Class attributes must be immutable. Never mutate a cached static getter's return value: it is shared across all callers.

### `None` to `undefined`

In our convention, Python's `None` is mapped to `undefined` in TypeScript.

SQLGlot sometimes explicitly passes `None` to override a default parameter. In TypeScript, passing `undefined` will fall back to the default value, which is a different behavior. You must explicitly pass a falsy value (e.g., `null` or `false`) in these cases to replicate the Python behavior.

> Note: Using `null` instead of `undefined` for explicit "no value" cases may be cleaner and avoids this pitfall. However, this is currently just a consideration, as I hate `null`s because it can be a source of inconsitencies when no proper convention is put out.

### Metaclasses as `@cache` Static Getters

Python metaclasses often perform computed logic on class construction (e.g., merging dicts from parent classes). In TypeScript, simulate this with `@cache` static getters that use `this` to access subclass overrides: this mimics metaclass "leaking" into subclasses via inheritance.

When a property needs both the original and merged versions, use `ORIGINAL_<NAME>` and `<NAME>`:

| Python | TypeScript |
|---|---|
| `KEYWORDS` (merged by metaclass) | `ORIGINAL_KEYWORDS` (raw) + `KEYWORDS` (merged, `@cache` getter) |
| `TRANSFORMS` (merged by metaclass) | `ORIGINAL_TRANSFORMS` (raw) + `TRANSFORMS` (merged, `@cache` getter) |

### Option Objects Instead of Positional Parameters

Python uses keyword arguments and boolean flags as positional parameters. In TypeScript, use an options object instead:

```python
# Python
def parse_field(self, any_token=False, anonymous_func=False):
    ...
```

```ts
// TypeScript
parseField(options: { anyToken?: boolean; anonymousFunc?: boolean } = {}): ... {
  const { anyToken = false, anonymousFunc = false } = options;
  ...
}
```

This applies to all internal methods with optional boolean/config parameters. Call sites use `{ anyToken: true }` instead of positional `true`.

### Intentional Divergences

- **Generator dispatch cache** (upstream `38957ccd6`): Python pre-builds an `EXPR_CLASSES` registry and a unified dispatch table to avoid slow `getattr`. TypeScript keeps the two-step lookup (TRANSFORMS map then `${key}Sql` property access) because V8 already optimizes property lookups well.
- **`DType.into_expr()`** (upstream `247548f59`): Python adds a convenience method on the `DType` enum. TypeScript enums cannot have methods, so this would require a standalone helper function. Deferred as a convenience-only refactor touching 100+ call sites.
