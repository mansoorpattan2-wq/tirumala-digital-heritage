import { Editorial } from '@/components/Editorial';
import PilgrimGuide from '@/components/PilgrimGuide';
export const metadata={title:'Prepare for Your Pilgrimage'};
export default function Page(){return <Editorial eyebrow="A PRACTICAL PILGRIM GUIDE" title={<>Travel with intention.<br/><em>Arrive prepared.</em></>} lead="Use this guide to prepare your questions and find official information. All reservations and current arrangements belong with Tirumala Tirupati Devasthanams."><div className="provenance-banner">We do not sell tickets, take payments, display live queues or collect details for TTD services. Availability, rules and schedules may change. Check the official portal before you travel.</div><PilgrimGuide/></Editorial>}
