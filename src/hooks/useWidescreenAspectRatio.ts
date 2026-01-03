import { useState, useEffect, useCallback } from 'react';

/**
 * Hook to detect if the current viewport is a widescreen desktop.
 * 
 * Uses WIDTH ONLY to avoid layout shifts when mobile browser bars
 * expand/collapse (which changes height but not width).
 * 
 * Widescreen desktop: width >= 1280px (typical laptop/monitor width)
 */
export const useWidescreenAspectRatio = () => {
  const [isWidescreen, setIsWidescreen] = useState(false);

  const checkWidth = useCallback(() => {
    const width = window.innerWidth;
    
    // Only use width - 1280px covers laptops and monitors
    // Avoids height-based calculations that break on mobile scroll
    setIsWidescreen(width >= 1280);
  }, []);

  useEffect(() => {
    checkWidth();
    
    window.addEventListener('resize', checkWidth);
    
    return () => {
      window.removeEventListener('resize', checkWidth);
    };
  }, [checkWidth]);

  return isWidescreen;
};
