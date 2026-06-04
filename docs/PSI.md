# PageSpeed verification

## Portfolio (reference)

Site: [https://briancrabtree.me/](https://briancrabtree.me/)

Numbers under `reference` in [`public/lighthouse-scores.json`](../public/lighthouse-scores.json). Screenshots: `docs/assets/psi-portfolio-*.png`.

```text
https://pagespeed.web.dev/analysis?url=https%3A%2F%2Fbriancrabtree.me%2F
```

## Starter demo (GitHub Pages)

```text
https://pagespeed.web.dev/analysis?url=https%3A%2F%2Fbriancrabtree-me.github.io%2Fpure-react-19-vanilla-starter%2F
```

After a good run:

1. Mobile and desktop tabs — confirm 100 on all four categories (re-run if one flickers to 99).
2. **Share** on PageSpeed — copy the report id into `PSI_REPORT_ID` or paste URLs into `demo.psiReports` in `lighthouse-scores.json`:
   - `...?form_factor=mobile`
   - `...?form_factor=desktop`
3. Screenshot the score rings in the PageSpeed UI (README PNGs must be real `pagespeed.web.dev` captures, not generated cards) → `docs/assets/psi-starter-mobile.png`, `psi-starter-desktop.png`. Only commit them after mobile and desktop each show **100** on all four categories. Fallback: `CHROME_PATH=/path/to/chrome node scripts/capture-psi-screenshots.mjs <reportId>`.
4. Update `demo` scores and `capturedAt` in JSON. Optional: `PSI_API_KEY=... node scripts/fetch-psi-scores.mjs` (needs API quota).

## Local preflight

```bash
VITE_BASE_PATH=/pure-react-19-vanilla-starter/ \
PUBLIC_SITE_URL=https://briancrabtree-me.github.io/pure-react-19-vanilla-starter \
npm run build
```

In `dist/index.html` after `</style>`: inlined app CSS (`<style data-app-css>`), then module script. `dist/about/index.html` should exist.

## Do not

- Publish Lighthouse scores that are not from [pagespeed.web.dev](https://pagespeed.web.dev) lab runs with shareable report URLs.
- `fetch()` `lighthouse-scores.json` from React.
- Load module JS before the main stylesheet.
