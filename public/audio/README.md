# Devotional playlist

The project owner supplied these two recordings on 25 October 2026 and requested their use:

1. `venkateswara-stotram.mp3`: copied without re-encoding from `Kamalakucha - Sri Venkateswara Stotram.mp3.mpeg`.
2. `veyi-namala-vada.mp3`: copied without re-encoding from `WhatsApp Audio 2026-10-25 at 2.15.37 PM.mpeg` for the requested second playlist slot. The WhatsApp filename does not independently establish the recording's song title.

Both sources have MP3 signatures despite their `.mpeg` extensions. `credits.json` records user authorization and the limits of verified recording provenance. No audio was extracted from YouTube. The reference for the first song resolves to “Sri Venkatesha Stotram - Invoking the Lord's Mercy”; the second reference could not be verified. The supplied recordings have not been established as the identical reference recordings, and no independent redistribution license has been verified.

`npm run dev` and `npm run build` verify that both files are nonempty MP3s with approval/source notes, then regenerate `lib/devotional-audio-manifest.json`. Both tracks must pass before playback is enabled. Do not create empty placeholder MP3 files or manually force the generated manifest to ready.

Opening the shrine starts the first recording from zero using the same user gesture. One HTMLAudioElement handles the complete alternating playlist, 35% default volume, fades, play/pause, previous/next, instant mute, saved volume/mute, browser playback rejection, and cleanup. Twilight artwork selects Veyi Namala Vada; golden shrine artwork selects Venkateswara Stotram. Artwork switching preserves an explicit music pause and mute/volume settings. Door opening starts Stotram. Harathi and atmosphere controls do not restart the audio instance. Closing doors or leaving `/darshan` fades and stops playback. Mobile operating systems may reserve volume adjustment for hardware controls.
