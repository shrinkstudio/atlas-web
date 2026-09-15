# Webflow Code Components

React components published into the Ruxlo Webflow workspace as a Code Component library via DevLink. Self-contained sub-package; does not touch the site bundle in `../src`.

First component: **V0 Embed** — a lazy-mounting iframe shell for the animated feature cards built in v0 and deployed to Vercel. The client drops the component on a page and pastes the animation's deploy URL into the **Source URL** prop. No rebuild per animation.

## Requirements
- Node.js ≥ 22.13 · npm (this package is npm-only, separate from the pnpm site build in `../`).
- A Webflow **workspace with DevLink / Code Components access** (the Shrink workspace has it).
- Logged in via `webflow auth login` (interactive). **Do not set `WEBFLOW_API_TOKEN`** for DevLink, see Publishing below.

## Scripts
```bash
npm install
npm run check     # tsc type-check
npm run bundle    # local library bundle (needs library.id in webflow.json, set on first import)
npm run import    # publish the library to the Webflow workspace (see below)
```

## Publishing (DevLink import)

> **Gotcha (this cost an hour once):** DevLink authenticates with your **interactive login session, not an API token.** Do NOT set `WEBFLOW_API_TOKEN` and do NOT keep a `.env` with it. A Data API token has no Code Components scope, so if the CLI finds one in the environment it uses it and fails with *"Your API token is invalid or not authorized to perform this action"* — even when the token is otherwise valid. Keep the env var unset so the CLI falls back to your login session.

```bash
# one-time (or when the session expires): interactive browser login
npx webflow auth login --force

# then, in a shell with WEBFLOW_API_TOKEN unset:
unset WEBFLOW_API_TOKEN   # clears any stale export in the current shell
npm run import
```

First import links the library to the workspace, prompts for the workspace if needed (pick the one with Code Components access), and writes `library.id` back into `webflow.json`.

Target site: **Ruxlo AI** (`6a671e8dae27f770cdae0220`), in the Shrink workspace (`63765059a2b39056142ead15`). After a successful import, **V0 Embed** appears in the Designer Components panel under the **Ruxlo** group.

## Using V0 Embed
1. Build an animation in v0 (one chat per card, under the `ruxlo` project), deploy it to Vercel.
2. Drop a **V0 Embed** instance on the page and set its props:
   - **Source URL** — the Vercel deploy URL for that animation (required).
   - **Title (accessibility)** — short label for the iframe, eg. "Work history animation".
   - **Aspect ratio** — matches the card, eg. `16/10` or `4/3`.
   - **Max width** — caps the embed width, eg. `620px`.
   - **Mount margin** — how far before the viewport the iframe boots (`600px` default).
   - **Poster image URL** — a static screenshot; shown before the iframe mounts and under reduced motion.
3. The iframe only runs while near the viewport, so several embeds on one page cost nothing off-screen.

Deploy the v0 animations under the **client's Vercel** (or transfer the projects at handoff) so the Source URLs are not tied to Shrink's account.

## Layout
```
webflow-components/
├── webflow.json                 # library manifest (id added on first import)
├── package.json · tsconfig.json
└── src/V0Embed/
    ├── V0Embed.tsx              # lazy-mount iframe shell (viewport gating + reduced-motion poster)
    └── V0Embed.webflow.tsx      # declareComponent + Designer props
```

## Notes
- **Shadow DOM:** Code Components render in a shadow root, so anything visual ships inside the component. V0 Embed is just an iframe, so there is nothing to style here; the animation lives in the embedded v0 page.
- **No heavy deps:** the animation code (framer-motion etc.) lives in the v0 deploys, not in this package. This shell stays react-only.
