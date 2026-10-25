# Sacred Seva integration

## Assets and missing archive

The supplied collage and all seven screenshots were inspected and integrated. The only Tirumala ZIP found in Downloads was the earlier `tirumala-experience-pack.zip`, containing the original eight pilgrimage scenes. It did not contain `README_FOR_CODEX.md` or `asset_manifest.json`; no new Seva ZIP was available. This was reported during work. The card imagery was therefore cropped deterministically from the supplied collage, excluding its generated lettering. Source collage and screenshot PNGs are retained in `public/assets/seva/`; images are served as individual WebPs with responsive screenshot derivatives. `public/assets/seva/asset_manifest.json` is a newly generated local provenance manifest, not a manifest read from the missing archive. `scripts/prepare-seva-assets.mjs` records crop regions and source names.

## Implemented

- `/sevas`: seven interactive English/Telugu Seva cards, appropriate motifs, descriptions, keyboard links, completion stored locally, and a supporting seven-image collection.
- `/sevas/suprabhatam`: entry screen, optional existing Stotram accompaniment, five chapters from predawn to sunrise, imagined architectural interpretation, four-section explanation and closing reflection. Native scrolling, previous/next, chapter selector, keyboard arrows, responsive motion controls, reduced motion, hidden-tab pauses, image loading/retry, one-image-ahead preloading and small scroll parallax are included.
- `/sevas/thomala`, `/sevas/archana`, `/sevas/kalyanotsavam`, `/sevas/abhishekam`, `/sevas/deepalankara`, `/sevas/brahmotsavam`: useful educational introductions with official-source links and explicit local completion controls.
- Gateway, pillar and lamp hotspots introduce architectural terms without treating the imagined corridor as an accessible or surveyed real temple route.
- Four explanation languages: English, Telugu, Hindi, Tamil. They are editorial translations and need native-speaker review before authoritative publication.
- Completion is recorded as explored educational content; no claim is made that a physical seva occurred.
- `SankalpaIntent` and `ApprovedVerseCue` interfaces prepare for later work. No personal-data form or simulated priest conversation is introduced.
- Home page preview and navigation expose the new collection. The existing shrine, golden-shrine/Stotram and twilight/Veyi audio associations, harathi, cursor effects and previous pilgrimage remain functional.

## Accuracy, audio and rendering limits

The assets support cinematic image layers and CSS perspective/parallax rather than free-roam 3D. No verified architectural model was supplied. All new imagery has artistic labels. The mandapam screenshot with a dancing figure is used only as a general supporting devotional illustration, not identified as a Venkateswara sanctum.

The existing user-supplied Stotram clip can accompany the experience after an explicit button interaction. It is not a full Suprabhatam recording. A verified timed transcript was not supplied, so no invented synchronized verses or ritual sounds are played. The opening invocation is an explicitly labeled reference reading from TTD. `approvedVerseCues` stays empty until accurate recording-specific timestamps and text are provided. No third-party recordings, Kage code or Kage imagery were copied.

## Sources

- [TTD Suprabhatam](https://www.tirumala.org/Suprabhatam.aspx): the 70-verse structure (29 Suprabhatam, 11 Stotram, 16 Prapatti, 14 Mangalasasanam), meaning and opening invocation.
- [TTD Daily Sevas](https://www.tirumala.org/DailySevas.aspx), [TTD Weekly Sevas](https://www.tirumala.org/WeeklySevas.aspx), [TTD Brahmotsavam](https://www.tirumala.org/Bramhostavam.aspx): educational context. No current schedules or booking availability are promised.
- [Kage](https://github.com/MengTo/kage): examined for layered storytelling, transitions and navigation inspiration. Its original code and artwork are not licensed for reuse and were not copied.

## Files and local launch

Main additions: `lib/sevas.ts`; `components/SevaGallery.tsx`, `SevaDetail.tsx`, `SuprabhatamExperience.tsx`; `app/sevas/page.tsx`, `app/sevas/[slug]/page.tsx`, `app/sevas/suprabhatam/page.tsx`; `app/sevas.css`; new image assets and preparation script; `tests/seva-check.mjs`.

Integration updates: `app/page.tsx`, `app/layout.tsx`, `components/Navigation.tsx`, `components/DevotionalAudioProvider.tsx`. Audio stops on route changes and continues normally within an experience.

Run `npm run dev`, or `npm run build` then `npm start`. The static build exports all 18 routes. No lint script exists; TypeScript runs as part of the build. Browser QA artifacts are written to ignored `test-results/`.
