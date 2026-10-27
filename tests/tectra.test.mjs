import test from 'node:test';
import assert from 'node:assert/strict';
import { families, featuredWork } from '../src/projects.mjs';
import { home, catalog, familyPage } from '../src/templates.mjs';

test('Tectra has a restrained listing and minimal development page', () => {
  const tectra = families.find(family => family.id === 'tectra');
  assert.equal(tectra.description, 'Bring an idea and develop it with Tectra’s AI. Shape a structure through connected parts, relationships and rules it can check as the design evolves.');
  assert.equal(tectra.status, 'In development');
  assert.equal(featuredWork.familyId, 'tectra');
  for (const html of [home(), catalog()]) {
    assert.match(html, /href="(?:\.\/|\.\.\/)?projects\/tectra\/"/);
    assert.match(html, /Design and refine 3D structures with AI assistance\./);
  }
  const html = familyPage(tectra);
  assert.match(html, /<h1>Tectra<\/h1>/);
  assert.match(html, /Create structures for<br> ?worlds real or imagined\./);
  assert.match(html, /Describe the space\. Shape what comes next\./);
  assert.match(html, /connected parts, relationships and rules it can check as the design evolves/);
  assert.match(html, /In development/);
  assert.doesNotMatch(html, /data-family=|assets\/families\//); // Cosmik's own brand, no product kit; the logo is plain artwork.
  const main = html.match(/<main[\s\S]*?<\/main>/)[0];
  assert.doesNotMatch(main, /agent|pipeline|MCP|SaaS|pricing|signup|beta|roadmap|Tecton|HPLX|Frictional/i);
});


test('Tectra identity removes inherited heading margin and loads its current stylesheet', async () => {
 const {readFile}=await import('node:fs/promises');
 const css=await readFile(new URL('../assets/site.css',import.meta.url),'utf8');
 assert.match(css,/\.family-heading \.family-identity h1\{margin:0\}/);
 const html=familyPage(families.find(f=>f.id==='tectra'));
 assert.match(html,/site\.css\?v=[a-f0-9]{12}/);
 assert.match(html,/<div class="family-identity"><img class="family-logo" src="\.\.\/\.\.\/assets\/projects\/tectra-latch-dark\.svg"[^>]+><h1>Tectra<\/h1><p class="endorsement">/);
});


test('deprecated Volsyn address redirects to Tectra without obsolete product content', async () => {
 const { legacyRoutes } = await import('../src/projects.mjs');
 const { legacyPage } = await import('../src/templates.mjs');
 const route=legacyRoutes.find(r=>r.id==='volsyn');
 assert.equal(route.familyId,'tectra');
 const html=legacyPage(route);
 assert.match(html,/http-equiv="refresh" content="0; url=..\/..\/projects\/tectra\/"/);
 assert.match(html,/href="..\/..\/projects\/tectra\/"/);
 assert.doesNotMatch(html,/Volsyn|Part of HPLX|#undefined/);
 if(process.env.SITE_URL) assert.ok(html.includes(`rel="canonical" href="${new URL('projects/tectra/', process.env.SITE_URL.endsWith('/') ? process.env.SITE_URL : process.env.SITE_URL+'/')}"`));
 for(const page of [home(),catalog(),familyPage(families.find(f=>f.id==='tectra'))]) assert.doesNotMatch(page,/volsyn/i);
});



test('the organization homepage features Tectra first without hiding HPLX or overstating availability', () => {
  const html = home();
  assert.match(html, /Software for<br> <span>structures and stories/);
  assert.doesNotMatch(html, /Independent software studio|Reimagine, extend, create/);
  assert.match(html, /id="tectra-title"/);
  const rows = [...html.matchAll(/<h3 id="([^"]+)-title">/g)].map(match => match[1]);
  assert.deepEqual(rows, ['tectra', 'hplx']);
  const hplx = familyPage(families.find(project => project.id === 'hplx'));
  assert.match(hplx, /intended to be open source/);
  assert.match(hplx, /product repositories are not public yet/);
  const tectra = familyPage(families.find(project => project.id === 'tectra'));
  assert.doesNotMatch(tectra, /pricing|chapel|subscription|launch date|better than/i);
});
