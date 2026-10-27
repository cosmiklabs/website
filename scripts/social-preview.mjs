/** Local authoring canvas for the organization share image.
 * Call after site assets are copied: await writeSocialPreview(output).
 * Only SOCIAL_PREVIEW=1 with no SITE_URL emits the ignored HTML canvas.
 * Capture it at 1200 × 630 after fonts and the approved SVG have loaded.
 */
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

export async function writeSocialPreview(output, env = process.env) {
  if (env.SOCIAL_PREVIEW !== '1') return false;
  if (env.SITE_URL) throw new Error('Social authoring previews are local only; unset SITE_URL.');
  await mkdir(output, { recursive: true });
  await writeFile(path.join(output, 'social-card.html'), `<!doctype html>
<html lang="en" data-theme="dark">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=1200, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>Cosmik social image — local authoring preview</title>
<link rel="stylesheet" href="assets/brand/cosmik.css">
<style>
@font-face{font-family:Inter;src:url('assets/fonts/Inter-Regular.woff2') format('woff2');font-weight:400;font-style:normal;font-display:block}
@font-face{font-family:Inter;src:url('assets/fonts/Inter-SemiBold.woff2') format('woff2');font-weight:600;font-style:normal;font-display:block}
@font-face{font-family:'IBM Plex Mono';src:url('assets/fonts/IBMPlexMono-Regular.woff2') format('woff2');font-weight:400;font-style:normal;font-display:block}
*{box-sizing:border-box}
html,body{width:1200px;height:630px;margin:0;overflow:hidden;background:var(--c-bg);color:var(--c-text)}
body{font-family:Inter,sans-serif}
main{width:1200px;height:630px;padding:20px 64px 38px;display:flex;flex-direction:column;align-items:center;text-align:center}
.identity{display:block;width:570px;height:190px;flex:none;object-fit:contain}
h1{margin:12px 0 0;font-size:68px;line-height:1.08;font-weight:600;letter-spacing:-.045em}
h1 span{display:block}
.description{margin:24px 0 0;color:var(--c-muted);font-size:24px;line-height:1.4}
.footer{width:100%;margin-top:auto;padding-top:24px;border-top:1px solid var(--c-divider);font-family:'IBM Plex Mono',monospace;font-size:18px;line-height:1.4;letter-spacing:.015em;color:var(--c-muted)}
</style>
</head>
<body><main>
<img class="identity" src="assets/cosmik-lockup-offwhite.svg" width="2172" height="724" alt="Cosmik">
<h1><span>Software for</span><span>structures and stories.</span></h1>
<p class="description">Independent software by Matthew Downs.</p>
<p class="footer">Tectra + HPLX · In development</p>
</main></body>
</html>\n`);
  return true;
}
