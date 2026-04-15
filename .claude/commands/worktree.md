---
description: Create git worktree for parallel development.
allowed-tools: Bash(git worktree:*), Bash(git branch:*), Bash(ls:*)
argument-hint: <branch-name>
---

# /worktree

1. Check branch: `git branch --list "$ARGUMENTS"`
2. Create: `git worktree add ../$(basename $(pwd))-$ARGUMENTS -b $ARGUMENTS`
3. Instruct: cd and run claude in worktree
