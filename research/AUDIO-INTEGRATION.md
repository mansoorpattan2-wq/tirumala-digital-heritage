# Devotional audio integration

Implemented locally on 25 October 2026. No new dependencies or publication.

## Files

- `components/DevotionalAudioProvider.tsx`: one persistent HTMLAudioElement controller in the root layout, stored volume/mute preferences, route-exit and pagehide cleanup.
- `components/AudioControl.tsx`: compact floating speaker, optional panel, accessible playback, track and volume controls; scroll-aware positioning avoids shrine action controls.
- `lib/devotional-audio.mjs`: playlist lifecycle, sequential track switching, fade-in/out, playback rejection, error handling, listener/timer cleanup, and protection against stale asynchronous playback operations.
- `lib/devotional-audio-manifest.json`: build-generated availability; no missing audio is requested.
- `app/devotional-audio.css`: themed compact controls and reduced-motion behavior.
- `app/layout.tsx`, `components/ShrineExperience.tsx`: provider and shrine enter/close integration; existing visual and harathi controls preserved.
- `public/audio/venkateswara-stotram.mp3`, `public/audio/veyi-namala-vada.mp3`: the owner's two supplied MP3 recordings, copied without lossy re-encoding.
- `public/audio/credits.json`, `public/audio/README.md`: source mapping and user authorization; independent recording redistribution rights and exact reference-recording identity are not verified.
- `scripts/prepare-devotional-audio.mjs`, `package.json`: predev/prebuild MP3 signatures, nonempty files, source/approval checks, playlist manifest generation.
- `scripts/serve.mjs`: audio MIME types, HEAD and byte ranges for seeking and mobile media delivery.
- `tests/audio-check.mjs`: browser playback checks using the actual supplied recordings, not simulated media.

## Source verification

The first reference resolves to [Sri Venkatesha Stotram - Invoking the Lord's Mercy](https://www.youtube.com/watch?v=_yhBlE3D9cc). The second supplied [YouTube reference](https://www.youtube.com/watch?v=l1pezLiSbZY) could not be fetched or its title independently verified. Neither reference was downloaded, scraped or embedded. The later user-supplied recordings enable playback. The Stotram filename identifies the intended first song; the WhatsApp recording occupies the requested Veyi Namala Vada slot, with its song identity unverified. No claim is made that these are identical to either reference performance.

## Playback and limits

Open the shrine to start track one at zero from that user gesture. If a browser rejects playback, Enable Divine Audio retries on a fresh gesture. The playlist alternates continuously through the same element without overlapping sources. Mute is immediate and volume/mute persist locally. Twilight artwork selects Veyi Namala Vada; golden shrine artwork selects Venkateswara Stotram. Artwork switches preserve an explicit music pause. Door opening starts Stotram. Harathi and visual atmosphere controls preserve playback. Closing the doors or navigating away fades out, stops and clears the source; re-entering begins track one again. No hidden YouTube player or audio API key is used.

Chromium playback with both actual files, native end-of-track playlist looping, source switching, mute/unmute, 35% fade-in, pause/resume, volume persistence, no duplicate player, shrine-close and route-exit cleanup, mobile panel geometry, keyboard close, and HTTP byte-range delivery passed. Build including TypeScript and all seven existing automated tests passed. The existing shrine browser suite passed after integration. Android/iOS physical devices were not available; iOS can reserve volume control to system hardware.
