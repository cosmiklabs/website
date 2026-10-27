import { assetUrl } from './assets.mjs';
import { retailGames } from './retail-links.mjs';
import { legalCopy } from './legal-copy.mjs';
import { families, featuredWork, pillars } from './projects.mjs';
export const escape = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const arrow = '<svg class="arrow" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6"/></svg>';
const external = '<svg class="arrow" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M6 18 18 6M6 6h12v12"/></svg>';
const label = text => `<p class="eyebrow">${escape(text)}</p>`;
const status = (text, dense = false) => `<span class="status c-status${dense ? ' c-status--dense' : ''}">${escape(text)}</span>`;
const pillarName = id => pillars.find(p => p.id === id)?.name ?? '';
const familyUrl = (root, family) => `${root}projects/${family.id}/`;

/** Public URL is explicit at build time; private previews retain noindex. */
export function shareMetadata({title, description, route, redirect, canonical = true}, siteUrl = process.env.SITE_URL) {
  let urls = '';
  if (siteUrl) {
    const base = new URL(siteUrl);
    if (base.protocol !== 'https:' || base.username || base.password || base.search || base.hash)
      throw new Error('SITE_URL must be an HTTPS base URL without credentials, query or fragment.');
    if (!base.pathname.endsWith('/')) base.pathname += '/';
    const page = new URL(redirect ? redirect.split('#')[0] : route ? `${route}/` : '', base);
    if (canonical) urls += `<link rel="canonical" href="${escape(page.href)}"><meta property="og:url" content="${escape(page.href)}">`;
    urls += `<meta property="og:image" content="${escape(new URL(route === 'projects/hplx' ? 'assets/media/hplx-social-card.jpg' : route === 'projects/tectra' ? 'assets/media/tectra-social-card.jpg' : 'assets/social-card.jpg', base).href)}"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:type" content="image/jpeg"><meta property="og:image:alt" content="${escape(route === 'projects/hplx' ? 'HPLX: build your story, step inside it' : route === 'projects/tectra' ? 'Tectra: 3D structures, directed by you' : 'Cosmik: software for structures and stories')}">`;
  }
  return `<meta property="og:type" content="website"><meta property="og:site_name" content="Cosmik"><meta property="og:title" content="${escape(title)}"><meta property="og:description" content="${escape(description)}"><meta name="twitter:card" content="summary_large_image"><meta name="theme-color" content="#000000">${urls}`;
}

/**
 * Brand load order: the Cosmik baseline, the shared controls, then this site's
 * CSS. Every page, project pages included, stays in Cosmik's own brand; product
 * family kits are not loaded.
 */
export function stylesheets() {
  return ['assets/brand/cosmik.css', 'assets/brand/controls.css', 'assets/site.css'];
}

export function shell({ title, description, route, body, current = '', rootOverride = null, redirect = null, canonical = true }) {
  const depth = route.split('/').filter(Boolean).length;
  const root = rootOverride ?? (depth ? '../'.repeat(depth) : './');
  const url = path => root + path;
  return `<!doctype html>
<html lang="en" data-theme="dark" data-motion="system">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escape(title)}</title><meta name="description" content="${escape(description)}">
${shareMetadata({title, description, route, redirect, canonical})}
${process.env.SITE_URL ? '' : '<meta name="robots" content="noindex, nofollow">'}<meta name="color-scheme" content="dark">
${redirect ? `<meta http-equiv="refresh" content="0; url=${escape(url(redirect))}">` : ''}
<link rel="icon" href="${url('assets/cosmik.ico')}" sizes="any">
<link rel="apple-touch-icon" href="${url('assets/cosmik-apple-touch-180.png')}">
<link rel="preload" href="${url('assets/fonts/Inter-Regular.woff2')}" as="font" type="font/woff2" crossorigin>
${stylesheets().map(path => `<link rel="stylesheet" href="${assetUrl(root, path)}">`).join('')}
</head>
<body>
<a class="skip-link" href="#main">Skip to content</a>
<header class="site-header wrap">
<a class="brand" href="${url('')}" aria-label="Cosmik home"><span class="brand-mark"><img src="${url('assets/emblem.svg')}" width="48" height="48" alt=""></span><span>Cosmik</span></a>
<nav aria-label="Main navigation"><a href="${url('projects/')}"${current === 'projects' ? ' aria-current="page"' : current === 'family' ? ' aria-current="location"' : ''}>Projects</a><a href="${url('about/')}"${current === 'about' ? ' aria-current="page"' : ''}>About</a><a href="${url('contact/')}"${current === 'contact' ? ' aria-current="page"' : ''}>Contact</a></nav>
</header>
<main id="main" tabindex="-1">${body(root)}</main>
<footer class="site-footer wrap"><div class="footer-identity"><img src="${url('assets/cosmik-lockup-offwhite.svg')}" width="2172" height="724" alt="Cosmik"><p>Independent software. Made with care.</p></div><div class="footer-links"><a href="${url('about/')}">About</a><a href="${url('contact/')}">Contact</a><a href="https://cosmiklabs.github.io/brand/">Brand guide ${external}</a><a href="https://github.com/cosmiklabs">GitHub ${external}</a><a href="${url('privacy/')}">Privacy</a><a href="${url('legal/')}">Legal &amp; Licenses</a></div><label class="motion-preference" hidden>Motion <span class="c-select c-select--dense"><select aria-label="Motion preference"><option value="system">System</option><option value="reduce">Reduce</option><option value="full">Full</option></select></span></label><p class="ownership">© 2026 COSMIK LABS, LLC</p></footer>
<script type="module" src="${assetUrl(root, 'assets/preferences.mjs')}"></script>
</body></html>`;
}

