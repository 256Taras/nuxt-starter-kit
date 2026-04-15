#!/usr/bin/env bash
set -uo pipefail

INPUT="$(cat)"
FILE_PATH="$(echo "$INPUT" | jq -r '.tool_input.file_path // .tool_input.path // empty')"
[[ -z "$FILE_PATH" ]] || [[ ! -f "$FILE_PATH" ]] && exit 0

cd "$CLAUDE_PROJECT_DIR" || exit 0

case "$FILE_PATH" in
  *.ts|*.tsx|*.js|*.jsx|*.vue|*.mjs|*.cjs)
    pnpm exec eslint --fix "$FILE_PATH" >/dev/null 2>&1 || true
    pnpm exec prettier --write "$FILE_PATH" >/dev/null 2>&1 || true ;;
  *.json|*.md|*.yaml|*.yml)
    pnpm exec prettier --write "$FILE_PATH" >/dev/null 2>&1 || true ;;
esac
exit 0
