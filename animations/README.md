# Ruxlo animations (superseded — local preview only)

> **This app is no longer how the animations ship.** They are now published as
> native Webflow Code Components from [`../webflow-components`](../webflow-components),
> which has its own copy of every animation in `src/animations/` — **edit them
> there**, not here. No Vercel deployment is needed anymore. This app remains
> only as a quick local preview harness (`npm run dev`, then visit `/<slug>`).

One small Next.js app that hosts every embedded UI animation for the Ruxlo site, a route per card. It was deployed once to Vercel, so each animation had a stable URL like `https://<domain>/work-history`; those URLs went into the (now removed) **V0 Embed** component's Source URL prop in Webflow.

Lives inside the `atlas-web` repo but is fully self-contained (its own `package.json`); it does not touch the site bundle in `../src` or `../webflow-components`.

## Why this exists

A v0 Project has a single production deployment, so publishing 13 chats would just overwrite one URL. Consolidating them into one app with a route each gives 13 stable URLs from one deployment, and one Vercel project to hand to the client.

## Adding an animation

Each card has a slot file in `components/animations/<slug>.tsx`. To fill it:

1. Open the card's chat in v0 (see the map below).
2. Copy the component code from v0's code panel.
3. Replace the whole slot file with it. Keep a **default export** (rename the export to match the file if needed, eg. `export default function WorkHistory()`).
4. If a component pulls extra packages (most just use `motion` and `lucide-react`, already installed), run `npm install <pkg>`.

Alternative: `npx v0 add <chat-url>` pulls a component and installs its deps automatically. If you use it, move the generated file to `components/animations/<slug>.tsx` (or update the import in `components/registry.tsx`) and make sure it default-exports.

Run `npm run dev` and visit `/<slug>` to check each one.

## Card map (chat name -> slug -> URL)

| v0 chat | slug | URL |
| --- | --- | --- |
| Framer Motion animation (orbit hero) | `home` | `/` |
| Work History | `work-history` | `/work-history` |
| Documents | `documents` | `/documents` |
| Neighbourhood Network | `neighborhood-network` | `/neighborhood-network` |
| Find Contractor | `find-contractor` | `/find-contractor` |
| Claim Your Work | `claim-work` | `/claim-work` |
| Portfolio | `portfolio` | `/portfolio` |
| Get Found | `get-found` | `/get-found` |
| Get Leads | `leads` | `/leads` |
| Your Street | `your-street` | `/your-street` |
| Block Events | `block-events` | `/block-events` |
| Town Notice | `town-notices` | `/town-notices` |
| Verified Neighbours | `verified-neighbors` | `/verified-neighbors` |

## Deploy (Vercel)

One Vercel project, pointed at this subfolder:

1. New Project from the `atlas-web` repo.
2. Set **Root Directory** to `animations`.
3. Framework preset: Next.js. Deploy.

That gives you one domain (eg. `ruxlo.vercel.app`) serving every route. In Webflow, each card's **V0 Embed** Source URL = `https://<domain>/<slug>`.

For a clean handoff, transfer this one Vercel project to the client's account (or deploy it there from the start).

## Notes

- The stage is transparent and centered, so each animation drops onto any Webflow section background.
- DM Sans / DM Serif Display / DM Mono are loaded globally in `app/layout.tsx`, so components can reference them by family name.
- Every route is static; nothing to maintain day to day. Re-paste + redeploy only when an animation changes.
