# Content and media evidence

Reviewed 26 October 2026. The marketing site uses existing product evidence without changing or running the product repository. Product implementation and public availability are separate facts.

## Product facts

Read-only sources in `cosmiklabs/tectra`, commit `c79e3f702c5971c892279db90e1f4716365b844b`:

| Marketing claim | Source |
| --- | --- |
| Constructed forms, not a single industry or complete environments | `docs/product/tectra.md` |
| Conversation, inspection, proposal review and revision history | `README.md`, `docs/product/authoring.md`, `docs/product/tectra.md` |
| Declared dimensions and requirements; creator acceptance | `docs/product/tectra.md` |
| Geometry-only/baked GLB, compatible-renderer shader package, source bundle | `docs/product/export.md` |
| No in-app bundle import | `docs/product/export.md` |

The site does not claim public access, a launch date, a price, customer adoption, universal export compatibility, a successful live agent session or safety certification. The displayed requirement measurements are hypothetical.

Buildings, furniture, vehicles and objects are product-scope categories explicitly named by `docs/product/tectra.md`, not a claim that a particular example in every category has been demonstrated. The only rendered example used here is the prepared cottage. No marketing sentence narrows the general product to games, buildings or another single audience.

## Geometry media

Files copied unchanged from `apps/web/src/auth/hero/media/` at the commit above. The product's `hero.tsx` identifies the prerecorded rendering as a prepared cottage scene, with illustrative requests. It is not a screen recording of a live authoring session.

| File | SHA-256 |
| --- | --- |
| `assets/media/revisions-dark.png` | `a590a9bc5c70c7551704b0c16bc1ba90b26341e3882a5571fe683cb6a8d92ebb` |
| `assets/media/revisions-dark.mp4` | `ba5865dc0f23ddc599ef475cadd5e732964b33c9a2da65b0c8ccf5a759aca18f` |
| `assets/media/revisions-dark.webm` | `40e06bf904ac0b25756582b014623fb583d64917d043f88463a33a5eca2098f6` |

The source timeline is approximately 15 seconds: an initial cottage, wider door, second chimney, steeper roof, then a return to the first state. The poster depicts the last revision. The page gives this sequence as text beside native, user-initiated video controls; it has no audio and never autoplays. The visible caption distinguishes geometry provenance from illustrative conversation.

The unused, hand-drawn structure placeholder has been removed. Git history preserves it.

## Review boundary

This is a local marketing review. Source media remain copyrighted by their owner; copying them into a marketing checkout does not grant a third-party reuse license. The parent/brand links do not imply the product is open source or free to use. Publication, DNS and actual hosting-provider disclosures remain a later owner action.

## Verification performed

- `npm run check`: 18 checks passed after the completed source changes, including both vendor locks, available CSS tokens, all page links/fragments/assets, native disclosures, media labeling, preview indexing, metadata and JPEG file signature.
- Production metadata build with `SITE_URL=https://tectra.app/`: canonical and social URLs, JPEG dimensions/type, robots.txt and sitemap inspected. `SOCIAL_PREVIEW=1` did not publish the social preview route. Restored the default noindex build with local company navigation afterward.
- HTTP preview: homepage 200; MP4 byte-range request 206 with `video/mp4`; social card 200 with `image/jpeg`; nested missing path 404 with the branded HTML response.
- Social artwork: the exact 1200 × 630 local HTML composition was captured through CUA into `assets/social-card.jpg`. File inspection confirms JPEG, 1200 × 630. Source composition is contained to its canvas.
- Coordinating agent's CUA review: desktop full-page composition inspected; mobile at 390 px had no horizontal overflow; availability question opened; native video playback reached ready state 4 with a 14.9-second duration and an advancing current time, then paused successfully.

This records the checks performed. It is not a claim of exhaustive browser support, accessibility certification, a public deployment, or end-to-end verification of the product itself.
