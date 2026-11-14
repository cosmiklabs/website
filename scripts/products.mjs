import { cp, mkdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { files as hplxAssets } from '../products/hplx/scripts/brand.mjs';
import { vendored as tectraAssets } from '../products/tectra/scripts/build.mjs';
import { build as buildHplx } from '../products/hplx/scripts/build.mjs';
import { build as buildTectra } from '../products/tectra/scripts/build.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));

async function brandFiles(output, mapping) {
  const location = path.join(root, 'vendor/product-brand');
  const { files } = JSON.parse(await readFile(path.join(location, 'manifest.json'), 'utf8'));
  await Promise.all(Object.entries(mapping).map(async ([target, source]) => {
    const family = source.startsWith('kits/') && !source.startsWith('kits/cosmik/');
    const bytes = await readFile(path.join(family ? location : path.join(root, 'vendor/brand'), source));
    if (family && createHash('sha256').update(bytes).digest('hex') !== files[source]) {
      throw new Error(`Product brand asset differs from its manifest: ${source}`);
    }
    const file = path.join(output, target);
    await mkdir(path.dirname(file), { recursive: true });
    await writeFile(file, bytes);
  }));
}

const arcfield = fileURLToPath(new URL('../products/arcfield/dist/', import.meta.url));

/** Assemble the independent product sites within the organization's Pages artifact. */
export async function buildProducts(output, siteUrl = process.env.SITE_URL) {
  const origin = siteUrl ? new URL(siteUrl) : null;
  if (origin && !origin.pathname.endsWith('/')) origin.pathname += '/';
  const productUrl = id => origin && new URL(id + '/', origin).href;
  const companyUrl = origin?.href;
  await brandFiles(output, {
    'assets/projects/arcfield-mark-dark.svg': 'kits/arcfield/assets/arcfield-mark-dark.svg',
    'assets/projects/arcfield-mark-white.svg': 'kits/arcfield/assets/arcfield-mark-white.svg',
    'assets/projects/vallix-fosse-dark.svg': 'kits/vallix/assets/vallix-fosse-dark.svg',
    'assets/projects/vallix-fosse-white.svg': 'kits/vallix/assets/vallix-fosse-white.svg',
  });
  await buildHplx({ destination: path.join(output, 'hplx'), siteUrl: productUrl('hplx'), cosmikUrl: companyUrl, brandUrl: 'https://github.com/cosmiklabs/brand/tree/main/kits/hplx' });
  await buildTectra({ destination: path.join(output, 'tectra'), siteUrl: productUrl('tectra'), mount: origin ? new URL('tectra/', origin).pathname : '/tectra/', cosmikUrl: companyUrl });

  const mountBrand = (id, targets) => brandFiles(path.join(output, id), Object.fromEntries(targets.map(target => {
    const local = target.slice(`vendor/brand-${id}/`.length);
    return [target, local.startsWith('vendor/brand/') ? local.slice('vendor/brand/'.length) : `kits/${id}/${local}`];
  })));
  await mountBrand('hplx', hplxAssets.map(file => `vendor/brand-hplx/${file}`));
  await mountBrand('tectra', tectraAssets);

  const destination = path.join(output, 'arcfield');
  await cp(arcfield, destination, { recursive: true });
  await brandFiles(destination, {
    'assets/mark.svg': 'kits/arcfield/assets/arcfield-mark-dark.svg',
    'assets/arcfield.css': 'kits/arcfield/tokens/arcfield.css',
    'assets/cosmik.css': 'kits/cosmik/tokens/cosmik.css',
    'assets/controls.css': 'kits/cosmik/components/controls.css',
    'assets/LICENSE.md': 'kits/arcfield/LICENSE.md',
    'assets/Inter-Regular.woff2': 'fonts/web/Inter-Regular.woff2',
    'assets/Inter-Medium.woff2': 'fonts/web/Inter-Medium.woff2',
    'assets/Inter-SemiBold.woff2': 'fonts/web/Inter-SemiBold.woff2',
    'assets/Inter-OFL.txt': 'fonts/licenses/Inter-OFL.txt',
  });
  const index = path.join(destination, 'index.html');
  const html = await readFile(index, 'utf8');
  const metadata = origin
    ? `<link rel="canonical" href="${productUrl('arcfield')}">`
    : '<meta name="robots" content="noindex,nofollow">';
  const company = origin ? companyUrl : '../';
  let page = html.replace('</head>', metadata + '\n</head>').replace('href="../">By Cosmik', `href="${company}">By Cosmik`);
  // Pages and the CDN can cache HTML and assets independently across deploys.
  for (const [, attribute, file] of html.matchAll(/(?:<link rel="stylesheet" |<script )(href|src)="([^"]+)"/g)) {
    const bytes = await readFile(path.join(destination, file));
    const revision = createHash('sha256').update(bytes).digest('hex').slice(0, 12);
    page = page.replace(`${attribute}="${file}"`, `${attribute}="${file}?v=${revision}"`);
  }
  await writeFile(index, page);
}
