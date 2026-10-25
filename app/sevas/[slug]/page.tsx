import {notFound} from 'next/navigation';
import SevaDetail from '@/components/SevaExperienceLayout';
import Footer from '@/components/Footer';
import {sevas} from '@/lib/sevas';
export function generateStaticParams(){return sevas.filter(seva=>seva.id!=='suprabhatam').map(seva=>({slug:seva.id}));}
export const dynamicParams=false;
export async function generateMetadata({params}:{params:Promise<{slug:string}>}){const {slug}=await params;return{title:sevas.find(seva=>seva.id===slug)?.name||'Sacred Seva'};}
export default async function SevaPage({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const seva=sevas.find(seva=>seva.id===slug);if(!seva)notFound();return <><SevaDetail seva={seva}/><Footer/></>;}
