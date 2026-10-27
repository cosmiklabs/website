# Marketing review — 26 October 2026

## Direction and boundary

Cosmik introduces the independent company and its maker. Tectra and HPLX explain
their own audience, workflow and current availability. Familiar navigation,
controls, spacing and optically balanced identity labels connect the sites;
product palettes, headings, evidence and stories remain distinct. No new marks,
pricing, dates, testimonials or release availability were invented.

Only marketing repositories were changed. Product implementations were read-only
sources. All commits are local; nothing was pushed or published and no account,
DNS, GitHub metadata or subscription was changed. `website-hplx` is a new local
repository with no remote. The current public organization bio still needs the
prepared copy in `.github/README.md` if publication is later authorized.

## Executed verification

- Cosmik: 54 tests in preview and explicit HTTPS publication modes; all passed.
- HPLX marketing: 11 tests passed; Tectra marketing: 18 passed.
- Brand suites: 104 Cosmik, 25 HPLX and 37 Tectra tests passed. Root browser suite
  includes 72 reference cases and the shared component suite; clean rebuilds passed.
- CUA rendered all three marketing homepages at 1440, 768, 390 and 320 CSS pixels.
  No horizontal overflow or unloaded eager images. Headers measured 89px at
  desktop/tablet and 113px on phones across all three. Navigation type measured
  14px, 13px at 390, and 12px at 320. Full desktop and phone captures were reviewed.
- Supporting CUA checks covered About, Contact, both parent product pages, HPLX
  Privacy/Legal, Tectra Privacy and all three Voice pages at 1440 and 390.
- Exercised HPLX Build/Playtest/Refine diagram states and native availability FAQ;
  Tectra video play/pause (14.9 seconds, readyState 4) and availability FAQ.
- Clicked the full Cosmik → parent introduction → standalone product → Cosmik
  journey for both products using the local review configuration.
- Browser diagnostics reported no errors or warnings in the inspected tab.
- Fixed mobile heading word joins, balanced marketing headers, and fixed narrow
  brand-guide metadata and prose-table readability. Visually checked the corrected
  Tectra Voice table at 390; the table and scroll width both matched its 356px parent.
- `npm run review` successfully built and launched all three sites with local links.

These checks are not accessibility certification or a live DNS/production audit.
Email links were inspected, not sent. No product executable was built or launched.
No new account or waiting-list system is implied by the contact actions.

## Review and later publication

Run `npm run review` in this repository, with `website-tectra` and `website-hplx`
as sibling checkouts. Requires Node 22+ and free ports 4191–4193. It builds noindex
previews and stops its servers on Ctrl+C. Normal builds contain no social-card
preview page.

After owner review, independently verify destination domains and provider privacy
configuration before publishing. Set `HPLX_URL=https://hplx.app/` and
`TECTRA_URL=https://tectra.app/` on a production build only when those sites are
available; until then parent pages keep useful contact actions. The standalone
marketing sites intentionally offer no download or platform access link yet.

Family brand references pin a local commit of the shared reference tooling. If
publishing later, push the shared `brand` commit before those family commits.
No new release tags or kit versions were created for this work.
