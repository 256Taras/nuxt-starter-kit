#!/usr/bin/env bash
set -uo pipefail
cd "$CLAUDE_PROJECT_DIR" || exit 0

INPUT="$(cat)"
TOOL="$(echo "$INPUT" | jq -r '.tool_name // "unknown"')"
ERROR="$(echo "$INPUT" | jq -r '.tool_response.error // .tool_response.stderr // ""' | head -200)"
[[ -z "$ERROR" ]] && exit 0

cat <<EOF
{"feedback":"Tool $TOOL failed.\n\nError:\n$ERROR\n\nREFLEXION REQUIRED: Append ONE line to .claude/REFLECTIONS.md:\n[$(date +%Y-%m-%d)] [domain] lesson\n\nDo this BEFORE moving on."}
EOF
exit 0
