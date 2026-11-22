---
"sqlingo": patch
---

Export the optimizer (including the scope API) as `sqlingo/optimizer`, fix `Scope.selectedSources` for sources named like `Object.prototype` members (e.g. `constructor`), and remove a leftover debug `console.log` in raw string generation
