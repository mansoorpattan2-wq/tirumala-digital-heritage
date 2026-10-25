'use client';

import { useEffect, useRef } from 'react';

/** Adds a quiet gold pointer companion without replacing the system cursor. */
export default function CursorEffects() {
  const cursor = useRef<HTMLDivElement>(null);
  const trail = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = cursor.current;
    const trailNode = trail.current;
    if (!node || !trailNode) return;
    const sparks = Array.from(trailNode.querySelectorAll<HTMLElement>('.pointer-spark'));
    const ripples = Array.from(trailNode.querySelectorAll<HTMLElement>('.pointer-touch'));
    const label = node.querySelector<HTMLElement>('.cursor-companion-label');
    const precisePointer = matchMedia('(hover: hover) and (pointer: fine)');
    const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
    let enabled = precisePointer.matches && !reduceMotion.matches;
    let frame = 0;
    let x = -100, y = -100;
    let sparkIndex = 0, rippleIndex = 0, lastEmission = 0;
    let lastX = -100, lastY = -100;
    let latestTarget: HTMLElement | undefined;
    const clear = () => {
      node.dataset.visible = 'false';
      node.dataset.pressed = 'false';
      sparks.concat(ripples).forEach(el => el.getAnimations().forEach(animation => animation.cancel()));
    };
    const emit = (px: number, py: number, touch: boolean) => {
      if (reduceMotion.matches || document.hidden) return;
      const particle = sparks[sparkIndex++ % sparks.length];
      particle.getAnimations().forEach(animation => animation.cancel());
      const drift = (sparkIndex % 3 - 1) * 8;
      particle.animate([
        { transform: `translate3d(${px - 2}px,${py - 2}px,0) scale(${touch ? 1.4 : 1})`, opacity: .7 },
        { transform: `translate3d(${px + drift}px,${py + 20}px,0) scale(.15)`, opacity: 0 },
      ], { duration: touch ? 650 : 520, easing: 'cubic-bezier(.2,.6,.3,1)', fill: 'forwards' });
    };
    const ripple = (px: number, py: number) => {
      if (reduceMotion.matches) return;
      const particle = ripples[rippleIndex++ % ripples.length];
      particle.getAnimations().forEach(animation => animation.cancel());
      particle.animate([
        { transform: `translate3d(${px - 16}px,${py - 16}px,0) scale(.3)`, opacity: .7 },
        { transform: `translate3d(${px - 16}px,${py - 16}px,0) scale(2.3)`, opacity: 0 },
      ], { duration: 600, easing: 'ease-out', fill: 'forwards' });
    };

    const setEnabled = () => {
      enabled = precisePointer.matches && !reduceMotion.matches;
      node.dataset.enabled = String(enabled);
      trailNode.dataset.enabled = String(!reduceMotion.matches);
      if (!enabled) {
        node.dataset.visible = 'false';
        node.dataset.mode = 'default';
      }
      if (reduceMotion.matches) clear();
    };
    const move = (event: PointerEvent) => {
      if (reduceMotion.matches) return;
      x = event.clientX;
      y = event.clientY;
      if (event.type === 'pointermove' && event.timeStamp - lastEmission > 14 && Math.hypot(x - lastX, y - lastY) > 5) {
        emit(x, y, event.pointerType !== 'mouse');
        lastEmission = event.timeStamp; lastX = x; lastY = y;
      }
      if (!enabled || event.pointerType !== 'mouse') return;
      latestTarget = event.composedPath().find(el => el instanceof HTMLElement && el.matches('a,button:enabled,select,input,[data-cursor-label]')) as HTMLElement | undefined;
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        node.style.setProperty('--cursor-x', `${x}px`);
        node.style.setProperty('--cursor-y', `${y}px`);
        node.dataset.visible = 'true';

        const target = latestTarget;
        if (target instanceof HTMLElement) {
          node.dataset.mode = 'interactive';
          node.dataset.label = target.dataset.cursorLabel || (target.tagName === 'A' ? 'OPEN' : 'SELECT');
        } else {
          node.dataset.mode = 'default';
          node.dataset.label = '';
        }
        if (label) label.textContent = node.dataset.label || '';
      });
    };
    const leave = () => { node.dataset.visible = 'false'; };
    const down = (event: PointerEvent) => { if (enabled && event.pointerType === 'mouse') node.dataset.pressed = 'true'; ripple(event.clientX,event.clientY); };
    const up = () => { node.dataset.pressed = 'false'; };
    const visibility = () => { if (document.hidden) clear(); };
    const keyboard = (event: KeyboardEvent) => { if (event.key === 'Tab') leave(); };

    setEnabled();
    precisePointer.addEventListener('change', setEnabled);
    reduceMotion.addEventListener('change', setEnabled);
    document.addEventListener('pointermove', move, { passive: true });
    document.addEventListener('pointerover', move, { passive: true });
    document.addEventListener('pointerleave', leave);
    document.addEventListener('pointerdown', down, { passive: true });
    document.addEventListener('pointerup', up, { passive: true });
    document.addEventListener('pointercancel', up, { passive: true });
    document.addEventListener('visibilitychange', visibility);
    document.addEventListener('keydown', keyboard);
    window.addEventListener('blur', clear);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      precisePointer.removeEventListener('change', setEnabled);
      reduceMotion.removeEventListener('change', setEnabled);
      document.removeEventListener('pointermove', move);
      document.removeEventListener('pointerover', move);
      document.removeEventListener('pointerleave', leave);
      document.removeEventListener('pointerdown', down);
      document.removeEventListener('pointerup', up);
      document.removeEventListener('pointercancel', up);
      document.removeEventListener('visibilitychange', visibility);
      document.removeEventListener('keydown', keyboard);
      window.removeEventListener('blur', clear);
      clear();
    };
  }, []);

  return <><div className="cursor-companion" ref={cursor} data-enabled="false" data-visible="false" data-mode="default" data-pressed="false" aria-hidden="true"><span className="cursor-companion-dot"/><span className="cursor-companion-ring"/><span className="cursor-companion-label"/></div><div className="pointer-trail" ref={trail} data-enabled="false" aria-hidden="true">{Array.from({length:18},(_,i)=><i className="pointer-spark" key={i}/>)}{Array.from({length:4},(_,i)=><i className="pointer-touch" key={`touch-${i}`}/>)}</div></>;
}
