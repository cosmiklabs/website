// Product logos are plain artwork on this site: its own assets, copied byte for byte
// from the product brand releases in brand-provenance.json, never vendored kits.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { provenance } from '../src/brand.mjs';
import { families } from '../src/projects.mjs';
import { home, catalog, about, notFound, familyPage } from '../src/templates.mjs';

const read = path => readFileSync(new URL(`../${path}`, import.meta.url));
const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');
// Pinned here as well as in brand-provenance.json, so neither can drift silently.
const approved = {
  'assets/projects/tectra-latch-dark.svg': ['cosmiklabs/brand-tectra', 'v0.6.1', '7cd0e0eb53e3c92b2f141264401528dacadb7d6ab2698f506cdaf4e711c0cd67'],
  'assets/projects/tectra-latch-white.svg': ['cosmiklabs/brand-tectra', 'v0.6.1', '621a1ac71204c3a9f9fa76d7c164fcf71285b062e31d93dcd4e0a3155cdeb6f9'],
  'assets/projects/hplx-glimmer-dark.svg': ['cosmiklabs/brand-hplx', 'v0.2.0', '4e62f4c11e5e84ec17d7d0705aba472767596aede653f4211a4dfeca26b680d7'],
  'assets/projects/hplx-glimmer-white.svg': ['cosmiklabs/brand-hplx', 'v0.2.0', 'fd20079b4f735a8242438e095da14f4c981f25397c80343c776f9424606473b5'],
};

test('product logos are the approved release files, byte for byte, with recorded provenance', () => {
  const { files } = provenance.projectLogos;
  assert.deepEqual(Object.keys(files).sort(), Object.keys(approved).sort());
  assert.deepEqual(readdirSync(new URL('../assets/projects/', import.meta.url)).sort(), Object.keys(approved).map(p => p.split('/').pop()).sort());
  for (const [path, [repository, tag, hash]] of Object.entries(approved)) {
    const entry = files[path];
    assert.equal(entry.repository, repository, path);
    assert.equal(entry.tag, tag, path);
    assert.match(entry.commit, /^[0-9a-f]{40}$/, path);
    assert.equal(entry.source, `assets/${path.split('/').pop()}`, path);
    assert.equal(entry.sha256, hash, path);
    assert.equal(sha256(read(path)), hash, `${path} differs from ${repository} ${tag}`);
    const svg = read(path).toString('utf8');
    assert.match(svg, /viewBox="0 0 64 64"/);
    assert.equal((svg.match(/<path /g) || []).length, 2);
    assert.doesNotMatch(svg, /<image|<filter|<script|href=/);
  }
  assert.deepEqual(readdirSync(new URL('../vendor/', import.meta.url)), ['brand']); // Logos are site assets, not vendored kits.
});

test('each logo sits beside its live name: listing rows use the monochrome variant, headings the approved on-dark colour', () => {
  for (const family of families) {
    assert.ok(family.logo, family.id);
    for (const html of [home(), catalog()]) assert.match(html, new RegExp(`<span class="family-row-name"><img class="family-row-symbol" src="(?:\\./|\\.\\./)${family.logo.listing}" width="32" height="32" alt="">${family.name}</span>`));
    const page = familyPage(family);
    assert.match(page, new RegExp(`<div class="family-identity"><img class="family-logo" src="\\.\\./\\.\\./${family.logo.heading}" width="64" height="64" alt=""><h1>${family.name}</h1>`));
    assert.equal(page.split(family.logo.heading).length - 1, 1);
    assert.doesNotMatch(page.replace(/<main[\s\S]*?<\/main>/, ''), /assets\/projects\//); // Header and footer stay Cosmik.
  }
  for (const html of [about(), notFound()]) assert.doesNotMatch(html, /assets\/projects\//);
});
