'use client';
import{useEffect,useReducer,useRef,useState}from'react';
import{ArrowRight,Check,Flower2,Flame,Mic,MicOff,Pause,Play,RotateCcw,ShieldCheck,Volume2,VolumeX,X}from'lucide-react';
import{sankalpaReducer,initialSankalpa,sankalpaStates,questionFields}from'@/lib/sankalpa-machine.mjs';
import{sankalpaCopy,sankalpaLanguages,personalizedPrayer,personalBlessing,type SankalpaLanguage,type PrayerDetails}from'@/lib/sankalpa-copy';
import{createPrayerBell}from'@/lib/prayer-bell';
import{useDevotionalAudio}from'../DevotionalAudioProvider';
import usePrayerVoice from'./usePrayerVoice';

export default function SankalpaExperience({motion,onClose,afterHarathi=false}:{motion:boolean;onClose:()=>void;afterHarathi?:boolean}){
  const[flow,dispatch]=useReducer(sankalpaReducer,undefined,()=>{const initial=initialSankalpa();return afterHarathi?{...initial,state:'GREETING',started:true}:initial;});const[language,setLanguage]=useState<SankalpaLanguage>('en');const[draft,setDraft]=useState('');const[voiceConsent,setVoiceConsent]=useState(false);const[micConsent,setMicConsent]=useState(false);const[sceneMusic,setSceneMusic]=useState(true);const[hidden,setHidden]=useState(false);const[frontFailed,setFrontFailed]=useState(false);
  const audio=useDevotionalAudio();const latestAudio=useRef(audio);latestAudio.current=audio;const bell=useRef<ReturnType<typeof createPrayerBell>|null>(null);const elapsed=useRef(0);const pane=useRef<HTMLElement>(null);const field=(questionFields as Record<string,keyof PrayerDetails>)[flow.state];const copy=sankalpaCopy[language];const locale=sankalpaLanguages.find(item=>item.id===language)!.locale;const harathi=flow.state==='HARATHI';const baseGain=harathi?1:.32;
  const voice=usePrayerVoice({locale,narrationConsent:voiceConsent,microphoneConsent:micConsent,muted:audio.state.muted,baseGain,onTranscript:text=>setDraft(text),onDuck:gain=>latestAudio.current.duck(gain)});
  const latestVoice=useRef(voice);latestVoice.current=voice;
  const question=field?copy[field]:'';
  const message=harathi?copy.harathi:flow.state==='GREETING'?copy.greeting:field?question:flow.state==='CONFIRM_DETAILS'?copy.review:flow.state==='SANKALPAM'?personalizedPrayer(flow.details,language):flow.state==='ARCHANA'?copy.archanaText:flow.state==='BLESSINGS'?personalBlessing(flow.details,language):copy.completeText;
  const index=sankalpaStates.indexOf(flow.state);
  useEffect(()=>{const visibility=()=>setHidden(document.hidden);visibility();document.addEventListener('visibilitychange',visibility);return()=>{document.removeEventListener('visibilitychange',visibility);bell.current?.dispose();latestAudio.current.duck(1);};},[]);
  useEffect(()=>{latestAudio.current.duck(baseGain);},[baseGain]);
  useEffect(()=>{if(audio.state.muted)bell.current?.stop();},[audio.state.muted]);
  useEffect(()=>{
    if(!harathi||!flow.started||hidden)return;const began=performance.now();const remaining=Math.max(0,12000-elapsed.current);const timer=setTimeout(()=>dispatch({type:'NEXT'}),remaining);
    return()=>{clearTimeout(timer);elapsed.current+=performance.now()-began;};
  },[harathi,flow.started,flow.revision,hidden]);
  useEffect(()=>{setDraft(field?flow.details[field]:'');latestVoice.current.stopListening();latestVoice.current.stopSpeaking();pane.current?.scrollTo({top:0,behavior:'instant'});pane.current?.querySelector<HTMLElement>('h2')?.focus({preventScroll:true});},[flow.state,field]);
  useEffect(()=>{if(flow.started&&!harathi&&voiceConsent&&!hidden)latestVoice.current.speak(message);return()=>latestVoice.current.stopSpeaking();},[flow.state,language,voiceConsent,flow.started,hidden]);
  useEffect(()=>{if(hidden){latestVoice.current.stopListening();latestVoice.current.stopSpeaking();bell.current?.stop();}},[hidden]);
  function ring(){if(sceneMusic&&!latestAudio.current.state.muted){bell.current??=createPrayerBell();void bell.current.ring();}}
  function begin(sound:boolean){setSceneMusic(sound);if(sound)audio.enable();else audio.pause();elapsed.current=0;dispatch({type:'START'});if(sound){bell.current??=createPrayerBell();void bell.current.ring();}}
  function next(){voice.stopListening();voice.stopSpeaking();dispatch({type:'NEXT'});}
  function skipHarathi(){if(!flow.started)dispatch({type:'START'});voice.stopSpeaking();dispatch({type:'NEXT'});}
  function replay(){voice.stopListening();voice.stopSpeaking();bell.current?.stop();elapsed.current=0;dispatch({type:'REPLAY_HARATHI'});ring();}
  function reset(){voice.stopListening();voice.stopSpeaking();bell.current?.stop();setMicConsent(false);setVoiceConsent(false);setDraft('');elapsed.current=0;dispatch({type:'RESET'});audio.pause();audio.duck(1);}
  function close(){voice.stopListening();voice.stopSpeaking();bell.current?.stop();setDraft('');dispatch({type:'RESET'});audio.duck(1);onClose();}
  function submit(event:React.FormEvent){event.preventDefault();voice.stopListening();voice.stopSpeaking();dispatch({type:'SUBMIT',value:draft});}
  const title=harathi?'Harathi':flow.state==='GREETING'?copy.title:field?copy[`${field}Label` as 'nameLabel'|'gothramLabel'|'familyLabel'|'intentionLabel']:flow.state==='CONFIRM_DETAILS'?copy.review:flow.state==='SANKALPAM'?copy.sankalpam:flow.state==='ARCHANA'?copy.archana:flow.state==='BLESSINGS'?copy.blessings:copy.complete;
  return <section className="sankalpa-experience" data-state={flow.state} data-started={flow.started} data-motion={motion&&!hidden} aria-label="Personal virtual prayer" lang={language}>
    <div className="sankalpa-priest" data-facing={harathi?'shrine':'visitor'} data-speaking={voice.speaking}>
      <img className="sankalpa-priest-back" src="/assets/devotional/harathi-priest.webp" alt="AI artistic priest representation offering a lamp toward the imagined shrine" width={1024} height={1024}/>
      {!frontFailed&&<img className="sankalpa-priest-front" src="/assets/devotional/priest-guide-front-1024.webp" srcSet="/assets/devotional/priest-guide-front-640.webp 640w, /assets/devotional/priest-guide-front-1024.webp 1024w" sizes="(max-width:760px) 80vw, 45vw" alt="AI artistic virtual priest guide facing the visitor with hands in a welcoming namaste" width={1024} height={1024} onError={()=>setFrontFailed(true)}/>}
      {frontFailed&&!harathi&&<div className="sankalpa-guide-fallback"><Flower2 size={44}/><span>Virtual devotional guide</span></div>}
      {harathi&&flow.started&&<div className="sankalpa-lamp-glow" aria-hidden="true"/>}
      <span className="sankalpa-priest-label">2.5D ARTISTIC GUIDE / {voice.speaking?'SPEAKING':'VIRTUAL REPRESENTATION'}</span>
    </div>
    <section ref={pane} className="sankalpa-dialogue" aria-label="Guided prayer conversation">
      <header className="sankalpa-dialogue-header"><div><span className="eyebrow">AI SANKALPA / GUIDED MODE</span><p>{copy.guide}</p></div><button className="sankalpa-icon" aria-label="Close personal prayer" onClick={close}><X size={18}/></button></header>
      <div className="sankalpa-language" role="group" aria-label="Prayer language">{sankalpaLanguages.map(item=><button key={item.id} lang={item.id} aria-pressed={language===item.id} onClick={()=>setLanguage(item.id)}>{item.label}</button>)}</div>
      <div className="sankalpa-progress" role="progressbar" aria-label="Guided prayer progress" aria-valuemin={1} aria-valuemax={11} aria-valuenow={index+1}><span style={{width:`${(index+1)/11*100}%`}}/></div>
      <span className="sankalpa-stage-name">{String(index+1).padStart(2,'0')} / 11 · {flow.state.replaceAll('_',' ')}</span>
      <h2 tabIndex={-1}>{title}</h2>
      <div className="sankalpa-speech" aria-live="polite" aria-atomic="true" data-speaking={voice.speaking}><p>{voice.boundary&&voice.speaking?<>{message.slice(0,voice.boundary.start)}<mark>{message.slice(voice.boundary.start,voice.boundary.end)}</mark>{message.slice(voice.boundary.end)}</>:message}</p></div>
      {harathi&&<><div className="sankalpa-harathi-symbol" aria-hidden="true"><Flame size={24}/><span/><Flame size={24}/></div><p className="sankalpa-small">Artistic Harathi · supplied devotional music · synthesized bell</p>{!flow.started?<div className="sankalpa-primary-actions"><button className="button" onClick={()=>begin(true)}><Flame size={17}/>{copy.begin}</button><button className="sankalpa-text-button" onClick={()=>begin(false)}>{copy.silent}</button></div>:<p className="sankalpa-small" role="status">The offering settles after twelve seconds. Continue whenever you are ready.</p>}<div className="sankalpa-inline-actions"><button onClick={skipHarathi}>{copy.skipHarathi}<ArrowRight size={14}/></button>{flow.started&&<button onClick={replay}><RotateCcw size={14}/>{copy.replay}</button>}</div></>}
      {flow.state==='GREETING'&&<button className="button sankalpa-continue" onClick={next}>{copy.continue}<ArrowRight size={17}/></button>}
      {field&&<form className="sankalpa-answer-form" onSubmit={submit}><label htmlFor="sankalpa-answer">{copy[`${field}Label` as 'nameLabel'|'gothramLabel'|'familyLabel'|'intentionLabel']}</label>{field==='intention'||field==='family'?<textarea id="sankalpa-answer" key={field} autoComplete="off" value={draft} onChange={event=>setDraft(event.target.value)} rows={3} maxLength={field==='family'?400:500} aria-describedby="sankalpa-answer-help"/>:<input id="sankalpa-answer" key={field} type="text" autoComplete="off" value={draft} onChange={event=>setDraft(event.target.value)} maxLength={field==='name'?80:120} aria-describedby="sankalpa-answer-help"/>}<p id="sankalpa-answer-help">{copy[`${field}Help` as 'nameHelp'|'gothramHelp'|'familyHelp'|'intentionHelp']}</p>{flow.error&&<p className="sankalpa-error" role="alert">{copy.nameRequired}</p>}
        <label className="sankalpa-consent"><input type="checkbox" checked={micConsent} onChange={event=>setMicConsent(event.target.checked)}/><span>{copy.micConsent}</span></label><div className="sankalpa-microphone"><button type="button" onClick={voice.listening?voice.stopListening:voice.startListening} disabled={!micConsent||!voice.supported} aria-pressed={voice.listening}>{voice.listening?<MicOff size={15}/>:<Mic size={15}/>} {voice.listening?copy.stopListening:copy.listen}</button><span role="status">{voice.listening?copy.listening:!voice.supported?copy.voiceUnavailable:''}</span></div>
        <div className="sankalpa-primary-actions"><button className="button" type="submit">{copy.continue}<ArrowRight size={15}/></button>{field!=='name'&&<button type="button" className="sankalpa-text-button" onClick={()=>{voice.stopListening();dispatch({type:'SUBMIT',value:''});}}>{copy.skip}</button>}</div></form>}
      {flow.state==='CONFIRM_DETAILS'&&<><dl className="sankalpa-review">{(['name','gothram','family','intention']as const).map(key=><div key={key}><dt>{copy[`${key}Label` as 'nameLabel'|'gothramLabel'|'familyLabel'|'intentionLabel']}</dt><dd>{flow.details[key]||copy.notProvided}</dd><button onClick={()=>dispatch({type:'EDIT',field:key})} aria-label={`${copy.edit} ${key}`}>{copy.edit}</button></div>)}</dl><button className="button sankalpa-continue" onClick={()=>dispatch({type:'CONFIRM'})}><Check size={16}/>{copy.confirm}</button></>}
      {flow.state==='SANKALPAM'&&<><div className="sankalpa-recording-placeholder"><VolumeX size={17}/><p>{copy.pending}</p></div><button className="button sankalpa-continue" onClick={next}>{copy.continue}<ArrowRight size={15}/></button></>}
      {flow.state==='ARCHANA'&&<><div className="sankalpa-flowers" aria-hidden="true">{Array.from({length:flow.flowers},(_,i)=><Flower2 key={i} size={27} style={{'--flower-index':i}as React.CSSProperties}/>)}</div><button className="button sankalpa-continue" onClick={()=>{dispatch({type:'OFFER'});ring();}}><Flower2 size={17}/>{copy.offer}</button><p className="sankalpa-small" role="status">{flow.flowers} {copy.offers}</p><button className="sankalpa-text-button" onClick={next}>{copy.continue}<ArrowRight size={15}/></button></>}
      {flow.state==='BLESSINGS'&&<button className="button sankalpa-continue" onClick={next}>{copy.finish}<Check size={16}/></button>}
      {flow.state==='COMPLETE'&&<div className="sankalpa-primary-actions"><button className="button" onClick={close}>{copy.close}<ArrowRight size={15}/></button><button className="sankalpa-text-button" onClick={reset}>{copy.newPrayer}</button></div>}
      {!harathi&&<div className="sankalpa-voice-actions"><button onClick={()=>voice.speaking?voice.stopSpeaking():voice.speak(message)} disabled={!voiceConsent||audio.state.muted}>{voice.speaking?<Pause size={14}/>:<Volume2 size={14}/>} {voice.speaking?copy.stopVoice:copy.read}</button></div>}
      {voice.message&&<p className="sankalpa-small" role="status">{copy[voice.message as 'speechUnavailable'|'voiceUnavailable'|'micError']||copy.voiceUnavailable}</p>}
      <details className="sankalpa-settings" open={harathi&&!flow.started}><summary>Voice, sound & privacy</summary><label className="sankalpa-consent"><input type="checkbox" checked={voiceConsent} onChange={event=>setVoiceConsent(event.target.checked)}/><span>{copy.speechConsent}</span></label><p className="sankalpa-small">{copy.aiMode}</p><p className="sankalpa-privacy"><ShieldCheck size={15}/>{copy.privacy}</p></details>
      <footer className="sankalpa-panel-footer"><button onClick={audio.mute} aria-label="Toggle prayer sound" aria-pressed={audio.state.muted}>{audio.state.muted?<VolumeX size={15}/>:<Volume2 size={15}/>} {audio.state.muted?'Sound off':'Mute'}</button><button onClick={reset}><RotateCcw size={14}/>{copy.reset}</button></footer><p className="sankalpa-simulation">{copy.simulation}</p>
    </section>
  </section>;
}
