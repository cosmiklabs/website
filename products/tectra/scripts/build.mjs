import { mkdir, rm, cp, writeFile, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const site=path.join(root,'site');
// The vendored brand-tectra files the page uses, copied at the same relative
// paths so the HTML and CSS references work in site/ as in the repository.
// Licence and font notices travel with the files they cover.
export const vendored=[
 'vendor/brand-tectra/LICENSE.md',
 'vendor/brand-tectra/tokens/tectra.css',
 'vendor/brand-tectra/assets/tectra-latch-dark.svg',
 'vendor/brand-tectra/assets/tectra-lockup-dark.svg',
 'vendor/brand-tectra/vendor/brand/LICENSE.md',
 'vendor/brand-tectra/vendor/brand/kits/cosmik/tokens/cosmik.css',
 'vendor/brand-tectra/vendor/brand/kits/cosmik/components/controls.css',
 'vendor/brand-tectra/vendor/brand/fonts/web/Inter-Regular.woff2',
 'vendor/brand-tectra/vendor/brand/fonts/web/Inter-Medium.woff2',
 'vendor/brand-tectra/vendor/brand/fonts/web/Inter-SemiBold.woff2',
 'vendor/brand-tectra/vendor/brand/fonts/web/IBMPlexMono-Regular.woff2',
 'vendor/brand-tectra/vendor/brand/fonts/licenses/Inter-OFL.txt',
 'vendor/brand-tectra/vendor/brand/fonts/licenses/IBM-Plex-OFL.txt',
];
const escape=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function publicBase(value) {
 if (!value) return null;
 const url=new URL(value);
 if(url.protocol!=='https:' || url.username || url.password || url.search || url.hash) throw new Error('SITE_URL must be an HTTPS URL without credentials, query or fragment.');
 if(!url.pathname.endsWith('/'))url.pathname+='/';
 return url;
}
export function companyBase(value='https://cosmiklabs.org/') {
 const url=new URL(value);
 if(url.username || url.password || url.search || url.hash || (url.protocol!=='https:' && !(url.protocol==='http:' && ['localhost','127.0.0.1'].includes(url.hostname))))throw new Error('COSMIK_URL must be HTTPS or a localhost preview.');
 if(!url.pathname.endsWith('/'))url.pathname+='/';
 return url.href;
}
export function pageMetadata(html,filename,base) {
 const title=html.match(/<title>(.*?)<\/title>/)?.[1]??'Tectra';
 const description=html.match(/<meta name="description" content="([^"]+)">/)?.[1]??'';
 const common=`<meta property="og:type" content="website"><meta property="og:site_name" content="Tectra"><meta property="og:title" content="${title}"><meta property="og:description" content="${description}"><meta name="twitter:card" content="summary_large_image">`;
 if(!base||filename==='404.html')return `<meta name="robots" content="noindex,nofollow">${common}`;
 const url=new URL(filename==='index.html'?'':filename,base);
 const image=new URL('assets/social-card.jpg',base);
 return `${common}<link rel="canonical" href="${escape(url.href)}"><meta property="og:url" content="${escape(url.href)}"><meta property="og:image" content="${escape(image.href)}"><meta property="og:image:type" content="image/jpeg"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="Tectra: 3D structures, directed by you. In development. By Cosmik.">`;
}
export async function build({ destination = site, siteUrl = process.env.SITE_URL, mount, cosmikUrl = process.env.COSMIK_URL } = {}) {
 const base=publicBase(siteUrl);
 const company=companyBase(cosmikUrl);
 if(base && new URL(company).protocol!=='https:')throw new Error('A production build cannot link to a localhost organization preview.');
 await rm(destination,{recursive:true,force:true});await mkdir(destination,{recursive:true});
 for(const filename of ['index.html','privacy.html','404.html']){
  const source=await readFile(path.join(root,'src',filename),'utf8');
  const html=source.replace('<!-- SITE_METADATA -->',pageMetadata(source,filename,base)).replaceAll('https://cosmiklabs.org/',escape(company)).replace('<base href="/">',`<base href="${escape(mount ?? base?.pathname ?? '/')}">`);
  await writeFile(path.join(destination,filename),html);
 }
 await cp(path.join(root,'assets'),path.join(destination,'assets'),{recursive:true});
 if(process.env.SOCIAL_PREVIEW==='1' && !base)await cp(path.join(root,'src/social-card.html'),path.join(destination,'social-card.html'));
 await writeFile(path.join(destination,'robots.txt'),base?`User-agent: *\nAllow: /\nSitemap: ${new URL('sitemap.xml',base).href}\n`:'User-agent: *\nDisallow: /\n');
 if(base)await writeFile(path.join(destination,'sitemap.xml'),`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${['','privacy.html'].map(file=>`<url><loc>${escape(new URL(file,base).href)}</loc></url>`).join('')}</urlset>`);
 await writeFile(path.join(destination,'.nojekyll'),'');
 console.log(`Built ${base?'production metadata':'noindex review preview'} in site/. No deployment performed.`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) await build();
