---
description: Generate daily standup from git activity.
allowed-tools: Bash(git log:*), Bash(git diff:*), Bash(date:*)
---

# /standup

Run git log --since='1 day ago', git branch, git status. Write 3-line standup:
Yesterday / Today / Blockers. Be terse.
