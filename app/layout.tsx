import type { Metadata } from 'next';
import Navigation from '@/components/Navigation';
import CursorEffects from '@/components/CursorEffects';
import { DevotionalAudioProvider } from '@/components/DevotionalAudioProvider';
import './globals.css';
import './pilgrimage-home.css';
import './temple-theme.css';
import './shrine.css';
import './devotional-audio.css';
import './sevas.css';
import './cinematic-intro.css';
import './seva-experiences.css';
export const metadata: Metadata = { title: { default: 'Tirumala — A Journey Through the Seven Hills', template: '%s · Tirumala Digital Heritage' }, description: 'An independent, immersive journey through the landscape, faith and architectural heritage of Tirumala. Explore seven artistic scenes, an optional festival, sourced stories and a practical pilgrim guide.' };
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body><DevotionalAudioProvider><CursorEffects/><Navigation/>{children}</DevotionalAudioProvider></body></html>}
