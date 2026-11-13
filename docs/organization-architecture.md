# Cosmik workspace architecture

Local repository and documentation review, 26 October 2026. This map describes the workspace, not an exhaustive account of repositories that might exist remotely. Repository names express scope and role; they do not imply separate companies, a product release or public source availability.

## Shared repositories

- `brand` owns the shared Cosmik foundation and the product kits under `kits/<product>/`.
- `website` owns the organization site and each independent marketing site under `products/<product>/`. GitHub Pages serves a single build at `cosmiklabs.org`, with products mounted at `/<product>/`.
- `.github` owns the GitHub organization profile.

Product pages use the shared baseline followed by their own family CSS. The company site uses the baseline and can show product marks as artwork. Products keep their own navigation, claims, and content.

## Tectra implementation

Authored construction is authoritative; geometry is derived. Rust construction libraries remain independent of rendering, accounts, AI providers and persistence. Mesh preparation and runtime preparation/acceptance form separate boundaries. The Solid web app uses a framework-independent three.js viewport and a WASM geometry worker client in `packages/geometry`.

`tectra-server` supplies API, worker and database binaries over shared application services. PostgreSQL preserves construction snapshots, revisions, proposals and authoring records. The Node agent bridge runs in `services/agent`; the compute service handles geometry checks, images and exports. The application validates independently and owns exact proposal acceptance. Agents cannot accept their own proposals. Deployment has a container-based local reference stack.

`tectra-bevy` is an experimental consumer of the unbaked export: it checks the archive and shader contracts, loads glTF and maps Tectra material shaders onto Bevy PBR. Its README pins the Cosmik Bevy fork. It does not become the construction engine or redefine the source model.

Sources: `tectra/README.md`, `tectra/docs/architecture/architecture.md`, `tectra-bevy/README.md` and their manifests.

## HPLX implementation

One Git repository and Cargo workspace hold the editor, engine, shared game layer and The Dark Descent reimplementation. Format readers own what legacy files say; compatibility crates own how that data maps to HPLX; the reusable engine owns game-independent capabilities. `lux` owns the shared game layer, `editor` owns authoring interfaces, and `tdd` assembles the program (editor by default, game with `--play`). The dependency direction prevents engine code from depending on the editor or game.

The purpose is easier custom-story creation with built-in playtesting for the original Amnesia: The Dark Descent. Original game content is read from the user’s installation, never bundled. The implementation declares GPL-3.0-or-later; this does not license all Cosmik products or brand artwork. Source licensing, remote repository visibility and release availability are distinct facts. Existing root-site copy describes product source as not yet public; this local review does not independently establish current remote visibility.

Sources: `hplx/README.md`, `hplx/docs/ARCHITECTURE.md`, and `brand/kits/hplx/README.md`.

## Reference and historical repositories

Per the owner’s direction, `cybersimulator` and `volsyn` / `volsyn-*` are references for Tectra, not additional current product entries. `cybersimulator` has a `visolar6` remote rather than a `cosmiklabs` remote. `volsyn-adapters` has no checked-out commit. The old `/projects/volsyn/` website address remains a compatibility redirect; its existence does not make Volsyn a third current product.
