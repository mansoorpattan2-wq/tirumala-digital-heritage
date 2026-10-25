'use client';
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { DevotionalAudioController } from '@/lib/devotional-audio.mjs';
import manifest from '@/lib/devotional-audio-manifest.json';
import sevaManifest from '@/lib/seva-audio-manifest.json';

type AudioState = { ready:boolean; index:number; volume:number; muted:boolean; playing:boolean; status:string; message:string };
type AudioContextValue = { state:AudioState; tracks:typeof manifest.tracks; enter:()=>void; enable:()=>void; leave:()=>void; pause:()=>void; next:()=>void; previous:()=>void; selectTrack:(index:number)=>void; mute:()=>void; volume:(value:number)=>void };
const initial:AudioState={ready:manifest.ready,index:0,volume:.35,muted:false,playing:false,status:manifest.ready?'idle':'unavailable',message:''};
const AudioContext=createContext<AudioContextValue|null>(null);
const preferenceKey='tirumala-devotional-audio';

export function DevotionalAudioProvider({children}:{children:React.ReactNode}) {
  const [state,setState]=useState<AudioState>(initial);
  const controller=useRef<DevotionalAudioController|null>(null);
  const pathname=usePathname();
  const previousPath=useRef(pathname);
  const configuredPlaylist=useRef('shrine');
  const sevaId=pathname.replace(/\/$/,'').split('/')[2];
  const ambience=pathname.startsWith('/sevas/')?sevaManifest.tracks.find(track=>track.id===sevaId):undefined;
  const tracks=ambience?[ambience]:manifest.tracks;
  const playlistId=ambience?.id||'shrine';
  function prepare(){const player=controller.current;if(player&&configuredPlaylist.current!==playlistId){player.configure(tracks);configuredPlaylist.current=playlistId;}return player;}
  useEffect(()=>{
    let preferences={};
    try{const saved=JSON.parse(localStorage.getItem(preferenceKey)||'{}');if(saved&&typeof saved==='object')preferences=saved;}catch{}
    const player=new DevotionalAudioController({tracks:manifest.tracks,ready:manifest.ready,preferences});
    controller.current=player;
    const unsubscribe=player.subscribe((snapshot:AudioState)=>{
      setState(snapshot);
      try{localStorage.setItem(preferenceKey,JSON.stringify({volume:snapshot.volume,muted:snapshot.muted}));}catch{}
    });
    const exit=()=>{void player.leave(true);};
    window.addEventListener('pagehide',exit);
    return()=>{unsubscribe();window.removeEventListener('pagehide',exit);player.dispose();controller.current=null;};
  },[]);
  useEffect(()=>{if(previousPath.current===pathname)return;previousPath.current=pathname;void controller.current?.leave();},[pathname]);
  const value:AudioContextValue={state:{...state,index:Math.min(state.index,tracks.length-1),ready:tracks.every(track=>track.available)},tracks,enter:()=>{void prepare()?.enter();},enable:()=>{const player=prepare();if(!player)return;player.setMuted(false);void player.enter();},leave:()=>{void controller.current?.leave();},pause:()=>controller.current?.pause(),next:()=>{void prepare()?.changeTrack(1);},previous:()=>{void prepare()?.changeTrack(-1);},selectTrack:index=>{void prepare()?.selectTrack(index);},mute:()=>prepare()?.toggleMute(),volume:value=>prepare()?.setVolume(value)};
  return <AudioContext.Provider value={value}>{children}</AudioContext.Provider>;
}
export function useDevotionalAudio(){const value=useContext(AudioContext);if(!value)throw new Error('Devotional audio requires its provider.');return value;}
