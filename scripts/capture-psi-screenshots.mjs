#!/usr/bin/env node
// Optional headless capture when you cannot screenshot manually. Usage: node scripts/capture-psi-screenshots.mjs [reportId]
import puppeteer from 'puppeteer-core';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const reportId = process.argv[2] || 'lo5ura31eh';
const slug = 'https-briancrabtree-me-github-io-pure-react-19-vanilla-starter';
const base = `https://pagespeed.web.dev/analysis/${slug}/${reportId}`;

const shots = [
  ['mobile', `${base}?form_factor=mobile`, resolve(root, 'docs/assets/psi-starter-mobile.png')],
  ['desktop', `${base}?form_factor=desktop`, resolve(root, 'docs/assets/psi-starter-desktop.png')],
];

const chrome = process.env.CHROME_PATH || '/tmp/chromium';

const browser = await puppeteer.launch({
  executablePath: chrome,
  headless: true,
  args: ['--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage'],
});

for (const [label, url, out] of shots) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 1200, deviceScaleFactor: 1 });
  console.log(`[capture-psi] ${label} → ${url}`);
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 90_000 });
  await page.waitForFunction(
    () => {
      const t = document.body?.innerText || '';
      return /100\s*Performance/.test(t) && /100\s*Accessibility/.test(t);
    },
    { timeout: 120_000, polling: 1000 },
  );
  await new Promise((r) => setTimeout(r, 1500));

  const clip = await page.evaluate(() => {
    const links = [...document.querySelectorAll('a')];
    const perf = links.find((a) => /^\s*100\s*Performance/i.test(a.textContent || ''));
    if (!perf) return null;
    let el = perf.parentElement;
    for (let i = 0; i < 6 && el; i++) {
      const r = el.getBoundingClientRect();
      if (r.width > 400 && r.height > 120) {
        const pad = 24;
        return {
          x: Math.max(0, r.x - pad),
          y: Math.max(0, r.y - pad),
          width: Math.min(window.innerWidth - r.x + pad, r.width + pad * 2),
          height: Math.min(r.height + pad * 2, 420),
        };
      }
      el = el.parentElement;
    }
    const r = perf.getBoundingClientRect();
    return { x: 0, y: Math.max(0, r.y - 80), width: window.innerWidth, height: 360 };
  });

  if (clip) {
    await page.screenshot({ path: out, clip });
  } else {
    await page.screenshot({ path: out, fullPage: false });
  }
  console.log(`[capture-psi] wrote ${out}`);
  await page.close();
}

await browser.close();
