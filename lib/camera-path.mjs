/** Pure, deterministic path sampling: the same scroll position always gives the same camera. */
export function samplePath(chapters, progress) {
  const p = Math.max(0, Math.min(1, progress));
  const index = Math.min(chapters.length - 1, Math.floor(p * chapters.length));
  const chapter = chapters[index];
  const local = Math.max(0, Math.min(1, (p - chapter.range[0]) / (chapter.range[1] - chapter.range[0])));
  const t = local * local * (3 - 2 * local);
  return { index, position: chapter.cameraStart.map((v, i) => v + (chapter.cameraEnd[i] - v) * t), target: chapter.target };
}
