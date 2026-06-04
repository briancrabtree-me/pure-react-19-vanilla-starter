# Architecture

Same loading ideas as [briancrabtree.me](https://briancrabtree.me/), minus CMS, Firebase, and edge workers.

## Load sequence

1. **Inline shell** (`index.html`) — nav + hero paint before JS.
2. **Global CSS** from `index.tsx`, then dynamic `bootstrap-app`.
3. **Postbuild** (`scripts/postbuild-html.mjs`) — blocking stylesheet before the module tag; strip `modulepreload` on `core-ui`.
4. **Hero** — `markHeroLcpReady()` drops the shell after the hero WebP loads; `scheduleHeroLcpFallback()` if the image never fires `onLoad`.
5. **Below fold** — lazy `DemoBelowFold`; `useIdleEffect` for deferred work.

## Bundling

`vite.config.ts` puts `react`, `react-dom`, and `react-router-dom` in `core-ui`. Postbuild removes modulepreload on that file so the LCP image is not competing with ~230 KB of vendor JS on the wire.

Keep icon fonts, analytics SDKs, and CSS frameworks off the critical path.

## Routing

`BrowserRouter` uses `import.meta.env.BASE_URL` for subdirectory Pages deploys. Postbuild writes `dist/about/index.html` with its own title, description, and canonical.

## CSS

Vanilla custom properties in `styles/index.css`. Anything visible on first paint for `/` must be in `index.css` or the inline shell. About-only rules: `styles/pages.css`.

## React 19 in the demo

- `use()` + `utils/siteConfig.ts` — static hero copy
- `useActionState` — About contact form
- Lazy route (`About`) and lazy section (`DemoBelowFold`)

Optional later: [React Compiler](https://react.dev/learn/react-compiler) instead of hand-rolled memoization.

## Omitted on purpose

PostCSS/Tailwind/CSS-in-JS, runtime Lighthouse JSON fetch, SSR frameworks.

## Env vars

| Variable | Purpose |
|----------|---------|
| `VITE_BASE_PATH` | Vite `base` (e.g. `/pure-react-19-vanilla-starter/`) |
| `PUBLIC_SITE_URL` | Canonicals in postbuild route shells |
