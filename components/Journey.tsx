'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowRight, ArrowUpRight } from 'lucide-react';
import { SacredMark } from './Navigation';
import SceneStage from './pilgrimage/SceneStage';
import ChapterNavigation from './pilgrimage/ChapterNavigation';
import ExperienceControls from './pilgrimage/ExperienceControls';
import { dailyScenes, festivalScene, firstScene, pilgrimageNotice, pilgrimageScenes, responsiveImage, type PilgrimageScene } from '@/lib/pilgrimage';
import { dailyIndexAtScroll, readResume, sceneFromHash } from '@/lib/pilgrimage-navigation.mjs';
import './pilgrimage/pilgrimage.css';

const resumeKey = 'tirumala-pilgrimage-resume';
const motionKey = 'tirumala-pilgrimage-motion';
type NetworkNavigator = Navigator & { connection?: { saveData?: boolean; effectiveType?: string; addEventListener?: (type: string, listener: () => void) => void; removeEventListener?: (type: string, listener: () => void) => void } };

export default function Journey() {
  const [started, setStarted] = useState(false);
  const [scene, setScene] = useState<PilgrimageScene>(firstScene);
  const [resume, setResume] = useState<PilgrimageScene>();
  const [motion, setMotion] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [reducedData, setReducedData] = useState(true);
  const [navigationRevision, setNavigationRevision] = useState(0);
  const [hidden, setHidden] = useState(false);
  const [reflection, setReflection] = useState(false);
  const [entryError, setEntryError] = useState(false);
  const track = useRef<HTMLDivElement>(null);
  const lastLoaded = useRef<PilgrimageScene | undefined>(undefined);
  const pendingDestination = useRef<string | null>(null);
  const activeRef = useRef(scene);
  const navigating = useRef(false);
  const navigationFrame = useRef(0);
  const motionAllowed = motion && !reducedMotion && !reducedData && !reflection;
  const dailyIndex = dailyScenes.findIndex(s => s.id === scene.id);

  const select = useCallback((next: PilgrimageScene) => {
    pendingDestination.current = next.id;
    navigating.current = true;
    activeRef.current = next;
    setScene(next);
    setNavigationRevision(value => value + 1);
    setStarted(true);
    setReflection(false);
    history.replaceState(null, '', `${location.pathname}${location.search}#${next.id}`);
  }, []);

  useEffect(() => {
    const preference = matchMedia('(prefers-reduced-motion: reduce)');
    const network = (navigator as NetworkNavigator).connection;
    function preferences() {
      setReducedMotion(preference.matches);
      if (preference.matches) setMotion(false);
      setReducedData(Boolean(network?.saveData || /(^|-)2g$/.test(network?.effectiveType || '')));
    }
    preferences();
    const noMotion = new URLSearchParams(location.search).get('motion') === 'off';
    try {
      setMotion(!noMotion && !preference.matches && localStorage.getItem(motionKey) !== 'off');
      setResume(readResume(localStorage.getItem(resumeKey), pilgrimageScenes));
    } catch { setMotion(!noMotion && !preference.matches); }
    const applyHash = () => {
      const destination = sceneFromHash(location.hash, pilgrimageScenes);
      if (destination) select(destination);
    };
    applyHash();
    const visibility = () => setHidden(document.hidden);
    visibility();
    document.addEventListener('visibilitychange', visibility);
    preference.addEventListener('change', preferences);
    network?.addEventListener?.('change', preferences);
    window.addEventListener('hashchange', applyHash);
    return () => {
      document.removeEventListener('visibilitychange', visibility);
      preference.removeEventListener('change', preferences);
      network?.removeEventListener?.('change', preferences);
      window.removeEventListener('hashchange', applyHash);
    };
  }, [select]);

  // Native scrolling remains available: no wheel or touch interception.
  useEffect(() => {
    if (!started || scene.optional) return;
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (!track.current || navigating.current) return;
        const top = track.current.getBoundingClientRect().top + window.scrollY;
        const viewport = track.current.firstElementChild?.clientHeight || window.innerHeight;
        const index = dailyIndexAtScroll(window.scrollY, top, viewport, dailyScenes.length);
        const next = dailyScenes[index];
        if (activeRef.current.id !== next.id) {
          activeRef.current = next;
          setScene(next);
          setReflection(false);
          history.replaceState(null, '', `${location.pathname}${location.search}#${next.id}`);
        }
      });
    };
    const resize = () => {
      if (!track.current) return;
      const index = dailyScenes.findIndex(s => s.id === activeRef.current.id);
      const viewport = track.current.firstElementChild?.clientHeight || window.innerHeight;
      window.scrollTo({ top: track.current.offsetTop + index * viewport, behavior: 'instant' });
    };
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', resize);
    return () => { cancelAnimationFrame(frame); window.removeEventListener('scroll', update); window.removeEventListener('resize', resize); };
  }, [started, scene.optional]);

  useEffect(() => {
    if (!started || !pendingDestination.current || !track.current) return;
    const index = dailyScenes.findIndex(s => s.id === pendingDestination.current);
    const viewport = track.current.firstElementChild?.clientHeight || window.innerHeight;
    const top = track.current.offsetTop + Math.max(0, index) * viewport;
    pendingDestination.current = null;
    window.scrollTo({ top, behavior: 'instant' });
    cancelAnimationFrame(navigationFrame.current);
    navigationFrame.current = requestAnimationFrame(() => { navigating.current = false; });
    return () => cancelAnimationFrame(navigationFrame.current);
  }, [scene, started, navigationRevision]);

  useEffect(() => {
    if (!started) return;
    try { localStorage.setItem(resumeKey, JSON.stringify({ version: 1, sceneId: scene.id })); } catch {}
    setResume(scene);
  }, [scene, started]);

  // Preload one adjacent daily image only. The optional festival requires a choice.
  useEffect(() => {
    if (hidden || reducedData || scene.optional) return;
    const next = dailyScenes[dailyScenes.findIndex(s => s.id === scene.id) + 1];
    if (!next) return;
    const preload = new window.Image();
    const attributes = responsiveImage(next);
    preload.sizes = attributes.sizes;
    preload.srcset = attributes.srcSet || '';
    preload.src = attributes.src;
    return () => { preload.onload = null; preload.onerror = null; };
  }, [scene, hidden, reducedData]);

  useEffect(() => {
    if (!started) return;
    const keyboard = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      if (target.closest('input,select,textarea,button,a,[contenteditable=true]') || event.altKey || event.ctrlKey || event.metaKey) return;
      const index = dailyScenes.findIndex(s => s.id === activeRef.current.id);
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        if (index >= 0 && index < dailyScenes.length - 1) select(dailyScenes[index + 1]);
        else setReflection(true);
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        if (activeRef.current.optional) select(dailyScenes.at(-1)!);
        else if (index > 0) select(dailyScenes[index - 1]);
      }
    };
    window.addEventListener('keydown', keyboard);
    return () => window.removeEventListener('keydown', keyboard);
  }, [started, select]);

  function toggleMotion() {
    const next = !motion;
    setMotion(next);
    try { localStorage.setItem(motionKey, next ? 'on' : 'off'); } catch {}
    const url = new URL(location.href);
    if (next) url.searchParams.delete('motion'); else url.searchParams.set('motion', 'off');
    history.replaceState(null, '', url.pathname + url.search + url.hash);
  }
  function startWithoutMotion() {
    setMotion(false);
    try { localStorage.setItem(motionKey, 'off'); } catch {}
    const url = new URL(location.href); url.searchParams.set('motion', 'off');
    history.replaceState(null, '', url.pathname + url.search);
    select(firstScene);
  }
  function restart() {
    setStarted(false); setReflection(false); setScene(firstScene);
    activeRef.current = firstScene;
    pendingDestination.current = null;
    navigating.current = false;
    lastLoaded.current = undefined;
    history.replaceState(null, '', location.pathname + location.search);
    window.scrollTo({ top: 0, behavior: 'instant' });
  }
  const brand = <Link href="/" className="brand pilgrimage-brand"><SacredMark/><span>TIRUMALA<small>DIGITAL HERITAGE</small></span></Link>;

  return <main id="main" className="pilgrimage" data-started={started} data-motion={motionAllowed}>
    {!started ? <>
      <div className="pilgrimage-topbar">{brand}<Link href="/about/#artwork">About this interpretation <ArrowUpRight size={16}/></Link></div>
      <section className="pilgrimage-entry">
        <div className="pilgrimage-entry-copy"><p className="eyebrow">THE HILLS. THE ASCENT. THE THRESHOLD.</p>
          <h1>A pilgrimage,<br/><em>at your own pace.</em></h1>
          <p>Follow the changing landscape from morning in the foothills to a quiet moment outside the temple at dusk.</p>
          <p className="entry-format">Seven moments. An optional celebration.<br/>A cinematic 2.5D journey through still images.</p>
          <button className="button" onClick={() => select(firstScene)}>Begin the pilgrimage <ArrowRight size={18}/></button>
          <button className="entry-no-motion" onClick={startWithoutMotion}>Explore without motion <ArrowRight size={16}/></button>
          {resume && <button className="entry-resume" onClick={() => select(resume)}>Resume: {resume.title}{resume.optional ? ' (optional)' : ''} <ArrowRight size={15}/></button>}
        </div>
        <figure className="pilgrimage-entry-image">
          {entryError ? <div className="scene-error"><p>The opening image could not load. You can still begin the journey.</p><button onClick={() => setEntryError(false)}>Retry image</button></div> : <img {...responsiveImage(firstScene, reducedData)} alt={firstScene.alt} fetchPriority="high" onError={() => setEntryError(true)}/>}
          <figcaption>01 / Dawn at the foothills <span>AI artistic reconstruction</span></figcaption>
        </figure>
      </section>
      <div className="entry-foot"><p>{pilgrimageNotice} The chapter order is narrative, not a verified walking map.</p><span>Sound unavailable · No audio supplied</span></div>
    </> : <>
      <h1 className="sr-only">A pilgrimage through Tirumala</h1>
      <div ref={track} className="pilgrimage-track" style={{ height: scene.optional ? '100svh' : `${dailyScenes.length * 100}svh` }}>
        <div className="pilgrimage-shell">
          <div className="pilgrimage-topbar">{brand}<Link href="/about/#artwork">About the scenes <ArrowUpRight size={16}/></Link></div>
          <div className="scene-heading"><p>{scene.label}</p><span aria-live="polite" aria-atomic="true">{scene.optional ? 'Optional festival' : `${String(dailyIndex + 1).padStart(2, '0')} / ${String(dailyScenes.length).padStart(2, '0')}`}</span></div>
          <SceneStage key={scene.id} scene={scene} previous={lastLoaded.current} motion={motionAllowed} hidden={hidden} reducedData={reducedData} onReady={loaded => { lastLoaded.current = loaded; }}/>
          <section className="scene-story" tabIndex={0} aria-label={reflection ? 'Quiet reflection' : scene.title}>
            <div><h2>{reflection ? 'Stay here for a moment.' : scene.title}</h2><p>{reflection ? 'Our journey ends at the exterior threshold. Take as much time as you wish; there is no timed sequence and no interior to unlock.' : scene.description}</p></div>
            <div className="scene-story-context"><p>{reflection ? 'The festival is a separate, optional celebration. It is not the next step of an everyday temple visit.' : scene.context}</p>
              {(dailyIndex === dailyScenes.length - 1 || reflection) && !scene.optional && <button onClick={() => select(festivalScene)}>Explore the optional festival <ArrowUpRight size={15}/></button>}
              {reflection && <Link href="/pilgrim-guide">Prepare for a real visit <ArrowUpRight size={15}/></Link>}
            </div>
          </section>
          <ChapterNavigation scene={scene} onSelect={select} onReflect={() => { if (scene.optional) select(dailyScenes.at(-1)!); setReflection(true); }}/>
          <ExperienceControls motion={motionAllowed} locked={reducedMotion ? 'Reduced motion' : reducedData ? 'Reduced data' : reflection ? 'Still reflection' : undefined} onMotion={toggleMotion} onRestart={restart}/>
          <div className="pilgrimage-progress" role="progressbar" aria-label="Everyday journey progress" aria-valuemin={1} aria-valuemax={dailyScenes.length} aria-valuenow={scene.optional ? dailyScenes.length : dailyIndex + 1}><span style={{ width: `${(scene.optional ? 1 : (dailyIndex + 1) / dailyScenes.length) * 100}%` }}/></div>
        </div>
      </div>
      <section className="pilgrimage-end"><p className="eyebrow">AT THE EXTERIOR THRESHOLD</p><h2>The journey can end <em>in stillness.</em></h2><p>{pilgrimageNotice}</p><div><button className="button" onClick={() => { select(dailyScenes.at(-1)!); setReflection(true); }}>Quiet reflection</button><button onClick={() => select(festivalScene)}>Optional festival <ArrowRight size={17}/></button><Link href="/heritage">Continue reading <ArrowRight size={17}/></Link></div><span><ArrowDown size={14}/> Scroll naturally, or use Previous / Next and the left / right arrow keys.</span></section>
    </>}
  </main>;
}
