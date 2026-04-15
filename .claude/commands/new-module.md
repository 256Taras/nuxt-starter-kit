---
description: Scaffold a new feature module following project structure.
allowed-tools: Read, Write, Edit, Grep, Glob
argument-hint: <module-name>
---

# /new-module

Module: `$ARGUMENTS`

1. Read reference: src/modules/(users)/authentication/ and profiles/
2. Ask: API endpoints? Pinia store? Form schemas? Pages?
3. Generate:
   ```
   $ARGUMENTS/
   ├── api/use-$ARGUMENTS-api.ts
   ├── model/
   │   ├── $ARGUMENTS.types.ts
   │   ├── $ARGUMENTS.schemas.ts (if forms)
   │   └── $ARGUMENTS.store.ts (if state)
   └── index.ts
   ```
4. Follow 4-layer hook chain.
