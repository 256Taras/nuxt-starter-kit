---
description: Append a lesson to .claude/REFLECTIONS.md.
allowed-tools: Read, Edit, Bash(date:*)
argument-hint: <domain> <lesson>
---

# /reflect

Domain: first word of `$ARGUMENTS`. Lesson: rest.

1. Read .claude/REFLECTIONS.md
2. Append: `[YYYY-MM-DD] [domain] lesson`
3. Show appended line + last 5 entries.
