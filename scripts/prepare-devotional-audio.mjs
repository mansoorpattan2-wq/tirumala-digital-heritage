import { readFile, writeFile, open } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const root=new URL('../',import.meta.url);
const credits=JSON.parse(await readFile(new URL('public/audio/credits.json',root),'utf8'));
const expected=['venkateswara-stotram.mp3','veyi-namala-vada.mp3'];
const tracks=await Promise.all(expected.map(async(file,index)=>{
  const credit=credits.tracks[index];
  if(!credit||credit.file!==file)throw new Error('Preserve the requested devotional playlist order and filenames.');
  let exists=false,valid=false;
  try{
    const handle=await open(new URL(`public/audio/${file}`,root),'r');
    try{
      const stat=await handle.stat();const header=Buffer.alloc(3);
      await handle.read(header,0,3,0);exists=stat.size>0;
      valid=stat.size>128&&(header.toString('ascii')==='ID3'||(header[0]===255&&(header[1]&224)===224));
    }finally{await handle.close();}
  }catch(error){if(error.code!=='ENOENT')throw error;}
  const approved=credit.approved===true&&typeof credit.source==='string'&&credit.source.trim().length>0&&typeof credit.license==='string'&&credit.license.trim().length>0;
  return {id:credit.id,title:credit.title,src:`/audio/${file}`,available:valid&&approved,reason:!exists?'missing recording':!valid?'invalid MP3':!approved?'permission details needed':null};
}));
const manifest={ready:tracks.every(track=>track.available),tracks};
await writeFile(new URL('lib/devotional-audio-manifest.json',root),JSON.stringify(manifest,null,2)+'\n');
console.log(`Devotional audio: ${manifest.ready?'two approved recordings ready':'playlist prepared; approved recordings still needed'}.`);
for(const track of tracks)if(!track.available)console.log(`  ${track.src}: ${track.reason}`);
await import('./prepare-seva-audio.mjs');
