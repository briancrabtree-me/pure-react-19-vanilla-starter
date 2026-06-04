#!/usr/bin/env node
// Vite emits modulepreload + JS-before-CSS; we flip that for lab scores and crawlers.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const siteUrl = (
  process.env.PUBLIC_SITE_URL ||
  'https://briancrabtree-me.github.io/pure-react-19-vanilla-starter'
).replace(/\/$/, '');

const PUBLIC_ROUTE_META = [
  {
    path: '/',
    title: 'Pure React 19 Starter | Vite + vanilla CSS',
    description:
      'Vite + React 19 + plain CSS. Prerender shell and blocking CSS before the module entry.',
    canonical: `${siteUrl}/`,
  },
  {
    path: '/about',
    title: 'About | Pure React 19 Starter',
    description:
      'How this repo loads: prerender shell, postbuild head order, idle effects, demo form.',
    canonical: `${siteUrl}/about/`,
  },
];

const root = resolve(process.cwd(), 'dist');
const indexPath = resolve(root, 'index.html');
let html = readFileSync(indexPath, 'utf8');

html = html.replace(
  /<link\s+rel=["']modulepreload["'][^>]*\bcore-ui[^>]*>\s*/gi,
  '',
);

const cssHrefRe = /<link\s+rel=["']stylesheet["'][^>]*\bhref=["']([^"']+\.css)["'][^>]*\/?>/gi;
const moduleScriptRe =
  /<script\s+type=["']module"[^>]*\bsrc=["']([^"']+\.js)["'][^>]*>\s*<\/script>/i;
const cssMatches = [...html.matchAll(cssHrefRe)];
const scriptMatch = html.match(moduleScriptRe);

if (!cssMatches.length || !scriptMatch) {
  console.warn('[postbuild-html] no stylesheet or module script found; skipping head reorder');
} else {
  const href = cssMatches[0][1];
  const assetMatch = href.match(/assets\/[^"']+\.css/);
  const cssPath = assetMatch ? resolve(root, assetMatch[0]) : null;
  html = html.replace(cssHrefRe, '');
  html = html.replace(/<link\s+rel=["']preload["'][^>]*\.css[^>]*\/?>\s*/gi, '');
  html = html.replace(moduleScriptRe, '');

  let styleBlock;
  if (cssPath) {
    const css = readFileSync(cssPath, 'utf8').replace(/<\/style/gi, '<\\/style');
    styleBlock = `<style data-app-css>\n${css}\n</style>`;
    console.log('[postbuild-html] inlined', assetMatch[0]);
  } else {
    const preloadCss = `<link rel="preload" href="${href}" as="style" />`;
    styleBlock = `${preloadCss}\n  <link rel="stylesheet" href="${href}" />`;
  }

  html = html.replace(/<\/style>\s*/i, (m) => `${m}  ${styleBlock}\n  ${scriptMatch[0]}\n`);
}

const buildStamp = new Date().toISOString().replace(/[-:TZ.]/g, '').slice(0, 12);
const buildMeta = `<meta name="starter-build" content="${buildStamp}" />`;
if (/<meta\s+name=["']starter-build["']/i.test(html)) {
  html = html.replace(/<meta\s+name=["']starter-build["'][^>]*\/?>/i, buildMeta);
} else {
  html = html.replace(/<head>/i, `<head>\n  ${buildMeta}`);
}

function escapeAttr(value) {
  return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
}

function applyRouteMeta(sourceHtml, meta) {
  let out = sourceHtml;
  out = out.replace(/<title>[^<]*<\/title>/i, `<title>${escapeAttr(meta.title)}</title>`);
  out = out.replace(
    /<meta\s+name=["']description["'][^>]*>/i,
    `<meta name="description" content="${escapeAttr(meta.description)}" />`,
  );
  out = out.replace(
    /<link\s+rel=["']canonical["'][^>]*>/i,
    `<link rel="canonical" href="${escapeAttr(meta.canonical)}" />`,
  );
  return out;
}

writeFileSync(indexPath, applyRouteMeta(html, PUBLIC_ROUTE_META[0]));
console.log('[postbuild-html] rewrote', indexPath, `(starter-build=${buildStamp})`);

for (const meta of PUBLIC_ROUTE_META) {
  if (meta.path === '/') continue;
  const segment = meta.path.replace(/^\//, '');
  const outPath = resolve(root, segment, 'index.html');
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, applyRouteMeta(html, meta));
  console.log('[postbuild-html] route shell', meta.path, '->', outPath);
}
