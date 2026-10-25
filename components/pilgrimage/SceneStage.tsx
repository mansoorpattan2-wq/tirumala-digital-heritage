'use client';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { RotateCcw } from 'lucide-react';
import { responsiveImage, type PilgrimageScene } from '@/lib/pilgrimage';

type Props = { scene: PilgrimageScene; previous?: PilgrimageScene; motion: boolean; reducedData: boolean; hidden: boolean; onReady: (scene: PilgrimageScene) => void };

export default function SceneStage({ scene, previous, motion, reducedData, hidden, onReady }: Props) {
  const image = useRef<HTMLImageElement>(null);
  const tween = useRef<gsap.core.Tween | null>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [attempt, setAttempt] = useState(0);
  const [showPrevious, setShowPrevious] = useState(Boolean(previous));
  useEffect(() => {
    if (status !== 'ready') return;
    const timer = setTimeout(() => setShowPrevious(false), motion ? 420 : 0);
    if (scene.push > 1) tween.current = gsap.fromTo(image.current, { scale: 1 }, { scale: scene.push, duration: 7, ease: 'sine.inOut', paused: true });
    return () => { clearTimeout(timer); tween.current?.kill(); tween.current = null; };
  }, [status, scene.push, attempt]);
  useEffect(() => {
    if (motion && !hidden && !reducedData) tween.current?.resume();
    else tween.current?.pause();
  }, [motion, hidden, reducedData, status, attempt]);

  return <figure className="pilgrimage-scene" data-status={status} data-motion={motion && !hidden && !reducedData} aria-busy={status === 'loading'}>
    <div className="pilgrimage-image-frame">
      {showPrevious && previous && status !== 'error' && <img {...responsiveImage(previous, reducedData)} className="pilgrimage-image scene-outgoing" alt="" aria-hidden="true" style={{ objectPosition: previous.objectPosition }}/>}
      {status !== 'error' && <img key={attempt} ref={image} {...responsiveImage(scene, reducedData)} alt={scene.alt}
        className={`pilgrimage-image scene-current ${status === 'ready' ? 'is-loaded' : ''}`} style={{ objectPosition: scene.objectPosition }}
        loading="eager" fetchPriority="high" onLoad={() => { setStatus('ready'); onReady(scene); }} onError={() => setStatus('error')}/>}
      {status === 'loading' && <div className="scene-load-message" role="status">Loading {scene.title.toLowerCase()}…</div>}
      {status === 'error' && <div className="scene-error" role="status"><strong>This scene could not load.</strong><p>{scene.alt} You can retry or continue to the next chapter.</p><button onClick={() => { setStatus('loading'); setAttempt(attempt + 1); }}><RotateCcw size={17}/> Retry image</button></div>}
    </div>
    <figcaption>AI artistic reconstruction <span>·</span> {scene.optional ? 'Optional celebration' : 'Exterior journey'} <span>·</span> Not a verified map</figcaption>
  </figure>;
}
