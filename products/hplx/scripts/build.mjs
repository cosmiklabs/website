import { mkdir, rm, cp, writeFile, readFile, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const output = path.join(root, 'site');
const escape = value => String(value).replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));

export function checkedUrl(value, { publicOnly = false } = {}) {
  const url = new URL(value);
  const local = ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname);
  if ((url.protocol !== 'https:' && !(url.protocol === 'http:' && local && !publicOnly)) || url.username || url.password || url.search || url.hash) throw new Error('Site URLs must use HTTPS (or localhost HTTP for preview) without credentials, queries or fragments.');
  if (publicOnly && local) throw new Error('SITE_URL must be a public HTTPS URL.');
  if (!url.pathname.endsWith('/')) url.pathname += '/';
  return url.href;
}
export function metadata(title, description, route = '', siteUrl = process.env.SITE_URL) {
  const tags = [`<meta property="og:type" content="website">`, `<meta property="og:site_name" content="HPLX">`, `<meta property="og:title" content="${escape(title)}">`, `<meta property="og:description" content="${escape(description)}">`, '<meta name="twitter:card" content="summary_large_image">', '<meta name="theme-color" content="#F3EFE6">'];
  if (siteUrl) {
    const base = checkedUrl(siteUrl, { publicOnly: true });
    const url = new URL(route, base).href;
    tags.push(`<link rel="canonical" href="${escape(url)}">`, `<meta property="og:url" content="${escape(url)}">`, `<meta property="og:image" content="${escape(new URL('assets/media/social-card.jpg', base).href)}">`, '<meta property="og:image:type" content="image/jpeg">', '<meta property="og:image:width" content="1200">', '<meta property="og:image:height" content="630">', '<meta property="og:image:alt" content="HPLX. Build your story. Step inside it. An editor for Amnesia: The Dark Descent custom stories. In development.">');
  } else tags.push('<meta name="robots" content="noindex,nofollow">');
  return tags.join('\n');
}
const privacy = `<p>This notice covers this HPLX information website and messages you send about HPLX. It does not describe the original game or other websites linked here.</p>
<h2>Using this website</h2><p>The website includes no accounts, payment forms, advertising scripts or site-added analytics. It does not set cookies or use browser storage. Its fonts and images are served with the page, rather than requested from third-party font services.</p><p>When the site is hosted, its hosting and network providers necessarily receive request information to deliver it. Their own privacy information describes how they handle that technical data.</p>
<h2>Getting in touch</h2><p>Email links open your own email application. Sending a message to <a href="mailto:hello@cosmiklabs.org">hello@cosmiklabs.org</a> shares your email address and the information you include with Cosmik and the email services involved in delivery. The message is used to respond to your inquiry. Do not include passwords or other sensitive information in a general inquiry.</p><p>For a question about your information, contact <a href="mailto:legal@cosmiklabs.org">legal@cosmiklabs.org</a>.</p>
<h2>External destinations</h2><p>Cosmik’s website and the HPLX brand guide are separate destinations. Their own privacy information applies when you visit them. This site does not automatically subscribe you to updates.</p>`;
const legal = `<p>HPLX is developed by Matthew Downs through COSMIK LABS, LLC. This site introduces software in development and does not announce its public availability.</p>
<h2>Independent and unofficial</h2><p>HPLX is not affiliated with, sponsored by or endorsed by Frictional Games. <em>Amnesia</em> and <em>Amnesia: The Dark Descent</em> are trademarks of their respective owners. The original game’s content remains the property of its rights holders.</p>
<h2>Your game installation</h2><p>HPLX is designed to read original game content from your own legitimately obtained local PC installation. Original game maps, models, textures, audio, scripts and other content are not distributed by this website or bundled with HPLX.</p>
<h2>Software and artwork</h2><p>HPLX is intended to be open source under the GNU General Public License, version 3 or later. Its product source is not currently offered publicly. This does not grant a license to the original game content or HPLX brand artwork.</p><p>Brand artwork and the fonts used here retain their own terms. See the <a href="../vendor/brand-hplx/LICENSE.md">HPLX brand license</a>, <a href="../vendor/brand-hplx/vendor/brand/LICENSE.md">Cosmik foundation license</a>, and <a href="../vendor/brand-hplx/fonts/licenses/Spectral-OFL.txt">Spectral font notice</a>. The <a href="../vendor/brand-hplx/vendor/brand/fonts/licenses/Inter-OFL.txt">Inter</a> and <a href="../vendor/brand-hplx/vendor/brand/fonts/licenses/IBM-Plex-OFL.txt">IBM Plex</a> notices are also included.</p>
<h2>Questions</h2><p>For questions about licensing, attribution or material on this website, email <a href="mailto:legal@cosmiklabs.org?subject=HPLX%20website">legal@cosmiklabs.org</a>.</p>`;
function policyPage(title, text, description, siteUrl, cosmik) {
  const route = title.toLowerCase();
  return `<!doctype html><html lang="en" data-family="hplx" data-theme="light"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title} — HPLX</title><meta name="description" content="${escape(description)}">${metadata(`${title} — HPLX`, description, `${route}/`, siteUrl)}<link rel="icon" href="../vendor/brand-hplx/assets/hplx-glimmer-light.svg" type="image/svg+xml"><link rel="stylesheet" href="../vendor/brand-hplx/vendor/brand/kits/cosmik/tokens/cosmik.css"><link rel="stylesheet" href="../vendor/brand-hplx/tokens/hplx.css"><link rel="stylesheet" href="../assets/site.css"></head><body><a class="skip" href="#main">Skip to content</a><header class="site-header"><div class="wrap header-inner"><a class="identity" href="../" aria-label="HPLX home"><img src="../vendor/brand-hplx/assets/hplx-glimmer-light.svg" width="48" height="48" alt=""><span>HPLX</span></a><nav aria-label="Main navigation"><a href="../#product">Product</a><a href="../#workflow">How it works</a><a href="../#questions">Questions</a><a href="../#contact">Contact</a></nav></div></header><main id="main" class="wrap legal-page"><p class="eyebrow">HPLX / ${title}</p><h1>${title}.</h1>${text}</main><footer class="site-footer wrap"><div class="footer-top"><p>By <a href="${escape(cosmik)}">Cosmik</a>.</p><nav aria-label="Footer navigation"><a href="../">Back to HPLX</a><a href="../privacy/">Privacy</a><a href="../legal/">Legal</a><a href="../#contact">Contact</a></nav></div></footer></body></html>`;
}
export async function build({ siteUrl = process.env.SITE_URL, cosmikUrl = process.env.COSMIK_URL || 'https://cosmiklabs.org/', brandUrl = process.env.BRAND_URL || 'https://cosmiklabs.github.io/brand-hplx/', destination = output, socialPreview = process.env.SOCIAL_PREVIEW === '1' } = {}) {
  if (siteUrl) { checkedUrl(siteUrl, { publicOnly: true }); await stat(path.join(root, 'assets/media/social-card.jpg')); }
  const cosmik = checkedUrl(cosmikUrl), brand = checkedUrl(brandUrl);
  const template = await readFile(path.join(root, 'src/index.html'), 'utf8');
  const title = 'HPLX — Build and playtest Amnesia custom stories';
  const description = 'An editor for Amnesia: The Dark Descent custom stories, with playtesting built in. Build a room, step inside it, and keep creating. In development.';
  const html = template.replace('@@METADATA@@', metadata(title, description, '', siteUrl)).replace('@@STORY_PLAN@@', await readFile(path.join(root, 'assets/media/story-plan.svg'), 'utf8')).replaceAll('@@COSMIK_URL@@', escape(cosmik)).replaceAll('@@BRAND_URL@@', escape(brand));
  await rm(destination, { recursive:true, force:true }); await mkdir(destination, { recursive:true });
  await writeFile(path.join(destination, 'index.html'), html);
  for (const [name, text, description] of [['Privacy', privacy, 'Privacy information for the HPLX website and contact email.'], ['Legal', legal, 'HPLX ownership, independence, software licensing and game-content information.']]) {
    await mkdir(path.join(destination, name.toLowerCase()), { recursive:true });
    await writeFile(path.join(destination, name.toLowerCase(), 'index.html'), policyPage(name, text, description, siteUrl, cosmik));
  }
  await cp(path.join(root, 'assets'), path.join(destination, 'assets'), { recursive:true });
  await writeFile(path.join(destination, '.nojekyll'), '');
  const base = siteUrl ? checkedUrl(siteUrl, { publicOnly:true }) : null;
  await writeFile(path.join(destination, 'robots.txt'), base ? `User-agent: *\nAllow: /\nDisallow: /social-card.html\nSitemap: ${new URL('sitemap.xml', base).href}\n` : 'User-agent: *\nDisallow: /\n');
  if (base) await writeFile(path.join(destination, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${['','privacy/','legal/'].map(route => `<url><loc>${escape(new URL(route, base).href)}</loc></url>`).join('')}</urlset>\n`);
  if (socialPreview && !base) await writeFile(path.join(destination, 'social-card.html'), await readFile(path.join(root, 'src/social-card.html')));
  await writeFile(path.join(destination, '404.html'), `<!doctype html><html lang="en" data-family="hplx" data-theme="light"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Page not found — HPLX</title><style>body{margin:0;background:#F3EFE6;color:#1A1714;font:18px/1.6 system-ui}main{max-width:640px;margin:15vh auto;padding:24px}h1{font-size:48px;line-height:1.1}a{color:inherit;text-underline-offset:.2em}</style></head><body><main><p>HPLX</p><h1>That page isn’t here.</h1><p>You can find the product, development status and contact information on the homepage.</p><a href="${escape(base || '/')}">Go to HPLX →</a></main></body></html>`);
  console.log(`Built HPLX ${base ? `public output for ${base}` : 'local noindex preview'}; no deployment performed.`);
}
if (process.argv[1] === fileURLToPath(import.meta.url)) await build();
