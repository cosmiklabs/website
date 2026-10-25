import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {readdirSync} from 'node:fs';
import {provenance,lockFor} from '../src/brand.mjs';
import {assetBytes} from '../src/assets.mjs';
import {families} from '../src/projects.mjs';
import {home,catalog,about,notFound,familyPage} from '../src/templates.mjs';
const read=p=>readFile(new URL(`../${p}`,import.meta.url),'utf8');
const cwd=fileURLToPath(new URL('..',import.meta.url));
const verify=(tool,dir)=>spawnSync(process.execPath,[tool,'verify',dir],{cwd,encoding:'utf8'});

test('the vendored Cosmik brand verifies with its own vendored tool',()=>{
 const run=verify('vendor/brand/scripts/vendor.mjs','vendor/brand');
 assert.equal(run.status,0,`vendor/brand: ${run.stderr}${run.stdout}`);
 assert.match(run.stdout,/vendor\/brand matches cosmiklabs\/brand v\d+\.\d+\.\d+/);
 assert.deepEqual(provenance.locks,{brand:'vendor/brand/brand.lock.json'});
 assert.equal(JSON.parse(readFileSync(new URL('../vendor/brand/brand.lock.json',import.meta.url))).repository,'cosmiklabs/brand');
});

test('the website vendors and publishes only the Cosmik brand, no product family kits',()=>{
 assert.deepEqual(readdirSync(new URL('../vendor/',import.meta.url)),['brand']);
 for(const {from} of Object.values(provenance.published))assert.match(from,/^vendor\/brand\//);
 for(const html of [home(),catalog(),about(),notFound(),...families.map(familyPage)]){
  assert.doesNotMatch(html,/data-family=|assets\/families\/|family-themes\.css|brand-(?:tectra|hplx)/);
 }
});

test('every published brand file comes from the lock, unchanged',()=>{
 const sha=b=>createHash('sha256').update(b).digest('hex');
 for(const [target,{from,derive}] of Object.entries(provenance.published)){
  const {lock,file}=lockFor(from);
  const vendored=readFileSync(new URL(`../${from}`,import.meta.url));
  assert.equal(sha(vendored),lock.files[file],`${from} differs from ${lock.repository} ${lock.tag}`);
  assert.equal(derive,undefined,target);
  assert.ok(assetBytes(target).equals(vendored),target);
 }
 for(const [target,{sha256}] of Object.entries(provenance.outsideDistribution.files))assert.equal(sha(readFileSync(new URL(`../${target}`,import.meta.url))),sha256,target);
});

test('pages load the baseline once, then the controls and site CSS, in order',async()=>{
 const pages=[home(),catalog(),about(),notFound(),...families.map(familyPage)];
 for(const html of pages){
  const sheets=[...html.matchAll(/<link rel="stylesheet" href="(?:\.\.\/|\.\/|\/)*([^"?]+)\?v=/g)].map(m=>m[1]);
  assert.deepEqual(sheets,['assets/brand/cosmik.css','assets/brand/controls.css','assets/site.css']);
  assert.doesNotMatch(html,/vendor\//);
 }
});

test('effective motion preserves system, reduce and full scope policy without global overrides',async()=>{
 const tokens=assetBytes('assets/brand/cosmik.css').toString('utf8'),css=await read('assets/site.css'),controls=assetBytes('assets/brand/controls.css').toString('utf8');
 assert.match(tokens,/:root \{ --c-motion-system-duration: var\(--c-motion-reduced-duration\); \}/);
 for(const [mode,token] of [['system','system'],['reduce','reduced'],['full','normal']])assert.ok(tokens.includes(`[data-motion="${mode}"] { --c-motion-duration: var(--c-motion-${token}-duration); }`));
 assert.doesNotMatch(css,/transition-duration:.*!important|animation-duration:.*!important/);
 assert.match(controls,/transition-duration: var\(--c-motion-duration\);/); // Buttons and links animate through the shared controls.
 assert.doesNotMatch(css,/transition:background-color/);
 assert.match(css,/scroll-behavior:auto/);
});
test('optional preference control handles repeated choices, defaults safely and makes no storage writes',async()=>{
 const script=await read('assets/preferences.mjs');let handler;const selected=[];
 const select={value:'system',addEventListener:(event,fn)=>{assert.equal(event,'change');handler=fn;}};
 const control={hidden:true,querySelector:()=>select};
 vm.runInNewContext(script,{document:{querySelector:()=>control,documentElement:{setAttribute:(k,v)=>{assert.equal(k,'data-motion');selected.push(v);}}}});
 assert.equal(control.hidden,false);
 for(const value of ['reduce','full','system','full','invalid']){select.value=value;handler();}
 assert.deepEqual(selected,['reduce','full','system','full','system']);
 assert.doesNotMatch(script,/localStorage|sessionStorage|fetch\(|cookie/);
 vm.runInNewContext(script,{document:{querySelector:()=>null}});
});
