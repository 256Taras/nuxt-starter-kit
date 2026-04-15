---
description: Generate PRP from ticket using planner agent.
allowed-tools: Read, Write, Glob, Bash(git:*), Task
argument-hint: <ticket-id>
---

# /spec

1. Invoke planner subagent for ticket `$ARGUMENTS`
2. Update PRPs/current.md
3. Show path + complexity estimate
4. Wait for approval before implementation
