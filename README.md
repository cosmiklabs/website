# Cosmik websites

The organization site is served at [cosmiklabs.org](https://cosmiklabs.org/). Arcfield, HPLX, and Tectra have independent marketing sites under `/arcfield/`, `/hplx/`, and `/tectra/`.

## Development

Node.js 22 or later. No third-party build dependencies or install step.

- `npm run dev` builds and serves at `http://127.0.0.1:4173`.
- `npm run build` generates ignored `site/` output.
- `npm run preview` serves the current build (`PORT` selects another port).
- `npm run check` rebuilds and runs automated checks.
- `SITE_URL=https://cosmiklabs.org npm run check` also checks publication metadata.
- `npm run brand:verify -- --brand ../brand` proves the vendor lock against its tagged source.

Edit project data in `src/projects.mjs`, page content in `src/templates.mjs`, and layout in `assets/site.css`. `featuredWork.familyId` controls the order of equally weighted homepage showcases independently of permanent project routes. Every project uses the same baseline heading component; optional body sections explain product-specific workflows. New content must state capabilities from product evidence and keep intended workflows distinct from shipped availability.

## Product sites

Each directory under `products/` owns its content, navigation, and site styles. The root build combines them with the company site into one Pages artifact. Product pages load the same Cosmik baseline as the company site, then their own scoped family CSS. The product files come from the consolidated `cosmiklabs/brand` distribution and are checked against the snapshot manifest.

The existing `/projects/` routes remain company portfolio pages and link to the independent product sites. Arcfield Workbench is built in `arcfield-bevy` and will be hosted separately at `arcfield.app`.
