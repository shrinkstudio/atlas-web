# Ruxlo Webflow Code Components

Every animated card and hero for the Ruxlo site, packaged as native **Webflow Code Components**. Publish once and all 21 animations appear in the Webflow Designer's Components panel (under **Ruxlo**) — drag one onto a page and it plays. There is no external hosting: no Vercel, no iframes, no URLs to paste. Webflow hosts everything with the site.

This folder is self-contained and is the piece to hand to the client (with this README). Day to day, **nothing here needs to run** — the site keeps working without it. It is only needed to *change* an animation or publish updates.

## One-time setup

1. Install [Node.js](https://nodejs.org) (version 22 or newer).
2. Open a terminal in this folder and run:
   ```bash
   npm install
   npx webflow auth login
   ```
   The login opens a browser window — sign in with the Webflow account that owns the workspace. The workspace needs Code Components (DevLink) access.

> **Important gotcha:** publishing uses that browser login, **not** an API token. If a `WEBFLOW_API_TOKEN` environment variable exists, the CLI will try to use it and fail with *"Your API token is invalid or not authorized"*. Run `unset WEBFLOW_API_TOKEN` first if you ever see that error.

## Publishing to Webflow

```bash
npm run import
```

That's the whole deploy. It compiles the styles, bundles the components, and pushes the **Ruxlo Tools** library into the Webflow workspace. Open the Designer afterwards and the components are in the Components panel under **Ruxlo** (a Designer refresh may be needed).

The first import into a new workspace will ask which workspace to link and writes the library id into `webflow.json`. If this library moves to a different workspace (e.g. at handoff), delete the `"id"` line inside `webflow.json` and run `npm run import` again to link it fresh.

## Changing an animation

Each animation is one file in `src/animations/` — for example `src/animations/work-history.tsx`. To change text, colors, or timing:

1. Edit the file (the copy inside the animation, e.g. `"Roof leak repair"`, is plain text in the code).
2. Run `npm run check` — this catches typos in the code before publishing.
3. Run `npm run import` to publish.
4. Refresh the Designer and re-publish the Webflow site.

Nothing else updates automatically or expires; if no one touches the code, the site keeps running the last published version forever.

## The components

| Designer name | Source file | Natural size |
| --- | --- | --- |
| Hero: Orbit Rings | `src/animations/home.tsx` | self-sizing (765 wide) |
| Hero: Who It's For | `src/animations/who-its-for.tsx` | 877 × 391 |
| Hero: How It Works | `src/animations/hiw-hero.tsx` | 730 × 405 |
| Work History | `src/animations/work-history.tsx` | 320 × 267 |
| Documents | `src/animations/documents.tsx` | 320 × 221 |
| Neighborhood Network | `src/animations/neighborhood-network.tsx` | 320 × 222 |
| Find Contractor | `src/animations/find-contractor.tsx` | 320 × 193 |
| Claim Your Work | `src/animations/claim-work.tsx` | 320 × 204 |
| Portfolio | `src/animations/portfolio.tsx` | 320 × 221 |
| Get Found | `src/animations/get-found.tsx` | 320 × 188 |
| Get Leads | `src/animations/leads.tsx` | 320 × 308 |
| Your Street | `src/animations/your-street.tsx` | 320 × 201 |
| Block Events | `src/animations/block-events.tsx` | 320 × 171 |
| Town Notices | `src/animations/town-notices.tsx` | 320 × 201 |
| Verified Neighbors | `src/animations/verified-neighbors.tsx` | 320 × 252 |
| Fragmented Tools | `src/animations/fragmented-tools.tsx` | 380 × 434 |
| Property Profile | `src/animations/property-profile.tsx` | 409 × 294 |
| Claim Your Home | `src/animations/claim-home.tsx` | 340 × 213 |
| Record Work | `src/animations/record-work.tsx` | 340 × 297 |
| Confirm Work | `src/animations/confirm-work.tsx` | 330 × 170 |
| Record Stays | `src/animations/record-stays.tsx` | 340 × 222 |

Using them in the Designer: drop a component in and give it a width (a card fills whatever box it gets, scales down to fit, and never scales up past its natural size — upscaling would blur the text). The three heroes have two settings in the panel: **Entrance** (reveal in the page-load cadence, on by default) and **Entrance delay** in milliseconds.

## How it works (for the curious)

- `src/animations/` — the animation components themselves (React + framer-motion, originally built in v0). Each draws its own card; the stage around it is transparent, so any Webflow section background shows through.
- `src/webflow/*.webflow.tsx` — one small wrapper per animation that registers it with the Designer (name, group, settings).
- `src/shared/AnimationCard.tsx` — the shell around every animation: injects the stylesheet into the component's shadow root, loads the DM Sans/DM Mono fonts from Google Fonts, only runs an animation while it is near the viewport (so a page full of them costs nothing off-screen), and handles the fit-scaling and hero entrance.
- `src/shared/theme.css` + `npm run css` — compiles the Tailwind classes the animations use into `src/shared/generated/tailwind-css.ts`. This runs automatically before every import/bundle, so it's only a separate step if you want to inspect the output.
- `src/shared/figma-assets.ts` — the few small icons, inlined as data URIs so no asset hosting is needed.
- Every animation respects the visitor's "reduce motion" system setting and shows a calm static state instead.

## Scripts

```bash
npm run check    # type-check (run before publishing)
npm run bundle   # build the library locally without publishing (sanity check)
npm run import   # publish the library to the Webflow workspace
npm run css      # rebuild the compiled stylesheet (import/bundle do this automatically)
```
