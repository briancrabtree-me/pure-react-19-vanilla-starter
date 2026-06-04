#!/usr/bin/env node
// Pull lab scores from PageSpeed API; paste PSI_REPORT_ID from pagespeed.web.dev share link.
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const demoUrl = 'https://briancrabtree-me.github.io/pure-react-19-vanilla-starter/';

function score(cat) {
  return typeof cat?.score === 'number' ? Math.round(cat.score * 100) : null;
}

function reportUrl(formFactor) {
  const id = process.env.PSI_REPORT_ID;
  if (!id) return undefined;
  const slug = 'https-briancrabtree-me-github-io-pure-react-19-vanilla-starter';
  return `https://pagespeed.web.dev/analysis/${slug}/${id}?form_factor=${formFactor}`;
}

async function fetchPsi(strategy) {
  const api = new URL('https://www.googleapis.com/pagespeedonline/v5/runPagespeed');
  api.searchParams.set('url', demoUrl);
  api.searchParams.set('strategy', strategy);
  for (const cat of ['performance', 'accessibility', 'best-practices', 'seo']) {
    api.searchParams.append('category', cat);
  }
  if (process.env.PSI_API_KEY) api.searchParams.set('key', process.env.PSI_API_KEY);

  const res = await fetch(api, { headers: { accept: 'application/json' } });
  const text = await res.text();
  if (!res.ok) throw new Error(`PSI ${strategy} ${res.status}: ${text.slice(0, 300)}`);

  const json = JSON.parse(text);
  const cats = json.lighthouseResult?.categories || {};
  return {
    performance: score(cats.performance),
    accessibility: score(cats.accessibility),
    bestPractices: score(cats['best-practices']),
    seo: score(cats.seo),
  };
}

const mobile = await fetchPsi('mobile');
const desktop = await fetchPsi('desktop');
const capturedAt = new Date().toISOString();

const scoresPath = resolve(root, 'public/lighthouse-scores.json');
const data = JSON.parse(readFileSync(scoresPath, 'utf8'));
const psiReports = {};
const mobileReport = reportUrl('mobile');
const desktopReport = reportUrl('desktop');
if (mobileReport) psiReports.mobile = mobileReport;
if (desktopReport) psiReports.desktop = desktopReport;

data.demo = {
  url: demoUrl,
  capturedAt,
  psiRun: `https://pagespeed.web.dev/analysis?url=${encodeURIComponent(demoUrl)}`,
  ...(Object.keys(psiReports).length ? { psiReports } : {}),
  mobile,
  desktop,
};
writeFileSync(scoresPath, `${JSON.stringify(data, null, 2)}\n`);

console.log('Updated', scoresPath);
console.log('mobile', mobile);
console.log('desktop', desktop);
if (mobileReport) console.log('mobile report', mobileReport);
if (desktopReport) console.log('desktop report', desktopReport);
