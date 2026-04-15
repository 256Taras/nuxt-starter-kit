#!/usr/bin/env bash
set -uo pipefail

INPUT="$(cat)"
FILE_PATH="$(echo "$INPUT" | jq -r '.tool_input.file_path // .tool_input.path // empty')"
[[ -z "$FILE_PATH" ]] && exit 0

case "$FILE_PATH" in
  *.spec.ts|*.spec.js|*.test.ts|*.test.js) ;;
  *) exit 0 ;;
esac

LOCKFILE="${FILE_PATH}.lock"
if [[ -f "$LOCKFILE" ]]; then
  cat <<EOF >&2
{"block":true,"message":"TEST LOCKED: '$FILE_PATH' is the source of truth (test-as-oracle pattern).\nTo unlock: rm '$LOCKFILE'"}
EOF
  exit 2
fi
exit 0
