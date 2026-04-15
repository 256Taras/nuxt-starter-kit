---
description: Multi-agent adversarial code review on current diff.
allowed-tools:
  Bash(git diff:*), Bash(git log:*), Bash(mkdir:*), Read, Glob, Task
---

# /review-debate

1. mkdir -p .claude/.review
2. Run defender subagent (sonnet)
3. Run attacker subagent (sonnet)
4. Run judge subagent (opus)
5. Show verdict. Do NOT commit if REJECT.
