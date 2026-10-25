/** A quiet, explicitly synthesized bell. It is not a temple recording. */
export function createPrayerBell(){
  let context:AudioContext|null=null;let closed=false;const nodes=new Set<OscillatorNode>();
  async function ring(){
    if(closed)return;const Constructor=window.AudioContext||(window as Window&{webkitAudioContext?:typeof AudioContext}).webkitAudioContext;if(!Constructor)return;
    try{context??=new Constructor();if(context.state==='suspended')await context.resume();if(closed||context.state!=='running')return;const now=context.currentTime;
      [660,1320,1855,2706].forEach((frequency,i)=>{if(!context)return;const oscillator=context.createOscillator();const gain=context.createGain();oscillator.type='sine';oscillator.frequency.value=frequency;gain.gain.setValueAtTime(.0001,now);gain.gain.exponentialRampToValueAtTime(.035/(i+1),now+.02);gain.gain.exponentialRampToValueAtTime(.0001,now+2.2);oscillator.connect(gain);gain.connect(context.destination);nodes.add(oscillator);oscillator.onended=()=>{nodes.delete(oscillator);oscillator.disconnect();gain.disconnect();};oscillator.start(now);oscillator.stop(now+2.25);});
    }catch{/* Text, music and the visual scene remain available without Web Audio. */}
  }
  function stop(){nodes.forEach(node=>{try{node.stop();}catch{}});nodes.clear();}
  function dispose(){closed=true;stop();if(context&&context.state!=='closed')void context.close();}
  return{ring,stop,dispose};
}
