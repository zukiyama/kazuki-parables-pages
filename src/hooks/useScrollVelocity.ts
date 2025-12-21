import { useEffect, useState, useRef } from 'react';

interface ScrollVelocityState {
  velocity: number;
  direction: 'up' | 'down' | 'none';
}

export function useScrollVelocity(maxVelocity: number = 30) {
  const [state, setState] = useState<ScrollVelocityState>({
    velocity: 0,
    direction: 'none'
  });
  
  const lastScrollY = useRef(0);
  const lastTime = useRef(Date.now());
  const velocityRef = useRef(0);
  const rafId = useRef<number | null>(null);
  const decayRafId = useRef<number | null>(null);
  
  useEffect(() => {
    const handleScroll = () => {
      if (rafId.current) return; // Throttle with rAF
      
      rafId.current = requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;
        const currentTime = Date.now();
        const timeDelta = currentTime - lastTime.current;
        
        if (timeDelta > 0) {
          const scrollDelta = currentScrollY - lastScrollY.current;
          const rawVelocity = (scrollDelta / timeDelta) * 100; // Scale for usability
          
          // Clamp velocity
          const clampedVelocity = Math.max(-maxVelocity, Math.min(maxVelocity, rawVelocity));
          velocityRef.current = clampedVelocity;
          
          setState({
            velocity: clampedVelocity,
            direction: scrollDelta > 0 ? 'down' : scrollDelta < 0 ? 'up' : 'none'
          });
        }
        
        lastScrollY.current = currentScrollY;
        lastTime.current = currentTime;
        rafId.current = null;
        
        // Cancel any existing decay and start new decay animation
        if (decayRafId.current) {
          cancelAnimationFrame(decayRafId.current);
        }
        startDecay();
      });
    };
    
    const startDecay = () => {
      const decay = () => {
        // Smoothly decay velocity back to 0
        velocityRef.current *= 0.92;
        
        if (Math.abs(velocityRef.current) < 0.1) {
          velocityRef.current = 0;
          setState(prev => ({ ...prev, velocity: 0, direction: 'none' }));
          decayRafId.current = null;
          return;
        }
        
        setState(prev => ({
          ...prev,
          velocity: velocityRef.current
        }));
        
        decayRafId.current = requestAnimationFrame(decay);
      };
      
      decayRafId.current = requestAnimationFrame(decay);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId.current) cancelAnimationFrame(rafId.current);
      if (decayRafId.current) cancelAnimationFrame(decayRafId.current);
    };
  }, [maxVelocity]);
  
  return state;
}