export function familyList(root, catalog = families) {
  return `<ul class="family-list">${catalog.map(family => `<li><a class="family-row" href="${familyUrl(root, family)}"><span class="family-row-name">${family.logo ? `<img class="family-row-symbol" src="${root}${family.logo.listing}" width="32" height="32" alt="">` : ''}${escape(family.name)}</span><span class="family-row-summary">${escape(family.scope)}<span>${escape(family.summary)}</span></span><span class="family-row-end"><span class="family-row-tags"><span class="eyebrow">${escape(pillarName(family.pillar))}</span>${status(family.status, true)}</span>${arrow}</span></a></li>`).join('')}</ul>`;
}

/** Independent destinations share an organization frame, with equal visibility. */
export function home(catalog = families, feature = featuredWork) {
  if (!catalog.some(family => family.id === feature.familyId)) throw new Error('Featured family not found.');
  const ordered = [catalog.find(f => f.id === feature.familyId), ...catalog.filter(f => f.id !== feature.familyId)];
  return shell({ title: 'Cosmik — Independent software for structures and stories', description: 'Independent software by Matthew Downs. Meet Tectra for creating 3D structures and HPLX for making Amnesia: The Dark Descent custom stories.', route: '', body: root => `
<section class="home-intro wrap" aria-labelledby="cosmik-title">
 ${label('Independent software by Matthew Downs')}
 <h1 id="cosmik-title">Software for<br> <span>structures and stories.</span></h1>
 <div class="intro-caption"><p>Different tools. A shared care for the things you make.</p><p>Shape a 3D structure with Tectra. Build and playtest a custom story with HPLX. Explore two projects in development at Cosmik.</p></div>
 <a class="text-link" href="#projects">Meet the projects ${arrow}</a>
</section>
<section class="portfolio wrap" id="projects" aria-labelledby="families-title"><div class="section-heading"><h2 id="families-title">Tectra &amp; HPLX</h2><span class="eyebrow">Two projects in development</span></div>
<div class="showcase-grid">${ordered.map(f => productShowcase(root, f)).join('')}</div>
</section>
<section class="about-band" data-theme="light"><div class="wrap section-grid"><div>${label('The person behind the work')}<h2>Independent by design.<br> Personal in practice.</h2></div><div><p class="about-lead">Cosmik is an independent software company run by Matthew Downs.</p><p>Each product has its own purpose and identity. The connection is the way it is made: clear tools, considered details, and room for the person using it to decide what comes next.</p><a class="text-link" href="${root}about/">About Cosmik ${arrow}</a></div></div></section>
${contactBand(root)}
` });
}

