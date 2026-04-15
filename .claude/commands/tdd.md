---
description:
  Start a TDD cycle — create test file, lock it, start implementation. Write the
  test first, then make it pass.
allowed-tools: Read, Write, Edit, Bash(touch:*), Bash(pnpm:*), BashOutput
argument-hint: <test-file-path>
---

# /tdd — Test-Driven Development Cycle

Test file: `$ARGUMENTS`

## Steps

### Phase 1: Red (write failing test)

1. If `$ARGUMENTS` does not exist, create it with a test skeleton.
2. Ask me to define the behaviors to test.
3. Lock: `touch $ARGUMENTS.lock`
4. Run to confirm failure (Red): `pnpm vitest run $ARGUMENTS` (or relevant test
   runner)

### Phase 2: Green (make it pass)

5. Implement minimum code to pass.
6. Cannot edit the locked test.
7. Run tests after each change.

### Phase 3: Refactor

8. All green — refactor implementation.
9. Run tests after each refactor.
10. Unlock: `rm $ARGUMENTS.lock`

## TDD Rules

- Never write implementation before the test.
- Never edit a locked test.
- Minimum code to pass in Green phase.
- Refactor only when green.
- One behavior per test.
