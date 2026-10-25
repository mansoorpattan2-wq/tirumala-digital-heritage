import manifest from '@/public/assets/tirumala/scene-manifest.json';

export const pilgrimageNotice = 'An AI-assisted artistic pilgrimage inspired by Tirumala. Architecture and scenes may differ from the real site.';
export type PilgrimageScene = (typeof manifest.chapters)[number] & {
  label: string; description: string; context: string; push: number;
};
// Paths, dimensions, order and optional status come exclusively from the supplied manifest.
const notes: Record<string, Pick<PilgrimageScene, 'label' | 'description' | 'context' | 'push'>> = {
  '01-seven-hills-dawn': { label: 'The beginning', description: 'Morning light meets the wooded foothills. Take a moment to arrive before the journey begins.', context: 'An imagined view inspired by Tirumala; the positions of the seven named hills cannot be inferred from this image.', push: 1.018 },
  '02-alipiri-ascent': { label: 'A walking perspective', description: 'Under the shade of a covered stairway, the ascent becomes a sequence of small, unhurried steps.', context: 'An Alipiri-inspired artistic scene. It is not a verified walking map or guidance on route conditions.', push: 1.012 },
  '03-ghat-road': { label: 'A separate way to travel', description: 'Now consider a different approach: the winding ghat road. The stairs do not turn into this road; this is a separate travel chapter.', context: 'A narrative change of viewpoint, not a continuous walking route or a navigational map.', push: 1.015 },
  '04-tirumala-arrival': { label: 'Time to arrive', description: 'The hills give way to an open exterior setting. Pause here and notice the scale of the entrance, the paving and the people.', context: 'An artistic reconstruction of an arrival setting. Buildings and spatial arrangements may differ from the real site.', push: 1 },
  '05-pushkarini': { label: 'A moment beside the water', description: 'A still view inspired by Swami Pushkarini. Reflections and open sky invite a slower pace.', context: 'The water is part of the supplied still image. No simulated ripples or inferred access routes are added.', push: 1 },
  '06-temple-day': { label: 'At the exterior threshold', description: 'Look at the white entrance gopuram and the distinct golden Ananda Nilayam behind it. Our spatial approach ends outside the temple.', context: 'AI artistic reconstruction, not verified architectural documentation. No sanctum interior or main-deity darshan is represented.', push: 1 },
  '07-temple-dusk': { label: 'A change of light', description: 'The story moves from daylight to dusk at the exterior threshold. Stay for a quiet reflection, with no need to move further.', context: 'Day and dusk were generated separately; architectural details may differ. This is a time-of-day transition, not a new interior destination.', push: 1 },
  '08-festival-procession': { label: 'Optional · a separate celebration', description: 'An artistic evocation of a devotional procession. This occasional celebration sits outside the everyday journey and is not a live event.', context: 'An AI-generated festival scene, not an event photograph, verified ritual sequence or representation of main-sanctum darshan.', push: 1 },
};
export const pilgrimageScenes: PilgrimageScene[] = manifest.chapters.map(scene => ({ ...scene, ...notes[scene.id] }));
export const dailyScenes = pilgrimageScenes.filter(scene => !scene.optional);
export const festivalScene = pilgrimageScenes.find(scene => scene.optional)!;
export const firstScene = dailyScenes[0];
export const sceneById = (id: string) => pilgrimageScenes.find(scene => scene.id === id);
export const sceneAdapter = { kind: 'image-2.5d', supportsFreeRoam: manifest.supportsFreeRoam3D, supports360: manifest.supports360, audio: null } as const;
// A future model adapter must provide provenance and bounds before it can be enabled.
export type VerifiedModelAdapter = { kind: 'verified-model'; modelUrl: string; licenseUrl: string; surveyReference: string; allowedExteriorBounds: readonly [number, number, number, number] };
export function responsiveImage(scene: PilgrimageScene, reducedData = false) {
  return { src: reducedData ? scene.srcSet.split(',')[0].trim().split(' ')[0] : scene.src, srcSet: reducedData ? undefined : scene.srcSet, sizes: '(max-width: 760px) 100vw, (max-width: 1400px) 90vw, 1260px', width: scene.width, height: scene.height };
}
