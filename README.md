# Cosmik website

The public website for Cosmik’s independent software workshop, hosted at https://cosmiklabs.org/. The website source and history are public. The HPLX engine and game repositories remain private; the former app and its package catalog are archived.

## Publication

GitHub Pages uses `.github/workflows/pages.yml`. Pushes to `main` or a manual workflow run build and test the site with Node.js 22, then publish only generated `site/` output. Source templates, tests, README and Git metadata are not in that output. Official GitHub actions are pinned to commit hashes; deployment permissions are limited to the deploy job. The custom domain `cosmiklabs.org` is set in the repository's Pages settings, not by a `CNAME` file.

Search indexing is enabled for the published build (owner, 8 October 2026). Local builds without `SITE_URL` retain `noindex, nofollow`.

## Run locally

Requires Node.js 22 or later. No third-party build dependencies or install step.

- `npm run dev` builds and serves at `http://127.0.0.1:4173`.
- `npm run build` generates `site/`.
- `npm run preview` serves the current build.
- `npm run check` rebuilds and runs all automated tests.
- `npm run brand:verify` checks the vendored brand releases; see [Updating the brand](#updating-the-brand).

Rebuild after source edits. `PORT` changes the preview port; `CHECK_PORT` changes the port `scripts/check-browser.mjs` serves on. The development server binds only to localhost. Generated pages also work as local files, except for the root-absolute 404 navigation used by root-level hosting.

## Editing

Edit project data and `featuredWork.familyId` in `src/projects.mjs`, and page templates in `src/templates.mjs`. Featured work is independent of permanent family destinations. Generated output belongs in ignored `site/`.

## Content boundaries

HPLX is presented as an editor for creating custom stories for the original Amnesia: The Dark Descent, for the people who make them (owner, 19 October 2026). It appears under **Story creation**. The editor is **In development**: built and being tested, not released. The reimplementation and **HPLX Engine** support custom-story authoring and playtesting inside the editor. Their purpose is a better, easier creation workflow.

There are no downloads, release dates, public product-source links, complete-compatibility claims or game assets on this website. The product repositories remain private and have no releases. Public copy does not describe other-game attempts or campaign validation. The old AMFP URL redirects to the current editor section without retaining an obsolete roadmap entry.

Public links are restricted to the Cosmik organization and brand repository. Original creators’ names, assets, credits and licenses remain separate from the Cosmik endorsement. No blanket code, brand or artwork license is applied by this repository.

## Brand provenance

The website is entirely in Cosmik's own brand (owner, 25 October 2026). It vendors
one tagged release, with a lock that records its repository, tag, commit and the
SHA-256 of every file:

| Directory | Release | Lock |
| --- | --- | --- |
| `vendor/brand/` | [cosmiklabs/brand](https://github.com/cosmiklabs/brand) v0.12.2, the Cosmik foundation | `vendor/brand/brand.lock.json` |

Product family kits ([cosmiklabs/brand-tectra](https://github.com/cosmiklabs/brand-tectra),
[cosmiklabs/brand-hplx](https://github.com/cosmiklabs/brand-hplx)) are not vendored or
rendered here. Their palettes and typefaces belong on the products' own sites.
Project pages and listings name the products in Cosmik's tokens and type. Never
edit anything under `vendor/`.

### Product logos

The Tectra Latch and the owner-approved HPLX Glimmer symbol (17 October 2026) appear
as plain artwork beside the live product names (owner, 25 October 2026), with no
family colours, fonts or theming around them. They are this site's own assets in
`assets/projects/`, copied byte for byte from brand-tectra v0.2.6 and brand-hplx
v0.1.2. `brand-provenance.json` (`projectLogos`) records each file's repository,
tag, commit, source path and SHA-256, and `tests/project-logos.test.mjs` pins the
same hashes, so a changed file fails the tests. To take a new logo from a release,
copy the file unchanged and update both.

Project rows on the home and Projects pages use each kit's monochrome white
variant at 32 × 32. Project page headings use the approved colour variant for dark
surfaces (`-dark`: Latch in mineral teal, Glimmer in amber) at 1.35em beside the
name. Logos are decorative (`alt=""`) because the live name is adjacent. Do not
recolour, crop or redraw them.

`brand-provenance.json` names the lock and maps every published brand file to its
vendored source. The build copies only those files into `site/`, unchanged: the
baseline `cosmik.css`, the shared `controls.css`, and Inter and IBM Plex Mono with
their notices. The Cosmik emblem and icons are not part of the brand distribution,
so they stay committed in `assets/`; `brand-provenance.json` records their source
paths and hashes (unchanged from brand v0.9.1 through v0.12.2). Preserve all bundled
font license notices.

Stylesheets load in the order the brand's consumer guide gives: `cosmik.css`,
`controls.css`, then the site's own `site.css`. The page root is always
`data-theme="dark"`, and some sections set `data-theme="light"`; the baseline sets
`color-scheme` on every `data-theme`, so the nearest explicit theme picks the mode.

### Shared controls

Calls to action use `c-button c-button--primary`, with the site's `.button` adding
only its layout. Links in running text use `c-link`. The Motion selector uses
`c-select c-select--dense`, which returns to the standard target and body size on
touch so focusing it never zooms. Global link hover and active colours have zero specificity, so control
classes keep their own colours, and every hover rule in `site.css` sits under
`@media (hover: hover)`, as the kit's controls do, so a tap never leaves a link
looking hovered. The site's global `:focus-visible` ring matches the
controls' ring and still covers navigation links, disclosures and other elements.
Status labels use `c-status` (the label type in a pill, with no control
affordance). The dense project rows on the home and Projects pages add the kit's
`c-status--dense` (the same pill and label at the ui-small size, with tighter
padding); the site's `.status` adds only wrapping.

### Updating the brand

Check out the new tag of `cosmiklabs/brand`, clean and exactly at the tag, then:

```sh
npm run brand:sync -- --brand ../brand
npm run brand:verify -- --brand ../brand
npm run check
```

`brand:sync` runs the release's own vendor tool and rewrites the lock.
`brand:verify` checks every vendored file against the lock, and with the checkout
also proves the lock against its release tag. Without a checkout,
`npm run brand:verify` checks the files against the lock; the tests run the same
check. Read the brand changelog, then compare the pages in both modes.

## Remaining review

The October 7 issue fixes pass the automated suite. Headless Chrome checked the home, Projects, HPLX and About pages at 1280, 768, 390 and 320 CSS pixels with 100% and 200% root text size; no horizontal page overflow remained. Homepage desktop and mobile captures were visually reviewed. Full browser zoom, complete keyboard/assistive-technology checks, Back/Forward and other browser engines remain unverified. These checks are not product accessibility certification.

For the October 8 Ember integration, the master SVG was independently rendered and inspected and all 30 automated tests pass, including the new identity checks. Live browser QA for this change remains unverified because the cloud browser cannot connect to the localhost preview. The earlier rendering checks above describe the previous revision.

Set `SITE_URL` to the final HTTPS base URL when building publication previews to emit canonical URLs and absolute share-image URLs; unset previews omit those URLs. Social cards use the unmodified 512 px plate icon from the pinned brand kit. Redirects name their destination as canonical, and 404 pages omit it. The preview includes `noindex, nofollow` metadata as an extra precaution. That is not access control. Publication was approved on 8 October 2026; the website and this source repository are now public. Search indexing is enabled in publication builds.


## Public policy pages

`src/legal-copy.mjs` holds the approved Privacy text (8 October 2026) and Legal & Licenses text (8 October 2026). The 19 October revision of Legal & Licenses changes only its date and the factual "What HPLX is" paragraph; a test pins every other legal paragraph and the whole Privacy text. `legalPage()` renders `/privacy/` and `/legal/`; shared footer links appear on every page. Correspondence retention is indefinite with no routine deletion schedule. The pages describe configured analytics without claiming verified beacon delivery or guaranteed visitor-residence exclusions. The public brand license is linked, not modified. Review-only notes are excluded from the source and generated site.

Run `npm run check` and `SITE_URL=https://cosmiklabs.org npm run check` to validate both preview and public metadata, links, policy text and preserved routes. Deployment retains the configured Pages base URL and existing indexing behavior.

### HPLX requirements and independence

The HPLX page prominently states the owner’s retail-install requirement, never-bundled original assets, independence from Frictional Games, and commitment never to require payment to use HPLX. The original retail games are separate. Legal & Licenses distinguishes ownership from the GPLv3 source release, with a link to Frictional Games’ official announcement. Custom-story creation for the original The Dark Descent is the sole focus. No software license was changed.

### Original retail game links

`src/retail-links.mjs` lists the original PC edition of The Dark Descent separately from HPLX availability, with Steam, GOG, Epic Games Store and Humble Store URLs linked by its official website.

Steam, GOG and Epic product listings were verified on 8 October 2026. The Humble destination is taken from the official [TDD site](https://www.amnesiagame.com/); the current Humble listing could not be independently retrieved. Links make no price, regional availability or HPLX store-build compatibility claim. The notice explains that local PC files are needed and console purchases do not provide them.


## Public project directory

The umbrella describes an independent software workshop. HPLX is the featured work and current public project family. Only listed public families generate pages; assets for removed families are not published. The existing legal and privacy text is unchanged.

Pushes to main publish automatically through the existing Pages workflow. Run `npm run check` in preview and publication metadata modes before publishing.

## Project page pattern

Every entry in `families` renders through `familyPage()` and `familyHeading()`.
Add the name, pillar, heading lines, description and status in `src/projects.mjs`.
Do not create a project-specific hero, generic `page-heading` fallback, per-project
layout CSS or per-project colours.

The shared pattern owns the breadcrumb, two-column hero, the logo-left/name-right
identity with the Cosmik endorsement below the name, heading typography, description and status
spacing, section grid and return link. At 720px it stacks into one column. Keep
content at its natural height. Optional sections may differ, but must use the
shared `section-grid` spacing. Do not add filler, fixed heights or project-specific
offsets to make pages appear equal. A project's `logo` in `src/projects.mjs`
names its listing and heading artwork in `assets/projects/`; a project without one
keeps the identity column without inventing artwork. The global header and footer
are the same on every page.

CSS URLs use content hashes from `src/assets.mjs`, so every CSS change invalidates
its own cached URL automatically. Run `npm run check` and
`SITE_URL=https://cosmiklabs.org npm run check`, then visually compare the pages
at desktop and narrow widths. Tests enforce the shared structure for existing and
future projects, and that no product family kit is vendored, published or loaded.

## Tectra rebrand (21 October 2026)

Tectra replaces deprecated Volsyn at `/projects/tectra/`. The old
`/projects/volsyn/` address redirects to Tectra and uses its canonical URL.
Listings and metadata use Tectra; the shared project layout is unchanged.

## Product websites

Product websites live in their own repositories. The Tectra website draft for `tectra.app` is [cosmiklabs/website-tectra](https://github.com/cosmiklabs/website-tectra), renamed from `cosmiklabs/tectra-website`. The product brands are [cosmiklabs/brand-tectra](https://github.com/cosmiklabs/brand-tectra) and [cosmiklabs/brand-hplx](https://github.com/cosmiklabs/brand-hplx).

## Featured project and motion

The homepage features Tectra while retaining HPLX as a separate project. Motion defaults to System; a page-local Motion selector offers Reduce and Full without saving tracking/storage data. CSS resolves the effective brand duration and responds to OS changes live. Explicit scoped overrides follow the nearest data-motion boundary. Content and navigation work without JavaScript; the optional selector stays hidden until enhanced. Scrolling is immediate in all modes.
