---
_label: "Guide"
_icon: icon.compass
description: "Learn the core workflow: parsing SQL to AST, navigating the tree, transpiling between dialects, optimizing queries, and building SQL from code."
---

This guide teaches the concepts behind sqlingo step by step. Each page builds on the previous one, so reading in order is recommended.

The central idea is simple: SQL goes in as a string, becomes a tree of objects, and comes back out as a string. Transpiling, optimizing, and building are all variations of this cycle.

```mermaid
graph LR
    A["SQL string"] --> B["parse"]
    B --> C["AST"]
    C --> D["search / transform"]
    D --> C
    C --> E["optimize"]
    E --> C
    C --> F["generate"]
    F --> G["SQL string"]

    H["code"] --> I["build"]
    I --> C

    C --> J["execute"]
    J --> K["result rows"]
    C --> L["lineage"]
    L --> M["column origin"]
```

1. [Parsing and trees](01-parsing-and-trees): how SQL becomes an AST and how you search, transform, and generate from it
2. [Transpiling](02-transpiling): converting SQL between dialects by mapping functions, types, and syntax
3. [Optimizing](03-optimizing): using schema information to simplify, qualify, and clean up queries
4. [Building queries](04-building-queries): constructing SQL programmatically with a fluent API
