# Tectra website

Tectra's product marketing site, served under `/tectra/`. An independent product introduction with a genuine geometry example, the directing/review workflow, export choices, questions and a direct contact route. Cosmik appears as a quiet ownership endorsement.

The combined website build serves this site under `/tectra/`. Run `npm run check` and `npm run dev` at the website repository root. The build uses the shared brand snapshot.

## Identity and content

The site uses the unmodified, Tectra family from the shared `brand` repository: its Latch symbol, mineral palette, Inter, IBM Plex Mono and shared Cosmik controls. The common marketing shell is a 1200 px content column and an 89 px desktop header including its border, with a 48 px identity slot and 20 px live label. At 760 px and below, a static two-row header uses a 40 px identity slot, 12 px vertical padding and 44 px navigation targets. Navigation names the visitor's tasks: Product, How it works, Questions and Contact. Product identity, examples and narrative remain Tectra's.

The page separates declared-rule checks from safety or suitability claims, gives the creator final review, and does not promise access, pricing, launch timing, universal compatibility or future features. Tectra remains a general tool for constructed 3D forms, rather than being presented as a game-only or building-design product.

The real geometry sequence is an existing product asset, copied unchanged with source hashes. Requests are illustrative, not a recording of a live conversation. Native video controls let visitors play, pause and seek; it never autoplays. A text description remains available with JavaScript off. See [content evidence](docs/content-evidence.md).

## Publication preparation

The root Pages workflow publishes Tectra with the other marketing sites.

Without `SITE_URL`, HTML includes `noindex,nofollow` and robots.txt disallows crawling. With an explicit HTTPS URL, the build generates canonical URLs, product-specific social metadata, robots.txt and a sitemap:

```sh
SITE_URL=https://tectra.app/ npm run build
```

This only builds files; it does not publish them. Before actual publication, verify the chosen host and DNS, add the actual hosting-provider details to the privacy notice, confirm the contact mailbox, inspect the live metadata and link destinations, and check video behavior on the target host. Public source visibility is separate from indexing or deployment.

`COSMIK_URL` defaults to `https://cosmiklabs.org/`; its override accepts HTTPS or localhost HTTP only. It changes navigation, not email addresses. Production builds must not use a local override.

## Social artwork

`src/social-card.html` is a 1200 × 630 composition using the approved lockup, local fonts and the same prepared geometry. `SOCIAL_PREVIEW=1 npm run build` exposes `/social-card.html` in a noindex review build only. Capture that exact composition at 1200 × 630 into `assets/social-card.jpg`; published metadata references the JPEG. Production builds never include the preview route. The social artwork says the product is in development.

## Brand kit

The combined build uses the Tectra family from the root brand snapshot and loads it after the shared baseline. The site includes the family license and font notices.
