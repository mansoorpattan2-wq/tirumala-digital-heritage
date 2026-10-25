# Validation — 25 October 2026

## Passed

- Production static export: all nine requested pages plus the 404 page and icon.
- TypeScript strict check (`tsc --noEmit`).
- Three camera tests: endpoint clamping, continuous chapter boundary, deterministic forward/reverse sampling.
- Chrome desktop (1440×1000) and mobile emulation (390×844): nine routes, one primary heading each, no horizontal overflow, all image assets decode.
- No unexpected browser JavaScript errors or local 404 asset/payload requests.
- WebGL2 scene renders; forward/reverse chapter selection, replay and image-mode toggle work.
- Hotspot opens/closes; camera pause/resume controls work.
- Client-side transitions from homepage and architecture page into the journey.
- Pilgrim checklist persists after reload in localStorage; guide accordion opens.
- Gallery filters produce four documentary photographs and two generated artworks.
- Telugu introduction switch updates the content language.
- Mobile menu opens and dismisses with Escape.
- Reduced-motion mode defaults to documentary images and supports chapter navigation.
- Tablet (768×1024) and narrow mobile (320×568) have no horizontal overflow.
- Chrome with WebGL disabled displays the fallback and supports chapter navigation.
- Local dependencies reported zero known vulnerabilities during installation.

Tests: `tests/camera-path.test.mjs`, `tests/browser-check.mjs`, `tests/interaction-check.mjs`. Browser scripts expect the production `out/` directory served at http://127.0.0.1:3000. Screenshots and the browser result JSON are in ignored `test-results/`.

## Repairs verified

- Repositioned foreground-obstructing procedural hills and adjusted the camera composition after screenshot inspection.
- Distinguished the golden shrine roof from the white gateway tower in the illustrative model.
- Added portable route payload aliases for the Windows static-export issue documented in vercel/next.js#85374. Both direct routes and client navigation now resolve without missing requests.

## Limits

Browser automation used local Chrome and software WebGL; performance on physical phones is not certified. Speech voices and pronunciation were not audibly reviewed. Translations require native-speaker review. The model remains an artistic interpretation, without a surveyed licensed GLB or restricted interior. No formal WCAG conformance claim is made.

## Publication

Sites created project `appgprj_6adcfecac7bc8191ad5667299c9dcef9` earlier in this session, and its exact ID is preserved in `.openai/hosting.json`. The source credential expired before packaging. Both credential renewal and a subsequent project lookup returned `SitesConnectorError: Sites project not found` (404). No source was pushed, no version was deployed, and the expected URL is not a verified live site. The local production build is ready for static hosting. Reconcile access to the same Sites project before resuming publication; do not silently create a duplicate or replace the persisted ID.
