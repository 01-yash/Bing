# Bing’s Bakery

A working React / TypeScript competition demonstration of a shared cake-order record for Bing’s Bakery. Warm, responsive customer pages and a practical staff workspace support custom designs, human-reviewed quotes and date-based production.

## Run in GitHub Codespaces

1. Open this repository in a Codespace. The included `.devcontainer/devcontainer.json` uses Node 22 and runs `npm ci` automatically.
2. In the terminal, run `npm run dev`.
3. Open the forwarded **5173** port in Codespaces’ **Ports** panel. Start at `/` for customers or `/demo` for the guided competition scenarios.
4. Select **Open staff workspace** or visit `/staff/login` to choose a fictional demo role. Choose **Owner** to explore settings and backup restoration.

Keep the forwarded port private when working with your demo. No credentials, API keys, database account or paid service is needed. Font files and illustrated cake assets are bundled; the running app does not need external image or font services.

For another machine: install Node 22 or later, run `npm ci`, then `npm run dev`. If your environment cannot write npm’s default cache, use `npm ci --cache /tmp/cakedesk-npm`.

## What works

- Dedicated Home, Custom cakes, How it works and Contact pages with active navigation, page-specific browser titles and a mobile menu.
- A validated Contact form saves fictional enquiries in this browser; the staff Contact inbox supports search, filtering, resolve/reopen and a separate export. No message is emailed to the bakery. Call the listed phone number for real enquiries.
- Dashboard navigation highlights the current section, including nested CakeCards. Summary cards open the correct pickup date or review queue.
- Four-step public cake request wizard, recoverable drafts, contact validation, immediate reference and persisted confirmation.
- JPG, PNG and WebP reference uploads up to 2 MB, removable images and numbered spatial design notes.
- Fast phone/counter intake, recoverable partial drafts, follow-up flag and duplicate warnings.
- Order search by reference, name, phone, description or date; status filters and dashboard queues.
- A shared CakeCard with customer communication, separate staff notes, timestamped history, printable production sheet and JSON summary.
- Staff-reviewed, versioned quote breakdowns, private cost estimates, customer acceptance with demo contact verification and expiration checks.
- Requested changes preserve the last approved instructions until the newly quoted design is approved.
- Bakery confirmation checks current quote acceptance, configured deposits, hours, closures and capacity. A manager can explicitly override availability; the override is recorded.
- Confirmed-only production and calendar views, independent preparation dates, preparation / ready / pickup transitions.
- Source counts, measured intake/quote timing when available, incident logs and CSV export.
- Owner-editable product options, example pricing, opening hours, closure dates, capacity, deposit and quote expiration policies.
- Full cake-order JSON backup generation and restore, including embedded reference images. Contact enquiries have a separate export in Contact inbox. Same-origin browser tabs refresh their in-memory records when another tab saves.

## Demo boundaries

**Use fictional information only.** Data is stored in `localStorage` on the browser and origin that created it. Another browser or a different forwarded hostname has a different store. Clearing site data removes it. Export before resetting or changing hosts. A full browser reload preserves records; processes do not provide storage.

Demo role selection restricts the interface but is **not authentication or an authorization security boundary**. Customer links use random UUID tokens and a contact check for approval, but all local data is available to the person controlling this browser. Do not deploy this local demonstration for real orders. It cannot satisfy production privacy/isolation requirements. A private browser link does not provide cross-device database sharing.

There is no card processing, email delivery, automatic reminder, online store integration, scheduled backup or offline synchronization. The interface explicitly labels these as unconfigured. Payment records require staff to attest they verified an external payment; customer actions cannot mark payments paid. Manual JSON exports are real file generation, not scheduled or remote backups. Uploaded illustrations and all sample orders are fictional.

Production deployment requirements and the acceptance-test mapping are in [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md). Presentation notes are in [docs/PRESENTATION.md](docs/PRESENTATION.md).

## Verify

```sh
npm run build
npm test
npx playwright install --with-deps chromium
npm run test:e2e
```

If Chromium is already installed, set `CI_CHROMIUM_PATH` to its executable for browser tests instead. For example, `CI_CHROMIUM_PATH=/usr/bin/chromium npm run test:e2e`. Browser tests cover the complete quote and revised-design lifecycle, images/annotations, pending-order isolation from production, phone intake, persistence, duplicate warnings, search, role screens, invalid customer links, cost visibility, backup restore, CSV and responsive layouts. Build output is `dist/`. A static host must rewrite unknown routes to `index.html`.

## Source layout

`src/PublicLayout.tsx` provides shared branding/navigation and route titles, `src/PublicPages.tsx` contains the public pages and contact inbox, `src/contactStore.ts` persists local contact enquiries, `src/main.tsx` contains the ordering and staff workflows, `src/model.ts` contains the typed records, demo fixtures, availability and persistence helpers, and `src/style.css` provides responsive and print styling. No secrets or real customer records are included. Use the existing checkout for cloud tasks; no Git worktree is needed.
