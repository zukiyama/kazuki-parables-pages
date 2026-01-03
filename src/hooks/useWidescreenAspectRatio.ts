import { useState, useEffect, useCallback } from 'react';

/**
 * Hook to detect if the current viewport has a widescreen aspect ratio.
 * This typically corresponds to laptops and HDTVs in landscape orientation.
 * 
 * 16:10 ratio = 1.6
 * 16:9 ratio = 1.777...
 * Browser viewports are often even wider due to browser chrome reducing height.
 * 
 * We detect aspect ratios >= 1.6 (16:10 or wider) on desktop-sized screens (width >= 1024px)
 * This covers laptops, HDTVs, and browser windows where chrome makes viewport wider.
 */
export const useWidescreenAspectRatio = () => {
  const [isWidescreen, setIsWidescreen] = useState(false);

  const checkAspectRatio = useCallback(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    // Only apply to true desktop-sized screens (laptops/monitors)
    // 1280px excludes tablets like 10.9" iPads (~1180px) while including 13"+ laptops
    if (width < 1280) {
      setIsWidescreen(false);
      return;
    }
    
    // Must be landscape orientation
    if (height >= width) {
      setIsWidescreen(false);
      return;
    }
    
    const ratio = width / height;
    
    // 16:10 = 1.6, 16:9 = 1.777
    // Detect anything 16:10 or wider (ratio >= 1.6)
    // This catches laptops, HDTVs, and browser windows with chrome
    const isWidescreenRatio = ratio >= 1.6;
    
    setIsWidescreen(isWidescreenRatio);
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
