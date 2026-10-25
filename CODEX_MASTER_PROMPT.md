# Codex master prompt — Tirumala immersive pilgrimage

You are working inside my existing website repository in VS Code. Implement the upgrade, do not stop at a proposal. First read AGENTS.md, inspect the stack, existing routes, renderer, dependencies, scripts, and current experience. Preserve working authentication, navigation, backend integrations, and unrelated user changes. Use the existing stack; avoid a framework rewrite. If assets or repository access are missing, report the exact missing inputs and complete independent work.

## Goal
Create a calm, believable, emotionally moving virtual pilgrimage inspired by Tirupati and Tirumala: foothills, ascent, arrival, temple surroundings, and a respectful festival finale. Natural materials, human-scale viewpoints, subtle motion and restrained sound should carry the experience. It must work beautifully on phones and desktops. Avoid generic landing-page card grids, sci-fi effects, neon temples, giant floating words, heavy bloom, or a constant roller-coaster camera.

## Asset installation
The supplied pack contains public/assets/tirumala/01-seven-hills-dawn.png through 08-festival-procession.png and scene-manifest.json. Merge the public folder into this repository. Never guess that missing images exist, use unrelated stock images, stretch an image, or hotlink search thumbnails. Keep originals; generate responsive WebP/AVIF derivatives locally if supported by installed tools. Inspect each actual image before choosing crop and focal point. All supplied images are AI artistic reconstructions, not verified documentation, map data, real-time imagery, HDR environment maps, seamless textures, 360 panoramas, or 3D models.

## Truthful treatment
Include a concise accessible About note: "An AI-assisted artistic pilgrimage inspired by Tirumala. Architecture and scenes may differ from the real site." The broad chapter order is narrative, not a verified walking map. Festival is a separate optional chapter rather than an everyday event. Do not infer the locations of all seven named hills from this imagery. Do not invent accessible sanctum interiors, main deity darshan imagery, sacred procedures, official TTD endorsement, or claims of complete corner-by-corner coverage. Stop the spatial approach at the exterior temple threshold. Offer a quiet reflection state there. Preserve the distinction between the white entrance gopuram and the inner gold Ananda Nilayam.

## Narrative and interactions
Provide a light entry screen with "Begin the pilgrimage", optional sound, and an immediately available "Explore without motion". Default sound off; load/play audio only after consent. No forced sign-in for public exploration unless the existing product requires it.
1. Dawn at the foothills: gentle reveal, breathing room, natural landscape.
2. Alipiri ascent: a grounded pilgrim-eye perspective, subtle forward movement.
3. Ghat road: a separate travel chapter; do not pretend the walking stairs turn into a road.
4. Arrival at Tirumala: let visitors pause and explore the exterior setting.
5. Swami Pushkarini: calm water scene with restrained visual motion.
6. Temple entrance, daylight: clear architectural focal point, readable fine detail.
7. Temple entrance, dusk: an explicit time-of-day transition, preserve visual identity as far as the separate generated images allow.
8. Festival procession: optional devotional festival gallery/scene, clearly separate from the everyday route.

Make the complete journey navigable using scroll, previous/next buttons, keyboard, and an accessible chapter selector. Use short readable labels with unobtrusive progress. Add a return-to-start and resume state only when compatible with the app. Do not trap scroll, capture every touch gesture, or require drag to discover the next chapter. Make sound and motion controls persist visibly.

## Rendering approach
Choose based on inspected code and assets. If an existing Three.js / React Three Fiber renderer exists, reuse it. If only flat images are available, implement an honest cinematic 2.5D experience with shallow camera push/pan and smooth chapter transitions. A flat-image slideshow cannot provide true free-roam temple geometry. Never wrap ordinary landscape images over an entire sphere or cube, stretch them into fake 360 views, hallucinate unseen sides of a building, or create broad camera orbit from a single view.

For 2.5D use correctly aspect-fitted image planes or DOM image layers, a very small crop-safe pan/zoom, and brief eased crossfades. Avoid making architecture warp or "swim". Only animate isolated foreground or water layers if appropriate masks/depth assets are genuinely available and visually checked. Do not displace entire images to imitate water. No lens flare or particles over every chapter.

For future real 3D support, keep a clean optional scene/model adapter. Require verified licensed GLB models, surveyed layout, or genuine panoramic photography before enabling navigation around reconstructed architecture. Do not block this deliverable on unavailable models.

## Visual direction
Image-led, restrained and spacious. Sandstone/off-white UI, muted warm gold accent, deep forest green, high-contrast text. Minimal rounded surfaces; avoid covering the temple with text. Small side or bottom controls, 44px touch targets, safe-area padding, legible labels, visible focus. Respect the original image color, natural light and texture. Use smooth easing and short transitions rather than long cinematic delays. Permit pausing at every chapter.

## Audio
Use only supplied/licensed recordings. If none are present, keep audio unavailable or off with an honest label; no broken players. Do not download random devotional songs or fabricate authentic ritual audio. If sounds are supplied, use soft fades between forest ambience, gentle footsteps, distant bells, and festival ambience. Cap volume; provide independent mute. No autoplay or microphone requirement.

## Performance and accessibility
Preload only the first scene and next scene; lazy-load the rest. Use responsive derivatives, explicit dimensions, poster/placeholder, and a recoverable failed-image state. Do not fetch all full-resolution PNGs at entry. Limit device pixel ratio and WebGL workload on mobile; pause rendering when the tab is hidden and dispose textures on teardown. Do not add perpetual animation loops to a static DOM experience.
Respect prefers-reduced-motion, provide a no-motion route, accessible names, semantic headings, keyboard controls, and sufficient contrast. No inaccessible canvas-only navigation. Handle portrait crops, orientation changes, reduced data when detectable, WebGL unavailable/context loss, and slow networks with a DOM fallback. Preserve image focal points and avoid cropped-off temple towers.

## Implementation and validation
Create reusable scene data from the supplied manifest; avoid duplicating scene constants. Build small components appropriate to the existing stack, for example JourneyShell, SceneStage, ChapterNavigation, and ExperienceControls. Keep effects and event listeners scoped and cleaned up. Avoid new dependencies unless necessary.
Run the repository's existing build, lint/type checks, and relevant tests. Fix errors introduced by your work. Verify navigation, reload, reduced motion, sound consent, missing image fallback, touch scrolling, and desktop/phone layouts. Use real browser inspection if available. Report checks actually run; do not claim browser/performance measurements you did not perform.
Deliver the actual changes, list changed files, explain launch commands from the repository's package scripts, and clearly separate implemented behavior from future true-3D work.

Do not deploy or publish unless separately authorized. Finish the local integration completely.

