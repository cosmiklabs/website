import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {productWebsite, shareMetadata, contact, about} from '../src/templates.mjs';
import {families} from '../src/projects.mjs';
test('standalone destinations are explicit and cannot leak local review URLs into publication',()=>{
 const family=families[0];
 assert.equal(productWebsite(family,{}),'');
 assert.equal(productWebsite(family,{HPLX_URL:'https://hplx.app'}),'https://hplx.app/');
 assert.equal(productWebsite(family,{HPLX_URL:'http://127.0.0.1:4193/'}),'http://127.0.0.1:4193/');
 for(const HPLX_URL of ['javascript:alert(1)','http://example.com','https://user:pass@example.com','https://hplx.app/#contact'])assert.throws(()=>productWebsite(family,{HPLX_URL}));
 assert.throws(()=>productWebsite(family,{HPLX_URL:'http://127.0.0.1:4193/',SITE_URL:'https://cosmiklabs.org/'}),/Published/);
});
test('product share previews carry the relevant product artwork',()=>{
 for(const id of ['hplx','tectra']){
  const html=shareMetadata({title:id,description:'Product',route:`projects/${id}`},'https://cosmiklabs.org/');
  assert.match(html,new RegExp(`assets/media/${id}-social-card.jpg`));
  assert.match(html,/summary_large_image/);assert.match(html,/image\/jpeg/);
 }
});
test('imported product media stays attributable and unchanged',async()=>{
 const provenance=JSON.parse(await readFile(new URL('../docs/media-provenance.json',import.meta.url),'utf8'));
 for(const [file,entry] of Object.entries(provenance.files)){
  assert.equal(createHash('sha256').update(await readFile(new URL(`../${file}`,import.meta.url))).digest('hex'),entry.sha256,file);
 }
});
test('company and contact describe actual authorship without inventing a team or signup',()=>{
 assert.match(about(),/Matthew Downs/);assert.match(about(),/independent software company/);
 assert.match(contact(),/mailto:hello@cosmiklabs.org/);assert.doesNotMatch(contact(),/<form|Join the waitlist|Subscribe now|24\/7/);
});
test('discovery files match the publication mode and omit retired redirects',async()=>{
 const robots=await readFile(new URL('../site/robots.txt',import.meta.url),'utf8');
 if(process.env.SITE_URL){
  assert.match(robots,/Allow: \/\nSitemap:/);
  const sitemap=await readFile(new URL('../site/sitemap.xml',import.meta.url),'utf8');
  assert.match(sitemap,/contact\//);assert.doesNotMatch(sitemap,/volsyn|amfp|404|social-card.html/);
 }else assert.match(robots,/Disallow: \//);
});
