---
"sqlingo": patch
---

- Export the optimizer (including the scope API, `RULES`, `qualify`, and all individual rules) as `sqlingo/optimizer` (#61)
- Fix `Scope.selectedSources` for sources named like `Object.prototype` members (e.g. `constructor`)
- Remove a leftover debug `console.log` in raw string generation
