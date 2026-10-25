# Phase 2: Personal virtual prayer

## Entry and integration

Open `/sankalpa/` to enter the existing imagined shrine with the prayer guide, or choose **Personal virtual prayer** from the opened `/darshan/` shrine. The existing twelve-second Harathi now automatically leads into the front-facing guide's greeting when it completes. Manual End harathi still ends the original effect. The gallery, six Seva closing scenes, navigation and Suprabhatam closing scene link to personal prayer. Existing shrine images and both MP3s are preserved; no independent chatbot page or second music player is created.

## Working flow

The deterministic reducer implements all requested states: HARATHI, GREETING, COLLECT_NAME, COLLECT_GOTHRAM, COLLECT_FAMILY, COLLECT_INTENTION, CONFIRM_DETAILS, SANKALPAM, ARCHANA, BLESSINGS, COMPLETE. Questions appear one at a time. Gothram, family and intention can be skipped. Gothram is never inferred. Confirmation supports editing each field and returns to review before proceeding. Unicode input is normalized and length bounded. Names are rendered as escaped React text.

The shrine's approved user-supplied music accompanies optional Harathi. A quiet Web Audio bell is generated only after a user interaction and is labeled synthesized. The existing background player supports transient volume reduction without changing the visitor's stored volume preference; music ducks for the guide and microphone. Skip, replay, mute, motion controls, image failure fallback and reduced motion are supported. A hidden tab pauses the Harathi countdown and stops voice capture/narration.

After Harathi, the back-facing artwork transitions into a matching generated front-facing guide using CSS opacity and shallow perspective. This is an explicitly labeled 2.5D artistic representation, not a rigged animated 3D priest, a real priest, or a live religious service.

English, Telugu, Hindi and Tamil have scripted questions, help, confirmations, plain-language personal prayer templates and personal closing wishes. Symbolic Archana animates flowers in response to the visitor's action. Actual sacred recitation has a visible placeholder awaiting an authorized, tradition-reviewed script or recording. No Sanskrit mantra or timestamp alignment is invented.

## Voice and privacy

No server AI provider, credentials or priest model were configured. This implementation uses a deterministic local dialogue, not a claimed LLM integration. It needs no API key. Browser narration and browser speech recognition are separate, explicit opt-ins. The on-screen disclosure explains that the browser's speech service may process audio or narration text outside the device. The website itself sends no personal details to an AI endpoint.

Speech recognition uses the chosen locale when supported, requests microphone access only after consent and a Start microphone click, shows listening state, and writes only an editable input draft. It never auto-submits a recognized answer. Unsupported languages, unsupported browsers, denied permissions, network/service failures and missing installed voices retain the complete text route. Spoken captions highlight actual speech boundary events when supplied by the browser; no fabricated lip synchronization is used. Microphone capture aborts on state/language changes, revoked consent, hidden tabs, reset, close and unmount. Browser site settings remain the place to revoke a previously granted browser permission.

Personal details live only in React memory for the open prayer. No names, gothrams, family details or intentions are saved to localStorage/sessionStorage, logged, put in URLs, or sent through application requests. Reset and close clear them. Volume/mute preferences continue to use the existing nonpersonal audio storage.

## Files

- `app/sankalpa/page.tsx`, `app/sankalpa.css`
- `components/sankalpa/SankalpaExperience.tsx`, `usePrayerVoice.ts`
- `components/SankalpaInvitation.tsx`
- `lib/sankalpa-machine.mjs`, `lib/sankalpa-copy.ts`, `lib/prayer-bell.ts`
- Front-facing priest source and responsive WebPs in `public/assets/devotional/`
- `tests/sankalpa.test.mjs`, `tests/sankalpa-check.mjs`

Integrated through `ShrineExperience.tsx`, `SevaGallery.tsx`, `SevaExperienceLayout.tsx`, `SuprabhatamExperience.tsx`, `Navigation.tsx`, the root stylesheet imports and the existing audio controller/provider.

## Validation and limits

Production build with TypeScript passed. All 14 automated tests passed, including seven new state-machine tests. Browser checks exercise all eleven states, editable microphone transcripts and confirmations, optional gothram, four languages, personalized reflection, symbolic flowers, reset, memory-only details, absence of personal application network requests, close/reopen, four viewports and reduced motion. Browser recognition and narration adapters were mocked to test permission gating, locale selection and event handling; real microphone recognition, installed voices and pronunciation require testing on the target browser/device. The existing actual-recording audio suite passed after audio ducking was added.

Translations are editorial and need native-speaker review before authoritative publication. A real 3D turn needs a suitable licensed rigged model and animations. Traditional recitation needs an authorized reviewed recording or script with real timestamps. Optional LLM services need an explicitly configured server-side provider and a disclosed consent flow before receiving personal details. No deployment or commit is performed in this phase; the implementation is prepared for the user's next review and release step.

## References

Browser behavior was checked against [SpeechRecognition documentation](https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition) and [speech boundary events](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesisUtterance/boundary_event). Availability and cloud/local handling depend on the browser and chosen voice.
