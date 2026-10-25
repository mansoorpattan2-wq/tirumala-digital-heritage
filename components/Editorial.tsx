import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import Footer from './Footer';
import { sources } from '@/lib/content';
export function Source({id}:{id:keyof typeof sources}){return <a className="source-link" href={sources[id].url} target="_blank" rel="noreferrer">{sources[id].title} <ArrowUpRight size={13}/></a>}
export function Editorial({eyebrow,title,lead,children}:{eyebrow:string;title:React.ReactNode;lead:string;children:React.ReactNode}){return <><main id="main"><section className="page-hero"><span className="page-hero-index" aria-hidden="true">ॐ</span><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p className="lead">{lead}</p></section><div className="page-body">{children}</div></main><Footer/></>}
export function PageCTA({title='See the stories in a different light.',href='/journey',label='Begin the pilgrimage'}:{title?:string;href?:string;label?:string}){return <div className="page-cta"><h3>{title}</h3><Link href={href} className="button">{label} <ArrowUpRight size={17}/></Link></div>}
