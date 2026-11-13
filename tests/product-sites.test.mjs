import assert from 'node:assert/strict';
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

for (const [id, shared, family] of products) {
  test(`${id} has its own page and loads its family after the common baseline`, async () => {
    const html = (await read(id + '/index.html')).toString();
    assert.match(html, new RegExp(`<html[^>]+data-family="${id}"`));
    const sheets = [...html.matchAll(/<link rel="stylesheet" href="([^"]+)"/g)].map(match => match[1]);
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