function productShowcase(root, family) {
 const tectra = family.id === 'tectra';
 return `<article class="product-showcase" aria-labelledby="${escape(family.id)}-title">${tectra ? `<figure class="showcase-art showcase-proof"><img src="${root}assets/media/tectra-revision.png" width="1200" height="900" alt="A cottage structure with a wide front door and two chimneys, prepared with Tectra." loading="lazy"><figcaption>Tectra geometry · illustrative revision</figcaption></figure>` : `<figure class="showcase-art showcase-proof"><img class="diagram" src="${root}assets/media/hplx-story-plan.svg" alt="Illustrative room plan with a light, script area and player route." width="920" height="560" loading="lazy"><figcaption>HPLX workflow illustration · not an app screenshot</figcaption></figure>`}<div class="showcase-copy">${label(pillarName(family.pillar))}<h3 id="${escape(family.id)}-title">${escape(family.name)}</h3><p class="showcase-heading">${family.heading.map(escape).join(' ')}</p><p>${escape(family.summary)}</p><p class="showcase-detail">${tectra ? 'Develop connected parts, review proposed changes, and take an accepted design into your own tools.' : 'Place the scene, play from where you are looking, then return to the editor and keep building.'}</p><div class="showcase-actions"><a class="c-button c-button--primary button" href="${familyUrl(root,family)}">Explore ${escape(family.name)} ${arrow}</a>${status(family.status)}</div></div></article>`;
}

function contactBand(root) {
 return `<section class="contact-band wrap"><div>${label('A conversation starts here')}<h2>What are you making?</h2><p>Questions about a project, ideas from your own workflow, or something you would like to share are welcome.</p></div><a class="text-link" href="${root}contact/">Get in touch ${arrow}</a></section>`;
}

/** Enable standalone links only once their destinations are available, or for local review. */
export function productWebsite(family, env = process.env) {
 const value = env[`${family.id.toUpperCase()}_URL`];
 if (!value) return '';
 const url = new URL(value);
 if (url.username || url.password || url.search || url.hash || !(url.protocol === 'https:' || (url.protocol === 'http:' && ['localhost','127.0.0.1'].includes(url.hostname)))) throw new Error('Product URLs must use HTTPS, or loopback HTTP for local review.');
 if (env.SITE_URL && url.protocol !== 'https:') throw new Error('Published pages cannot link to local product previews.');
 return url.href;
}

function productAction(family) {
 const destination = productWebsite(family);
 return destination ? `<a class="c-button c-button--primary button" href="${escape(destination)}">Visit ${escape(family.name)} ${external}</a>` : `<a class="c-button c-button--primary button" href="mailto:hello@cosmiklabs.org?subject=${encodeURIComponent(family.name + ' — a question')}">Talk about ${escape(family.name)} ${arrow}</a>`;
}

export function catalog(catalog = families) {
  return shell({ title: 'Projects — Cosmik', description: 'Explore Tectra for creating 3D structures and HPLX for creating custom stories for the original Amnesia: The Dark Descent.', route: 'projects', current: 'projects', body: root => `
<section class="page-heading wrap">${label('Projects')}<h1>Tectra &amp; HPLX.</h1><p>Two projects, each with a different way to create. Explore what they do and where development stands.</p></section>
<section class="family-section directory-section wrap" aria-labelledby="families-title"><h2 class="section-label" id="families-title">Projects</h2>${familyList(root, catalog)}</section>
<section class="directory-note wrap"><p>Tectra and HPLX are in development. Their project pages explain the direction of each project and where it stands.</p></section>` });
}

export function retailLinks(id) {
  const game = retailGames[id];
  if (!game) return '';
  return `<p class="retail-links"><strong>${escape(game.label)}:</strong> ${game.stores.map(store => `<a class="c-link" href="${escape(store.url)}" aria-label="${escape(game.name)} on ${escape(store.name)}">${escape(store.name)}</a>`).join(' · ')}</p>`;
}

/** Every family uses this shell; only its content sections are optional. */
export function familyPage(family) {
  return shell({ title: `${family.name} — Cosmik`, description: family.description, route: `projects/${family.id}`, current: 'family', body: root => `
<div class="wrap"><nav class="breadcrumbs" aria-label="Breadcrumb"><a href="${root}projects/">Projects</a><span aria-hidden="true">/</span><span aria-current="page">${escape(family.name)}</span></nav>
${familyHeading(family, root)}</div>
${family.id === 'hplx' ? hplxSections(family, root) : family.id === 'tectra' ? tectraSections() : ''}
<div class="family-bottom wrap"><a class="text-link" href="${root}projects/">${arrow} All projects</a>${family.legalNote ? `<p class="legal-note">${escape(family.legalNote)}</p>` : ''}</div>` });
}

