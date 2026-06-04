# Deploy notes

## GitHub Pages

Demo: https://briancrabtree-me.github.io/pure-react-19-vanilla-starter/

Pushes to `main` run [`.github/workflows/deploy-pages.yml`](../.github/workflows/deploy-pages.yml). First time: **Settings → Pages → Build and deployment → Source: GitHub Actions**.

Build env for this repo path:

```bash
VITE_BASE_PATH=/pure-react-19-vanilla-starter/ \
PUBLIC_SITE_URL=https://briancrabtree-me.github.io/pure-react-19-vanilla-starter \
npm run build
```

Root-domain deploy: omit `VITE_BASE_PATH`.

## Manual deploy

You can still publish `dist/` to a **`gh-pages`** branch if you prefer not to use Actions.

Before copying `dist/`, remove any nested repo: `rm -rf dist/.git` (a leftover `.git` re-attaches old deploy history and can revive stale contributor attribution on GitHub). Copy with `rsync -a --exclude='.git' dist/` into a fresh orphan `gh-pages` commit authored as Brian Crabtree only.

## PSI after deploy

Re-run PageSpeed on the live demo and refresh scores/screenshots per [PSI.md](PSI.md).
