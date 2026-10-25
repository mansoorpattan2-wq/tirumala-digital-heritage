'use client';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { dailyScenes, festivalScene, type PilgrimageScene } from '@/lib/pilgrimage';
export default function ChapterNavigation({ scene, onSelect, onReflect }: { scene: PilgrimageScene; onSelect: (scene: PilgrimageScene) => void; onReflect: () => void }) {
  const index = dailyScenes.findIndex(s => s.id === scene.id);
  const last = index === dailyScenes.length - 1;
  return <nav className="pilgrimage-navigation" aria-label="Pilgrimage chapters">
    <button disabled={index === 0} onClick={() => onSelect(scene.optional ? dailyScenes.at(-1)! : dailyScenes[index - 1])} aria-label={scene.optional ? 'Return to dusk' : 'Previous chapter'}><ArrowLeft size={18}/><span>{scene.optional ? 'Back to dusk' : 'Previous'}</span></button>
    <label className="chapter-select"><span className="sr-only">Choose a chapter</span><select value={scene.id} onChange={event => { const selected = [...dailyScenes, festivalScene].find(s => s.id === event.target.value); if (selected) onSelect(selected); }}>
      <optgroup label="The everyday journey">{dailyScenes.map((s, i) => <option key={s.id} value={s.id}>{String(i + 1).padStart(2, '0')} · {s.title}</option>)}</optgroup>
      <optgroup label="Separate optional chapter"><option value={festivalScene.id}>08 · Festival procession (optional)</option></optgroup>
    </select></label>
    <button onClick={() => last || scene.optional ? onReflect() : onSelect(dailyScenes[index + 1])} aria-label={last || scene.optional ? 'Quiet reflection' : 'Next chapter'}><span>{last || scene.optional ? 'Reflect' : 'Next'}</span><ArrowRight size={18}/></button>
  </nav>;
}