/** The product logo as plain artwork beside the live name, with the Cosmik endorsement below; type and colours stay Cosmik's. */
export function familyHeading(family, root) {
  return `<header class="family-heading"><div>${label(`${pillarName(family.pillar)} · The ${family.name} project`)}<div class="family-identity">${family.logo ? `<img class="family-logo" src="${root}${family.logo.heading}" width="64" height="64" alt="">` : '<span class="family-logo" aria-hidden="true"></span>'}<h1>${escape(family.name)}</h1><p class="endorsement">A Cosmik project</p></div></div><div class="family-introduction"><h2>${family.heading.map(escape).join('<br> ')}</h2><p>${escape(family.description)}</p>${family.slogan ? `<p>${escape(family.slogan)}</p>` : ''}${status(family.status)}<div>${productAction(family)}</div></div></header>`;
}

function hplxSections(family, root) {
 return `<div class="wrap">

<nav class="family-nav" aria-label="On this page"><a href="#make">The editor</a><a href="#game">Built-in playtesting</a><a href="#development">Development</a></nav></div>
<section class="family-games" data-theme="light" id="make" aria-labelledby="make-title"><div class="wrap section-grid"><div>${label('01 / The editor')}<h2 id="make-title">Build it.<br> Playtest it.<br> Keep creating.</h2></div><div>${family.tools.filter(tool => tool.progress).map(tool => `<article class="game-detail" id="${escape(tool.id)}">${status(tool.status)}<h3>${escape(tool.name)}</h3><p>${escape(tool.description)}</p><details><summary>Where it stands ${arrow}</summary><div class="disclosure-body"><p>${escape(tool.progress)}</p></div></details></article>`).join('')}</div></div></section>
<section class="family-tools wrap section-grid" id="game" aria-labelledby="game-title"><div>${label('02 / Built-in playtesting')}<h2 id="game-title">The Dark Descent,<br> underneath.</h2></div><div>${family.games.map(game => `<article class="game-detail" id="${escape(game.id)}">${status(game.status)}<h3>${escape(game.name)}</h3><p>${escape(game.description)}</p>${retailLinks(game.id)}</article>`).join('')}<div class="tool-list">${family.tools.filter(tool => !tool.progress).map(tool => `<article class="tool-row" id="${escape(tool.id)}"><div class="tool-title"><h3>${escape(tool.name)}</h3>${status(tool.status)}</div><p>${escape(tool.description)}</p></article>`).join('')}</div></div></section>
<div class="wrap"><section class="family-tools section-grid" aria-labelledby="requirements-title"><div>${label('Before you start')}<h2 id="requirements-title">Your game.<br> Your story.</h2></div><div class="legal-copy"><p>HPLX requires a legitimately obtained local retail installation of the original game. Original game assets are never bundled or distributed with HPLX.</p><p>Cosmik Labs does not, and never will, require payment to use HPLX. The original retail game is separate and may cost money.</p><p>The storefront links on this page are for the original PC game. HPLX needs local PC game files; a console copy does not provide them. Individual store builds have not all been tested with HPLX.</p><p>Cosmik Labs and HPLX are independent and unofficial. They are not affiliated with, sponsored by, or endorsed by <a class="c-link" href="https://frictionalgames.com/">Frictional Games</a>. The original engines, games, source code and assets remain the property of Frictional Games and their respective rights holders. <a class="c-link" href="${root}legal/">Read Legal &amp; Licenses</a>.</p></div></section></div>
<section class="family-development" data-theme="light" id="development" aria-labelledby="development-title"><div class="wrap section-grid"><div>${label('03 / Development')}<h2 id="development-title">Where things stand.</h2></div><div class="development-copy"><p class="development-lead">HPLX is in active development. There’s no public release or download yet.</p><p>The editor and its reimplementation are being developed together, entirely around creating custom stories for the original Amnesia: The Dark Descent. The focus is making that process easier and better.</p><p>HPLX is intended to be open source. Its product repositories are not public yet.</p><p>No release date has been announced.</p></div></div></section>
`;
}


