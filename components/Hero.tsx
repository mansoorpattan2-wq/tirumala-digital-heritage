import Link from 'next/link';
import { ArrowDown, ArrowRight, ArrowUpRight } from 'lucide-react';
export default function Hero() {
  return <><section className="home-pilgrimage temple-hero">
    <div className="home-pilgrimage-copy"><p className="eyebrow">TIRUMALA / A LIVING HERITAGE</p>
      <span className="hero-small-rule" aria-hidden="true"/>
      <h1>A thousand stories.<br/>One sacred <em>presence.</em></h1>
      <p>In the folds of the seven hills, devotion becomes a way of seeing. Come closer to the landscape, the stories, and the light.</p>
      <div className="temple-hero-actions"><Link className="button" href="/journey">Begin the pilgrimage <ArrowRight size={18}/></Link>
      <Link className="text-link" href="/darshan" data-cursor-label="ENTER">Enter the imagined shrine <ArrowUpRight size={17}/></Link></div>
      <span className="home-pilgrimage-meta">LANDSCAPE / HERITAGE / DEVOTION</span>
    </div>
    <figure className="hero-devotional-art"><img src="/assets/devotional/venkateswara-twilight-1024.webp" srcSet="/assets/devotional/venkateswara-twilight-640.webp 640w, /assets/devotional/venkateswara-twilight-1024.webp 1024w" sizes="(max-width:760px) 100vw, 54vw" width={1024} height={1536} alt="Supplied devotional artwork of Venkateswara adorned with garlands and gold, surrounded by warm lamps at twilight" fetchPriority="high"/><div className="hero-art-light" aria-hidden="true"/><figcaption>Venkateswara <span>Devotional AI artwork</span></figcaption></figure>
    <a className="home-discover" href="#discover"><ArrowDown size={17}/> The stories begin here <span>SCROLL TO DISCOVER</span></a>
  </section><section className="shrine-teaser section-shell"><figure><img src="/assets/devotional/venkateswara-shrine-640.webp" alt="Devotional artwork of Venkateswara in a golden shrine" width={640} height={960} loading="lazy"/><figcaption>AN IMAGINED SHRINE / SUPPLIED AI ARTWORK</figcaption></figure><div><p className="eyebrow">A MOMENT BEYOND THE EVERYDAY</p><h2>The doors open.<br/><em>The world falls quiet.</em></h2><p>Step into a devotional interpretation of light and stillness. Open the carved doors, choose a portrait, and offer a moment of harathi.</p><Link className="button" href="/darshan" data-cursor-label="ENTER">Enter the imagined shrine <ArrowRight size={18}/></Link></div></section></>;
}
