'use client';
export default function Error({reset}:{reset:()=>void}){return <main id="main" className="error-page"><p className="eyebrow">A moment of stillness</p><h1>The journey was interrupted.</h1><p>Please try loading this page again.</p><button className="button" onClick={reset}>Try again</button><a href="/heritage/" className="text-link">Read the heritage collection →</a></main>}
