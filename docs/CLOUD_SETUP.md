# Reusable managed cloud setup

The cloud draft API returned `INVALID_ARGUMENT` during this session, so persistence of `install_script` and `start_skill` could not be confirmed. The repository's Codespaces configuration is saved independently in `.devcontainer/devcontainer.json` and does not depend on that API.

If configuring the managed environment manually, use this install script:

```bash
#!/usr/bin/env bash
set -euo pipefail
cd /workspace/BingChing
npm ci --cache /tmp/cakedesk-npm
npm run build
npm test
```

Startup instructions:

Use the existing checkout at `/workspace/BingChing`; each cloud task is already isolated, so do not create a Git worktree unless explicitly requested. Read the README and applicable agent instructions. Dependencies and files can be retained in a snapshot; running processes cannot. From the checkout, run `npm run dev -- --port 5173` in a persistent terminal. Verify the app through local HTTP and browser checks. Visit `/demo` for scenarios and `/staff/login` for fictional roles. Use only fictional data. Payments, email, secure authentication and scheduled backups are unconfigured. For verification run `npm run build`, `npm test` and `CI_CHROMIUM_PATH=/usr/bin/chromium npm run test:e2e` when system Chromium is available. Do not claim a saved configuration was published or a new task was validated without evidence.
