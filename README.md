# Tirumala Digital Heritage

An independent devotional and cultural heritage website built with Next.js and React. Includes a cinematic introduction, an artistic pilgrimage, an imagined shrine, seven Sacred Seva experiences, local progress, sourced explanations and user-controlled audio.

## Run locally

Requires Node.js 20.9 or newer.

```sh
npm ci
npm run dev
```

Open http://localhost:3000. In Windows PowerShell, use `npm.cmd` if script execution is restricted.

```sh
npm run build
npm start
```

The production site is statically exported to `out/`. `vercel.json` configures the production build for Vercel. No environment variables or external API keys are required.

## Experiences

- `/`: cinematic awakening, portal reveal and diya loading progress; optional sound, skip and session-aware replay.
- `/journey`: seven artistic pilgrimage chapters with an optional festival, keyboard/scroll navigation, reduced motion and resume.
- `/darshan`: an imagined shrine with opening doors, portraits, symbolic harathi, Stotram and Veyi Namala Vada accompaniment.
- `/sevas`: all seven Sevas, including the five-chapter Suprabhatam experience and six interactive scenes with original synthesized ambience.
- `/heritage`, `/architecture`, `/festivals`, `/gallery`, `/guide`, `/pilgrim-guide`, `/about`: educational references, source credits, language guide and practical official-service links.

## Checks

```sh
npm run typecheck
npm test
npm run build
```

With the production preview running, browser checks use an installed Chrome browser:

```sh
node tests/browser-check.mjs
node tests/audio-check.mjs
node tests/seva-check.mjs
node tests/intro-seva-audio-check.mjs
```

## Artwork, audio and sources

The visual experiences use supplied artistic illustrations and image layers with CSS/GSAP motion. They are not official TTD photography, a surveyed 3D reconstruction, a verified walking route, or footage of restricted ceremonies. Documentary photographs have separate credits in `public/images/credits.json`.

The two shrine recordings were supplied by the project owner; their provenance and licensing limits are recorded in `public/audio/credits.json`. The six WAV ambience cues are original synthesized instrumental compositions supplied for this project. They are not traditional chanting or real TTD ceremonial audio. Verified chanting and verse timestamps remain clearly marked as pending.

See `research/RESEARCH.md`, `research/SACRED-SEVA-INTEGRATION.md` and `research/INTRO-AND-SIX-SEVAS.md` for implementation details and official sources. Translations are editorial drafts awaiting native-speaker review. Symbolic interactions do not perform physical offerings or provide bookings.

This is an independent educational project, not affiliated with or endorsed by Tirumala Tirupati Devasthanams.
