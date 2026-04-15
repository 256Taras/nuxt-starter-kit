#!/usr/bin/env bash
set -uo pipefail

INPUT="$(cat)"
FILE_PATH="$(echo "$INPUT" | jq -r '.tool_input.file_path // .tool_input.path // empty')"
[[ -z "$FILE_PATH" ]] && exit 0

BRANCH="$(git -C "$CLAUDE_PROJECT_DIR" branch --show-current 2>/dev/null || echo '')"
case "$BRANCH" in
  main|master|develop|production|staging)
    cat <<EOF >&2
{"block":true,"message":"BLOCKED: cannot edit on protected branch '$BRANCH'. Run: git checkout -b feature/<task>"}
EOF
    exit 2 ;;
esac

BASENAME="$(basename "$FILE_PATH")"
if [[ "$BASENAME" =~ ^\.env(\..+)?$ ]] && [[ "$BASENAME" != ".env.example" ]] && [[ "$BASENAME" != ".env.sample" ]]; then
  cat <<EOF >&2
{"block":true,"message":"BLOCKED: cannot edit secret file '$FILE_PATH'."}
EOF
  exit 2
fi

if [[ "$BASENAME" =~ \.(pem|key|p12|pfx|jks)$ ]]; then
  cat <<EOF >&2
{"block":true,"message":"BLOCKED: cannot edit cryptographic key file '$FILE_PATH'."}
EOF
  exit 2
fi
exit 0
