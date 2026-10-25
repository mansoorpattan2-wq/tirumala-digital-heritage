/** One HTMLAudioElement for the entire playlist. No embeds, autoplay, or overlapping tracks. */
export class DevotionalAudioController {
  constructor({tracks,ready,createAudio=()=>new Audio(),preferences={},fadeDuration=800,switchDuration=180,exitDuration=220}) {
    this.tracks=tracks;this.fadeDuration=fadeDuration;this.switchDuration=switchDuration;this.exitDuration=exitDuration;
    this.listeners=new Set();this.active=false;this.disposed=false;this.operation=0;this.fadeCancel=null;this.pending=false;
    const volume=typeof preferences.volume==='number'&&Number.isFinite(preferences.volume)?Math.min(1,Math.max(0,preferences.volume)):.35;
    this.lastVolume=volume||.35;
    this.state={ready:Boolean(ready&&tracks.length>0&&tracks.every(track=>track.available)),index:0,volume,muted:preferences.muted===true,playing:false,status:'idle',message:''};
    if(!this.state.ready)this.state.status='unavailable';
    this.audio=createAudio();this.audio.preload='none';this.audio.volume=volume;this.audio.muted=this.state.muted;
    this.onEnded=()=>{if(this.active)this.changeTrack(1,true);};
    this.onPlaying=()=>{if(!this.active||this.disposed){this.audio.pause();return;}this.update({playing:true,status:'playing',message:''});};
    this.onPause=()=>{if(!this.disposed)this.update({playing:false});};
    this.onError=()=>{if(!this.active||!this.state.ready||this.disposed)return;this.operation++;this.cancelFade();this.pending=false;this.audio.pause();this.update({playing:false,status:'error',message:'This recording could not play. Please retry.'});};
    this.audio.addEventListener('ended',this.onEnded);this.audio.addEventListener('playing',this.onPlaying);this.audio.addEventListener('pause',this.onPause);this.audio.addEventListener('error',this.onError);
  }
  subscribe(listener){this.listeners.add(listener);listener(this.state);return()=>{this.listeners.delete(listener);};}
  update(patch){if(this.disposed)return;this.state={...this.state,...patch};this.listeners.forEach(listener=>listener(this.state));}
  cancelFade(){this.fadeCancel?.();this.fadeCancel=null;}
  setAudioVolume(value){try{this.audio.volume=Math.max(0,Math.min(1,value));}catch{/* Some iOS versions control volume through hardware. */}}
  fadeTo(target,duration){
    this.cancelFade();
    if(duration<=0){this.setAudioVolume(target);return Promise.resolve(true);}
    return new Promise(resolve=>{
      const start=this.audio.volume;const began=Date.now();
      const finish=completed=>{clearInterval(timer);this.fadeCancel=null;resolve(completed);};
      const timer=setInterval(()=>{const progress=Math.min(1,(Date.now()-began)/duration);this.setAudioVolume(start+(target-start)*(progress*(2-progress)));if(progress===1)finish(true);},25);
      this.fadeCancel=()=>finish(false);
    });
  }
  enter(){
    if(!this.state.ready||this.disposed)return Promise.resolve(false);
    if(this.active){if(this.state.playing||this.pending)return Promise.resolve(true);return this.playCurrent(false);}
    this.active=true;this.update({index:0});return this.playCurrent(true);
  }
  async playCurrent(reset){
    if(!this.active||this.disposed||!this.state.ready)return false;
    const operation=++this.operation;this.cancelFade();this.pending=true;
    if(reset||!this.audio.getAttribute('src')){this.audio.src=this.tracks[this.state.index].src;this.audio.currentTime=0;}
    else if(this.state.status==='error')this.audio.load();
    this.audio.muted=this.state.muted;this.setAudioVolume(0);this.update({status:'loading',message:''});
    try{
      await this.audio.play();
      if(operation!==this.operation||this.disposed)return false;
      this.pending=false;this.update({playing:true,status:'playing'});
      await this.fadeTo(this.state.volume,this.fadeDuration);return true;
    }catch(error){
      if(operation!==this.operation||this.disposed)return false;
      this.pending=false;const blocked=error?.name==='NotAllowedError';
      this.update({playing:false,status:blocked?'blocked':'error',message:blocked?'Tap Enable Divine Audio to begin.':'This recording could not play. Please retry.'});return false;
    }
  }
  pause(){if(!this.state.ready)return;this.operation++;this.cancelFade();this.pending=false;this.audio.pause();this.update({playing:false,status:'paused'});}
  configure(tracks){
    if(this.disposed)return;
    this.operation++;this.cancelFade();this.active=false;this.pending=false;this.audio.pause();this.audio.removeAttribute('src');this.audio.load();
    this.tracks=tracks;const ready=tracks.length>0&&tracks.every(track=>track.available);
    this.update({ready,index:0,playing:false,status:ready?'idle':'unavailable',message:''});
  }
  selectTrack(index){
    if(!Number.isInteger(index)||index<0||index>=this.tracks.length)return;
    if(index===this.state.index&&this.state.status!=='loading')return;
    return this.changeTrack(index-this.state.index);
  }
  async changeTrack(direction,fromEnd=false){
    if(!this.active||!this.state.ready||this.disposed)return;
    const operation=++this.operation;this.cancelFade();const shouldPlay=fromEnd||this.state.playing||this.pending;this.pending=false;
    this.update({status:'loading'});
    if(shouldPlay&&!fromEnd&&!this.audio.paused){const completed=await this.fadeTo(0,this.switchDuration);if(!completed)return;}
    if(operation!==this.operation||this.disposed)return;
    this.audio.pause();this.update({index:(this.state.index+direction+this.tracks.length)%this.tracks.length,playing:false});
    this.audio.src=this.tracks[this.state.index].src;this.audio.currentTime=0;
    if(shouldPlay)await this.playCurrent(false);else this.update({status:'paused'});
  }
  setVolume(volume){if(!Number.isFinite(volume))return;const next=Math.max(0,Math.min(1,volume));if(next>0)this.lastVolume=next;this.cancelFade();this.setAudioVolume(next);this.update({volume:next,muted:next===0?true:this.state.muted});this.audio.muted=this.state.muted;}
  setMuted(muted){
    if(!muted&&this.state.volume===0){this.setAudioVolume(this.lastVolume);this.update({volume:this.lastVolume});}
    this.audio.muted=muted;this.update({muted});
  }
  toggleMute(){this.setMuted(!this.state.muted);}
  async leave(immediate=false){
    this.active=false;const operation=++this.operation;this.cancelFade();this.pending=false;
    if(!this.audio.paused&&!immediate){this.update({status:'stopping'});const completed=await this.fadeTo(0,this.exitDuration);if(!completed)return;}
    if(operation!==this.operation||this.disposed)return;
    this.audio.pause();this.audio.currentTime=0;this.audio.removeAttribute('src');this.audio.load();
    this.update({playing:false,index:0,status:this.state.ready?'idle':'unavailable',message:''});
  }
  dispose(){
    this.active=false;this.operation++;this.cancelFade();this.disposed=true;
    this.audio.removeEventListener('ended',this.onEnded);this.audio.removeEventListener('playing',this.onPlaying);this.audio.removeEventListener('pause',this.onPause);this.audio.removeEventListener('error',this.onError);
    this.audio.pause();this.audio.removeAttribute('src');this.audio.load();this.listeners.clear();
  }
}
