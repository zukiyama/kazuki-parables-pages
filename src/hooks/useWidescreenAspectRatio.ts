import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Hook to detect if the current viewport has a widescreen aspect ratio.
 * Uses hysteresis to prevent flickering when browser chrome causes minor viewport changes.
 * 
 * 16:10 ratio = 1.6
 * 16:9 ratio = 1.777...
 * 
 * Entry threshold: ratio >= 1.6 (to enter widescreen mode)
 * Exit threshold: ratio < 1.5 (to exit widescreen mode)
 * 
 * This prevents flickering on devices like iPads where the browser bar
 * appearing/disappearing causes the aspect ratio to hover around 1.43-1.5
 */
export const useWidescreenAspectRatio = () => {
  const [isWidescreen, setIsWidescreen] = useState(false);
  const isWidescreenRef = useRef(false);

  const checkAspectRatio = useCallback(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    // Must be landscape orientation
    if (height >= width) {
      isWidescreenRef.current = false;
      setIsWidescreen(false);
      return;
    }
    
    const ratio = width / height;
    
    // Hysteresis: different thresholds for entering vs exiting
    // Enter widescreen: ratio >= 1.6 (16:10 or wider)
    // Exit widescreen: ratio < 1.5 (clear exit point)
    const currentlyWidescreen = isWidescreenRef.current;
    
    let newWidescreen: boolean;
    if (currentlyWidescreen) {
      // Currently in widescreen - only exit if ratio drops below 1.5
      newWidescreen = ratio >= 1.5;
    } else {
      // Not in widescreen - only enter if ratio reaches 1.6
      newWidescreen = ratio >= 1.6;
    }
    
    if (newWidescreen !== currentlyWidescreen) {
      isWidescreenRef.current = newWidescreen;
      setIsWidescreen(newWidescreen);
    }
  }, []);

  useEffect(() => {
    checkAspectRatio();
    
    window.addEventListener('resize', checkAspectRatio);
    window.addEventListener('orientationchange', checkAspectRatio);
    
    return () => {
      window.removeEventListener('resize', checkAspectRatio);
      window.removeEventListener('orientationchange', checkAspectRatio);
    };
  }, [checkAspectRatio]);

  return isWidescreen;
};
