# Combined introduction and six Seva experiences

## Introduction

The first homepage visit in a browsing session presents a single opening combining the supplied sunrise atmosphere, glowing portal and lamp-lit pathway. The Vaishnava Namam uses the existing site SVG. A diya progress ring is implemented in `components/SacredLoader.tsx`. `components/CinematicIntro.tsx` orchestrates the opening, with CSS image layers, a small decorative particle pool, mist, typography and a short forward portal transition. No additional WebGL renderer or dependency is created.

Preparation is real: three image loads/decodes and the browser font readiness promise are tracked as four tasks. Failures settle their tasks and show a fallback note; a seven-second timeout enables entry if optional preparation is slow. Skip remains available from the start. The percentage reflects completed preparation tasks, not an artificial time counter.

The intro is homepage-only, skips deep links and ordinary internal navigation, stores completion in sessionStorage, and provides Replay Intro in navigation. It has a modal focus cycle, inert background, Escape/skip, safe-area spacing, reduced-motion presentation, silent default and optional user-initiated sound through the existing audio controller. The current homepage remains intact beneath the overlay. The title and Telugu copy are HTML text.

Main files: `components/CinematicIntro.tsx`, `components/SacredLoader.tsx`, `app/cinematic-intro.css`, `public/assets/intro/`. Integration changes: `app/page.tsx`, `app/layout.tsx`, `components/Navigation.tsx`.

## Audio archive

Extracted `tirumala_six_seva_audio_pack.zip` to `research/six-seva-audio-pack/` and read its `README_FOR_CODEX.md` and `audio_manifest.json`. All six original WAVs are installed in `public/audio/sevas/`. They are 16-second mono 22050 Hz synthesized instrumental cues. The supplied manifest authorizes their use in this project and explicitly states that they are not traditional chants, live recordings or official TTD audio. Those distinctions are visible in the experience captions and player.

Mapping: `thomala_seva_original_ambience.wav` → Thomala; `sahasranama_archana_original_ambience.wav` → Archana; `kalyanotsavam_original_ambience.wav` → Kalyanotsavam; `abhishekam_original_ambience.wav` → Abhishekam; `sahasra_deepalankara_original_ambience.wav` → Deepalankara; `brahmotsavam_original_ambience.wav` → Brahmotsavam.

`scripts/prepare-seva-audio.mjs` validates RIFF/WAVE files and builds `lib/seva-audio-manifest.json`. The existing predev/prebuild preparation runs it. The two shrine MP3s were preserved. One HTMLAudioElement serves the route-appropriate playlist and avoids overlapping sources. Each experience offers Begin with ambience or Explore silently, fades, pause, mute, remembered volume and replay. Navigation fades/stops the previous source. Single-cue repeats use their existing fades and the controller's fade-in; they are not described as seamless crossfades.

Traditional Sanskrit/Telugu chanting has a clearly labeled unavailable slot. No empty audio file is requested, and no invented mantras, pronunciation or synchronized verses are presented.

## Six distinct interactions

- Thomala: three-stage flow, supplied deity artwork, restrained garland motif, jasmine/marigold/rose explorer, English/Telugu botanical explanations and an on-screen symbolic flower offering.
- Archana: searchable three-name starter collection (Venkateswara, Srinivasa, Govinda), contextual explanations and symbolic reflection. The complete 1,008-name dataset, pronunciation and timed recitation await verified review.
- Kalyanotsavam: artistic setting, three-stage flow and interactive pavilion/garland/deity context. No authentic ceremony footage is claimed.
- Abhishekam: illustrated vessels and water/milk/sandalwood explanation selectors; TTD's Friday observance is described without staging an actual sanctum ritual.
- Deepalankara: an interactive field of 96 symbolic lamps (48 in light mode), individual lighting, full illumination and reset, with CSS flame motion and reduced-motion fallback.
- Brahmotsavam: nine-day educational timeline and Garuda, Hanumantha, sun/moon and chariot illustrations. Traditional order is sourced from TTD. The annual festival is distinguished from Arjitha Brahmotsavam.

Shared implementation: `components/SevaExperienceLayout.tsx`, `components/SevaInteractions.tsx`, `lib/seva-experiences.ts`, `app/seva-experiences.css`, and the existing audio provider/player. Stages, explanations, image failures/retry, performance mode, motion control, local completion and navigation work across all six. The optional virtual-prayer CTA opens an honest integration note; no unfinished route or live priest conversation is simulated.

## Sources and limits

Official sources inspected: [Archana](https://www.tirumala.org/Archana.aspx), [Abhishekam](https://www.tirumala.org/Abhishekam.aspx), [Brahmotsavam order](https://www.tirumala.org/Bramhostavam.aspx), and the previously inspected [Daily Sevas](https://www.tirumala.org/DailySevas.aspx). Flower popovers are botanical examples, not a verified temple garland recipe. Name explanations are contextual descriptions rather than invented etymologies. Telugu explanations remain editorial and need native-speaker review before authoritative publication.

These are image-based artistic experiences with CSS depth, lighting and motion, not surveyed 3D reconstructions. No current festival dates, bookings or physical offerings are implied. The earlier 42-image ZIP was not supplied; available collage crops and screenshots continue to be used with provenance notes.

## Verification

`npm run build` passed, including TypeScript. All seven existing automated tests passed. `tests/intro-seva-audio-check.mjs` played and decoded all six actual WAVs (16 seconds each), verified every interactive Seva, no autoplay, optional intro sound, one audio element, route cleanup, mobile layouts, intro preparation/skip/replay/session behavior, reduced motion and a deliberately failed portal asset fallback. `tests/audio-check.mjs` passed for both actual shrine MP3s, their image associations, saved-mute restoration, playlist controls and cleanup. Physical Android/iOS devices were not available; mobile viewport checks used Chrome emulation. iOS may reserve volume control to the operating system.

Use `npm run dev`, or `npm run build` then `npm start`. The local preview is http://127.0.0.1:3000/. Replay the intro with http://127.0.0.1:3000/?intro=replay. No deployment was performed.
