// Windows Next.js export can emit __next.route/__PAGE__.txt while its client
// requests __next.route.__PAGE__.txt. Preserve originals and add portable aliases.
// Upstream: https://github.com/vercel/next.js/issues/85374
import { readdir, copyFile } from 'node:fs/promises';
import { resolve, join } from 'node:path';
const root=resolve('out');
let count=0;
async function walk(directory){
  for(const entry of await readdir(directory,{withFileTypes:true})){
    if(!entry.isDirectory())continue;
    const path=join(directory,entry.name);
    if(entry.name.startsWith('__next.'))await flatten(path,directory,entry.name);
    else if(entry.name!=='_next')await walk(path);
  }
}
async function flatten(directory,destination,prefix){
  for(const entry of await readdir(directory,{withFileTypes:true})){
    if(entry.isDirectory())await flatten(join(directory,entry.name),destination,`${prefix}.${entry.name}`);
    else if(entry.name.endsWith('.txt')){await copyFile(join(directory,entry.name),join(destination,`${prefix}.${entry.name}`));count++;}
  }
}
await walk(root);
console.log(`Static export verified: ${count} portable route payload aliases written.`);
