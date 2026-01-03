import { useState, useEffect, useCallback } from 'react';

/**
 * Hook to detect if the current viewport is a widescreen DESKTOP.
 * 
 * Uses WIDTH + INPUT TYPE to distinguish desktops from large tablets:
 * - Width >= 1280px (typical laptop/monitor width)
 * - AND has mouse/trackpad (hover: hover, pointer: fine)
 * 
 * This excludes iPads and tablets which have touch as primary input,
 * even if they have large screens (iPad Pro 12.9" is ~1366px wide in landscape).
 * 
 * Does NOT use height to avoid layout shifts from mobile browser bars.
 */
export const useWidescreenAspectRatio = () => {
  const [isWidescreen, setIsWidescreen] = useState(false);

  const checkWidescreen = useCallback(() => {
    const width = window.innerWidth;
    
    // Must be desktop-width AND have mouse/trackpad (excludes tablets)
    const isDesktopInput = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    
    setIsWidescreen(width >= 1280 && isDesktopInput);
  }, []);

  useEffect(() => {
    checkWidescreen();
    
    window.addEventListener('resize', checkWidescreen);
    
    return () => {
      window.removeEventListener('resize', checkWidescreen);
    };
  }, [checkWidescreen]);

  return isWidescreen;
};
