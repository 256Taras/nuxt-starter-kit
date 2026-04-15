---
description: Lock a test file (test-as-oracle pattern).
allowed-tools: Bash(touch:*), Bash(ls:*), Read
argument-hint: <test-file-path>
---

# /lock-test

1. Verify file: `ls -la $ARGUMENTS`
2. Read test
3. Create lock: `touch $ARGUMENTS.lock`
4. Tell: "Test locked. To unlock: rm $ARGUMENTS.lock"
