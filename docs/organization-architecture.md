# Cosmik workspace architecture

Local repository and documentation review, 25 October 2026. This map describes the workspace, not an exhaustive account of repositories that might exist remotely. Repository names express scope and role; they do not imply separate companies, a product release or public source availability.

## Organization scope

| Repository | Responsibility |
| --- | --- |
| `.github` | GitHub organization profile; `profile/README.md` is the public entry point. |
| `website` | Parent organization website at cosmiklabs.org; shared project directory, context and public policies. GitHub Pages publishes generated `site/` only. |
| `brand` | Parent identity and shared design foundation: monochrome semantic tokens, Cosmik marks, Inter, IBM Plex Mono, shared controls, guidance and family-generation tooling. |

These three repositories represent Cosmik itself. They must not acquire one product’s colors, heading typeface or product-specific commercial commitments. Product identities can appear as artwork inside the parent scope.

## Product scopes and naming

| Pattern / repository | Meaning |
| --- | --- |
| `<product>` | The product implementation. Currently `tectra` and `hplx`. |
| `brand-<product>` | The product’s independent identity, wording and generated token extension, consuming a pinned `brand` release. Currently `brand-tectra` and `brand-hplx`. |
| `website-<product>` | A dedicated product website, using the product brand rather than the parent palette. `website-tectra` exists; no `website-hplx` checkout is present. |
| `<product>-<host>` | A product integration for another host: `tectra-bevy` loads Tectra exports into Bevy. It shares Tectra’s identity, not a separate brand. |
| `bevy` | Cosmik’s engine fork, supporting product and integration work. Not an original Cosmik product. |

The current spelling `website-tectra` is deliberate: role first for websites and brands, product first for integrations. Historical `tectra-website` references do not define the current convention.

## Dependency and identity flow

`brand` → `brand-tectra` → Tectra app / product website / integrations.

`brand` → `brand-hplx` → HPLX interfaces and documents.

`brand` → organization `website` / `.github` profile.

Family kits vendor an immutable tagged baseline plus its hash lock and run that release’s generator and checks. Product consumers vendor a tagged family kit including its nested baseline; they should not introduce a second independent baseline alongside it. Root organization surfaces consume the baseline directly. A brand approval says nothing about product release readiness.

## Tectra implementation

Authored construction is authoritative; geometry is derived. Rust construction libraries remain independent of rendering, accounts, AI providers and persistence. Mesh preparation and runtime preparation/acceptance form separate boundaries. The Solid web app uses a framework-independent three.js viewport and a WASM geometry worker client in `packages/geometry`.

`tectra-server` supplies API, worker and database binaries over shared application services. PostgreSQL preserves construction snapshots, revisions, proposals and authoring records. The Node agent bridge runs in `services/agent`; the compute service handles geometry checks, images and exports. The application validates independently and owns exact proposal acceptance. Agents cannot accept their own proposals. Deployment has a container-based local reference stack.

`tectra-bevy` is an experimental consumer of the unbaked export: it checks the archive and shader contracts, loads glTF and maps Tectra material shaders onto Bevy PBR. Its README pins the Cosmik Bevy fork. It does not become the construction engine or redefine the source model.

Sources: `tectra/README.md`, `tectra/docs/architecture/architecture.md`, `tectra-bevy/README.md` and their manifests.

## HPLX implementation

One Git repository and Cargo workspace hold the editor, engine, shared game layer and The Dark Descent reimplementation. Format readers own what legacy files say; compatibility crates own how that data maps to HPLX; the reusable engine owns game-independent capabilities. `lux` owns the shared game layer, `editor` owns authoring interfaces, and `tdd` assembles the program (editor by default, game with `--play`). The dependency direction prevents engine code from depending on the editor or game.

The purpose is easier custom-story creation with built-in playtesting for the original Amnesia: The Dark Descent. Original game content is read from the user’s installation, never bundled. The implementation declares GPL-3.0-or-later; this does not license all Cosmik products or brand artwork. Source licensing, remote repository visibility and release availability are distinct facts. Existing root-site copy describes product source as not yet public; this local review does not independently establish current remote visibility.

Sources: `hplx/README.md`, `hplx/docs/ARCHITECTURE.md`, and `brand-hplx/README.md`.

## Reference and historical repositories

Per the owner’s direction, `cybersimulator` and `volsyn` / `volsyn-*` are references for Tectra, not additional current product entries. `cybersimulator` has a `visolar6` remote rather than a `cosmiklabs` remote. `volsyn-adapters` has no checked-out commit. The old `/projects/volsyn/` website address remains a compatibility redirect; its existence does not make Volsyn a third current product.

## Change boundary

This revamp changes only `.github` and `website`. Product repositories, family brand kits, the Bevy fork, reference repositories and existing uncommitted changes are outside the implementation scope. Product sites retain their own identity and publishing decisions. No public product-site URL is assumed live from a repository name or domain mentioned in a README.
