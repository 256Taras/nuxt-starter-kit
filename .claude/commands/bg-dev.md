---
description: Start Nuxt dev server in background for live error monitoring.
allowed-tools: Bash(pnpm:*), BashOutput, KillBash
---

# /bg-dev

1. Start `pnpm dev` with run_in_background: true
2. Wait 5s for Nuxt boot
3. Check BashOutput for Nitro startup or errors
4. Report shell ID. HMR handles code changes automatically.
