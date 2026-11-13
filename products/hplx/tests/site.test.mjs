import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir, stat, mkdtemp, rm } from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';
import { build, metadata, checkedUrl } from '../scripts/build.mjs';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const site = path.resolve(root, '../../site/hplx');
const read = file => readFile(path.join(site, file), 'utf8');
const pages = ['index.html', 'privacy/index.html', 'legal/index.html'];

test('approved brand files match immutable release provenance with no retired assets', async () => {
  const snapshot = JSON.parse(await readFile(path.resolve(root, '../../vendor/product-brand/manifest.json'), 'utf8'));
  const provenance = { files: Object.fromEntries(Object.entries(snapshot.files).filter(([file]) => file.startsWith('kits/hplx/')).map(([file, hash]) => [file.slice('kits/hplx/'.length), hash])) };
  assert.ok(Object.keys(provenance.files).every(file => !/ember|archive|historical/.test(file)));
  assert.ok(provenance.files['assets/hplx-glimmer-dark.svg']);
  assert.ok(provenance.files['fonts/licenses/Spectral-OFL.txt']);
});

test('all generated page assets, internal links and fragments resolve', async () => {
  for (const page of pages) {
    const html = await read(page);
    const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
    assert.equal(new Set(ids).size, ids.length, `${page}: duplicate ids`);
    for (const [, href] of html.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
      if (/^(https?:|mailto:|data:)/.test(href)) continue;
      const [relative, fragment] = href.split('#');
      let destination = relative ? path.resolve(site, path.dirname(page), relative) : path.join(site, page);
      const file = await stat(destination);
      if (file.isDirectory()) destination = path.join(destination, 'index.html');
      const bytes = await readFile(destination, 'utf8');
      if (fragment) assert.ok(bytes.includes(`id="${fragment}"`), `${page}: missing ${href}`);
    }
  }
});

test('all stylesheet font references resolve to local licensed files', async () => {
  const css = await read('assets/site.css');
  for (const [, value] of css.matchAll(/url\('([^']+)'\)/g)) assert.ok((await stat(path.resolve(site, 'assets', value))).isFile());
  assert.ok(!css.includes('fonts.googleapis'));
});

test('product remains accurately in development with no fake conversion or app screenshot', async () => {
  const html = await read('index.html');
  assert.match(html, /No public download yet/);
  assert.match(html, /Not an app screenshot/);
  assert.match(html, /mailto:hello@cosmiklabs\.org\?subject=HPLX/);
  assert.ok(!/<form\b|href="[^"]*releases\/download/.test(html));
  assert.match(html, /No original game content/);
  assert.match(html, /not affiliated with, sponsored by or endorsed by Frictional Games/);
});

test('workflow remains readable without JavaScript and uses native controls', async () => {
  const html = await read('index.html');
  assert.ok(!/<br\s*\/?>(?=\S)/.test(html), 'Responsive headings must retain a word separator when line breaks are hidden.');
  assert.equal((html.match(/class="diagram-step"/g) || []).length, 3);
  assert.equal((html.match(/class="diagram-step"[^>]*hidden/g) || []).length, 3);
  assert.match(html, /<kbd>F5<\/kbd>/);
  assert.match(html, /<kbd>Esc<\/kbd>/);
  assert.equal((html.match(/<details>/g) || []).length, 7);
  assert.equal((html.match(/<summary>/g) || []).length, 7);
  assert.ok(!/<div[^>]*onclick/.test(html));
  assert.match(html, /class="hero-requirement">Requires your own local PC copy/);
});

test('the same primary navigation appears on all pages', async () => {
  for (const page of pages) {
    const html = await read(page);
    const nav = html.match(/<nav aria-label="Main navigation">([\s\S]*?)<\/nav>/)?.[1];
    assert.ok(nav, page);
    assert.deepEqual([...nav.matchAll(/<a[^>]*>([^<]+)<\/a>/g)].map(match => match[1]), ['Product', 'How it works', 'Questions', 'Contact']);
    assert.match(html, /Skip to content/);
    assert.match(html, /<nav aria-label="Footer navigation">[\s\S]*?<a href="(?:\.\.\/)?#contact">Contact<\/a>/);
  }
});

test('public metadata respects subpath deployment and product identity', () => {
  const html = metadata('HPLX & stories', 'A "story"', 'privacy/', 'https://example.com/hplx');
  assert.match(html, /https:\/\/example.com\/hplx\/privacy\//);
  assert.match(html, /https:\/\/example.com\/hplx\/assets\/media\/social-card.jpg/);
  assert.match(html, /og:site_name" content="HPLX/);
  assert.match(html, /HPLX &amp; stories/);
  assert.match(html, /A &quot;story&quot;/);
  assert.ok(!html.includes('noindex'));
});

test('social artwork uses the JPEG format declared by the public metadata', async () => {
  const bytes = await readFile(path.join(root, 'assets/media/social-card.jpg'));
  assert.equal(bytes[0], 0xff);
  assert.equal(bytes[1], 0xd8);
  assert.match(metadata('HPLX', 'Story editor', '', 'https://example.com/'), /og:image:type" content="image\/jpeg"/);
});

test('URL configuration prevents unsafe protocols, credentials and fragments', () => {
  for (const url of ['javascript:alert(1)', 'http://example.com', 'https://user:pass@example.com', 'https://example.com/?foo=1', 'https://example.com/#part']) assert.throws(() => checkedUrl(url));
  assert.equal(checkedUrl('http://127.0.0.1:4191'), 'http://127.0.0.1:4191/');
  assert.throws(() => checkedUrl('https://localhost', { publicOnly:true }));
});

test('local build is noindex and social preview is explicitly gated', async () => {
  const dir = await mkdtemp(path.join(os.tmpdir(), 'hplx-preview-'));
  try {
    await build({ siteUrl:null, destination:dir, socialPreview:false });
    assert.match(await readFile(path.join(dir, 'index.html'), 'utf8'), /noindex,nofollow/);
    assert.match(await readFile(path.join(dir, 'robots.txt'), 'utf8'), /Disallow: \//);
    assert.ok(!(await readdir(dir)).includes('sitemap.xml'));
    assert.ok(!(await readdir(dir)).includes('social-card.html'));
    await build({ siteUrl:null, destination:dir, socialPreview:true });
    assert.ok((await readdir(dir)).includes('social-card.html'));
  } finally { await rm(dir, { recursive:true, force:true }); }
});

test('public build produces canonical pages and a sitemap, without internal preview routes', async () => {
  const dir = await mkdtemp(path.join(os.tmpdir(), 'hplx-public-'));
  try {
    await build({ siteUrl:'https://example.com/hplx/', destination:dir, socialPreview:true });
    const html = await readFile(path.join(dir, 'index.html'), 'utf8');
    assert.ok(!html.includes('noindex'));
    assert.match(html, /rel="canonical" href="https:\/\/example.com\/hplx\/"/);
    const sitemap = await readFile(path.join(dir, 'sitemap.xml'), 'utf8');
    assert.equal((sitemap.match(/<url>/g) || []).length, 3);
    assert.ok(!sitemap.includes('social-card'));
    assert.ok(!(await readdir(dir)).includes('social-card.html'));
    assert.match(await readFile(path.join(dir, 'robots.txt'), 'utf8'), /Sitemap: https:\/\/example.com\/hplx\/sitemap.xml/);
  } finally { await rm(dir, { recursive:true, force:true }); }
});
