import { Editorial } from '@/components/Editorial';
import LanguageGuide from '@/components/LanguageGuide';
export const metadata={title:'Multilingual Introduction'};
export default function Page(){return <Editorial eyebrow="A SHARED HERITAGE · MANY LANGUAGES" title={<>An invitation,<br/><em>in your language.</em></>} lead="Choose English, Telugu, Hindi or Tamil for a short introduction and an architectural glossary. Listen when a matching voice is available on your device."><LanguageGuide/></Editorial>}
