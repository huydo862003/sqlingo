---
"sqlingo": patch
---

- Export the optimizer (including the scope API) as `sqlingo/optimizer`
- Fix `Scope.selectedSources` for sources named like `Object.prototype` members (e.g. `constructor`)
- Remove a leftover debug `console.log` in raw string generation
