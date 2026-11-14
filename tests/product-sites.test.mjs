import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile, stat } from 'node:fs/promises';
import test from 'node:test';

const output = new URL('../site/', import.meta.url);
const read = relative => readFile(new URL(relative, output));
const baseline = await read('assets/brand/cosmik.css');
const products = [
  ['arcfield', 'assets/cosmik.css', 'assets/arcfield.css'],
  ['hplx', 'vendor/brand-hplx/vendor/brand/kits/cosmik/tokens/cosmik.css', 'vendor/brand-hplx/tokens/hplx.css'],
  ['tectra', 'vendor/brand-tectra/vendor/brand/kits/cosmik/tokens/cosmik.css', 'vendor/brand-tectra/tokens/tectra.css'],
];

test('Arcfield uses Cosmik controls for the terrain demo and calls to action', async () => {
  const html = (await read('arcfield/index.html')).toString();
  assert.match(html, /href="assets\/arcfield\.css\?v=[^"]+"[\s\S]*href="assets\/controls\.css\?v=[^"]+"[\s\S]*href="site\.css\?v=[^"]+"/);
  assert.deepEqual(await read('arcfield/assets/controls.css'), await read('assets/brand/controls.css'));
  assert.match(html, /class="c-button c-button--primary c-button--large"/);
  assert.match(html, /role="group" aria-label="Edge shape"/);
  assert.match(html, /data-edge="joined" aria-pressed="true"/);
  assert.match(html, /data-edge="split" aria-pressed="false"/);
});

test('Arcfield introduces Workbench as a separate browser app', async () => {
  const html = (await read('arcfield/index.html')).toString();
  assert.match(html, /href="#workbench">Workbench/);
  assert.match(html, /id="workbench"[\s\S]*Arcfield Workbench[\s\S]*In development[\s\S]*WebAssembly at <strong>arcfield\.app<\/strong>/);
  assert.match(html, /run this from the <code>arcfield-bevy<\/code> root/);
  assert.doesNotMatch(html, /Arcfield Studio|#studio/);
});

test('Arcfield asset URLs are tied to the deployed bytes', async () => {
  const html = (await read('arcfield/index.html')).toString();
  for (const file of ['assets/cosmik.css', 'assets/arcfield.css', 'assets/controls.css', 'site.css', 'terrain.js']) {
    const bytes = await read(`arcfield/${file}`);
    const revision = createHash('sha256').update(bytes).digest('hex').slice(0, 12);
    assert.ok(html.includes(`"${file}?v=${revision}"`), file);
  }
});

for (const [id, shared, family] of products) {
  test(`${id} has its own page and loads its family after the common baseline`, async () => {
    const html = (await read(id + '/index.html')).toString();
    assert.match(html, new RegExp(`<html[^>]+data-family="${id}"`));
    const sheets = [...html.matchAll(/<link rel="stylesheet" href="([^"]+)"/g)].map(match => match[1].split('?')[0]);
    assert.ok(sheets.indexOf(shared) >= 0);
    assert.ok(sheets.indexOf(family) > sheets.indexOf(shared));
    assert.deepEqual(await read(id + '/' + shared), baseline);
    for (const sheet of sheets) assert.ok((await stat(new URL(id + '/' + sheet, output))).isFile());
    if (process.env.SITE_URL) {
      const base = process.env.SITE_URL.replace(/\/?$/, '/');
      const canonical = new URL(id + '/', base);
      assert.ok(html.includes(`rel="canonical" href="${canonical}"`));
      assert.ok((await read('sitemap.xml')).includes(`<loc>${canonical}</loc>`));
    } else assert.match(html, /name="robots" content="noindex,nofollow"/);
  });
}
