'use client';
import { Pause, Play, RotateCcw, VolumeX } from 'lucide-react';
export default function ExperienceControls({ motion, locked, onMotion, onRestart }: { motion: boolean; locked?: string; onMotion: () => void; onRestart: () => void }) {
  return <div className="experience-controls" aria-label="Experience settings">
    <button onClick={onMotion} aria-pressed={motion} disabled={Boolean(locked)} title={locked || 'Pause or resume subtle scene motion'}>{motion ? <Pause size={17}/> : <Play size={17}/>} {locked || (motion ? 'Pause motion' : 'Motion off')}</button>
    <span className="sound-unavailable" role="note" title="No licensed audio recordings were supplied. No sound will play."><VolumeX size={17}/><span>Sound unavailable<small>No audio supplied</small></span></span>
    <button onClick={onRestart}><RotateCcw size={17}/><span>Return to start</span></button>
  </div>;
}
