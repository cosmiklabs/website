# Cosmik website

The organization website at [cosmiklabs.org](https://cosmiklabs.org/), introducing Tectra and HPLX. This repository serves the parent identity; product websites and product brand kits are separate. See [the organization architecture](docs/organization-architecture.md) for the workspace map and naming rules.

## Development

Node.js 22 or later. No third-party build dependencies or install step.

- `npm run review` builds and serves Cosmik, Tectra and HPLX together from sibling checkouts, with working local links, at ports 4191–4193. Ctrl+C stops all three.
- `npm run dev` builds and serves at `http://127.0.0.1:4173`.
- `npm run build` generates ignored `site/` output.
- `npm run preview` serves the current build (`PORT` selects another port).
- `npm run check` rebuilds and runs automated checks.
- `SITE_URL=https://cosmiklabs.org npm run check` also checks publication metadata.
- `npm run brand:verify -- --brand ../brand` proves the vendor lock against its tagged source.

Edit project data in `src/projects.mjs`, page content in `src/templates.mjs`, and layout in `assets/site.css`. `featuredWork.familyId` controls the order of equally weighted homepage showcases independently of permanent project routes. Every project uses the same baseline heading component; optional body sections explain product-specific workflows. New content must state capabilities from product evidence and keep intended workflows distinct from shipped availability.

## Identity and content

The enclosing website uses only Cosmik’s monochrome baseline, Inter, IBM Plex Mono and shared controls. It vendors `cosmiklabs/brand` **v0.16.1**, unchanged, under `vendor/brand/`. The lock records the tag, commit and hashes. `brand-provenance.json` maps the exact files published into the generated site. The accepted Cosmik lockup, emblem and icons are copied unchanged from the pinned release; original font licenses travel with the fonts.

Product marks remain plain artwork. Project rows use approved monochrome variants, and project headings use approved on-dark variants. Their pinned releases and SHA-256 values are in `brand-provenance.json`; family palettes and fonts are not loaded. Product kits belong to `brand-tectra` and `brand-hplx`; the product websites belong to `website-tectra` and `website-hplx`.

Cosmik is an independent software company building tools for creating 3D structures and playable stories. The company introduces Matthew and the portfolio; product sites own their story and customer journey, with a quiet Cosmik endorsement. Do not restore the retired motto or describe all work as open source. HPLX’s commitments are specific to HPLX.

Both projects are in development. The website offers no product downloads, release date, public source promise, Tectra pricing or construction-safety certification. HPLX leads with custom-story creation for the original Amnesia: The Dark Descent and built-in playtesting. Original game assets are never bundled. Its retail-install, independence and no-payment notices remain visible. Product source links are omitted until their public availability is established.

## Publication and preserved behavior

The existing `.github/workflows/pages.yml` builds and checks pushes to `main` or a manual run, then deploys only `site/` to GitHub Pages. The custom domain is configured in Pages settings. Local builds without `SITE_URL` request no indexing; publication builds emit canonical URLs, route-specific social images, robots.txt and a sitemap. Explicit `HPLX_URL` and `TECTRA_URL` enable links to standalone product sites once those destinations are available. Without them, the parent project pages offer a real contact action. HTTP loopback URLs are accepted only for local review; production builds reject them. Do not add a second hosting system for this repository revamp.

Permanent project routes, old detail redirects, the 404 page, Privacy and Legal & Licenses are retained. `src/legal-copy.mjs` holds the existing approved policy text; its regression checks preserve the existing policy substance while allowing the reviewed company-description and contact-address corrections. Original game-store links are separate from HPLX availability and make no current price or compatibility claims.

Navigation, content and native disclosures work without JavaScript. The optional Motion selector offers System, Reduce and Full for the current page, with no storage writes. Shared control states, visible focus, enlarged text and narrow-screen layouts remain part of review.

## Updating the brand

From a clean checkout exactly at a release tag:

```sh
npm run brand:sync -- --brand ../brand
npm run brand:verify -- --brand ../brand
npm run check
```

Never hand-edit `vendor/`. If taking new artwork, copy accepted files unchanged and update provenance with the same release. CSS and preference-script URLs are content-hashed to invalidate cached versions.

## Review

`scripts/check-browser.mjs` is a review-only browser check; it never publishes. It checks desktop and narrow layouts, image loading, navigation, JavaScript errors, motion preferences and no-JavaScript access. Supply `PLAYWRIGHT_MODULE_PATH` and `BROWSER_PATH` if the runner’s defaults do not match your environment. Saved screenshots are evidence for the revision that generated them, not a certification of every browser or assistive technology.

Review of the current marketing work: 54 automated checks pass in both preview and publication modes. The three sites are reviewed together through `npm run review`; see `docs/marketing-review.md` for executed browser checks and review boundaries. No publication was performed.

Social artwork is rendered from `scripts/social-preview.mjs`. Run `SOCIAL_PREVIEW=1 npm run build`, open `/social-card.html` at 1200×630, and save a browser capture as `assets/social-card.jpg`. The preview refuses `SITE_URL` and is omitted from normal builds. Imported product imagery and share cards have source commits and hashes in `docs/media-provenance.json`; the HPLX illustration is not an app screenshot, and the Tectra geometry is not a recording of a live authoring session.
