import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,stat} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {publicBase,companyBase,pageMetadata} from '../scripts/build.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const site=path.resolve(root,'../../site/tectra');
const html=await readFile(path.join(site,'index.html'),'utf8');
const privacy=await readFile(path.join(site,'privacy.html'),'utf8');
const notFound=await readFile(path.join(site,'404.html'),'utf8');
const css=await readFile(path.join(root,'assets/site.css'),'utf8');
const script=await readFile(path.join(root,'assets/motion.mjs'),'utf8');
test('product identity and available next steps are explicit',()=>{
 assert.match(html,/data-family="tectra" data-theme="dark"/);
 assert.match(html,/Create structures for worlds/);assert.match(html,/real or imagined/);
 assert.match(html,/Describe the space\.<br> Shape what comes next\./);
 assert.match(html,/Public access is not available yet/);
 assert.match(html,/mailto:hello@cosmiklabs.org\?subject=About%20Tectra/);
 assert.doesNotMatch(html,/href="[^"]*(?:sign-in|register|platform.tectra.app)/);
});
test('all page links, assets and fragments resolve',async()=>{
 for(const [file,content]of [['index.html',html],['privacy.html',privacy],['404.html',notFound]]) {
  for(const [,href]of content.matchAll(/(?:href|src|poster)="([^"]+)"/g)){
   if(/^(?:https?:|mailto:)/.test(href)||href==='/tectra/')continue;
   let [name,id]=href.split('#');
   if (file==='404.html' && !name && id==='main') continue;
   name=name==='./'?'index.html':name||file;
   if(name.endsWith('/'))name+='index.html';
   assert.ok((await stat(path.join(site,name))).isFile(),href);
   if(id)assert.ok((await readFile(path.join(site,name),'utf8')).includes('id="'+id+'"'),href);
  }
 }
 for(const [,font]of css.matchAll(/url\('([^']+)'\)/g))assert.ok((await stat(path.join(site,'assets',font))).size>0,font);
});
test('no fabricated launch, performance or availability promises',()=>{
 assert.doesNotMatch(html,/checks that it works|never have to model|exactly as it was|coming soon|free trial|trusted by|100x|MCP|WGSL|\$\d/i);
 assert.match(html,/no launch date or price has been announced/);
 assert.match(html,/not a certification of real-world safety/);
 assert.match(html,/In-app reimport is not available yet/);
});
test('video is real product geometry, labeled illustrative and user initiated',()=>{
 assert.match(html,/Geometry prepared by Tectra/);
 assert.match(html,/Illustrative revision sequence, not a live authoring session/);
 assert.match(html,/<video controls playsinline preload="none"/);
 assert.doesNotMatch(html,/<video[^>]*(autoplay|loop)/);
 assert.match(html,/aria-describedby="demo-transcript"/);
 assert.match(html,/No audio/);
 for(const request of ['Begin with a cottage','Make the door wider','Add a second chimney','Raise the roof pitch'])assert.ok(html.includes(request));
});
test('navigation and native disclosure affordances form a complete journey',()=>{
 for(const id of ['product','workflow','output','questions','contact'])assert.ok(html.includes('id="'+id+'"'));
 assert.equal((html.match(/<details>/g)||[]).length,6);
 assert.equal((html.match(/<summary class="c-focus-ring">/g)||[]).length,6);
 assert.match(html,/By <a class="c-link" href="(?:https:\/\/cosmiklabs.org\/|http:\/\/(?:localhost|127.0.0.1):\d+\/)">Cosmik/);
});
test('all interactive links use shared controls and custom summaries use shared focus',()=>{
 for(const [a] of (html+privacy).matchAll(/<a\b[^>]*>/g))assert.match(a,/class="[^"]*\bc-(button|link|focus-ring)\b/,a);
 assert.doesNotMatch(css,/--c-status-(bg|border)|var\(--c-action-primary-hover\)/);
 assert.doesNotMatch(css,/\.status\b[^{]*\{[^}]*(font|border|padding|background|color)/);
});
test('landmarks, accessible media and IDs are valid on both pages',()=>{
 for(const content of [html,privacy,notFound]){
  assert.equal((content.match(/<h1\b/g)||[]).length,1);assert.match(content,/<main id="main"/);
  assert.match(content,/href="#main">Skip to content/);assert.match(content,/nav aria-label="Main navigation"/);
  const ids=[...content.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);assert.equal(ids.length,new Set(ids).size);
  for(const [img]of content.matchAll(/<img\b[^>]*>/g))assert.match(img,/alt="[^"]*"/);
 }
});
test('CSS uses available brand tokens and keeps narrow layout support',async()=>{
 const tokens=await readFile(path.join(site,'vendor/brand-tectra/vendor/brand/kits/cosmik/tokens/cosmik.css'),'utf8');
 const theme=await readFile(path.join(site,'vendor/brand-tectra/tokens/tectra.css'),'utf8');
 for(const [,token]of css.matchAll(/var\((--c-[\w-]+)\)/g))assert.ok((tokens+theme).includes(token+':'),token);
 assert.doesNotMatch(css,/#[0-9a-f]{3,8}\b/i);
 assert.match(css,/@media\(max-width:700px\)/);assert.match(css,/grid-template-columns:1fr/);
 assert.match(css,/min-height:88px/);assert.match(css,/width:48px;height:48px/);
});
test('motion preferences are progressive enhancement without tracking',()=>{
 assert.match(html,/aria-label="Motion preference"/);
 assert.match(script,/prefers-reduced-motion: reduce/);
 assert.doesNotMatch(script,/fetch\(|XMLHttpRequest|localStorage|cookie/);
 assert.doesNotMatch(css,/animation:[^;}]*infinite/);
 assert.match(privacy,/no accounts, forms, advertising or analytics scripts/);
});
test('review builds stay unindexed, publication requires explicit safe metadata',async()=>{
 if (!process.env.SITE_URL) assert.match(html,/noindex,nofollow/);
 if (!process.env.SITE_URL) assert.match(await readFile(path.join(site,'robots.txt'),'utf8'),/Disallow: \//);
 assert.equal(publicBase(),null);
 for(const bad of ['http://tectra.app','https://user:pass@tectra.app','https://tectra.app/?secret=x','https://tectra.app/#x'])assert.throws(()=>publicBase(bad));
 const prod=pageMetadata(html,'index.html',publicBase('https://tectra.app'));
 assert.match(prod,/canonical" href="https:\/\/tectra.app\/"/);
 assert.match(prod,/og:image" content="https:\/\/tectra.app\/assets\/social-card.jpg"/);
 assert.doesNotMatch(prod,/noindex/);
 assert.match(pageMetadata(privacy,'privacy.html',publicBase('https://tectra.app')),/canonical" href="https:\/\/tectra.app\/privacy.html"/);
 assert.equal(companyBase('http://127.0.0.1:4191'),'http://127.0.0.1:4191/');
 assert.throws(()=>companyBase('http://example.org/'));
 assert.match(notFound,/<base href="\/tectra\/">/);
 assert.doesNotMatch(pageMetadata(notFound,'404.html',publicBase('https://tectra.app')),/canonical/);
});
test('social image is a real JPEG matching its declared type',async()=>{
 const image=await readFile(path.join(site,'assets/social-card.jpg'));
 assert.equal(image.subarray(0,3).toString('hex'),'ffd8ff');
 assert.match(pageMetadata(html,'index.html',publicBase('https://tectra.app')),/og:image:type" content="image\/jpeg"/);
});
