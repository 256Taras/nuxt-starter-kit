#!/usr/bin/env bash
set -uo pipefail
cd "$CLAUDE_PROJECT_DIR" || exit 0

CHANGED="$(git diff --name-only 2>/dev/null | grep -E '\.(ts|tsx|vue|js|jsx)$' || true)"
[[ -z "$CHANGED" ]] && exit 0

ISSUES=""

OUT="$(npx vue-tsc --noEmit 2>&1 | grep 'error TS' | head -10 || true)"
[[ -n "$OUT" ]] && ISSUES="${ISSUES}\n[vue-tsc]\n$OUT"

LINT_OUT="$(pnpm exec eslint $CHANGED 2>&1 | grep -E '(error|warning)' | head -10 || true)"
[[ -n "$LINT_OUT" ]] && ISSUES="${ISSUES}\n[lint]\n$LINT_OUT"

if [[ -n "$ISSUES" ]]; then
  cat <<EOF
{"continue":true,"feedback":"Final checks failed. Fix before stopping:$ISSUES"}
EOF
fi
exit 0
