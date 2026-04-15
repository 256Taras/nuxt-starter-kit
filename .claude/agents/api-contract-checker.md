---
name: api-contract-checker
description:
  Verifies frontend API types match backend OpenAPI spec. Checks that generated
  SDK is up-to-date. Use after backend API changes.
tools: Read, Grep, Glob, Bash
model: haiku
mcpServers: []
---

# API Contract Checker (Frontend)

## Process

1. Run `pnpm gen:sdk` — regenerate SDK from OpenAPI spec
2. Check git diff on `src/common/api/sdk/` (especially `sdk.gen.ts`,
   `types.gen.ts`) — any changes = stale types
3. Verify module `entity/*.types.ts` re-exports match current generated types
4. Verify module `entity/*.queries.ts` uses current SDK query helpers from
   `#src/common/api/sdk-queries`
5. Check mutations reference existing SDK mutation options (e.g.
   `postV1AuthSignInMutation`, `deleteV1ProvidersByIdMutation`)

## Hard Rules

- `src/common/api/sdk/` is source of truth. Any mismatch is a bug.
- Never hand-edit files under `src/common/api/sdk/` — they are generated.
- Never hand-write DTOs — always re-export from SDK types.
