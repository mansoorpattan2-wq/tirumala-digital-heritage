import sharp from 'sharp';
import {mkdir,copyFile,writeFile} from 'node:fs/promises';
const dest='public/assets/seva';await mkdir(dest,{recursive:true});
const collage='C:/Users/manso/Downloads/a_large_high_resolution_collage_asset_sheet_in_a.png';
await copyFile(collage,`${dest}/supplied-collage.png`);
const assets=[];
const cards=['suprabhatam','thomala','archana','kalyanotsavam','abhishekam','deepalankara','brahmotsavam'];
for(const [i,id] of cards.entries()){
  const left=[0,224,443,662,881,1100,1320][i];const width=Math.min(219,1536-left);
  await sharp(collage).extract({left,top:0,width,height:230}).webp({quality:90}).toFile(`${dest}/${id}-card.webp`);
  assets.push({id:`${id}-card`,src:`/assets/seva/${id}-card.webp`,width,height:230,origin:'Cropped from supplied collage; generated lettering excluded',kind:'AI illustration'});
}
for(const [id,left,width] of [['temple-night',207,199],['gopuram',413,206],['corridor',626,213],['lamps',792,130],['flowers',1038,156]]){
  const top=id==='lamps'||id==='flowers'?526:340;const height=top===526?135:150;
  await sharp(collage).extract({left,top,width,height}).webp({quality:90}).toFile(`${dest}/${id}.webp`);
  assets.push({id,src:`/assets/seva/${id}.webp`,width,height,origin:'Supplied collage crop',kind:'AI illustration'});
}
const extras=[['sunrise','144525'],['devotional-portrait','144539'],['golden-corridor','144555'],['golden-tower','144609'],['morning-arrival','144621'],['lamp-hall','144641'],['harathi-portrait','144655']];
for(const [id,time] of extras){
  const source=`C:/Users/manso/OneDrive/Pictures/Screenshots/Screenshot 2026-10-25 ${time}.png`;
  const meta=await sharp(source).metadata();await copyFile(source,`${dest}/${id}-source.png`);
  for(const width of [640,1280])await sharp(source).resize({width,withoutEnlargement:true}).webp({quality:86,effort:4}).toFile(`${dest}/${id}-${width}.webp`);
  assets.push({id,src:`/assets/seva/${id}-1280.webp`,small:`/assets/seva/${id}-640.webp`,width:meta.width,height:meta.height,origin:`Supplied screenshot ${time}`,kind:'Supplied devotional imagery; unverified documentation'});
}
await writeFile(`${dest}/asset_manifest.json`,JSON.stringify({provenance:'Locally prepared from the supplied collage and screenshots. The new ZIP and its README_FOR_CODEX.md/asset_manifest.json were not present at integration time.',notice:'Artistic imagery, not official TTD photography or verified architecture.',assets},null,2));
console.log(`Prepared ${assets.length} individual assets plus responsive derivatives; source images retained.`);
