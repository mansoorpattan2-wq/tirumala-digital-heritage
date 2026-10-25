import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
const root=resolve('out');
const mime={'.html':'text/html; charset=utf-8','.js':'application/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.webp':'image/webp','.jpg':'image/jpeg','.png':'image/png','.svg':'image/svg+xml','.woff2':'font/woff2','.txt':'text/plain; charset=utf-8','.mp3':'audio/mpeg','.mpeg':'audio/mpeg','.ogg':'audio/ogg','.wav':'audio/wav','.m4a':'audio/mp4'};
const server=http.createServer(async(req,res)=>{
  try{
    const url=new URL(req.url,'http://localhost');let path=resolve(root,'.'+decodeURIComponent(url.pathname));
    if(path!==root&&!path.startsWith(root+sep)){res.writeHead(403);return res.end('Forbidden');}
    if((await stat(path)).isDirectory())path=resolve(path,'index.html');
    const data=await readFile(path);
    const headers={'Content-Type':mime[extname(path)]||'application/octet-stream','X-Content-Type-Options':'nosniff','Accept-Ranges':'bytes','Content-Length':data.length};
    if(req.headers.range){
      const match=/^bytes=(\d*)-(\d*)$/.exec(req.headers.range);
      let start=0,end=data.length-1;
      if(match){
        if(match[1]){start=Number(match[1]);if(match[2])end=Math.min(Number(match[2]),end);}
        else if(match[2])start=Math.max(0,data.length-Number(match[2]));
      }
      if(!match||(!match[1]&&!match[2])||start> end||start>=data.length||(!match[1]&&Number(match[2])===0)){
        res.writeHead(416,{'Content-Range':`bytes */${data.length}`});return res.end();
      }
      res.writeHead(206,{...headers,'Content-Range':`bytes ${start}-${end}/${data.length}`,'Content-Length':end-start+1});
      return res.end(req.method==='HEAD'?undefined:data.subarray(start,end+1));
    }
    res.writeHead(200,headers);res.end(req.method==='HEAD'?undefined:data);
  }catch{res.writeHead(404,{'Content-Type':'text/html; charset=utf-8'});res.end(req.method==='HEAD'?undefined:await readFile(resolve(root,'404.html')).catch(()=>Buffer.from('Page not found')));}
});
server.listen(Number(process.env.PORT)||3000,'127.0.0.1',()=>console.log(`Tirumala preview: http://127.0.0.1:${server.address().port}`));