export function about() {
 return shell({title:'About Cosmik — Independent software by Matthew Downs', description:'Meet Matthew Downs, the independent developer behind Cosmik, Tectra and HPLX.',route:'about',current:'about',body:root=>`
 <section class="page-heading wrap">${label('About Cosmik')}<h1>One maker.<br> Different ways to create.</h1><p>Cosmik is an independent software company run by Matthew Downs. It is the home of Tectra and HPLX.</p></section>
 <section class="about-content" data-theme="light"><div class="wrap section-grid"><div>${label('The work')}<h2>Make the idea.<br> Keep shaping it.</h2></div><div><p class="about-lead">A structure you can revise. A story you can play while you build it.</p><p>Tectra develops 3D structures through connected parts, AI-assisted revision and review. HPLX is an editor for Amnesia: The Dark Descent’s custom stories, with playtesting built in.</p><p>They serve different creators. Each has its own identity, with a shared attention to tools that explain themselves and leave decisions in your hands.</p><a class="text-link" href="${root}projects/">Meet the projects ${arrow}</a></div></div></section>
 <section class="wrap section-grid"><div>${label('Independent, and in development')}<h2>A person behind<br> the products.</h2></div><div><p>I’m Matthew, the developer behind Cosmik. I’m building Tectra and HPLX independently, and both are still in development.</p><p>If you make 3D structures or custom stories, I would like to hear how you work, what gets in your way, and what you want these tools to help you do.</p><a class="text-link" href="${root}contact/">Say hello ${arrow}</a><p class="signed-note">Matthew Downs · Founder and developer</p></div></section>
 <section class="wrap section-grid about-details"><div>${label('Clear boundaries')}<h2>Each product has<br> its own commitments.</h2></div><div><p>HPLX is intended to be open source and free to use; the original game is obtained separately. Tectra is proprietary software, with access and pricing still undecided.</p><p>Neither has a public release date. Current project descriptions distinguish working capabilities from what is still being developed.</p><a class="text-link" href="${root}legal/">Legal &amp; Licenses ${arrow}</a></div></section>`});
}

export function contact() {
 return shell({title:'Contact Cosmik',description:'Contact Matthew Downs about Cosmik, Tectra or HPLX. Questions, feedback and thoughtful introductions are welcome.',route:'contact',current:'contact',body:root=>`
 <section class="page-heading wrap">${label('Contact')}<h1>Let’s talk<br> about what you’re making.</h1><p>Reach Matthew directly with a question, feedback from your workflow, or a press inquiry.</p><a class="c-button c-button--primary button" href="mailto:hello@cosmiklabs.org">hello@cosmiklabs.org ${arrow}</a></section>
 <section class="contact-options wrap" aria-label="Choose a topic"><article><h2>Tectra</h2><p>Tell me what you want to create in 3D, or ask about the project.</p><a class="text-link" href="mailto:hello@cosmiklabs.org?subject=Tectra%20%E2%80%94%20a%20question">Talk about Tectra ${arrow}</a></article><article><h2>HPLX</h2><p>Share your custom-story workflow, or ask about the editor.</p><a class="text-link" href="mailto:hello@cosmiklabs.org?subject=HPLX%20%E2%80%94%20a%20question">Talk about HPLX ${arrow}</a></article><article><h2>Press &amp; general</h2><p>For an introduction, an interview, or a question about Cosmik.</p><a class="text-link" href="mailto:hello@cosmiklabs.org?subject=Cosmik%20%E2%80%94%20an%20introduction">Introduce yourself ${arrow}</a></article></section>
 <section class="wrap contact-note"><p>These links open your email app. Sending a message does not create an account or subscribe you to updates.</p><p>For privacy, attribution, or licensing questions, use <a href="mailto:legal@cosmiklabs.org">legal@cosmiklabs.org</a>. Read how correspondence is handled in the <a href="${root}privacy/">privacy notice</a>.</p></section>`});
}

