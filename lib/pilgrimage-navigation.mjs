/** Scrolling the daily route can never select the optional festival. */
export function dailyIndexAtScroll(scrollY, trackTop, viewportHeight, count) {
  if (viewportHeight <= 0 || count < 1) return 0;
  return Math.min(count - 1, Math.max(0, Math.round((scrollY - trackTop) / viewportHeight)));
}
export function sceneFromHash(hash, scenes) {
  let id;
  try { id = decodeURIComponent(hash.replace(/^#/, '')); } catch { return undefined; }
  return scenes.find(scene => scene.id === id);
}
export function readResume(value, scenes) {
  try {
    const saved = JSON.parse(value || 'null');
    if (saved?.version !== 1) return undefined;
    return scenes.find(scene => scene.id === saved.sceneId);
  } catch { return undefined; }
}
