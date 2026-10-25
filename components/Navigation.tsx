'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ArrowUpRight, Menu, X } from 'lucide-react';
export function SacredMark({className = ''}:{className?:string}) { return <svg className={className} width="28" height="34" viewBox="0 0 28 34" fill="none" aria-hidden="true"><path d="M4 3v16c0 6 4 10 10 12 6-2 10-6 10-12V3M8 3v16c0 3 2 6 6 8 4-2 6-5 6-8V3" stroke="currentColor" strokeWidth="1.3"/><path d="M14 2v20" stroke="#C6A368" strokeWidth="3"/></svg> }
const links = [['/journey','The journey'],['/darshan','The shrine'],['/sevas','Sacred Sevas'],['/heritage','Heritage'],['/architecture','Architecture'],['/pilgrim-guide','Pilgrim guide'],['/?intro=replay','Replay intro']];
export default function Navigation(){
  const [open,setOpen] = useState(false); const path = usePathname();
  useEffect(()=>{setOpen(false)},[path]);
  const journeyRoute = ['/journey','/darshan','/sevas/suprabhatam'].includes(path.replace(/\/$/, ''));
  useEffect(()=>{if(!open)return; const f=(e:KeyboardEvent)=>{if(e.key==='Escape')setOpen(false)};window.addEventListener('keydown',f);return()=>window.removeEventListener('keydown',f)},[open]);
  if (journeyRoute) return <a className="skip-link" href="#main">Skip to content</a>;
  return <><a className="skip-link" href="#main">Skip to content</a><header className="site-header"><Link href="/" className="brand" aria-label="Tirumala Digital Heritage home"><SacredMark/><span>TIRUMALA<small>DIGITAL HERITAGE</small></span></Link><nav className="desktop-nav" aria-label="Main navigation">{links.map(([href,label])=><Link key={href} href={href} aria-current={path===href?'page':undefined}>{label}</Link>)}</nav><Link className="header-cta" href="/journey">Enter the experience <ArrowUpRight size={15}/></Link><button className="menu-button icon-button" aria-label={open?'Close navigation':'Open navigation'} aria-expanded={open} aria-controls="mobile-nav" onClick={()=>setOpen(!open)}>{open?<X/>:<Menu/>}</button></header>{open&&<nav id="mobile-nav" className="mobile-nav" aria-label="Mobile navigation">{[...links,['/festivals','Festivals'],['/gallery','Gallery'],['/guide','Multilingual guide'],['/about','Sources & about']].map(([href,label])=><Link href={href} key={href}>{label}<ArrowUpRight size={18}/></Link>)}</nav>}</>;
}
