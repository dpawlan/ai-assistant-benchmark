const assert = require('node:assert/strict');
const { chromium } = require('playwright');
const { products } = require('../data/market-map-timeline.json');

async function checkTimeline() {
  const browser = await chromium.launch({
    headless: true,
    ...(process.env.TIMELINE_BROWSER_CHANNEL ? { channel: process.env.TIMELINE_BROWSER_CHANNEL } : {}),
  });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    const baseUrl = process.env.TIMELINE_BASE_URL || 'http://localhost:3125';
    const response = await page.goto(new URL('/market-map', baseUrl).href, { waitUntil: 'networkidle' });
    assert.equal(response.status(), 200);

    const map = page.getByLabel('Market map products');
    const slider = page.getByRole('slider', { name: 'Market map month' });
    const past = page.getByRole('checkbox', { name: 'Include past products' });
    const category = page.getByLabel('Filter by category');
    const allTiles = map.getByRole('link');
    const tile = name => map.getByRole('link', { name, exact: true });
    const showMonth = (year, month) => slider.fill(String(year * 12 + month - 1));
    const backToCurrent = () => page.getByRole('button', { name: 'Back to current' }).click();
    assert.equal(await allTiles.count(), products.filter(product => product.mapped).length);
    assert.equal(await tile('Ollie').count(), 0);
    assert.equal(await tile('Vellum').count(), 1);

    await showMonth(2026, 10);
    assert.equal(await tile('Ollie').count(), 1);
    await showMonth(2026, 1);
    assert.equal(await tile('Instinct').count(), 0);
    await showMonth(2026, 2);
    assert.equal(await tile('Instinct').count(), 1);
    await backToCurrent();

    await past.check();
    assert.equal(await allTiles.count(), products.length);
    await past.uncheck();

    const coordination = 'Agent orchestration & collaboration';
    await category.selectOption(coordination);
    assert.equal(await allTiles.count(), products.filter(product => product.category === coordination).length);
    assert.equal(await tile('Paperclip').count(), 1);
    await category.selectOption('All categories');

    await page.getByRole('button', { name: 'Play', exact: true }).click();
    const pause = page.getByRole('button', { name: 'Pause', exact: true });
    await pause.waitFor();
    const start = await slider.getAttribute('aria-valuetext');
    await page.waitForFunction(initial => {
      const input = document.querySelector('input[aria-label="Market map month"]');
      return input?.getAttribute('aria-valuetext') !== initial;
    }, start);
    await pause.click();
    await backToCurrent();

    const brokenImages = await map.locator('img').evaluateAll(async images => {
      await Promise.allSettled(images.map(image => {
        image.loading = 'eager';
        return image.decode();
      }));
      return images.filter(image => !image.naturalWidth).map(image => image.src);
    });
    assert.deepEqual(brokenImages, []);
    await page.setViewportSize({ width: 390, height: 844 });
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'Mobile view overflows');
    assert.deepEqual(errors, []);
    console.log('Passed: current and historical counts, date boundaries, categories, playback, logos, and mobile width.');
  } finally {
    await browser.close();
  }
}

checkTimeline().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
