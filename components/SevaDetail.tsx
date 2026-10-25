'use client';
import Link from 'next/link';
import {useEffect,useState} from 'react';
import {ArrowLeft,ArrowRight,ArrowUpRight,Check,Flower2} from 'lucide-react';
import {completeSeva,readCompletions,sevaNotice,type sevas} from '@/lib/sevas';
export default function SevaDetail({seva}:{seva:typeof sevas[number]}){
  const [completed,setCompleted]=useState(false);useEffect(()=>{setCompleted(readCompletions().includes(seva.id));},[seva.id]);
  return <main id="main" className="seva-detail"><Link href="/sevas" className="seva-back"><ArrowLeft size={16}/> Sacred Seva Gallery</Link><section className="seva-detail-layout"><figure><img src={`/assets/seva/${seva.id}-card.webp`} alt={`Artistic illustration for ${seva.name}`} width={219} height={230}/><figcaption>AI ARTISTIC ILLUSTRATION</figcaption></figure><div><p className="eyebrow">AN EDUCATIONAL INTRODUCTION / {seva.meaning}</p><p className="seva-telugu" lang="te">{seva.telugu}</p><h1>{seva.name}</h1><p className="seva-detail-lead">{seva.detail}</p><div className="seva-detail-note"><Flower2 size={22}/><p>Explore the meaning, symbolism and context of this tradition. This introduction is a learning experience; it does not perform an actual temple ritual.</p></div><a href={seva.source} target="_blank" rel="noreferrer" className="text-link">Read official TTD information <ArrowUpRight size={16}/></a><div className="seva-detail-actions"><button className="button" onClick={()=>{completeSeva(seva.id);setCompleted(true);}}>{completed?<><Check size={17}/> Marked as explored</>:'Mark as explored'}</button><Link href="/sevas/suprabhatam" className="text-link">Experience Suprabhatam <ArrowRight size={17}/></Link></div><p className="seva-art-notice">{sevaNotice}</p></div></section></main>;
}
