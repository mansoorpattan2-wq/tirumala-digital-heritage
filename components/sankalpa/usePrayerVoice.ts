'use client';
import{useCallback,useEffect,useRef,useState}from'react';
type RecognitionResult={isFinal:boolean;0:{transcript:string}};
type RecognitionEvent={results:{length:number;[index:number]:RecognitionResult}};
type Recognition={lang:string;interimResults:boolean;continuous:boolean;maxAlternatives:number;onstart:(()=>void)|null;onend:(()=>void)|null;onerror:((event:{error:string})=>void)|null;onresult:((event:RecognitionEvent)=>void)|null;start:()=>void;abort:()=>void;stop:()=>void;};
type RecognitionWindow=Window&{SpeechRecognition?:new()=>Recognition;webkitSpeechRecognition?:new()=>Recognition;};
type VoiceOptions={locale:string;narrationConsent:boolean;microphoneConsent:boolean;muted:boolean;baseGain:number;onTranscript:(text:string)=>void;onDuck:(gain:number)=>void;};
export default function usePrayerVoice(options:VoiceOptions){
  const latest=useRef(options);latest.current=options;
  const recognition=useRef<Recognition|null>(null);const utterance=useRef<SpeechSynthesisUtterance|null>(null);const micTimer=useRef<ReturnType<typeof setTimeout>|null>(null);const alive=useRef(true);
  const[supported,setSupported]=useState(false);const[listening,setListening]=useState(false);const[speaking,setSpeaking]=useState(false);const[message,setMessage]=useState('');const[boundary,setBoundary]=useState<{start:number;end:number}|null>(null);const[voices,setVoices]=useState<SpeechSynthesisVoice[]>([]);
  const stopListening=useCallback(()=>{const rec=recognition.current;recognition.current=null;if(micTimer.current)clearTimeout(micTimer.current);if(rec){rec.onstart=null;rec.onend=null;rec.onerror=null;rec.onresult=null;try{rec.abort();}catch{}}if(alive.current)setListening(false);latest.current.onDuck(latest.current.baseGain);},[]);
  const stopSpeaking=useCallback(()=>{if(utterance.current){utterance.current.onstart=null;utterance.current.onend=null;utterance.current.onerror=null;utterance.current.onboundary=null;utterance.current=null;}if('speechSynthesis'in window)speechSynthesis.cancel();if(alive.current){setSpeaking(false);setBoundary(null);}latest.current.onDuck(latest.current.baseGain);},[]);
  useEffect(()=>{alive.current=true;const browser=window as RecognitionWindow;setSupported(Boolean((browser.SpeechRecognition||browser.webkitSpeechRecognition)&&window.isSecureContext));const update=()=>setVoices('speechSynthesis'in window?speechSynthesis.getVoices():[]);update();if('speechSynthesis'in window)speechSynthesis.addEventListener('voiceschanged',update);return()=>{alive.current=false;stopListening();stopSpeaking();if('speechSynthesis'in window)speechSynthesis.removeEventListener('voiceschanged',update);};},[stopListening,stopSpeaking]);
  useEffect(()=>{stopListening();setMessage('');},[options.locale,options.microphoneConsent,stopListening]);
  useEffect(()=>{if(!options.narrationConsent||options.muted)stopSpeaking();},[options.narrationConsent,options.muted,stopSpeaking]);
  const speak=useCallback((text:string)=>{
    stopListening();stopSpeaking();const opts=latest.current;if(!opts.narrationConsent||opts.muted||!text)return;
    if(!('speechSynthesis'in window)){setMessage('speechUnavailable');return;}
    const candidates=speechSynthesis.getVoices().filter(voice=>voice.lang.toLowerCase().startsWith(opts.locale.slice(0,2))).sort((a,b)=>Number(b.localService)-Number(a.localService));
    if(speechSynthesis.getVoices().length&&!candidates.length){setMessage('speechUnavailable');return;}
    const speech=new SpeechSynthesisUtterance(text);speech.lang=opts.locale;speech.rate=.9;speech.volume=.85;if(candidates[0])speech.voice=candidates[0];utterance.current=speech;setMessage('');
    speech.onstart=()=>{if(!alive.current)return;setSpeaking(true);latest.current.onDuck(.12);};
    const finish=()=>{if(!alive.current)return;setSpeaking(false);setBoundary(null);utterance.current=null;latest.current.onDuck(latest.current.baseGain);};speech.onend=finish;speech.onerror=()=>{finish();if(alive.current)setMessage('speechUnavailable');};
    speech.onboundary=event=>{if(!alive.current)return;const length=event.charLength||text.slice(event.charIndex).match(/^\S+/u)?.[0].length||1;setBoundary({start:event.charIndex,end:Math.min(text.length,event.charIndex+length)});};speechSynthesis.speak(speech);
  },[stopListening,stopSpeaking]);
  const startListening=useCallback(()=>{
    const opts=latest.current;if(!opts.microphoneConsent)return;
    const browser=window as RecognitionWindow;const Constructor=browser.SpeechRecognition||browser.webkitSpeechRecognition;
    if(!Constructor||!window.isSecureContext){setMessage('voiceUnavailable');return;}
    stopListening();stopSpeaking();setMessage('');const rec=new Constructor();recognition.current=rec;rec.lang=opts.locale;rec.interimResults=true;rec.continuous=false;rec.maxAlternatives=1;
    rec.onstart=()=>{if(alive.current){setListening(true);latest.current.onDuck(.06);}};
    rec.onresult=event=>{if(!alive.current||recognition.current!==rec)return;let text='';for(let i=0;i<event.results.length;i++)text+=event.results[i][0].transcript+' ';latest.current.onTranscript(text.trim().slice(0,500));};
    rec.onerror=event=>{if(!alive.current)return;setMessage(event.error==='language-not-supported'?'voiceUnavailable':'micError');stopListening();};rec.onend=()=>{if(!alive.current||recognition.current!==rec)return;stopListening();};
    try{rec.start();micTimer.current=setTimeout(stopListening,20000);}catch{setMessage('micError');stopListening();}
  },[stopListening,stopSpeaking]);
  return{supported,listening,speaking,message,boundary,voices,speak,stopSpeaking,startListening,stopListening};
}
