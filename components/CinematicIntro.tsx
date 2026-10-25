'use client';
import {useEffect,useRef,useState} from 'react';
import {useSearchParams} from 'next/navigation';
import {ArrowRight,Volume2,VolumeX} from 'lucide-react';
import {SacredMark} from './Navigation';
import SacredLoader from './SacredLoader';
import AudioControl from './AudioControl';
import {useDevotionalAudio} from './DevotionalAudioProvider';

const sessionKey='tirumala-sacred-intro-seen';
const preparationImages=['/assets/intro/awakening-1280.webp','/assets/intro/portal-1280.webp','/assets/devotional/venkateswara-twilight-640.webp'];
export default function CinematicIntro(){
  const params=useSearchParams();const audio=useDevotionalAudio();
  const [phase,setPhase]=useState<'checking'|'loading'|'ready'|'entering'|'hidden'>('checking');const [completed,setCompleted]=useState(0);const [failed,setFailed]=useState(0);const [sound,setSound]=useState(false);const [homeSound,setHomeSound]=useState(false);const [version,setVersion]=useState(0);const [reduced,setReduced]=useState(false);
  const root=useRef<HTMLDivElement>(null);const exitTimer=useRef<ReturnType<typeof setTimeout>|null>(null);const latestAudio=useRef(audio);latestAudio.current=audio;
  useEffect(()=>{
    const replay=params.get('intro')==='replay';let seen=false;try{seen=sessionStorage.getItem(sessionKey)==='yes';}catch{}
    if(seen&&!replay){setPhase('hidden');return;}setPhase('loading');setVersion(value=>value+1);
  },[params]);
  useEffect(()=>{
    const media=matchMedia('(prefers-reduced-motion: reduce)');const change=()=>setReduced(media.matches);change();media.addEventListener('change',change);
    const replay=()=>{latestAudio.current.leave();setCompleted(0);setFailed(0);setPhase('loading');setVersion(value=>value+1);};window.addEventListener('replay-sacred-intro',replay);
    return()=>{media.removeEventListener('change',change);window.removeEventListener('replay-sacred-intro',replay);if(exitTimer.current)clearTimeout(exitTimer.current);};
  },[]);
  useEffect(()=>{
    if(!version)return;let cancelled=false,count=0;const images:HTMLImageElement[]=[];setCompleted(0);setFailed(0);
    const finish=(failure:boolean)=>{if(cancelled)return;count++;setCompleted(count);if(failure)setFailed(value=>value+1);if(count===4)setPhase(current=>current==='loading'?'ready':current);};
    for(const src of preparationImages){const img=new Image();images.push(img);img.onload=()=>{img.decode().then(()=>finish(false),()=>finish(true));};img.onerror=()=>finish(true);img.src=src;}
    document.fonts.ready.then(()=>finish(false),()=>finish(true));
    const timeout=setTimeout(()=>{if(!cancelled)setPhase(current=>current==='loading'?'ready':current);},7000);
    return()=>{cancelled=true;clearTimeout(timeout);images.forEach(img=>{img.onload=null;img.onerror=null;});};
  },[version]);
  const visible=phase!=='hidden'&&phase!=='checking';
  useEffect(()=>{
    if(!visible)return;
    const originalOverflow=document.body.style.overflow;document.body.style.overflow='hidden';const previousFocus=document.activeElement as HTMLElement|null;
    const background=Array.from(document.querySelectorAll<HTMLElement>('.site-header,.mobile-nav,.skip-link,#main,.footer'));const previousInert=background.map(node=>node.inert);background.forEach(node=>{node.inert=true;});
    root.current?.querySelector<HTMLButtonElement>('.intro-skip')?.focus({preventScroll:true});
    const key=(event:KeyboardEvent)=>{
      if(event.key==='Escape'){event.preventDefault();dismiss();return;}
      if(event.key!=='Tab')return;const items=Array.from(root.current?.querySelectorAll<HTMLElement>('button:not(:disabled),input,a[href]')||[]);if(!items.length)return;const first=items[0],last=items.at(-1)!;
      if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
    };document.addEventListener('keydown',key);
    return()=>{document.body.style.overflow=originalOverflow;background.forEach((node,i)=>{node.inert=previousInert[i];});document.removeEventListener('keydown',key);if(previousFocus?.isConnected)previousFocus.focus({preventScroll:true});};
  // Only the overlay lifecycle changes page inertness; loading progress does not.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[visible]);
  function remember(){try{sessionStorage.setItem(sessionKey,'yes');}catch{}}
  function dismiss(){remember();setPhase('hidden');if(new URL(location.href).searchParams.has('intro')){const url=new URL(location.href);url.searchParams.delete('intro');history.replaceState(null,'',url.pathname+url.search+url.hash);}}
  function enter(){remember();if(sound){audio.enable();setHomeSound(true);}else{audio.leave();setHomeSound(false);}if(reduced){dismiss();return;}setPhase('entering');exitTimer.current=setTimeout(dismiss,1050);}
  if(!visible)return homeSound?<AudioControl active/>:null;
  return <div ref={root} className="cinematic-intro" data-phase={phase} data-motion={!reduced} role="dialog" aria-modal="true" aria-labelledby="intro-title">
    <div className="intro-awakening" aria-hidden="true"><img src="/assets/intro/awakening-1280.webp" alt=""/><span/></div><div className="intro-portal" aria-hidden="true"><img src="/assets/intro/portal-1280.webp" alt=""/><span className="intro-portal-glow"/></div><div className="intro-mist" aria-hidden="true"/>
    <div className="intro-particles" aria-hidden="true">{Array.from({length:20},(_,i)=><i key={i} style={{'--i':i}as React.CSSProperties}/>)}</div>
    <button className="intro-skip" onClick={dismiss}>Skip intro <ArrowRight size={14}/></button>
    <div className="intro-identity"><div className="intro-namam"><SacredMark/></div><p className="intro-kicker">WHERE DEVOTION MEETS DISCOVERY</p><h2 id="intro-title">TIRUMALA<span>DIGITAL HERITAGE</span></h2><p className="intro-subtitle">An Immersive Sacred Experience</p><p lang="te" className="intro-telugu">శ్రీవారి దివ్య అనుభవం</p>
      <SacredLoader completed={completed} total={4} failed={failed}/>
      <div className="intro-entry"><button className="intro-enter" disabled={phase==='loading'||phase==='entering'} onClick={enter}>Enter the shrine <ArrowRight size={18}/></button><label className="intro-sound"><input type="checkbox" checked={sound} onChange={event=>setSound(event.target.checked)}/>{sound?<Volume2 size={15}/>:<VolumeX size={15}/>} {sound?'Enter with sound':'Enter silently'}</label></div>
    </div>
    <div className="intro-lights" aria-hidden="true"><img src="/assets/intro/lights-1280.webp" alt=""/><span/>{Array.from({length:12},(_,i)=><i key={i} style={{'--i':i}as React.CSSProperties}/>)}</div>
    <div className="intro-footer"><span>A MOMENT OF STILLNESS. A WORLD TO DISCOVER.</span><span>ARTISTIC DEVOTIONAL INTERPRETATION</span></div>
  </div>;
}
