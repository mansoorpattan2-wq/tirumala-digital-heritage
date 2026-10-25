import{readFile,writeFile}from'node:fs/promises';
const root=new URL('../',import.meta.url);
const source=JSON.parse(await readFile(new URL('public/audio/sevas/audio_manifest.json',root),'utf8'));
const mapping={thomala:'thomala_seva',archana:'sahasranama_archana',kalyanotsavam:'kalyanotsavam',abhishekam:'abhishekam',deepalankara:'sahasra_deepalankara',brahmotsavam:'brahmotsavam'};
const names={thomala:'Thomala · Floral ambience',archana:'Archana · Contemplative ambience',kalyanotsavam:'Kalyanotsavam · Celebratory ambience',abhishekam:'Abhishekam · Gentle ambience',deepalankara:'Deepalankara · Lamplight ambience',brahmotsavam:'Brahmotsavam · Festival ambience'};
const tracks=[];
for(const[id,key]of Object.entries(mapping)){
  const file=source.files[key]?.split('/').at(-1);if(!file||!file.endsWith('.wav'))throw new Error(`Missing WAV mapping for ${id}`);
  const data=await readFile(new URL(`public/audio/sevas/${file}`,root));
  if(data.toString('ascii',0,4)!=='RIFF'||data.toString('ascii',8,12)!=='WAVE'||data.length<44)throw new Error(`Invalid WAV: ${file}`);
  tracks.push({id,title:names[id],src:`/audio/sevas/${file}`,available:true,reason:null,caption:'Original synthesized instrumental ambience. Music only; no chanting or live temple recording.',license:source.license});
}
await writeFile(new URL('lib/seva-audio-manifest.json',root),JSON.stringify({ready:true,tracks},null,2)+'\n');
console.log('Seva audio verified: six original WAV ambience cues. Shrine recordings preserved.');