function tectraSections() {
  return `<section class="product-process" data-theme="light" aria-labelledby="process-title"><div class="wrap section-grid"><div>${label('Authoring with Tectra')}<h2 id="process-title">Describe. Review.<br> Revise.</h2></div><div><p class="about-lead">Direct the structure as it develops.</p><ol class="process-list"><li><h3>Start with an idea</h3><p>Describe the space you want to create. Tectra’s AI develops a construction from connected parts and relationships.</p></li><li><h3>Review the proposal</h3><p>Inspect the geometry and proposed changes before accepting a revision. Checks evaluate the construction’s declared rules.</p></li><li><h3>Keep developing it</h3><p>Give feedback, revise the structure and develop its materials. Revision history keeps earlier accepted states available.</p></li></ol></div></div></section><section class="wrap section-grid"><div>${label('Output and development')}<h2>A structure you<br> can take further.</h2></div><div><p>Export an accepted revision as a GLB with portable materials, or use the unbaked export with a compatible integration to retain its material shaders.</p><p>Tectra is in development. Authoring conversations, proposal review, revision history, material-library editing and geometry inspection are implemented. This page does not announce public availability.</p></div></section>`;
}


export function legacyPage(legacy) {
  if (legacy.renamed) {
    const target = `projects/${legacy.familyId}/`;
    return shell({title: `Continue to ${legacy.name} — Cosmik`, description: `Continue to ${legacy.name}.`, route:`projects/${legacy.id}`, redirect: target, current:'family', body: root => `<section class="page-heading wrap"><h1>Continue to ${escape(legacy.name)}.</h1><p>This project has a new name and address.</p><a class="c-button c-button--primary button" href="${root}${target}">Visit ${escape(legacy.name)} ${arrow}</a></section>`});
  }
  const target = `projects/${legacy.familyId}/#${legacy.fragment}`;
  return shell({title: `${legacy.name} — HPLX — Cosmik`, description: `${legacy.name} is part of the HPLX project.`, route:`projects/${legacy.id}`, redirect: target, current: 'family', body: root => `<section class="page-heading wrap"><h1>Part of HPLX.</h1><p>${escape(legacy.name)} now lives on the HPLX project page.</p><a class="c-button c-button--primary button" href="${root}${target}">Continue to ${escape(legacy.name)} ${arrow}</a></section>`});
}

export function notFound() {
  return shell({title:'Page not found — Cosmik', description:'This page could not be found.', route:'', rootOverride:'/', canonical:false, body: root => `<section class="page-heading wrap not-found">${label('404')}<h1>Page not found.</h1><p>The address may have changed. You can find the current work in Projects.</p><a class="c-button c-button--primary button" href="${root}projects/">Explore projects ${arrow}</a></section>`});
}


export function legalPage(kind) {
  const privacy = kind === 'privacy';
  const title = privacy ? 'Privacy' : 'Legal & Licenses';
  const entries = legalCopy[privacy ? 'Privacy' : 'Legal and Licenses'];
  const description = privacy ? 'How information is handled when you visit cosmiklabs.org or contact Cosmik.' : 'Project independence, software licenses, original game assets and Cosmik branding.';
  const renderEntry = entry => {
    if (entry.style === 'Heading 2') return `<h2>${escape(entry.text)}</h2>`;
    let text = escape(entry.text);
    for (const link of entry.links) text = text.replace(escape(link.text), `<a class="c-link" href="${escape(link.url)}">${escape(link.text)}</a>`);
    text = text.replaceAll('hello@cosmiklabs.org', '<a class="c-link" href="mailto:hello@cosmiklabs.org">hello@cosmiklabs.org</a>');
    text = text.replaceAll('legal@cosmiklabs.org', '<a class="c-link" href="mailto:legal@cosmiklabs.org">legal@cosmiklabs.org</a>');
    return `<p>${text}</p>`;
  };
  return shell({ title: `${title} — Cosmik`, description, route: kind, body: () => `
<article class="legal-page wrap"><header class="page-heading">${label('Cosmik')}<h1>${escape(title)}</h1><p>${escape(entries[0].text)}</p></header>
<div class="legal-copy">${entries.slice(1).map(renderEntry).join('\n')}${privacy ? '' : '<p><a class="c-link" href="https://github.com/cosmiklabs/brand/blob/main/LICENSE.md">Brand licensing and usage terms</a></p>'}</div></article>` });
}
