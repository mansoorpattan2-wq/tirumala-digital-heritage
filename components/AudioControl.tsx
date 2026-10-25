'use client';
import { useEffect, useRef, useState } from 'react';
import { ChevronUp, Pause, Play, SkipBack, SkipForward, Volume2, VolumeX, X } from 'lucide-react';
import { useDevotionalAudio } from './DevotionalAudioProvider';

export default function AudioControl({active,ambience=false}:{active:boolean;ambience?:boolean}) {
  const audio=useDevotionalAudio();const {state,tracks}=audio;
  const [expanded,setExpanded]=useState(false);
  const root=useRef<HTMLDivElement>(null);const expander=useRef<HTMLButtonElement>(null);const panel=useRef<HTMLDivElement>(null);
  const enabled=state.ready&&active;
  const needsStart=enabled&&!state.playing&&state.status!=='paused';
  const needsAudible=enabled&&(state.muted||state.volume===0);
  const label=!state.ready?'Devotional music — recordings needed':!active?'Begin the experience to enable music':needsStart?'Enable Divine Audio':state.muted?'Unmute Devotional Music':'Mute Devotional Music';
  useEffect(()=>{
    if(!expanded)return;
    panel.current?.querySelector<HTMLButtonElement>('button')?.focus();
    const key=(event:KeyboardEvent)=>{if(event.key==='Escape'){setExpanded(false);expander.current?.focus();}};
    const outside=(event:PointerEvent)=>{if(!root.current?.contains(event.target as Node))setExpanded(false);};
    document.addEventListener('keydown',key);document.addEventListener('pointerdown',outside);
    return()=>{document.removeEventListener('keydown',key);document.removeEventListener('pointerdown',outside);};
  },[expanded]);
  useEffect(()=>{
    let frame=0;
    const measure=()=>{cancelAnimationFrame(frame);frame=requestAnimationFrame(()=>{
      const controls=document.querySelector('.shrine-controls')?.getBoundingClientRect();
      const bottom=controls&&controls.top<innerHeight-16&&controls.bottom>innerHeight-84?Math.max(20,innerHeight-controls.top+12):20;
      root.current?.style.setProperty('--audio-bottom',`${bottom}px`);
    });};
    measure();window.addEventListener('scroll',measure,{passive:true});window.addEventListener('resize',measure);
    return()=>{cancelAnimationFrame(frame);window.removeEventListener('scroll',measure);window.removeEventListener('resize',measure);};
  },[]);
  function primary(){if(!state.ready){setExpanded(!expanded);return;}if(!active)return;if(needsStart)audio.enter();else audio.mute();}
  return <div ref={root} className="devotional-audio" data-playing={state.playing&&!state.muted} data-ready={state.ready}>
    {expanded&&<div ref={panel} id="devotional-audio-panel" role="dialog" aria-label="Devotional music controls" className="devotional-audio-panel"><div className="audio-panel-heading"><span>DEVOTIONAL MUSIC</span><button aria-label="Close audio controls" onClick={()=>{setExpanded(false);expander.current?.focus();}}><X size={16}/></button></div>
      <p className="audio-now-label">{state.playing?'NOW PLAYING':state.ready?'SELECTED TRACK':'PLAYLIST PREPARED'}</p><h2>{tracks[state.index].title}</h2>
      <p className="audio-message" role="status">{!state.ready?'Approved recordings have not been added yet.':!active?'Begin the experience to enable music.':state.message||state.status==='paused'&&'Music paused.'||(ambience?'Original synthesized ambience. Music only; no chanting or real TTD ceremony recording.':'A quiet accompaniment to your darshan.')}</p>
      <div className="audio-transport"><button aria-label="Previous Song" disabled={!enabled} onClick={audio.previous}><SkipBack size={18}/></button><button className="audio-play" aria-label={state.playing?'Pause Devotional Music':'Play Devotional Music'} disabled={!enabled} onClick={state.playing?audio.pause:audio.enter}>{state.playing?<Pause size={20}/>:<Play size={20}/>}</button><button aria-label="Next Song" disabled={!enabled} onClick={audio.next}><SkipForward size={18}/></button></div>
      <div className="audio-volume"><button aria-label={state.muted?'Unmute Devotional Music':'Mute Devotional Music'} disabled={!state.ready} onClick={audio.mute}>{state.muted?<VolumeX size={18}/>:<Volume2 size={18}/>}</button><label className="sr-only" htmlFor="devotional-volume">Devotional music volume</label><input id="devotional-volume" type="range" min="0" max="1" step="0.01" value={state.volume} disabled={!state.ready} onChange={event=>audio.volume(Number(event.target.value))} aria-valuetext={`${Math.round(state.volume*100)} percent`}/><span>{Math.round(state.volume*100)}%</span></div>
      {!state.ready&&<ol className="audio-track-list">{tracks.map(track=><li key={track.id}>{track.title}<span>Recording needed</span></li>)}</ol>}
    </div>}
    <div className="audio-launcher"><button className="audio-speaker" title={label} aria-label={label} aria-pressed={state.ready?state.muted:undefined} onClick={primary}>{state.muted||!state.ready?<VolumeX size={20}/>:<Volume2 size={20}/>}<span className="audio-wave" aria-hidden="true"/></button>{(needsStart||needsAudible)&&<button className="audio-enable" onClick={audio.enable}>{needsAudible?'Unmute devotional music':'Enable Divine Audio'}</button>}<button ref={expander} className="audio-expand" aria-label="Open devotional audio controls" aria-haspopup="dialog" aria-controls="devotional-audio-panel" aria-expanded={expanded} onClick={()=>setExpanded(!expanded)}><ChevronUp size={14}/></button></div>
  </div>;
}
