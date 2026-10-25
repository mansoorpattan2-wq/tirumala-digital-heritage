'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Flame, Pause, Play, RotateCcw, Sparkles, Volume2 } from 'lucide-react';
import { SacredMark } from './Navigation';
import { devotionalImages, devotionalNotice } from '@/lib/devotional';
import AudioControl from './AudioControl';
import { useDevotionalAudio } from './DevotionalAudioProvider';

export default function ShrineExperience() {
  const audio=useDevotionalAudio();
  const [opened, setOpened] = useState(false);
  const [withMusic,setWithMusic]=useState(true);
  const [selected, setSelected] = useState(0);
  const [motion, setMotion] = useState(false);
  const [reduced, setReduced] = useState(true);
  const [visible, setVisible] = useState(true);
  const [ritual, setRitual] = useState(false);
  const [ritualComplete, setRitualComplete] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [retry, setRetry] = useState(0);
  const room = useRef<HTMLDivElement>(null);
  const art = devotionalImages[selected];
  const animate = motion && !reduced && visible;

  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    const preference = () => setReduced(media.matches);
    const visibility = () => setVisible(!document.hidden);
    preference(); visibility();
    try { setMotion(localStorage.getItem('tirumala-shrine-motion') !== 'off'); } catch { setMotion(true); }
    media.addEventListener('change', preference);
    document.addEventListener('visibilitychange', visibility);
    return () => { media.removeEventListener('change', preference); document.removeEventListener('visibilitychange', visibility); };
  }, []);

  useEffect(() => {
    if (!ritual || !animate) return;
    const timer = window.setTimeout(() => { setRitual(false); setRitualComplete(true); }, 12000);
    return () => clearTimeout(timer);
  }, [ritual, animate]);

  useEffect(() => {
    if (!animate || !opened || !room.current) return;
    const node = room.current;
    let frame = 0, x = 0, y = 0;
    const move = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return;
      const bounds = node.getBoundingClientRect();
      x = (event.clientX - bounds.left) / bounds.width - .5;
      y = (event.clientY - bounds.top) / bounds.height - .5;
      if (frame) return;
      frame = requestAnimationFrame(() => { frame = 0; node.style.setProperty('--room-x', `${x * 7}px`); node.style.setProperty('--room-y', `${y * 5}px`); });
    };
    const reset = () => { node.style.setProperty('--room-x', '0px'); node.style.setProperty('--room-y', '0px'); };
    node.addEventListener('pointermove', move, { passive: true });
    node.addEventListener('pointerleave', reset);
    return () => { cancelAnimationFrame(frame); node.removeEventListener('pointermove', move); node.removeEventListener('pointerleave', reset); reset(); };
  }, [animate, opened]);

  function toggleMotion() {
    const next = !motion; setMotion(next);
    try { localStorage.setItem('tirumala-shrine-motion', next ? 'on' : 'off'); } catch {}
  }
  function choose(index: number) {
    if (index === selected) return;
    setLoaded(false); setError(false); setSelected(index); setRitual(false); setRitualComplete(false);
    if (opened) audio.selectTrack(index);
  }
  function openShrine(still=false){
    if(still)setMotion(false);
    setOpened(true);
    if(withMusic)audio.enable();
  }

  return <main id="main" className="shrine-page" data-motion={animate}>
    <header className="shrine-topbar"><Link href="/" className="brand"><SacredMark/><span>TIRUMALA<small>DIGITAL HERITAGE</small></span></Link><Link href="/journey"><ArrowLeft size={15}/> Return to the pilgrimage</Link></header>
    <section className="shrine-intro"><div><p className="eyebrow">A DEVOTIONAL INTERLUDE / AN IMAGINED SHRINE</p><h1>In the <em>presence.</em></h1></div><p>Let the doors open.<br/>Let the world become quiet.</p></section>
    <div ref={room} className="shrine-room" data-open={opened} data-ritual={ritual} data-loaded={loaded}>
      <div className="shrine-architecture" aria-hidden="true"><span/><span/></div>
      <div className="shrine-picture-space">
        <img ref={node => { if (node?.complete && node.naturalWidth > 0) setLoaded(true); }} key={`${art.id}-${retry}`} className={`shrine-deity${loaded ? ' is-loaded' : ''}`} src={`/assets/devotional/${art.file}-1024.webp`} srcSet={`/assets/devotional/${art.file}-640.webp 640w, /assets/devotional/${art.file}-1024.webp 1024w`} sizes="(max-width:760px) 100vw, 55vw" width={1024} height={1536} alt={art.alt} fetchPriority="high" onLoad={() => setLoaded(true)} onError={() => setError(true)}/>
        <div className="shrine-lamplight" aria-hidden="true"/><div className="shrine-light-beam" aria-hidden="true"/>
        <div className="shrine-incense" aria-hidden="true"><i/><i/><i/></div>
        <div className="shrine-embers" aria-hidden="true">{Array.from({length:8},(_,i)=><i key={i} style={{'--i':i} as React.CSSProperties}/>)}</div>
      </div>
      {ritual && <div className="harathi-foreground" aria-hidden="true"><img src="/assets/devotional/harathi-priest.webp" alt="" width={1024} height={1024}/><div className="harathi-light"/></div>}
      <div className="shrine-vignette" aria-hidden="true"/>
      <div className="shrine-doors" aria-hidden="true">{['left','right'].map(side=><div key={side} className={`shrine-door shrine-door-${side}`}><span className="door-carving"/><span className="door-boss door-boss-one"/><span className="door-boss door-boss-two"/><span className="door-handle"/></div>)}</div>
      {!opened && <div className="shrine-invitation"><SacredMark/><p>A MOMENT OF DEVOTION</p><label className="shrine-music-choice"><input type="checkbox" checked={withMusic} onChange={event=>setWithMusic(event.target.checked)}/><Volume2 size={15}/> With devotional music</label><button className="button" disabled={!loaded || error} onClick={() => openShrine()} data-cursor-label="REVEAL">{loaded ? 'Open the shrine' : 'Preparing the shrine…'} <ArrowRight size={17}/></button><button className="shrine-skip" onClick={() => openShrine(true)}>View without the reveal</button></div>}
      {error && <div className="shrine-image-error" role="alert"><p>The shrine artwork could not load.</p><button className="button outline" onClick={() => {setError(false);setRetry(value=>value+1);}}>Retry artwork</button></div>}
      {opened && loaded && <div className="shrine-art-caption"><span>{String(selected + 1).padStart(2,'0')} / {art.title}</span><span>DEVOTIONAL AI ARTWORK</span></div>}
      <span className="shrine-frame-caption" aria-hidden="true">ॐ नमो वेंकटेशाय</span>
    </div>
    <div className="shrine-controls"><div className="shrine-views" role="group" aria-label="Choose devotional artwork">{devotionalImages.map((image,index)=><button key={image.id} aria-pressed={selected===index} onClick={() => choose(index)}><span>0{index+1}</span>{image.title}</button>)}</div><div className="shrine-actions"><button onClick={() => {setRitual(!ritual);setRitualComplete(false);}} disabled={!opened || !loaded} aria-pressed={ritual}><Flame size={17}/>{ritual ? 'End harathi' : 'Offer harathi'}</button><button onClick={toggleMotion} disabled={reduced} aria-pressed={animate}>{animate ? <Pause size={16}/> : <Play size={16}/>} {reduced ? 'Reduced motion' : animate ? 'Pause atmosphere' : 'Resume atmosphere'}</button><button onClick={() => {setOpened(false);setRitual(false);setRitualComplete(false);audio.leave();}} aria-label="Close shrine doors"><RotateCcw size={16}/><span>Close doors</span></button></div></div>
    <p className="shrine-ritual-status" role="status" aria-live="polite">{ritual ? (animate ? 'A quiet offering of light. The harathi settles after twelve seconds.' : 'A still offering of light. Use End harathi when you are ready.') : ritualComplete ? 'The offering settles. Stay for a moment, as long as you wish.' : 'A moment at your own pace. Devotional music has its own controls.'}</p>
    {opened&&<div className="shrine-music-status"><Volume2 size={16}/><span>{audio.state.playing&&!audio.state.muted?`Playing: ${audio.tracks[audio.state.index].title}`:audio.state.muted?'Devotional music is muted.':audio.state.status==='blocked'?'Tap to enable devotional music.':'Devotional music is paused.'}</span>{(!audio.state.playing||audio.state.muted)&&<button onClick={audio.enable}>Play shrine music <Play size={13}/></button>}</div>}
    <footer className="shrine-note"><Sparkles size={18}/><p>{devotionalNotice}</p><Link href="/about/#devotional">About this artwork <ArrowRight size={14}/></Link></footer>
    <AudioControl active={opened}/>
  </main>;
}
